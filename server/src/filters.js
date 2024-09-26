const queryBuilder = require("./services/connection");
const jwt = require("jsonwebtoken");
const yup = require("yup");
const { pt } = require("yup-locales");
const { messages } = require("./utils/utils");
yup.setLocale(pt);

const verifyLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return messages(res, 401, "Usuário não autenticado!");
  }
  const token = authorization.replace("Bearer ", "");

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    const result = await queryBuilder("users")
      .select("*")
      .where({ id })
      .first();

    if (!result) {
      return messages(res, 404, "Usuário não encontrado");
    }

    const { password: _, ...user } = result;

    req.user = user;

    next();
  } catch (error) {
    return messages(res, 400, "Token inválido");
  }
};

const verifyOnCreateUser = async (req, res, next) => {
  const { email } = req.body;
  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  try {
    await schema.validate(req.body);

    const isEmail = await queryBuilder("users")
      .where({ email })
      .select("*")
      .first();

    if (isEmail) {
      return messages(res, 400, "E-mail já cadastrado!");
    }
    next();
  } catch (error) {
    messages(res, 500, error);
  }
};

const verifyOnUpdateUser = async (req, res, next) => {
  const { id } = req.user;
  const dados = req.body;
  const { cpf, email, senha } = dados;
  !id && messages(res, 400, "O ID é obrigatório");
  !dados && messages(res, 400, "Informe os dados para atualização!");

  if (senha) {
    const schema = yup.object().shape({
      senha: yup
        .string()
        .min(6)
        .required("O campo senha tem que ter no mínimo 6 caracteres"),
    });
    try {
      await schema.validate(dados);
    } catch (error) {
      return messages(res, 400, "Senha inválida!");
    }
  }

  if (cpf) {
    const schema = yup.object().shape({
      cpf: yup
        .string()
        .min(11)
        .max(14)
        .required("CPF tem que ter no mínimo 11 e no máximo 14 digitos"),
    });
    try {
      await schema.validate(dados);
    } catch (error) {
      return messages(res, 400, "CPF inválido!");
    }
  }

  try {
    if (email) {
      const rsEmail = await queryBuilder("users")
        .select("email")
        .whereNot({ id })
        .where({ email })
        .first();

      if (rsEmail) {
        return messages(res, 400, "E-mail já cadastrado!");
      }
    }

    if (cpf) {
      const rsCpf = await queryBuilder("users")
        .select("cpf")
        .whereNot({ id })
        .where({ cpf })
        .first();

      if (rsCpf) {
        return messages(res, 400, "CPF já cadastrado!");
      }
    }

    next();
  } catch (error) {
    return messages(res, 400, "Dados inválidos Filter User ! " + error.message);
  }
};

const verifyOnRegisterClient = async (req, res, next) => {
  const { cpf, email } = req.body;

  const schema = yup.object().shape({
    name: yup.string().required("O campo nome é obrigatório"),
    email: yup.string().email().required("O campo email é obrigatório"),
    cpf: yup.string().min(11).max(14).required("O campo cpf é obrigatório"),
    telefone: yup.string().required("O campo telefone é obrigatório"),
    cep: yup.string(),
    logradouro: yup.string(),
    complemento: yup.string(),
    bairro: yup.string(),
    cidade: yup.string(),
    estado: yup.string(),
  });

  try {
    await schema.validate(req.body);

    const rsCpf = await queryBuilder("clients")
      .select("cpf")
      .where({ cpf })
      .first();

    if (rsCpf) {
      return messages(res, 400, "CPF já cadastrado!");
    }

    const rsEmail = await queryBuilder("clients")
      .select("cpf")
      .where({ email })
      .first();

    if (rsEmail) {
      return messages(res, 400, "E-mail já cadastrado!");
    }

    next();
  } catch (error) {
    return messages(res, 400, "Dados inválidos filter!");
  }
};

const verifyOnUpdateClient = async (req, res, next) => {
  const { name, cpf, email, telefone } = req.body;

  if (!req.params) {
    return messages(res, 400, "O ID é obrigatório");
  }

  if (!req.body) {
    return messages(res, 400, "Informe os dados para atualizaação! Filter");
  }
  next();
};

module.exports = {
  verifyLogin,
  verifyOnCreateUser,
  verifyOnUpdateUser,
  verifyOnRegisterClient,
  verifyOnUpdateClient,
};
