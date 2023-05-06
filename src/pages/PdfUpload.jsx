import React, { useContext, useEffect, useState } from "react";
import upload from "../assets/pdfUpload.png";
import { useNavigate } from "react-router-dom";
import { FileContext } from "../context/FileContext";

const PdfUpload = () => {
  const [file, setFiles] = useState(null);
  const navigate = useNavigate();
  const { setPdf, setExtractedPdf } = useContext(FileContext);
  useEffect(() => {
    if (file) {
      handleFormSubmit();
    }
  }, [file]);

  const handleFormSubmit = () => {
    if (file) {
      // const reader = new FileReader();
      // reader.onload = () => {
      //   setFiles(reader.result);
      // };
      // reader.readAsDataURL(file);
      // setPdf(file);
      // console.log(file);

      let myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append(
        "Cookie",
        "session-space-cookie=ce77829d14fa40212ba8be712eb37b06; session-space-cookie=97a2ee5a10a290cbfff3f7669c61463b"
      );

      let formData = new FormData();
      formData.append("file", file);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };

      fetch("https://stephenz007-pdf-api.hf.space/file", requestOptions)
        .then((response) => response.text())
        .then((result) => setExtractedPdf(result), setPdf(file), navigate("/main"))
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border border-gray-500 rounded-xl p-6">
        <h1 className="text-center text-3xl font-semibold text-gray-900">New Labelling Email Invoice System</h1>
        <form className="flex items-center justify-center mt-6 ">
          <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer text-xl font-medium">
            <img src={upload} alt="pdf upload" className="max-h-16 opacity-80" />
            Click here to Upload your Invoice
          </label>
          <input
            type="file"
            id="file-upload"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFiles(e.target.files[0])}
          />
        </form>
      </div>
    </div>
  );
};

export default PdfUpload;
