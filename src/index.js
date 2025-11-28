import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import App from './App'; 
import { BrowserRouter } from 'react-router-dom'; 
import { CartProvider } from './context/CartContext';
import { StreamProvider } from './context/StreamContext';
// Nota: Se removió provisionalmente la configuración de @livepeer/react para evitar conflictos de dependencias.
// Si quieres usar la librería oficial, puedo volver a integrarla correctamente (requiere instalar sus peer dependencies compatibles).

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StreamProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </StreamProvider>
    </BrowserRouter>
  </React.StrictMode>
);