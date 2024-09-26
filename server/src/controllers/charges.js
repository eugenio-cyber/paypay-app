const queryBuilder = require("../services/connection");
const yup = require("yup");
const { pt } = require("yup-locales");
const { messages } = require("../utils/utils");
const { format } = require("date-fns");
yup.setLocale(pt);

const formatDateCharge = (charges) => {
  charges.forEach((charge) => {
    const expirationDate = new Date(charge.vencimento);

    charge.vencimento = format(expirationDate, "dd/MM/yyyy");
    charge.valor = (Number(charge.valor) / 100).toFixed(2);
  });
  return charges;
};

const registerCharge = async (req, res) => {
  let { client_id, status, vencimento } = req.body;
  const schema = yup.object().shape({
    client_id: yup.number().required("O campo cliente é obrigatório"),
    descricao: yup.string().required("O campo descrição é obrigatório"),
    valor: yup.number().required("O campo valor é obrigatório"),
    vencimento: yup.date().required("O campo data é obrigatório"),
  });

  if (status === "Pendente" || status === "Paga") {
  } else {
    return messages(res, 400, "O status deve ser apenas Pendente/Paga");
  }

  if (status != "Paga") {
    let dataVencimento = new Date(vencimento);
    dataVencimento = dataVencimento.getTime();
    const hoje = Date.now();

    if (dataVencimento < hoje) {
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
      return messages(res, 400, "não foi possivel cadastrar cobrança");
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
    let allcharges = await queryBuilder("charges")
      .join("clients", "charges.client_id", "clients.id")
      .select("charges.*", "clients.name")
      .orderBy("charges.id", "desc");

    allcharges = formatDateCharge(allcharges);

    return messages(res, 200, allcharges);
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const panelCharges = async (_, res) => {
  try {
    const paidTotal = await queryBuilder("vw_paypay")
      .where({ ch_status: "Paga" })
      .sum("valor as total");

    const pendingTotal = await queryBuilder("vw_paypay")
      .where({ ch_status: "Pendente" })
      .sum("valor as total");

    const overdueTotal = await queryBuilder("vw_paypay")
      .where({ ch_status: "Vencida" })
      .sum("valor as total");

    const paidCount = await queryBuilder("vw_paypay")
      .where({ ch_status: "Paga" })
      .count("* as total");

    const pendingCount = await queryBuilder("vw_paypay")
      .where({ ch_status: "Pendente" })
      .count("* as total");

    const overdueCount = await queryBuilder("vw_paypay")
      .where({ ch_status: "Vencida" })
      .count("* as total");

    const paidList = await queryBuilder("vw_paypay")
      .where({ ch_status: "Paga" })
      .select("*")
      .limit(4);

    const pendingList = await queryBuilder("vw_paypay")
      .where({ ch_status: "Pendente" })
      .select("*")
      .limit(4);

    const overdueList = await queryBuilder("vw_paypay")
      .where({ ch_status: "Vencida" })
      .select("*")
      .limit(4);

    const panel = {
      pagos: {
        list: !paidList ? [] : paidList,
        total: !paidTotal[0].total ? 0 : paidTotal[0].total,
        number: !paidCount[0].total ? 0 : paidCount[0].total,
      },
      pendentes: {
        list: !pendingList ? [] : pendingList,
        total: !pendingTotal[0].total ? 0 : pendingTotal[0].total,
        number: !pendingCount[0].total ? 0 : pendingCount[0].total,
      },
      vencidos: {
        list: !overdueList ? [] : overdueList,
        total: !overdueTotal[0].total ? 0 : overdueTotal[0].total,
        number: !overdueCount[0].total ? 0 : overdueCount[0].total,
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
