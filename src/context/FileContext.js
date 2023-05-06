import { createContext, useState } from "react";

export const FileContext = createContext();

function FileContextProvider(props) {
  const [pdf, setPdf] = useState(null);
  const [extractedPdf, setExtractedPdf] = useState(null);
  return (
    <FileContext.Provider value={{ pdf, setPdf, extractedPdf, setExtractedPdf }}>{props.children}</FileContext.Provider>
  );
}

export default FileContextProvider;
