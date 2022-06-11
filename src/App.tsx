import { NextUIProvider } from "@nextui-org/react";
import Home from "./Route/Home";

function App() {
  return (
    <NextUIProvider>
      <div className="App">
        <Home />
      </div>
    </NextUIProvider>
  );
}

export default App;
