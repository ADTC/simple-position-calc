import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextBoxes from "components/TextBoxes";
import Text from "components/Text";
import {
  compute,
  noError,
  preCompute,
  preComputeRatios,
  type Error,
} from "utils/compute";

import Decimal from "decimal.js";

export default function LongPosition() {
  const [target, setTarget] = useState<Decimal>();
  const [rewardPercent, setRewardPercent] = useState<Decimal>();
  const [rewardAmount, setRewardAmount] = useState<Decimal>();
  const [tpLimit, setTpLimit] = useState<Decimal>();
  const [tpSellAmount, setTpSellAmount] = useState<Decimal>();
  const [riskRewardRatio, setRiskRewardRatio] = useState<Decimal>();
  const [entryPrice, setEntryPrice] = useState<Decimal>();
  const [buyAmount, setBuyAmount] = useState<Decimal>();
  const [slTrigger, setSlTrigger] = useState<Decimal>();
  const [slSellAmount, setSlSellAmount] = useState<Decimal>();
  const [stop, setStop] = useState<Decimal>();
  const [riskPercent, setRiskPercent] = useState<Decimal>();
  const [riskAmount, setRiskAmount] = useState<Decimal>();

  const [error, setError] = useState<Error>(noError);

  const handleCompute = () => {
    const initial = preComputeRatios(
      preCompute({
        target,
        rewardPercent,
        rewardAmount,
        tpLimit,
        tpSellAmount,
        riskRewardRatio,
        entryPrice,
        buyAmount,
        slTrigger,
        slSellAmount,
        stop,
        riskPercent,
        riskAmount,
      })
    );

    const [computed, error] = compute(initial);
    setError(error);

    if (!computed) return;

    setTarget(computed.target);
    setRewardPercent(computed.rewardPercent);
    setRewardAmount(computed.rewardAmount);
    setTpLimit(computed.tpLimit);
    setTpSellAmount(computed.tpSellAmount);
    setRiskRewardRatio(computed.riskRewardRatio);
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
    setRiskRewardRatio(undefined);
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

  return (
    <>
      <TextBoxes>
        <Text
          label="Target"
          xs
          value={target}
          onChange={setTarget}
          error={error.target}
        />
        <Text
          label="Reward %"
          xs
          value={rewardPercent}
          onChange={setRewardPercent}
          error={error.rewardPercent}
        />
        <Text
          label="Reward Amount"
          xs
          value={rewardAmount}
          onChange={setRewardAmount}
          error={error.rewardAmount}
        />
      </TextBoxes>
      <TextBoxes>
        <Text
          label="TP Limit"
          value={tpLimit}
          onChange={setTpLimit}
          error={error.tpLimit}
        />
        <Text
          label="Sell Amount"
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
          height: 300,
          bgcolor: "#003705",
        }}
      >
        <Text
          label="Risk/Reward Ratio"
          value={riskRewardRatio}
          onChange={setRiskRewardRatio}
          error={error.riskRewardRatio}
        />
      </Box>
      <TextBoxes>
        <Text
          label="Entry Price"
          value={entryPrice}
          onChange={setEntryPrice}
          error={error.entryPrice}
        />
        <Text
          label="Buy Amount"
          value={buyAmount}
          onChange={setBuyAmount}
          error={error.buyAmount}
        />
      </TextBoxes>
      <Box
        sx={{
          width: 300,
          height: 100,
          bgcolor: "#5a2d2d",
        }}
      />
      <TextBoxes>
        <Text
          label="SL Trigger"
          value={slTrigger}
          onChange={setSlTrigger}
          error={error.slTrigger}
        />
        <Text
          label="Sell Amount"
          value={slSellAmount}
          onChange={setSlSellAmount}
          error={error.slSellAmount}
        />
      </TextBoxes>
      <TextBoxes>
        <Text
          label="Stop"
          xs
          value={stop}
          onChange={setStop}
          error={error.stop}
        />
        <Text
          label="Risk %"
          xs
          value={riskPercent}
          onChange={setRiskPercent}
          error={error.riskPercent}
        />
        <Text
          label="Risk Amount"
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
