const supabase = require("../db/supabaseClient");

const checkDuplicatePhone = async (req, res, next) => {
  try {
    const {phone_number, email} = req.body;
    console.log(phone_number, email);
    if (!phone_number.trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("id")
      .eq("phone_number", phone_number)
      .limit(1);

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (data && data.length > 0) {
      
      return res.status(409).json({ message: "Phone number already exists" });
    }

    const { data: emailData, error: emailError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (emailError) {
      console.error("Supabase query error:", emailError);
      return res.status(500).json({ message: "Server error" });
    }

    if (emailData && emailData.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkDuplicatePhone;