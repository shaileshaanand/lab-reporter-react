export const omit = (obj) => {
  const missing = [null, undefined, ""];
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !missing.includes(v))
  );
};

export const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
