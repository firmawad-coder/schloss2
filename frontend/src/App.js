import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";

function App() {
  return (
    <div className="App" data-testid="luxelle-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "#1a1a1a", color: "#f9f7f4", border: "1px solid #d4af37", borderRadius: 0 } }} />
    </div>
  );
}

export default App;
