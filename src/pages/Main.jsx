import React, { useContext, useState } from "react";
import { FileContext } from "../context/FileContext";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack5";
import { keywords } from "../utils";
import { Edit } from "@mui/icons-material";
import { Alert, Button, Snackbar } from "@mui/material";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Main = () => {
  const { pdf, extractedPdf } = useContext(FileContext);
  const [numPages, setNumPages] = useState(null);
  const [labelledData, setLabelledData] = useState([]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  //~snackbar
  const [openSnack, setOpenSnack] = useState(false);

  //~Label chips
  const [arrIndex, setArrIndex] = useState(0);
  const [labelChip, setLabelChip] = useState(keywords[arrIndex].label);
  const [checked, setChecked] = useState(true);
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectedWordsKey, setSelectedWordsKey] = useState([]);

  const newString = extractedPdf?.slice(1, -1); //[] removed
  const splitIndex = newString?.indexOf(`{`) !== -1 ? newString?.indexOf(`{`) : newString?.length - 1;
  const myArray = newString?.substring(0, splitIndex).split(","); // converted whole string in to array
  const mainArray = myArray?.map((str) => str.slice(1, -1).split(" ")); // converted each string in to array also removing " from beginning and ending

  const [selectedItems, setSelectedItems] = useState([]);
  console.log(labelChip);
  const handleClick = (item, key) => {
    setOpenSnack(true);

    if (selectedItems?.includes(item)) {
      setSelectedItems(selectedItems?.filter((i) => i !== item));
      setSelectedWords(selectedItems?.filter((i) => i !== item));
      setSelectedWordsKey(selectedWordsKey?.filter((i) => i !== key));
    } else {
      setSelectedItems([...selectedItems, item]);
      setSelectedWords([...selectedWords, item]);
      setSelectedWordsKey([...selectedWordsKey, key]);
    }
  };

  const handleLabels = () => {
    const isLast = arrIndex >= keywords.length;
    setOpenSnack(false);
    if (!isLast) {
      setLabelledData((prevLabelledData) => [
        ...prevLabelledData,
        { [labelChip]: checked ? selectedItems.join("") : null },
      ]);
      if (!checked) {
        setChecked(true);
      }
      if (arrIndex !== keywords.length - 1) {
        setArrIndex((prevIndex) => prevIndex + 1);
        setLabelChip(keywords[arrIndex + 1].label);
        setSelectedItems([]);
      } else {
        setLabelChip(null);
      }
    }
  };

  const handleDelete = () => {
    setArrIndex(0);
    setLabelChip(keywords[0].label);
    setLabelledData([]);
    setSelectedItems([]);
    setSelectedWordsKey([]);
  };

  console.log(labelledData);

  return (
    <div className="flex p-10 gap-6 2xl:gap-14 ">
      <div className="dragger-area flex-1">
        <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={1} width={595} />
        </Document>
      </div>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnack}>
        <Alert severity="info" sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          Are you done with <span className="font-semibold">{labelChip ? labelChip : "this"} </span>
          labelling ?{" "}
          <button className="ml-2.5 bg-green-600 font-medium p-1 px-3 text-white rounded-md" onClick={handleLabels}>
            Yes
          </button>
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={!checked}>
        <Alert severity="info" sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          Are you sure there is no <span className="font-semibold">{labelChip ? labelChip : "this"} </span>label ?
          <button className="ml-2.5 bg-green-600 font-medium p-1 px-3 text-white rounded-md" onClick={handleLabels}>
            Yes
          </button>
        </Alert>
      </Snackbar>
      {labelChip !== null ? (
        <div className="space-y-4 flex-[1.3]">
          {labelChip ? (
            <div className="border-[1.5px] border-blue-600 p-4 text-lg rounded-lg space-y-2 ">
              Please Select <span className="font-medium">{labelChip}</span> in the below Content{" "}
              <div>
                <input
                  type="checkbox"
                  checked={checked}
                  className="mr-3 cursor-pointer"
                  onClick={() => setChecked(false)}
                />
                <span className="text-sm">
                  This Invoice contains <span className="font-medium">{labelChip}</span> label, If not (unCheck this)
                </span>
              </div>
              <span className="flex gap-1 ">
                Selected Labels :
                {selectedItems.map((item, index) => (
                  <p className="font-semibold underline">{item}</p>
                ))}
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="bg-gray-300 rounded-lg p-4 space-y-3">
            <h2 className="font-medium">Invoice Labels</h2>
            <div className="flex gap-3 ">
              {keywords.slice(0, 5).map((label, i) => (
                <button
                  className={`${
                    labelChip === label.label ? "bg-blue-600" : "bg-gray-500"
                  } p-1.5 px-2.5 rounded-full text-white text-sm flex items-center gap-1`}
                >
                  {label.label} <Edit fontSize="inherit" className="" />
                </button>
              ))}
            </div>
            <h2 className="font-medium">Item Labels</h2>
            <div className="flex gap-3 flex-wrap ">
              {keywords.slice(5, keywords.length).map((label, i) => (
                <button
                  className={`${
                    labelChip === label.label ? "bg-blue-600" : "bg-gray-500"
                  } p-1.5 px-2.5 rounded-full text-white text-sm flex items-center gap-1`}
                >
                  {label.label} <Edit fontSize="inherit" className="" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-200 rounded-lg p-4">
            {mainArray?.length !== 0 ? (
              mainArray?.map((arr, i) => (
                <div className="flex gap-4 p-1" key={i}>
                  {arr.map((item, j) => {
                    const key = `${i}-${j}-${item}`;
                    const isWordSelected = selectedWordsKey.includes(key);

                    return (
                      <p
                        key={key}
                        className={`text-sm cursor-pointer hover:underline ${
                          isWordSelected && "bg-blue-500 text-white  hover:no-underline rounded-sm "
                        }`}
                        onClick={() => {
                          if (!isWordSelected) {
                            handleClick(item, key);
                          }
                        }}
                      >
                        {item}
                      </p>
                    );
                  })}
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1 bg-slate-200 rounded-lg p-4">
          <h1 className="text-2xl font-medium text-center">Selected labels</h1>
          <div className=" border border-gray-600 rounded-lg p-4 space-y-4">
            <h2 className="font-medium text-gray-800">Selected Invoice Labels</h2>
            <div className="space-y-4">
              {labelledData.slice(0, 2).map((item, i) =>
                Object.entries(item).map(([key, value]) => (
                  <div className="space-y-6 text-white text-[15px] ">
                    <div className="space-x-4 flex justify-between max-w-xs">
                      <span className="bg-blue-600 p-1.5 px-2.5 rounded-md flex-1">{key}</span>
                      <span className="border border-gray-600 text-black p-1.5 px-2.5 rounded-md flex-1">
                        {value ? value : "null"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <h2 className="font-medium text-gray-800">Selected Item Labels</h2>
            <div className="space-y-4">
              {labelledData?.slice(2, keywords.length).map((item, i) =>
                Object.entries(item).map(([key, value]) => (
                  <div className="space-y-6 text-white text-[15px]">
                    <div className="space-x-4 flex justify-between max-w-xs">
                      <span className="bg-blue-600 p-1.5 px-2.5 rounded-md flex-1">{key}</span>
                      <span className="border border-gray-600 text-black p-1.5 px-2.5 rounded-md flex-1">
                        {value ? value : "null"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-green-600 font-medium  p-1 px-3 text-white rounded-md mr-4"
              onClick={() => alert("Labelling done Successfully")}
            >
              Save
            </button>
            <button className="bg-red-600 font-medium  p-1 px-3 text-white rounded-md" onClick={handleDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
