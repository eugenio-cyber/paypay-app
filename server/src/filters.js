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
  const data = req.body;
  const { cpf, email, password } = data;
  !id && messages(res, 400, "O ID é obrigatório");
  !data && messages(res, 400, "Informe os dados para atualização!");

  if (password) {
    const schema = yup.object().shape({
      password: yup
        .string()
        .min(6)
        .required("O campo senha tem que ter no mínimo 6 caracteres"),
    });
    try {
      await schema.validate(data);
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
        .required("CPF tem que ter no mínimo 11 e no máximo 14 dígitos"),
    });
    try {
      await schema.validate(data);
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
    return messages(res, 400, "Dados inválidos! " + error.message);
  }
};

const verifyOnRegisterClient = async (req, res, next) => {
  const { cpf, email } = req.body;

  const schema = yup.object().shape({
    name: yup.string().required("O campo nome é obrigatório"),
    email: yup.string().email().required("O campo email é obrigatório"),
    cpf: yup.string().min(11).max(14).required("O campo cpf é obrigatório"),
    phone: yup.string().required("O campo telefone é obrigatório"),
    cep: yup.string(),
    street: yup.string(),
    complement: yup.string(),
    address: yup.string(),
    city: yup.string(),
    state: yup.string(),
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
    return messages(res, 400, "Dados inválidos ou faltando.");
  }
};

const verifyOnUpdateClient = async (req, res, next) => {
  if (!req.params) {
    return messages(res, 400, "O ID é obrigatório");
  }

  if (!req.body) {
    return messages(res, 400, "Informe os dados para atualização!");
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
