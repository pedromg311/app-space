export const isValidIdsList = (ids: string) => {
  if (ids.trim().length === 0) {
    return true;
  }

  const arrayOfIds = ids.trim().split(",");
  let wrongIds = arrayOfIds.filter((id) => !/^\d+$/.test(id));

  return wrongIds.length === 0;
};

export const formatValue = (value: string) => {
  return encodeURIComponent(value.trim());
};
