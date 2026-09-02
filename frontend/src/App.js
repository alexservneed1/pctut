import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";
import { initAnalytics } from "@/lib/analytics";

function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "#151A22",
            color: "#FFFFFF",
            border: "1px solid rgba(10,132,255,0.35)",
          },
        }}
      />
    </div>
  );
}

export default App;
