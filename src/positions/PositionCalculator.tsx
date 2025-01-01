import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextBoxes from "components/TextBoxes";
import Text from "components/Text";
import { compute, noError, preCompute, type Error } from "utils/compute";

import Decimal from "decimal.js";

export type Position = "long" | "short";

export default function PositionCalculator({ type }: { type: Position }) {
  const isShort = type === "short";

  const [target, setTarget] = useState<Decimal>();
  const [rewardPercent, setRewardPercent] = useState<Decimal>();
  const [rewardAmount, setRewardAmount] = useState<Decimal>();
  const [tpLimit, setTpLimit] = useState<Decimal>();
  const [tpSellAmount, setTpSellAmount] = useState<Decimal>();
  const [longRiskRewardRatio, setLongRiskRewardRatio] = useState<Decimal>();
  const [shortRiskRewardRatio, setShortRiskRewardRatio] = useState<Decimal>();
  const [entryPrice, setEntryPrice] = useState<Decimal>();
  const [buyAmount, setBuyAmount] = useState<Decimal>();
  const [slTrigger, setSlTrigger] = useState<Decimal>();
  const [slSellAmount, setSlSellAmount] = useState<Decimal>();
  const [stop, setStop] = useState<Decimal>();
  const [riskPercent, setRiskPercent] = useState<Decimal>();
  const [riskAmount, setRiskAmount] = useState<Decimal>();

  const [error, setError] = useState<Error>(noError);

  const handleCompute = () => {
    const initial = preCompute(
      {
        target,
        rewardPercent,
        rewardAmount,
        tpLimit,
        tpSellAmount,
        longRiskRewardRatio,
        shortRiskRewardRatio,
        entryPrice,
        buyAmount,
        slTrigger,
        slSellAmount,
        stop,
        riskPercent,
        riskAmount,
      },
      isShort
    );

    const [computed, error] = compute(initial);
    setError(error);

    if (!computed) return;

    setTarget(computed.target);
    setRewardPercent(computed.rewardPercent);
    setRewardAmount(computed.rewardAmount);
    setTpLimit(computed.tpLimit);
    setTpSellAmount(computed.tpSellAmount);
    setLongRiskRewardRatio(computed.longRiskRewardRatio);
    setShortRiskRewardRatio(computed.shortRiskRewardRatio);
    setEntryPrice(computed.entryPrice);
    setBuyAmount(computed.buyAmount);
    setSlTrigger(computed.slTrigger);
    setSlSellAmount(computed.slSellAmount);
    setStop(computed.stop);
    setRiskPercent(computed.riskPercent);
    setRiskAmount(computed.riskAmount);
  };

  const resetAllState = () => {
    setTarget(undefined);
    setRewardPercent(undefined);
    setRewardAmount(undefined);
    setTpLimit(undefined);
    setTpSellAmount(undefined);
    setLongRiskRewardRatio(undefined);
    setShortRiskRewardRatio(undefined);
    setEntryPrice(undefined);
    setBuyAmount(undefined);
    setSlTrigger(undefined);
    setSlSellAmount(undefined);
    setStop(undefined);
    setRiskPercent(undefined);
    setRiskAmount(undefined);

    setError(noError);
  };

  const isError = Object.values(error).some((value) => value);

  const baseAdornment = "XYZ";
  const green = "#003705";
  const red = "#5a2d2d";
  const config = {
    // Mathematically, the values are exactly the same^ for both long and short positions.
    // It's only the labels that interchange in the UI. ^ (except for Risk/Reward Ratio).
    target: isShort ? "Stop" : "Target",
    rewardPercent: isShort ? "Risk %" : "Reward %",
    rewardAmount: isShort ? "Risk Amt" : "Reward Amt",
    tpLimit: isShort ? "SL Trigger" : "TP Limit",
    tpSellAmount: isShort ? "Buy Amount" : "Sell Amount",
    riskRewardRatio: "Risk/Reward Ratio",
    entryPrice: "Entry Price",
    buyAmount: isShort ? "Sell Amount" : "Buy Amount",
    slTrigger: isShort ? "TP Limit" : "SL Trigger",
    slSellAmount: isShort ? "Buy Amount" : "Sell Amount",
    stop: isShort ? "Target" : "Stop",
    riskPercent: isShort ? "Reward %" : "Risk %",
    riskAmount: isShort ? "Reward Amt" : "Risk Amt",
    aboveHeight: isShort ? 50 : 150,
    aboveColor: isShort ? red : green,
    belowHeight: isShort ? 150 : 50,
    belowColor: isShort ? green : red,
  };

  return (
    <>
      <TextBoxes>
        <Text
          label={config.target}
          xs
          value={target}
          onChange={setTarget}
          error={error.target}
        />
        <Text
          adornment="%"
          label={config.rewardPercent}
          xs
          value={rewardPercent}
          onChange={setRewardPercent}
          error={error.rewardPercent}
        />
        <Text
          label={config.rewardAmount}
          xs
          value={rewardAmount}
          onChange={setRewardAmount}
          error={error.rewardAmount}
        />
      </TextBoxes>
      <TextBoxes>
        <Text
          baseAmount={new Decimal(1)}
          baseAdornment={baseAdornment}
          label={config.tpLimit}
          value={tpLimit}
          onChange={setTpLimit}
          error={error.tpLimit}
        />
        <Text
          baseAmount={tpSellAmount?.div(tpLimit || 1).toDecimalPlaces(5)}
          baseAdornment={baseAdornment}
          label={config.tpSellAmount}
          value={tpSellAmount}
          onChange={setTpSellAmount}
          error={error.tpSellAmount}
        />
      </TextBoxes>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 300,
          height: config.aboveHeight,
          bgcolor: config.aboveColor,
        }}
      >
        <Text
          adornment=""
          hidden={isShort}
          label={config.riskRewardRatio}
          value={longRiskRewardRatio}
          onChange={setLongRiskRewardRatio}
          error={error.longRiskRewardRatio}
        />
      </Box>
      <TextBoxes>
        <Text
          baseAmount={new Decimal(1)}
          baseAdornment={baseAdornment}
          label={config.entryPrice}
          value={entryPrice}
          onChange={setEntryPrice}
          error={error.entryPrice}
        />
        <Text
          baseAmount={buyAmount?.div(entryPrice || 1).toDecimalPlaces(5)}
          baseAdornment={baseAdornment}
          label={config.buyAmount}
          value={buyAmount}
          onChange={setBuyAmount}
          error={error.buyAmount}
        />
      </TextBoxes>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 300,
          height: config.belowHeight,
          bgcolor: config.belowColor,
        }}
      >
        <Text
          adornment=""
          hidden={!isShort}
          label={config.riskRewardRatio}
          value={shortRiskRewardRatio}
          onChange={setShortRiskRewardRatio}
          error={error.shortRiskRewardRatio}
        />
      </Box>
      <TextBoxes>
        <Text
          baseAmount={new Decimal(1)}
          baseAdornment={baseAdornment}
          label={config.slTrigger}
          value={slTrigger}
          onChange={setSlTrigger}
          error={error.slTrigger}
        />
        <Text
          baseAmount={slSellAmount?.div(slTrigger || 1).toDecimalPlaces(5)}
          baseAdornment={baseAdornment}
          label={config.slSellAmount}
          value={slSellAmount}
          onChange={setSlSellAmount}
          error={error.slSellAmount}
        />
      </TextBoxes>
      <TextBoxes>
        <Text
          label={config.stop}
          xs
          value={stop}
          onChange={setStop}
          error={error.stop}
        />
        <Text
          adornment="%"
          label={config.riskPercent}
          xs
          value={riskPercent}
          onChange={setRiskPercent}
          error={error.riskPercent}
        />
        <Text
          label={config.riskAmount}
          xs
          value={riskAmount}
          onChange={setRiskAmount}
          error={error.riskAmount}
        />
      </TextBoxes>
      <Box sx={{ display: "flex", gap: 5, marginTop: 5 }}>
        <Button variant="contained" onClick={handleCompute}>
          Compute
        </Button>
        <Button variant="outlined" onClick={resetAllState}>
          Reset
        </Button>
      </Box>
      {isError && (
        <Alert severity="error">
          Compute failed. Remove some conflicting values and try again.
        </Alert>
      )}
    </>
  );
}
