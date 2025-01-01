import { type Values } from "./types";

// Also: Pre-compute amounts after the simple and ratio pre-computes
// Note: Separate function is used to get updated values from last pre-compute.
export const preComputeAmounts = (initial: Values): Values => {
  const {
    // target,
    rewardPercent,
    rewardAmount,
    // tpLimit,
    tpSellAmount,
    // longRiskRewardRatio,
    // shortRiskRewardRatio,
    // entryPrice,
    // buyAmount,
    // slTrigger,
    slSellAmount,
    // stop,
    riskPercent,
    riskAmount,
  } = initial;

  let buyAmount = initial.buyAmount;

  if (buyAmount === undefined) {
    if (rewardAmount !== undefined && rewardPercent !== undefined) {
      buyAmount = rewardAmount.div(rewardPercent.div(100));
    } else if (riskAmount !== undefined && riskPercent !== undefined) {
      buyAmount = riskAmount.div(riskPercent.div(100));
    } else if (tpSellAmount !== undefined && rewardPercent !== undefined) {
      buyAmount = tpSellAmount.div(rewardPercent.div(100).plus(1));
    } else if (slSellAmount !== undefined && riskPercent !== undefined) {
      buyAmount = slSellAmount.div(riskPercent.div(100).minus(1).negated());
    }
    initial.buyAmount = buyAmount;
  }

  initial.rewardAmount =
    initial.rewardAmount === undefined &&
    buyAmount !== undefined &&
    rewardPercent !== undefined
      ? buyAmount.mul(rewardPercent.div(100))
      : initial.rewardAmount;

  initial.riskAmount =
    initial.riskAmount === undefined &&
    buyAmount !== undefined &&
    riskPercent !== undefined
      ? buyAmount.mul(riskPercent.div(100))
      : initial.riskAmount;

  initial.tpSellAmount =
    initial.tpSellAmount === undefined &&
    buyAmount !== undefined &&
    rewardAmount !== undefined
      ? buyAmount.plus(rewardAmount)
      : initial.tpSellAmount;

  initial.slSellAmount =
    initial.slSellAmount === undefined &&
    buyAmount !== undefined &&
    riskAmount !== undefined
      ? buyAmount.minus(riskAmount)
      : initial.slSellAmount;

  return initial;
};
