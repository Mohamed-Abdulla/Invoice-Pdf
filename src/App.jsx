import Main from "./pages/Main";
import PdfUpload from "./pages/PdfUpload";
import { Routes, Route, Navigate } from "react-router-dom";
import { FileContext } from "./context/FileContext";
import { useContext } from "react";

function App() {
  const { pdf } = useContext(FileContext);

  return (
    <Routes>
      <Route path="/" element={<PdfUpload />} />
      <Route path="/main" element={pdf != null ? <Main /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
