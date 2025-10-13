const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.post("/upload", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data.length) {
      return res.status(400).json({ message: "No data received" });
    }

    //  Check that environment variables exist
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.SPREADSHEET_ID) {
      console.error(" Missing Google credentials or Spreadsheet ID in environment variables.");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    //  Format the private key correctly (remove quotes & newlines)
    const cleanedKey = process.env.GOOGLE_PRIVATE_KEY
      .replace(/^"|"$/g, "") // remove accidental quotes if present
      .replace(/\\n/g, "\n")  // restore newlines
      .trim();

    //  Authenticate Google service account
    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: cleanedKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    //  Initialize Sheets API
    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    //  Prepare rows (and ensure structure)
    const values = data.map((row) => [
      row.first_name || "",
      row.last_name || "",
      row.email || "",
      row.phone_number || "",
    ]);

    if (!values.length) {
      return res.status(400).json({ message: "No valid rows to upload" });
    }

    //  Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    console.log(` Successfully added ${values.length} rows to Google Sheet.`);
    res.json({ message: "Uploaded successfully!", updated: response.data.updates.updatedRows || values.length });
  } catch (err) {
    console.error(" Google Sheets upload error:", err);
    res.status(500).json({
      message: "Error uploading data",
      error: err.message,
    });
  }
});

module.exports = router;
