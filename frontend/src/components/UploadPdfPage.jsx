import React, { useState } from "react";
import { extractTableFromPDF } from "../utils/pdfToText";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function PdfToExcelPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF first.");
      return;
    }

    setStatus("⏳ Extracting table data...");
    try {
      const tableData = await extractTableFromPDF(pdfFile);

      if (!tableData || tableData.length === 0) {
        setStatus("⚠️ No tabular data found. The PDF might be plain text.");
        return;
      }

      setPreview(tableData.slice(0, 10));
      // Convert to Excel
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PDF Data");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, pdfFile.name.replace(/\.pdf$/, ".xlsx"));

      setStatus("✅ Conversion complete! File downloaded.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to extract data from PDF.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white px-4">
      <h1 className="text-2xl font-bold mb-6">📄 PDF → Excel Converter</h1>

      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-800 rounded text-sm mb-4"
        />

        <button
          onClick={handleConvert}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
        >
          Convert to Excel
        </button>

        {status && <p className="mt-4 text-gray-300">{status}</p>}
      </div>

      {preview.length > 0 && (
        <div className="mt-8 w-full max-w-md text-sm text-gray-400 bg-[#1a1a1a] rounded-lg p-4 overflow-y-auto max-h-64">
          <h3 className="text-lg mb-2 text-blue-400 font-semibold">Extracted Data Preview:</h3>
          <table className="w-full text-left border-collapse border border-gray-600">
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-700 px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
