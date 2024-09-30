const queryBuilder = require("../services/connection");
const yup = require("yup");
const { pt } = require("yup-locales");
const { messages } = require("../utils/utils");
const { format } = require("date-fns");
yup.setLocale(pt);

const formatDateCharge = (charges) => {
  charges.forEach((charge) => {
    const expirationDate = new Date(charge.due);

    charge.due = format(expirationDate, "dd/MM/yyyy");
    charge.value = (Number(charge.value) / 100).toFixed(2);
  });

  return charges;
};

const registerCharge = async (req, res) => {
  let { client_id, status, due } = req.body;
  const schema = yup.object().shape({
    client_id: yup.number().required("O campo cliente é obrigatório"),
    description: yup.string().required("O campo descrição é obrigatório"),
    value: yup.number().required("O campo valor é obrigatório"),
    due: yup.date().required("O campo data é obrigatório"),
  });

  if (!["Pendente", "Paga"].includes(status)) {
    return messages(res, 400, "O status deve ser apenas Pendente ou Paga");
  }

  if (status != "Paga") {
    const today = Date.now();
    let dueDate = new Date(due);
    dueDate = dueDate.getTime();

    if (dueDate < today) {
      status = "Vencida";
    }
  }

  try {
    await schema.validate(req.body);

    const clientExists = await queryBuilder("clients")
      .where({ id: client_id })
      .first();

    if (!clientExists) {
      return messages(res, 404, "Cliente não encontrado");
    }

    const charge = await queryBuilder("charges").insert({
      ...req.body,
      status,
    });

    await updateUserStatus(client_id);

    if (!charge) {
      return messages(res, 400, "Não foi possível cadastrar cobrança");
    }

    return messages(res, 201, "Cobrança cadastrada com sucesso");
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const filterCharges = async (req, res) => {
  const { chargeStatus } = req.body;

  try {
    let filteredCharges = await queryBuilder("charges")
      .join("clients", "charges.client_id", "clients.id")
      .select("charges.*", "clients.name")
      .where("charges.status", chargeStatus);

    filteredCharges = formatDateCharge(filteredCharges);

    return messages(res, 200, filteredCharges);
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const listCharges = async (req, res) => {
  try {
    let allCharges = await queryBuilder("charges")
      .join("clients", "charges.client_id", "clients.id")
      .select("charges.*", "clients.name")
      .orderBy("charges.id", "desc");

    allCharges = formatDateCharge(allCharges);

    return messages(res, 200, allCharges);
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const panelCharges = async (_, res) => {
  try {
    const paidTotal = await queryBuilder("charges")
      .where({ status: "Paga" })
      .sum("value as total");

    const pendingTotal = await queryBuilder("charges")
      .where({ status: "Pendente" })
      .sum("value as total");

    const overdueTotal = await queryBuilder("charges")
      .where({ status: "Vencida" })
      .sum("value as total");

    const paidList = await queryBuilder("charges")
      .leftJoin("clients", "charges.client_id", "clients.id")
      .where({ "charges.status": "Paga" })
      .select("charges.*", "clients.name")
      .limit(4);

    const pendingList = await queryBuilder("charges")
      .leftJoin("clients", "charges.client_id", "clients.id")
      .where({ "charges.status": "Pendente" })
      .select("charges.*", "clients.name")
      .limit(4);

    const overdueList = await queryBuilder("charges")
      .leftJoin("clients", "charges.client_id", "clients.id")
      .where({ "charges.status": "Vencida" })
      .select("charges.*", "clients.name")
      .limit(4);

    const panel = {
      paid: {
        list: !paidList ? [] : paidList,
        total: !paidTotal[0].total ? 0 : paidTotal[0].total,
        number: !paidList ? 0 : paidList.length,
      },
      pending: {
        list: !pendingList ? [] : pendingList,
        total: !pendingTotal[0].total ? 0 : pendingTotal[0].total,
        number: !pendingList ? 0 : pendingList.length,
      },
      overdue: {
        list: !overdueList ? [] : overdueList,
        total: !overdueTotal[0].total ? 0 : overdueTotal[0].total,
        number: !overdueList ? 0 : overdueList.length,
      },
    };
    return messages(res, 200, panel);
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const updateCharge = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const chargeExists = await queryBuilder("charges").where({ id }).first();

    if (!chargeExists) {
      return messages(res, 404, "Cobrança não encontrada");
    }

    const charge = await queryBuilder("charges")
      .where({ id })
      .update(data)
      .returning("*");

    return messages(res, 200, charge);
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const deleteCharge = async (req, res) => {
  const { id } = req.params;
  try {
    const charge = await queryBuilder("charges").where({ id }).first();

    if (!charge) {
      return messages(res, 404, "Cobrança não encontrada");
    }

    if (charge.status !== "Pendente") {
      return messages(
        res,
        400,
        "Uma cobrança só pode ser excluída se o status for Pendente"
      );
    }

    await queryBuilder("charges").where({ id }).del();

    return messages(res, 200, "Cobrança excluída com sucesso!");
  } catch (error) {
    return messages(res, 400, error);
  }
};

const updateUserStatus = async (id) => {
  const clientCharges = await queryBuilder("charges").where({
    client_id: id,
  });

  const defaultingClient = clientCharges.some((charge) => {
    return charge.status === "Vencida";
  });

  if (defaultingClient === true) {
    return await queryBuilder("clients")
      .where({ id })
      .update({ status: false });
  } else if (defaultingClient === false) {
    return await queryBuilder("clients").where({ id }).update({ status: true });
  }
};

module.exports = {
  registerCharge,
  filterCharges,
  listCharges,
  updateCharge,
  deleteCharge,
  panelCharges,
};
