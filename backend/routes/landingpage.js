const express = require('express');
const router = express.Router();
const supabase = require('../db/supabaseClient');
const crypto = require('crypto');
const axios = require("axios");
const multer = require("multer");
const pdfParse = require("pdf-parse-fork");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { v4: uuid } = require('uuid');
///////////////////////////////////////////////////////////////////////////////////////
const upload = multer({ dest: 'uploads/temp/' });

//deployment urls
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const ABACUS_API_KEY = process.env.ABACUS_API_KEY;
///////////////////////////////////////////////////////////////////////////////////////
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    console.log(" Received file:", req.file.originalname, req.file.mimetype);

    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${fileExt}`;
    const filePath = req.file.path;

    const fileBuffer = fs.readFileSync(filePath);

    const { data: uploaded, error: uploadError } = await supabase.storage
  .from("landing-page-bucket")
      .upload(`landing/${fileName}`, fileBuffer, {
        contentType: req.file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    // Remove file
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn("Temp file cleanup failed:", err.message);
    }
    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return res.status(500).json({ error: "Failed to upload to Supabase" });
    }

    const { data: publicUrlData } = supabase
      .storage
     .from("landing-page-bucket")
  .getPublicUrl(`landing/${fileName}`);

    console.log(" Uploaded to Supabase:", publicUrlData.publicUrl);
    return res.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('id, title, address, details, price, description, property_images, share_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Add public_url to every page dynamically
    const normalized = (data || []).map((p) => ({
      ...p,
      public_url: p.share_id ? `${FRONTEND_URL}/landing/${p.share_id}` : null,
    }));

    res.json(normalized);
  } catch (err) {
    console.error('Error fetching landing pages:', err.message);
    res.status(500).json({ error: 'Failed to fetch landing pages' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, description, template, content } = req.body;

    if (!title || !template) {
      return res.status(400).json({ error: 'Title and template are required' });
    }

    const { data, error } = await supabase
      .from('landing_pages')
      .insert([{ title, description, template, content }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Error creating landing page:', err);
    res.status(500).json({ error: 'Failed to create landing page' });
  }
});

router.post("/extract-pdf", upload.single("pdf"), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    filePath = req.file.path;
    console.log(" Processing:", req.file.originalname);

    //PDF
    let extractedText = '';
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text?.trim() || '';
    } catch (pdfErr) {
      console.error("PDF parsing error:", pdfErr.message);
      return res.status(400).json({ error: "Failed to extract text from PDF" });
    }

    if (!extractedText || extractedText.length < 10) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        error: "PDF contains no readable text. Ensure the PDF is not scanned or image-based." 
      });
    }

    console.log("📄 Extracted", extractedText.length, "characters");

    //Send to ai
const aiResponse = await axios.post(
  "https://routellm-42d60c65c.api.abacus.ai/v1/chat/completions",
      {
      model: 'route-llm',
        messages: [
          {
            role: "system",
            content: `You are an expert real estate data extraction AI. Extract ALL property details from the provided text and return ONLY a valid JSON object. No markdown, no code blocks, no explanations.

Return this exact JSON structure with ALL fields:
{
  "property": {
    "address": "string or null",
    "city": "string or null",
    "state": "string or null",
    "zipCode": "string or null",
    "title": "string or null",
    "price": "string or null",
    "mlsNumber": "string or null",
    "status": "string or null",
    "propertyType": "string or null"
  },
  "details": {
    "bedrooms": "string or null",
    "bathrooms": "string or null",
    "bedroomsPlus": "string or null",
    "sqft": "string or null",
    "pricePerSqft": "string or null",
    "yearBuilt": "string or null",
    "floodZone": "string or null",
    "pool": "string or null",
    "exteriorStories": "string or null",
    "interiorLevels": "string or null",
    "dwellingType": "string or null",
    "dwellingStyles": "string or null",
    "lotSqft": "string or null",
    "lotAcres": "string or null",
    "subdivision": "string or null",
    "taxMunicipality": "string or null",
    "plannedCommunityName": "string or null",
    "builderName": "string or null"
  },
  "schools": {
    "elementaryDistrict": "string or null",
    "elementarySchool": "string or null",
    "juniorHighSchool": "string or null",
    "highSchoolDistrict": "string or null",
    "highSchool": "string or null"
  },
  "location": {
    "crossStreets": "string or null",
    "directions": "string or null"
  },
  "description": "string or null",
  "features": {
    "garage": {
      "spaces": "string or null",
      "carportSpaces": "string or null",
      "totalCovered": "string or null",
      "parkingFeatures": []
    },
    "pool": {
      "type": "string or null",
      "features": []
    },
    "fireplace": "string or null",
    "propertyDescription": [],
    "landscaping": [],
    "exteriorFeatures": [],
    "communityFeatures": [],
    "flooring": [],
    "kitchenFeatures": [],
    "masterBathroom": "string or null",
    "masterBedroom": "string or null",
    "additionalBedroom": [],
    "laundry": [],
    "diningArea": "string or null",
    "basement": "string or null",
    "denOffice": "string or null"
  },
  "construction": {
    "architecture": "string or null",
    "buildingStyle": "string or null",
    "unitStyle": [],
    "constFinish": "string or null",
    "construction": "string or null",
    "roofing": "string or null",
    "fencing": "string or null",
    "cooling": [],
    "heating": "string or null",
    "utilities": [],
    "waterSource": "string or null",
    "sewer": "string or null"
  },
  "taxInfo": {
    "countyCode": "string or null",
    "legalDescription": "string or null",
    "assessorNumber": "string or null",
    "lotNumber": "string or null",
    "townRangeSection": "string or null",
    "taxesPerYear": "string or null",
    "ownership": "string or null",
    "newFinancing": "string or null",
    "existingLoan": "string or null",
    "disclosures": [],
    "possession": "string or null"
  },
  "hoa": {
    "hasHOA": "string or null",
    "monthlyFee": "string or null",
    "hoaName": "string or null",
    "hoaTelephone": "string or null",
    "managementCompany": "string or null",
    "managementPhone": "string or null",
    "specialAssessment": "string or null",
    "transferFee": "string or null",
    "feeIncludes": [],
    "rules": [],
    "totalMonthlyFeeEquiv": "string or null",
    "capImprovementFee": "string or null",
    "prepaidFees": "string or null",
    "disclosureFees": "string or null",
    "otherFees": "string or null",
    "otherFeesDescription": "string or null"
  },
  "listing": {
    "cdom": "string or null",
    "adom": "string or null",
    "statusChangeDate": "string or null",
    "listPrice": "string or null",
    "specialConditions": "string or null",
    "showingService": "string or null",
    "lockboxType": "string or null",
    "listedBy": "string or null"
  },
  "highlights": [
    {
      "title": "string",
      "text": "string"
    }
  ]
}

