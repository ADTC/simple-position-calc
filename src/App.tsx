import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextBoxes from "components/TextBoxes";
import Text from "components/Text";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={darkTheme}>
          <TextBoxes>
            <Text id="target" label="Target" xs />
            <Text id="rewardPercent" label="Reward %" xs />
            <Text id="rewardAmount" label="Reward Amount" xs />
          </TextBoxes>
          <TextBoxes>
            <Text id="tpLimit" label="TP Limit" />
            <Text id="tpSellAmount" label="Sell Amount" />
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
            <Text id="riskRewardRatio" label="Risk/Reward Ratio" />
          </Box>
          <TextBoxes>
            <Text id="entryPrice" label="Entry Price" />
            <Text id="buyAmount" label="Buy Amount" />
          </TextBoxes>
          <Box
            sx={{
              width: 300,
              height: 100,
              bgcolor: "#5a2d2d",
            }}
          />
          <TextBoxes>
            <Text id="slTrigger" label="SL Trigger" />
            <Text id="slSellAmount" label="Sell Amount" />
          </TextBoxes>
          <TextBoxes>
            <Text id="stop" label="Stop" xs />
            <Text id="riskPercent" label="Risk %" xs />
            <Text id="riskAmount" label="Risk Amount" xs />
          </TextBoxes>
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
