const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.post("/upload", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !data.length) {
      return res.status(400).json({ message: "No data received" });
    }
//sheet provite data
const jwtClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
//sheet creation
const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;
//converting data to map in sheet
    const values = data.map((row) => [
      row.first_name,
      row.last_name,
      row.email,
      row.phone_number,
    ]);
//sending data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.json({ message: "Uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading data" });
  }
});

module.exports = router;
