const express = require("express");
const router = express.Router();
const  supabase = require("../db/supabaseClient");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("market_insights")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
