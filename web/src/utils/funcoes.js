export default function dateToStringConverter(date) {
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
}
