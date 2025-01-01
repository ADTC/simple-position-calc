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

Long Risk/Reward Ratio = Reward % / Risk %
Reward % = Long Risk/Reward Ratio * Risk %
Risk % = Reward % / Long Risk/Reward Ratio

Short Risk/Reward Ratio =  Risk % / Reward %
Risk % = Short Risk/Reward Ratio * Reward %
Reward % = Risk % / Short Risk/Reward Ratio

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

// Also: Pre-compute ratios after the simple pre-compute
// Note: Separate function is used to get updated values from last pre-compute.
const preComputeRatios = (initial: Values, isShort: boolean): Values => {
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

// Also: Pre-compute amounts after the simple and ratio pre-computes
// Note: Separate function is used to get updated values from last pre-compute.
const preComputeAmounts = (initial: Values): Values => {
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
    // longRiskRewardRatio,
    // shortRiskRewardRatio,
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

    longRiskRewardRatio:
      rewardPercent !== undefined && riskPercent !== undefined
        ? rewardPercent.div(riskPercent)
        : undefined,

    shortRiskRewardRatio:
      riskPercent !== undefined && rewardPercent !== undefined
        ? riskPercent.div(rewardPercent)
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
    longRiskRewardRatio: merge(
      computed.longRiskRewardRatio,
      initial.longRiskRewardRatio
    ),
    shortRiskRewardRatio: merge(
      computed.shortRiskRewardRatio,
      initial.shortRiskRewardRatio
    ),
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
        longRiskRewardRatio: !equal(
          computed.longRiskRewardRatio,
          initial.longRiskRewardRatio
        ),
        shortRiskRewardRatio: !equal(
          computed.shortRiskRewardRatio,
          initial.shortRiskRewardRatio
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
  longRiskRewardRatio: Decimal | undefined;
  shortRiskRewardRatio: Decimal | undefined;
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
  longRiskRewardRatio: boolean;
  shortRiskRewardRatio: boolean;
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
  longRiskRewardRatio: false,
  shortRiskRewardRatio: false,
  entryPrice: false,
  buyAmount: false,
  slTrigger: false,
  slSellAmount: false,
  stop: false,
  riskPercent: false,
  riskAmount: false,
};
