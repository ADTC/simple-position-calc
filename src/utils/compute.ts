import Decimal from "decimal.js";

// With 100 significant digits, chop the last 50 digits when comparing two Decimals.
// This is to have a tolerance for values that are very close but not exactly equal.
Decimal.set({ precision: 100 });

/*
Formulae:

Target = TP Limit - Entry Price
TP Limit = Entry Price + Target
TP Limit = (Target / Reward %) + Target
Entry Price = TP Limit - Target
Reward % = Target / Entry Price
Target = Entry Price * Reward %
Entry Price = Target / Reward %
Reward Amount = Buy Amount * Reward %
Reward % = Reward Amount / Buy Amount
Sell Amount(USD) = Buy Amount (USD) + Reward Amount (USD)

Risk/Reward Ratio = Reward % / Risk %

Stop = Entry Price - SL Trigger
SL Trigger = Entry Price - Stop
SL Trigger = (Stop / Risk %) - Stop
Entry Price = SL Trigger + Stop
Risk % = Stop / Entry Price
Stop = Entry Price * Risk %
Entry Price = Stop / Risk %
Risk Amount = Buy Amount * Risk %
Risk % = Risk Amount / Buy Amount
Sell Amount (USD) = Buy Amount (USD) - Risk Amount (USD)
*/