CRITICAL RULES:
- Extract EVERY field visible in the document
- Return ONLY valid JSON, no markdown or code blocks
- If a field is not found, use null (not empty string)
- For array fields, return empty array [] if no values found
- Parse numeric values as strings (e.g., "2" not 2)
- Keep all original formatting and punctuation from document
- No explanations or additional text`
          },
          {
            role: "user",
            content: `Extract property details from this text:\n\n${extractedText.slice(0, 15000)}`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${ABACUS_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": BACKEND_URL,
          "X-Title": "Landing Page PDF Parser"
        },
      }
    );

    const aiContent =
  aiResponse?.data?.output?.[0]?.content ||
  aiResponse?.data?.choices?.[0]?.message?.content;
    if (!aiContent) {
      fs.unlinkSync(filePath);
      return res.status(500).json({ error: "No response from AI" });
    }
    let propertyData;
    try {
      const cleanedContent = aiContent
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      propertyData = JSON.parse(cleanedContent);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      console.error("AI response was:", aiContent.substring(0, 500));
      
      fs.unlinkSync(filePath);
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: "AI did not return valid JSON"
      });
    }
    fs.unlinkSync(filePath);
    filePath = null;
    return res.json({
      success: true,
      message: "PDF processed successfully",
      data: propertyData,
    });

  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error("Error deleting temp file:", unlinkErr);
      }
    }
    console.error("🔥 Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

router.post("/save-full", async (req, res) => {
  try {
    const {
      title,
      address,
      details,
      price,
      description,
      highlights,
      propertyDetails,
      features,
      propertyImages,
      editableTabs,
      highlightsImage,
      editableDetails, 
      room,          
      construction, 
      tax,
    } = req.body;
    if (!title || !address) {
      return res.status(400).json({ 
        error: "Title and address are required" 
      });
    }
    const share_id = crypto.randomBytes(6).toString("hex");
function sanitizeImageMap(imgs = {}) {
  const out = {};
  for (const [k, v] of Object.entries(imgs || {})) {
    if (typeof v === 'string' && v.startsWith('http')) out[k] = v;
  }
  return out;
}
const cleanedImages = sanitizeImageMap(propertyImages);
const cleanedHighlightsImage = highlightsImage || null;

    //Supabase
    const { data, error } = await supabase
      .from("landing_pages")
      .insert([
        {
          title,
          address,
          details,
          price,
          description,
          highlights,
          property_details: propertyDetails,
          features,
          property_images: cleanedImages,
          editable_tabs: editableTabs,
          highlights_image: cleanedHighlightsImage,
          share_id,
           editable_details: editableDetails || null,
          room: room || null,
          construction : construction || null,
          tax : tax || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const publicUrl = `${FRONTEND_URL}/landing/${share_id}`;

    res.status(201).json({
      message: "Landing page saved successfully!",
      page: data,
      public_url: publicUrl,
    });
  } catch (err) {
    console.error("Error saving landing page:", err.message);
    res.status(500).json({
      error: "Failed to save landing page",
      details: err.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Landing page not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching landing page:', err);
    res.status(500).json({ error: 'Failed to fetch landing page' });
  }
});

router.get('/share/:share_id', async (req, res) => {
  try {
    const { share_id } = req.params;
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('share_id', share_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Landing page not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching shared page:', err);
    res.status(500).json({ error: 'Failed to fetch shared page' });
  }
});

module.exports = router;