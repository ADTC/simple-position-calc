import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PositionCalculator, { Position } from "positions/PositionCalculator";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [position, setPosition] = useState<Position>("long");

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    position: Position
  ) => {
    if (position) setPosition(position);
  };

  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={darkTheme}>
          <ToggleButtonGroup
            color="primary"
            value={position}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="long">Long Position (Buy & Sell)</ToggleButton>
            <ToggleButton value="short">
              Short Position (Sell & Buy)
            </ToggleButton>
          </ToggleButtonGroup>
          <PositionCalculator type={position} />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
