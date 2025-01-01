import { type Error, noError, type Values } from "./types";
import { equal, merge } from "./utils";

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
