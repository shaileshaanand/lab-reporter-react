export const omit = (obj) => {
  const missing = [null, undefined, ""];
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !missing.includes(v))
  );
};
