const queryBuilder = require("../services/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { messages } = require("../utils/utils");
const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const schema = yup.object().shape({
    email: yup.string().email().required("E-mail obrigatório e válido!"),
    password: yup
      .string()
      .min(6)
      .required("Senha é obrigatória e deve ter no mínimo 6 caracteres!"),
  });

  try {
    await schema.validate(req.body);

    const result = await queryBuilder("users")
      .select("*")
      .where({ email })
      .first();

    if (!result) {
      return messages(res, 404, "E-mail ou senha inválidos!");
    }

    const isValid = await bcrypt.compare(password, result.password);

    if (!isValid) {
      return messages(res, 401, "Senha inválida");
    }

    const { password: _, ...user } = result;

    const token = await jwt.sign(user, process.env.SUPABASE_JWT_SECRET, {
      expiresIn: "8h",
    });

    delete user.id;

    messages(res, 200, { user, token });
  } catch (error) {
    messages(res, 400, error.message);
  }
};

const getUserProfile = async (req, res) => {
  const { email } = req.user;
  try {
    const profile = await queryBuilder("users")
      .where({ email })
      .select("name", "cpf", "email", "phone")
      .first();

    return messages(res, 200, profile);
  } catch (error) {
    return messages(res, 404, "Erro ao buscar perfil!");
  }
};

const createUser = async (req, res) => {
  const data = req.body;
  const salts = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data.password, salts);
  data.password = hash;

  try {
    const result = await queryBuilder("users").insert(data).returning("*");
    const { password: _, ...user } = result[0];

    return messages(res, 201, "Cadastro realizado com sucesso!");
  } catch (error) {
    return messages(res, 400, "Erro inesperado: " + error.message);
  }
};

const updateUser = async (req, res) => {
  const { oldEmail, ...data } = req.body;
  const salts = await bcrypt.genSalt(10);
  const user = await queryBuilder("users")
    .select("*")
    .where({ email: oldEmail })
    .first();

  try {
    if (data.password && data.password !== user.password) {
      const hash = await bcrypt.hash(data.password, salts);
      const result = await bcrypt.compare(hash, user.password);

      if (!result) data.password = hash;
    }

    await queryBuilder("users").update(data).where({ email: oldEmail });

    return messages(res, 200, "Usuário atualizado com sucesso");
  } catch (error) {
    return messages(res, 400, error.message);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await queryBuilder("users").where({ id }).del();

    if (!result) {
      return messages(res, 404, "Usuário não encontrado!");
    }
    return messages(res, 200, "Usuário excluído com sucesso!");
  } catch (error) {
    return messages(res, 400, "Não foi possível excluir o usuário!");
  }
};

module.exports = {
  getUserProfile,
  userLogin,
  createUser,
  updateUser,
  deleteUser,
};
