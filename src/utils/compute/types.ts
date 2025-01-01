import type Decimal from "decimal.js";

export type Values = {
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
