import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MyAccount from "@/pages/MyAccount";
import OrderHistory from "@/pages/OrderHistory";
import Checkout from "@/pages/Checkout";
import CheckoutComplete from "@/pages/CheckoutComplete";
import RequireAuth from "@/components/site/RequireAuth";

function App() {
  return (
    <div className="App" data-testid="bas-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<RequireAuth><MyAccount /></RequireAuth>} />
          <Route path="/account/orders" element={<RequireAuth><OrderHistory /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/checkout/complete" element={<RequireAuth><CheckoutComplete /></RequireAuth>} />
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
