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
      ? tpLimit - entryPrice
      : initial.target;

  initial.tpLimit =
    initial.tpLimit === undefined &&
    target !== undefined &&
    entryPrice !== undefined
      ? target + entryPrice
      : initial.tpLimit;

  initial.entryPrice =
    initial.entryPrice === undefined &&
    tpLimit !== undefined &&
    target !== undefined
      ? tpLimit - target
      : initial.entryPrice;

  initial.buyAmount =
    initial.buyAmount === undefined &&
    rewardAmount !== undefined &&
    tpSellAmount !== undefined
      ? tpSellAmount - rewardAmount
      : initial.buyAmount;

  initial.rewardAmount =
    initial.rewardAmount === undefined &&
    buyAmount !== undefined &&
    tpSellAmount !== undefined
      ? tpSellAmount - buyAmount
      : initial.rewardAmount;

  initial.tpSellAmount =
    initial.tpSellAmount === undefined &&
    buyAmount !== undefined &&
    rewardAmount !== undefined
      ? buyAmount + rewardAmount
      : initial.tpSellAmount;

  initial.slTrigger =
    initial.slTrigger === undefined &&
    entryPrice !== undefined &&
    stop !== undefined
      ? entryPrice - stop
      : initial.slTrigger;

  initial.stop =
    initial.stop === undefined &&
    entryPrice !== undefined &&
    slTrigger !== undefined
      ? entryPrice - slTrigger
      : initial.stop;

  initial.entryPrice =
    initial.entryPrice === undefined &&
    slTrigger !== undefined &&
    stop !== undefined
      ? stop + slTrigger
      : initial.entryPrice;

  initial.buyAmount =
    initial.buyAmount === undefined &&
    riskAmount !== undefined &&
    slSellAmount !== undefined
      ? slSellAmount + riskAmount
      : initial.buyAmount;

  initial.riskAmount =
    initial.riskAmount === undefined &&
    buyAmount !== undefined &&
    slSellAmount !== undefined
      ? buyAmount - slSellAmount
      : initial.riskAmount;

  initial.slSellAmount =
    initial.slSellAmount === undefined &&
    buyAmount !== undefined &&
    riskAmount !== undefined
      ? buyAmount - riskAmount
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
      ? (target / entryPrice) * 100
      : initial.rewardPercent === undefined &&
        rewardAmount !== undefined &&
        buyAmount !== undefined
      ? (rewardAmount / buyAmount) * 100
      : initial.rewardPercent;

  initial.riskPercent =
    initial.riskPercent === undefined &&
    stop !== undefined &&
    entryPrice !== undefined
      ? (stop / entryPrice) * 100
      : initial.riskPercent === undefined &&
        riskAmount !== undefined &&
        buyAmount !== undefined
      ? (riskAmount / buyAmount) * 100
      : initial.riskPercent;

  initial.riskRewardRatio =
    initial.riskRewardRatio === undefined &&
    rewardPercent !== undefined &&
    riskPercent !== undefined
      ? rewardPercent / riskPercent
      : initial.riskRewardRatio === undefined &&
        initial.rewardPercent !== undefined &&
        initial.riskPercent !== undefined
      ? initial.rewardPercent / initial.riskPercent
      : initial.riskRewardRatio;

  // Round to 5 decimal places
  const computed: Values = Object.fromEntries(
    Object.entries(initial).map(([key, value]) => [
      key,
      value !== undefined ? Math.round(value * 1e5) / 1e5 : undefined,
    ])
  ) as Values;

  return computed;
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
  const computedFloat: Values = {
    target:
      tpLimit !== undefined && entryPrice !== undefined
        ? tpLimit - entryPrice
        : rewardPercent !== undefined && entryPrice !== undefined
        ? entryPrice * (rewardPercent / 100)
        : undefined,

    rewardPercent:
      target !== undefined && entryPrice !== undefined
        ? (target / entryPrice) * 100
        : rewardAmount !== undefined && buyAmount !== undefined
        ? (rewardAmount / buyAmount) * 100
        : undefined,

    rewardAmount:
      buyAmount !== undefined && rewardPercent !== undefined
        ? buyAmount * (rewardPercent / 100)
        : undefined,

    tpLimit:
      target !== undefined && entryPrice !== undefined
        ? target + entryPrice
        : target !== undefined && rewardPercent !== undefined
        ? target / (rewardPercent / 100) + target
        : undefined,

    tpSellAmount:
      buyAmount !== undefined && rewardAmount !== undefined
        ? buyAmount + rewardAmount
        : undefined,

    riskRewardRatio:
      rewardPercent !== undefined && riskPercent !== undefined
        ? rewardPercent / riskPercent
        : undefined,

    entryPrice:
      slTrigger !== undefined && stop !== undefined
        ? stop + slTrigger
        : stop !== undefined && riskPercent !== undefined
        ? stop / (riskPercent / 100)
        : target !== undefined && rewardPercent !== undefined
        ? target / (rewardPercent / 100)
        : undefined,

    buyAmount:
      riskAmount !== undefined && riskPercent !== undefined
        ? riskAmount / (riskPercent / 100)
        : undefined,

    slTrigger:
      entryPrice !== undefined && stop !== undefined
        ? entryPrice - stop
        : stop !== undefined && riskPercent !== undefined
        ? stop / (riskPercent / 100) - stop
        : undefined,

    slSellAmount:
      buyAmount !== undefined && riskAmount !== undefined
        ? buyAmount - riskAmount
        : undefined,

    stop:
      entryPrice !== undefined && slTrigger !== undefined
        ? entryPrice - slTrigger
        : riskPercent !== undefined && entryPrice !== undefined
        ? entryPrice * (riskPercent / 100)
        : undefined,

    riskPercent:
      stop !== undefined && entryPrice !== undefined
        ? (stop / entryPrice) * 100
        : riskAmount !== undefined && buyAmount !== undefined
        ? (riskAmount / buyAmount) * 100
        : undefined,

    riskAmount:
      buyAmount !== undefined && riskPercent !== undefined
        ? buyAmount * (riskPercent / 100)
        : undefined,
  };

  // Round to 5 decimal places
  const computed: Values = Object.fromEntries(
    Object.entries(computedFloat).map(([key, value]) => [
      key,
      value !== undefined ? Math.round(value * 1e5) / 1e5 : undefined,
    ])
  ) as Values;

  // Merge initial and computed states
  // (only defined values in computed state should overwrite initial state)
  const merged: Values = {
    target: computed.target ?? initial.target,
    rewardPercent: computed.rewardPercent ?? initial.rewardPercent,
    rewardAmount: computed.rewardAmount ?? initial.rewardAmount,
    tpLimit: computed.tpLimit ?? initial.tpLimit,
    tpSellAmount: computed.tpSellAmount ?? initial.tpSellAmount,
    riskRewardRatio: computed.riskRewardRatio ?? initial.riskRewardRatio,
    entryPrice: computed.entryPrice ?? initial.entryPrice,
    buyAmount: computed.buyAmount ?? initial.buyAmount,
    slTrigger: computed.slTrigger ?? initial.slTrigger,
    slSellAmount: computed.slSellAmount ?? initial.slSellAmount,
    stop: computed.stop ?? initial.stop,
    riskPercent: computed.riskPercent ?? initial.riskPercent,
    riskAmount: computed.riskAmount ?? initial.riskAmount,
  };

  if (JSON.stringify(initial) === JSON.stringify(merged)) {
    return [merged, noError];
  } else {
    if (loopCount < 100) {
      return compute(merged, loopCount + 1);
    } else {
      const error: Error = {
        target: computed.target !== initial.target,
        rewardPercent: computed.rewardPercent !== initial.rewardPercent,
        rewardAmount: computed.rewardAmount !== initial.rewardAmount,
        tpLimit: computed.tpLimit !== initial.tpLimit,
        tpSellAmount: computed.tpSellAmount !== initial.tpSellAmount,
        riskRewardRatio: computed.riskRewardRatio !== initial.riskRewardRatio,
        entryPrice: computed.entryPrice !== initial.entryPrice,
        buyAmount: computed.buyAmount !== initial.buyAmount,
        slTrigger: computed.slTrigger !== initial.slTrigger,
        slSellAmount: computed.slSellAmount !== initial.slSellAmount,
        stop: computed.stop !== initial.stop,
        riskPercent: computed.riskPercent !== initial.riskPercent,
        riskAmount: computed.riskAmount !== initial.riskAmount,
      };
      console.error("Compute failed with infinite recursion.", initial, merged);
      return [null, error];
    }
  }
};

type Values = {
  target: number | undefined;
  rewardPercent: number | undefined;
  rewardAmount: number | undefined;
  tpLimit: number | undefined;
  tpSellAmount: number | undefined;
  riskRewardRatio: number | undefined;
  entryPrice: number | undefined;
  buyAmount: number | undefined;
  slTrigger: number | undefined;
  slSellAmount: number | undefined;
  stop: number | undefined;
  riskPercent: number | undefined;
  riskAmount: number | undefined;
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
