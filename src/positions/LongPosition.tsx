import { useState } from "react";
import Box from "@mui/material/Box";
import TextBoxes from "components/TextBoxes";
import Text from "components/Text";

export default function LongPosition() {
  const [target, setTarget] = useState<number>();
  const [rewardPercent, setRewardPercent] = useState<number>();
  const [rewardAmount, setRewardAmount] = useState<number>();
  const [tpLimit, setTpLimit] = useState<number>();
  const [tpSellAmount, setTpSellAmount] = useState<number>();
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>();
  const [entryPrice, setEntryPrice] = useState<number>();
  const [buyAmount, setBuyAmount] = useState<number>();
  const [slTrigger, setSlTrigger] = useState<number>();
  const [slSellAmount, setSlSellAmount] = useState<number>();
  const [stop, setStop] = useState<number>();
  const [riskPercent, setRiskPercent] = useState<number>();
  const [riskAmount, setRiskAmount] = useState<number>();

  return (
    <>
      <TextBoxes>
        <Text label="Target" xs value={target} onChange={setTarget} />
        <Text
          label="Reward %"
          xs
          value={rewardPercent}
          onChange={setRewardPercent}
        />
        <Text
          label="Reward Amount"
          xs
          value={rewardAmount}
          onChange={setRewardAmount}
        />
      </TextBoxes>
      <TextBoxes>
        <Text label="TP Limit" value={tpLimit} onChange={setTpLimit} />
        <Text
          label="Sell Amount"
          value={tpSellAmount}
          onChange={setTpSellAmount}
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
        />
      </Box>
      <TextBoxes>
        <Text label="Entry Price" value={entryPrice} onChange={setEntryPrice} />
        <Text label="Buy Amount" value={buyAmount} onChange={setBuyAmount} />
      </TextBoxes>
      <Box
        sx={{
          width: 300,
          height: 100,
          bgcolor: "#5a2d2d",
        }}
      />
      <TextBoxes>
        <Text label="SL Trigger" value={slTrigger} onChange={setSlTrigger} />
        <Text
          label="Sell Amount"
          value={slSellAmount}
          onChange={setSlSellAmount}
        />
      </TextBoxes>
      <TextBoxes>
        <Text label="Stop" xs value={stop} onChange={setStop} />
        <Text label="Risk %" xs value={riskPercent} onChange={setRiskPercent} />
        <Text
          label="Risk Amount"
          xs
          value={riskAmount}
          onChange={setRiskAmount}
        />
      </TextBoxes>
    </>
  );
}
