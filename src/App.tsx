import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PositionCalculator from "positions/PositionCalculator";

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
          <PositionCalculator />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
