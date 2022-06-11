import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import Home from './Route/Home';

function App() {
  return (
    <NextUIProvider>
      <Home />
      <Toaster />
    </NextUIProvider>
  );
}

export default App;