// Pre-compute simple addition and subtraction
export const preCompute = (initial: Values): Values => {
  const {
    target,
    // rewardPercent,
    rewardAmount,
    tpLimit,
    tpSellAmount,
    // riskRewardRatio,
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

  return initial;
};

// Also-compute ratios after the simple pre-compute
export const preComputeRatios = (initial: Values): Values => {
  const {
    target,
    rewardPercent,
    rewardAmount,
    // tpLimit,
    // tpSellAmount,
    // riskRewardRatio,
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

  initial.riskRewardRatio =
    initial.riskRewardRatio === undefined &&
    rewardPercent !== undefined &&
    riskPercent !== undefined
      ? rewardPercent.div(riskPercent)
      : initial.riskRewardRatio === undefined &&
        initial.rewardPercent !== undefined &&
        initial.riskPercent !== undefined
      ? initial.rewardPercent.div(initial.riskPercent)
      : initial.riskRewardRatio;

  return initial;
};

export const compute = (
  initial: Values,
  loopCount: number = 1
): [Values | null, Error] => {
  const {
    target,
    rewardPercent,
    rewardAmount,
    tpLimit,
    // tpSellAmount,
    // riskRewardRatio,
    entryPrice,
    buyAmount,
    slTrigger,
    // slSellAmount,
    stop,
    riskPercent,
    riskAmount,
  } = initial;

  const computed: Values = {
    target:
      tpLimit !== undefined && entryPrice !== undefined
        ? tpLimit.minus(entryPrice)
        : rewardPercent !== undefined && entryPrice !== undefined
        ? entryPrice.mul(rewardPercent.div(100))
        : undefined,

    rewardPercent:
      target !== undefined && entryPrice !== undefined
        ? target.div(entryPrice).mul(100)
        : rewardAmount !== undefined && buyAmount !== undefined
        ? rewardAmount.div(buyAmount).mul(100)
        : undefined,

    rewardAmount:
      buyAmount !== undefined && rewardPercent !== undefined
        ? buyAmount.mul(rewardPercent.div(100))
        : undefined,

    tpLimit:
      target !== undefined && entryPrice !== undefined
        ? target.plus(entryPrice)
        : target !== undefined && rewardPercent !== undefined
        ? target.div(rewardPercent.div(100)).plus(target)
        : undefined,

    tpSellAmount:
      buyAmount !== undefined && rewardAmount !== undefined
        ? buyAmount.plus(rewardAmount)
        : undefined,

    riskRewardRatio:
      rewardPercent !== undefined && riskPercent !== undefined
        ? rewardPercent.div(riskPercent)
        : undefined,

    entryPrice:
      slTrigger !== undefined && stop !== undefined
        ? stop.plus(slTrigger)
        : stop !== undefined && riskPercent !== undefined
        ? stop.div(riskPercent.div(100))
        : target !== undefined && rewardPercent !== undefined
        ? target.div(rewardPercent.div(100))
        : undefined,

    buyAmount:
      riskAmount !== undefined && riskPercent !== undefined
        ? riskAmount.div(riskPercent.div(100))
        : undefined,

    slTrigger:
      entryPrice !== undefined && stop !== undefined
        ? entryPrice.minus(stop)
        : stop !== undefined && riskPercent !== undefined
        ? stop.div(riskPercent.div(100)).minus(stop)
        : undefined,

    slSellAmount:
      buyAmount !== undefined && riskAmount !== undefined
        ? buyAmount.minus(riskAmount)
        : undefined,

    stop:
      entryPrice !== undefined && slTrigger !== undefined
        ? entryPrice.minus(slTrigger)
        : riskPercent !== undefined && entryPrice !== undefined
        ? entryPrice.mul(riskPercent.div(100))
        : undefined,

    riskPercent:
      stop !== undefined && entryPrice !== undefined
        ? stop.div(entryPrice).mul(100)
        : riskAmount !== undefined && buyAmount !== undefined
        ? riskAmount.div(buyAmount).mul(100)
        : undefined,

    riskAmount:
      buyAmount !== undefined && riskPercent !== undefined
        ? buyAmount.mul(riskPercent.div(100))
        : undefined,
  };

  // Merge initial and computed states
  // (only defined values in computed state should overwrite initial state)
  const merged: Values = {
    target: merge(computed.target, initial.target),
    rewardPercent: merge(computed.rewardPercent, initial.rewardPercent),
    rewardAmount: merge(computed.rewardAmount, initial.rewardAmount),
    tpLimit: merge(computed.tpLimit, initial.tpLimit),
    tpSellAmount: merge(computed.tpSellAmount, initial.tpSellAmount),
    riskRewardRatio: merge(computed.riskRewardRatio, initial.riskRewardRatio),
    entryPrice: merge(computed.entryPrice, initial.entryPrice),
    buyAmount: merge(computed.buyAmount, initial.buyAmount),
    slTrigger: merge(computed.slTrigger, initial.slTrigger),
    slSellAmount: merge(computed.slSellAmount, initial.slSellAmount),
    stop: merge(computed.stop, initial.stop),
    riskPercent: merge(computed.riskPercent, initial.riskPercent),
    riskAmount: merge(computed.riskAmount, initial.riskAmount),
  };

  if (JSON.stringify(initial) === JSON.stringify(merged)) {
    return [merged, noError];
  } else {
    if (loopCount < 100) {
      if (loopCount > 5 && loopCount < 10)
        console.debug(
          "Loop Count",
          loopCount,
          JSON.parse(JSON.stringify(initial)),
          JSON.parse(JSON.stringify(merged))
        );
      return compute(merged, loopCount + 1);
    } else {
      const error: Error = {
        target: !equal(computed.target, initial.target),
        rewardPercent: !equal(computed.rewardPercent, initial.rewardPercent),
        rewardAmount: !equal(computed.rewardAmount, initial.rewardAmount),
        tpLimit: !equal(computed.tpLimit, initial.tpLimit),
        tpSellAmount: !equal(computed.tpSellAmount, initial.tpSellAmount),
        riskRewardRatio: !equal(
          computed.riskRewardRatio,
          initial.riskRewardRatio
        ),
        entryPrice: !equal(computed.entryPrice, initial.entryPrice),
        buyAmount: !equal(computed.buyAmount, initial.buyAmount),
        slTrigger: !equal(computed.slTrigger, initial.slTrigger),
        slSellAmount: !equal(computed.slSellAmount, initial.slSellAmount),
        stop: !equal(computed.stop, initial.stop),
        riskPercent: !equal(computed.riskPercent, initial.riskPercent),
        riskAmount: !equal(computed.riskAmount, initial.riskAmount),
      };
      console.error(
        "Compute failed with infinite recursion.",
        JSON.parse(JSON.stringify(initial)),
        JSON.parse(JSON.stringify(merged))
      );
      return [null, error];
    }
  }
};

const merge = (
  computed: Decimal | undefined,
  initial: Decimal | undefined
): Decimal | undefined => {
  if (computed === undefined) return initial;
  if (equal(computed, initial)) return initial;
  else return computed;
};

const equal = (
  computed: Decimal | undefined,
  initial: Decimal | undefined
): boolean => {
  if (computed === undefined && initial === undefined) return true;
  if (computed === undefined || initial === undefined) return false;
  return (
    computed.toFixed(100).slice(0, -50) === initial.toFixed(100).slice(0, -50)
  );
};

type Values = {
  target: Decimal | undefined;
  rewardPercent: Decimal | undefined;
  rewardAmount: Decimal | undefined;
  tpLimit: Decimal | undefined;
  tpSellAmount: Decimal | undefined;
  riskRewardRatio: Decimal | undefined;
  entryPrice: Decimal | undefined;
  buyAmount: Decimal | undefined;
  slTrigger: Decimal | undefined;
  slSellAmount: Decimal | undefined;
  stop: Decimal | undefined;
  riskPercent: Decimal | undefined;
  riskAmount: Decimal | undefined;
};

export type Error = {
  target: boolean;
  rewardPercent: boolean;
  rewardAmount: boolean;
  tpLimit: boolean;
  tpSellAmount: boolean;
  riskRewardRatio: boolean;
  entryPrice: boolean;
  buyAmount: boolean;
  slTrigger: boolean;
  slSellAmount: boolean;
  stop: boolean;
  riskPercent: boolean;
  riskAmount: boolean;
};

export const noError: Error = {
  target: false,
  rewardPercent: false,
  rewardAmount: false,
  tpLimit: false,
  tpSellAmount: false,
  riskRewardRatio: false,
  entryPrice: false,
  buyAmount: false,
  slTrigger: false,
  slSellAmount: false,
  stop: false,
  riskPercent: false,
  riskAmount: false,
};
