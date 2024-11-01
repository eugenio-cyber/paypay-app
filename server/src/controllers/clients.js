const queryBuilder = require("../services/connection");
const yup = require("yup");
const { pt } = require("yup-locales");
const { messages } = require("../utils/utils");
yup.setLocale(pt);

const registerClient = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  data.user_id = id;

  try {
    const client = await queryBuilder("clients").insert(data).returning("*");
    if (!client) {
      return messages(res, 400, "Erro ao cadastrar cliente");
    }

    return messages(res, 201, "Cadastro realizado com sucesso!");
  } catch (error) {
    return messages(res, 500, error.message);
  }
};

const updateClient = async (req, res) => {
  const { oldEmail, ...client } = req.body;

  try {
    await queryBuilder("clients")
      .where({ email: oldEmail })
      .update(client)
      .returning("*");

    return messages(res, 204, "Atualizado com sucesso!");
  } catch (error) {
    return messages(res, 400, error);
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await queryBuilder("clients").where({ id }).del();

    return messages(res, 200, "Cliente excluído com sucesso!");
  } catch (error) {
    return messages(res, 400, error);
  }
};

const listClients = async (_, res) => {
  try {
    const clients = await queryBuilder("clients");

    return messages(res, 200, clients);
  } catch (error) {
    return messages(res, 400, error);
  }
};

const detailCLient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await queryBuilder("clients").where({ id }).first();

    if (!client) {
      return messages(res, 404, "cliente não encontrado");
    }

    const charges = await queryBuilder("charges").where({ client_id: id });

    return messages(res, 200, { client, charges });
  } catch (error) {
    return messages(res, 400, error);
  }
};

const clientCharges = async (req, res) => {
  const { id } = req.params;

  try {
    const charges = await queryBuilder("charges")
      .select("*")
      .where({ client_id: id });

    if (!charges) {
      return messages(res, 404, "Não há cobranças para esse cliente");
    }

    return messages(res, 200, charges);
  } catch (error) {
    return messages(res, 400, error);
  }
};

const panelClients = async (_, res) => {
  try {
    const defaultingList = await queryBuilder("clients")
      .join("charges", "clients.id", "charges.client_id")
      .select(
        "clients.name",
        "charges.id",
        "charges.value",
        "charges.due",
        "clients.status"
      )
      .where({ "clients.status": false })
      .orderBy("charges.id", "desc")
      .groupBy(
        "clients.name",
        "charges.id",
        "charges.value",
        "charges.due",
        "clients.status"
      )
      .limit(4);

    const dealList = await queryBuilder("clients")
      .join("charges", "clients.id", "charges.client_id")
      .select(
        "clients.name",
        "charges.id",
        "charges.value",
        "charges.due",
        "clients.status"
      )
      .where({ "clients.status": true })
      .orderBy("charges.id", "desc")
      .groupBy(
        "clients.name",
        "charges.id",
        "charges.value",
        "charges.due",
        "clients.status"
      )
      .limit(4);

    if (!defaultingList && !dealList) {
      defaultingList = [];
      dealList = [];
    }

    const clients = {
      legals: {
        number: dealList.length,
        list: dealList,
      },
      defaulting: {
        number: defaultingList.length,
        list: defaultingList,
      },
    };

    return messages(res, 200, clients);
  } catch (error) {
    return messages(res, 400, error);
  }
};

module.exports = {
  clientCharges,
  listClients,
  registerClient,
  updateClient,
  deleteClient,
  detailCLient,
  panelClients,
};
