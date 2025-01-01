import { preComputeRatios } from "./preComputeRatios";
import { type Values } from "./types";

// Pre-compute simple addition and subtraction
export const preCompute = (initial: Values, isShort: boolean): Values => {
  const {
    target,
    // rewardPercent,
    rewardAmount,
    tpLimit,
    tpSellAmount,
    // longRiskRewardRatio,
    // shortRiskRewardRatio,
    entryPrice,
    buyAmount,
    slTrigger,
    slSellAmount,
    stop,
    // riskPercent,
    riskAmount,
  } = initial;

  initial.target =
    initial.target === undefined &&
    tpLimit !== undefined &&
    entryPrice !== undefined
      ? tpLimit.minus(entryPrice)
      : initial.target;

  initial.tpLimit =
    initial.tpLimit === undefined &&
    target !== undefined &&
    entryPrice !== undefined
      ? target.plus(entryPrice)
      : initial.tpLimit;

  initial.entryPrice =
    initial.entryPrice === undefined &&
    tpLimit !== undefined &&
    target !== undefined
      ? tpLimit.minus(target)
      : initial.entryPrice;

  initial.buyAmount =
    initial.buyAmount === undefined &&
    rewardAmount !== undefined &&
    tpSellAmount !== undefined
      ? tpSellAmount.minus(rewardAmount)
      : initial.buyAmount;

  initial.rewardAmount =
    initial.rewardAmount === undefined &&
    buyAmount !== undefined &&
    tpSellAmount !== undefined
      ? tpSellAmount.minus(buyAmount)
      : initial.rewardAmount;

  initial.tpSellAmount =
    initial.tpSellAmount === undefined &&
    buyAmount !== undefined &&
    rewardAmount !== undefined
      ? buyAmount.plus(rewardAmount)
      : initial.tpSellAmount;

  initial.slTrigger =
    initial.slTrigger === undefined &&
    entryPrice !== undefined &&
    stop !== undefined
      ? entryPrice.minus(stop)
      : initial.slTrigger;

  initial.stop =
    initial.stop === undefined &&
    entryPrice !== undefined &&
    slTrigger !== undefined
      ? entryPrice.minus(slTrigger)
      : initial.stop;

  initial.entryPrice =
    initial.entryPrice === undefined &&
    slTrigger !== undefined &&
    stop !== undefined
      ? stop.plus(slTrigger)
      : initial.entryPrice;

  initial.buyAmount =
    initial.buyAmount === undefined &&
    riskAmount !== undefined &&
    slSellAmount !== undefined
      ? slSellAmount.plus(riskAmount)
      : initial.buyAmount;

  initial.riskAmount =
    initial.riskAmount === undefined &&
    buyAmount !== undefined &&
    slSellAmount !== undefined
      ? buyAmount.minus(slSellAmount)
      : initial.riskAmount;

  initial.slSellAmount =
    initial.slSellAmount === undefined &&
    buyAmount !== undefined &&
    riskAmount !== undefined
      ? buyAmount.minus(riskAmount)
      : initial.slSellAmount;

  return preComputeRatios(initial, isShort);
};
