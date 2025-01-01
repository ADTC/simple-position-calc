import type Decimal from "decimal.js";

export const merge = (
  computed: Decimal | undefined,
  initial: Decimal | undefined
): Decimal | undefined => {
  if (computed === undefined) return initial;
  if (equal(computed, initial)) return initial;
  else return computed;
};

export const equal = (
  computed: Decimal | undefined,
  initial: Decimal | undefined
): boolean => {
  if (computed === undefined && initial === undefined) return true;
  if (computed === undefined || initial === undefined) return false;
  return (
    computed.toFixed(100).slice(0, -50) === initial.toFixed(100).slice(0, -50)
  );
};
