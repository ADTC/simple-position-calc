import { preComputeAmounts } from "./preComputeAmounts";
import { type Values } from "./types";

// Also: Pre-compute ratios after the simple pre-compute
// Note: Separate function is used to get updated values from last pre-compute.
export const preComputeRatios = (initial: Values, isShort: boolean): Values => {
  const {
    target,
    rewardPercent,
    rewardAmount,
    // tpLimit,
    // tpSellAmount,
    // longRiskRewardRatio,
    // shortRiskRewardRatio,
    entryPrice,
    buyAmount,
    // slTrigger,
    // slSellAmount,
    stop,
    riskPercent,
    riskAmount,
  } = initial;

  initial.rewardPercent =
    initial.rewardPercent === undefined &&
    target !== undefined &&
    entryPrice !== undefined
      ? target.div(entryPrice).mul(100)
      : initial.rewardPercent === undefined &&
        rewardAmount !== undefined &&
        buyAmount !== undefined
      ? rewardAmount.div(buyAmount).mul(100)
      : initial.rewardPercent;

  initial.riskPercent =
    initial.riskPercent === undefined &&
    stop !== undefined &&
    entryPrice !== undefined
      ? stop.div(entryPrice).mul(100)
      : initial.riskPercent === undefined &&
        riskAmount !== undefined &&
        buyAmount !== undefined
      ? riskAmount.div(buyAmount).mul(100)
      : initial.riskPercent;

  initial.longRiskRewardRatio =
    initial.longRiskRewardRatio === undefined &&
    rewardPercent !== undefined &&
    riskPercent !== undefined
      ? rewardPercent.div(riskPercent)
      : initial.longRiskRewardRatio === undefined &&
        initial.rewardPercent !== undefined &&
        initial.riskPercent !== undefined
      ? initial.rewardPercent.div(initial.riskPercent)
      : initial.longRiskRewardRatio;

  initial.shortRiskRewardRatio =
    initial.shortRiskRewardRatio === undefined &&
    riskPercent !== undefined &&
    rewardPercent !== undefined
      ? riskPercent.div(rewardPercent)
      : initial.shortRiskRewardRatio === undefined &&
        initial.riskPercent !== undefined &&
        initial.rewardPercent !== undefined
      ? initial.riskPercent.div(initial.rewardPercent)
      : initial.shortRiskRewardRatio;

  // Back-compute Risk % and Reward % if Ratio is given

  if (isShort) {
    initial.rewardPercent =
      initial.rewardPercent === undefined &&
      initial.shortRiskRewardRatio !== undefined &&
      initial.riskPercent !== undefined
        ? initial.riskPercent.div(initial.shortRiskRewardRatio)
        : initial.rewardPercent;

    initial.riskPercent =
      initial.riskPercent === undefined &&
      initial.shortRiskRewardRatio !== undefined &&
      initial.rewardPercent !== undefined
        ? initial.shortRiskRewardRatio.mul(initial.rewardPercent)
        : initial.riskPercent;
    //
  } else {
    initial.rewardPercent =
      initial.rewardPercent === undefined &&
      initial.longRiskRewardRatio !== undefined &&
      initial.riskPercent !== undefined
        ? initial.longRiskRewardRatio.mul(initial.riskPercent)
        : initial.rewardPercent;

    initial.riskPercent =
      initial.riskPercent === undefined &&
      initial.longRiskRewardRatio !== undefined &&
      initial.rewardPercent !== undefined
        ? initial.rewardPercent.div(initial.longRiskRewardRatio)
        : initial.riskPercent;
  }

  return preComputeAmounts(initial);
};
