import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import MyAccount from "@/pages/MyAccount";
import OrderHistory from "@/pages/OrderHistory";
import Checkout from "@/pages/Checkout";

function App() {
  return (
    <div className="App" data-testid="bas-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/account/orders" element={<OrderHistory />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1c1714",
            color: "#f5f0e8",
            border: "1px solid #a8814a",
            borderRadius: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            letterSpacing: "0.05em",
          },
        }}
      />
    </div>
  );
}

export default App;
