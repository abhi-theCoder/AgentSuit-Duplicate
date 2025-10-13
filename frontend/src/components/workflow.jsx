import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

function Droppable({ id, label, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl h-16 flex items-center justify-center text-center font-medium border-2 transition-all duration-200
        ${isOver ? "border-blue-500 bg-blue-100 text-blue-800" : "border-gray-500 bg-gray-800 text-gray-300"}
      `}
    >
      {children ? (
        <span className="font-semibold text-blue-400">{children}</span>
      ) : (
        <span className="opacity-70">Drop column for <b>{label}</b></span>
      )}
    </div>
  );
}

function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: transform ? 100 : "auto",
  };
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab select-none rounded-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition-transform duration-150"
    >
      {children}
    </div>
  );
}

export default function ExcelUploader() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
  });

  //  Handle Excel upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const [headers, ...body] = data;

      if (!headers || headers.length === 0) {
        alert(" The uploaded file appears to be empty or invalid.");
        return;
      }

      const seen = {};
      const uniqueHeaders = headers.map((col) => {
        const key = (col || "").toString().trim() || "Unnamed";
        seen[key] = (seen[key] || 0) + 1;
        return seen[key] > 1 ? `${key}${seen[key]}` : key;
      });

      setColumns(uniqueHeaders);
      setRows(body);
    };
    reader.readAsBinaryString(file);
  };

  //  Handle mapping (drag + drop)
  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;

    if (Object.values(mapping).includes(active.id)) {
      alert(` Column "${active.id}" is already mapped!`);
      return;
    }

    setMapping((prev) => ({
      ...prev,
      [over.id]: active.id,
    }));
  };

  //  Submit mapped data
  const handleSubmit = async () => {
    if (!rows.length) return alert(" Please upload a file first.");

    // Validate required fields
    if (!mapping.first_name || !mapping.last_name || !mapping.phone_number) {
      return alert(
        "⚠️ Please ensure 'first_name', 'last_name', and 'phone_number' are mapped before uploading."
      );
    }

    // Map data
    const mappedData = rows.map((r) => ({
      first_name: r[columns.indexOf(mapping.first_name)] || "",
      last_name: r[columns.indexOf(mapping.last_name)] || "",
      email: r[columns.indexOf(mapping.email)] || "",
      phone_number: r[columns.indexOf(mapping.phone_number)] || "",
    }));

    // Final validation (no empty key rows)
    const invalidRows = mappedData.filter(
      (row) => !row.first_name || !row.last_name || !row.phone_number
    );

    if (invalidRows.length > 0) {
      const proceed = window.confirm(
        ` ${invalidRows.length} row(s) have missing first_name, last_name, or phone_number.\nDo you still want to proceed?`
      );
      if (!proceed) return;
    }

    try {
      await axios.post("http://localhost:5001/api/upload", { data: mappedData });//in production replace localhost or use proxy or base url
      alert("✅ Data uploaded successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Upload error:", err);
      alert(" Upload failed. Check your server connection.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-900 text-white rounded-2xl shadow-2xl min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">🧾 Excel Column Mapper</h2>

      <div className="bg-blue-950 border border-blue-700 p-4 rounded-lg mb-6 text-blue-200">
        <p className="text-sm leading-relaxed">
          ⚡ <strong>Tip:</strong> Make sure your Excel includes columns for{" "}
          <span className="font-semibold text-blue-400">First Name</span>,{" "}
          <span className="font-semibold text-blue-400">Last Name</span>,{" "}
          <span className="font-semibold text-blue-400">Email</span>,{" "}
          <span className="font-semibold text-blue-400">Phone Number</span>{" "}
          before uploading. You can drag and drop columns to match them.
        </p>
      </div>

      {/* Upload + Submit */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="w-full md:w-1/2 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 
                     file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
        <button
          onClick={handleSubmit}
          disabled={!rows.length}
          className={`px-6 py-2 rounded-full font-semibold transition 
                      ${
                        rows.length
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
        >
           Upload to Database
        </button>
      </div>

      {/*  Mapping */}
      {columns.length > 0 && (
        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          <h3 className="text-xl mb-3 font-semibold text-blue-300">🧾 Excel Preview</h3>

          <div className="overflow-auto max-h-64 mb-6 border border-gray-700 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-700 sticky top-0">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-3 py-2 border-b border-gray-600 text-left">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-700">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 border-b border-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Drag + Drop Mapping */}
          <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            <div className="flex flex-wrap gap-3 mb-8">
              {columns.map((col) => (
                <Draggable key={col} id={col}>
                  {col}
                </Draggable>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-2 text-blue-300"> Map Your Fields</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.keys(mapping).map((key) => (
                <div key={key}>
                  <p className="text-sm mb-1 font-semibold text-gray-300">{key}</p>
                  <Droppable id={key} label={key}>
                    {mapping[key]}
                  </Droppable>
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      )}
    </div>
  );
}
