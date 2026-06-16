import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";

function App() {
  return (
    <div className="App" data-testid="bas-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
