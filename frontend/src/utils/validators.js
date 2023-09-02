const isPositive = (val) => val > 0 || "must > 0";
const isInteger = (val) => Number.isInteger(val) || "must be an integer";

export { isPositive, isInteger };
