export const dateToStringConverter = (date) => {
  let dataDb = new Date(date);

  const day =
    dataDb.getUTCDate() + 1 < 10
      ? `0${dataDb.getUTCDate()}`
      : dataDb.getUTCDate();

  const month =
    dataDb.getUTCMonth() + 1 < 10
      ? `0${dataDb.getUTCMonth() + 1}`
      : dataDb.getUTCMonth() + 1;

  const year = dataDb.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export const cepMask = (cep) => {
  if (cep.length >= 9) return cep.slice(0, 9);

  return cep.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
};

export const cpfMask = (cpf) => {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const phoneMask = (phone) => {
  if (phone.length >= 15) return phone.slice(0, 15);

  return phone
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
};
