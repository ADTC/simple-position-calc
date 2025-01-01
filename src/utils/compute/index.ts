import Decimal from "decimal.js";

import { type Error, noError } from "./types";
import { compute } from "./compute";
import { preCompute } from "./preCompute";

// With 100 significant digits, chop the last 50 digits when comparing two Decimals.
// This is to have a tolerance for values that are very close but not exactly equal.
Decimal.set({ precision: 100 });

export { compute, noError, preCompute, type Error };
