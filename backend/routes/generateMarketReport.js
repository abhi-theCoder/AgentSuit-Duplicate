const express = require("express");
const router = express.Router();
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const  supabase  = require("../db/supabaseClient");
require("dotenv").config();

const ABACUS_API_KEY = process.env.ABACUS_API_KEY;

const MARKET_PROMPT = `
Act as a local real estate market research strategist with expertise in analyzing public market trends, MLS data patterns, demographic shifts, and migration behavior.
Your task is to create a professional, insight-rich report for a Realtor in Arizona who wants to uncover hidden listing opportunities in the luxury homes and single-family home segments.

Follow these instructions:
• Analyze market inventory, pricing, and absorption trends to detect areas shifting from seller's to buyer's markets.
• Identify 3–5 micro-areas or neighborhoods showing hidden seller signals (long ownership tenure, aging population, rising DOM, investor exit patterns, etc.).
• Include a short overview of seller demographics (retirees, relocators, heirs, investors, upsizers).
• Outline specific pain points motivating sellers (maintenance, taxes, migration, rates, equity timing).
• Keep writing plain, tactical, and usable for a Realtor — not academic.
• Add a "Takeaway" or "Action Plan" section summarizing what the agent can do next.

Structure:
1️⃣ Executive Summary
2️⃣ Micro-Areas to Watch
3️⃣ Seller Profiles Most Likely to List
4️⃣ Market & Migration Trends
5️⃣ Pain Points Driving Sales
6️⃣ Prospecting & Content Strategy
7️⃣ Final Takeaways
`;
async function generateMarketReport() {
  let pdfPath = null;
  try {
    console.log("Market Insight");
    //api
    const response = await axios.post(
      "https://routellm-42d60c65c.api.abacus.ai/v1/chat/completions",
      {
        model: "route-llm",
        messages: [
          {
            role: "system",
            content: "You are a professional real estate strategist creating data-driven Arizona market insights.",
          },
          { role: "user", content: MARKET_PROMPT },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${ABACUS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const reportText = response.data?.choices?.[0]?.message?.content || "No content returned from Abacus AI.";
    console.log(" Report content received (length:", reportText.length, "chars)");

    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log(" Created reports directory");
    }
    const timestamp = new Date();
    const dateLabel = timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const fileName = `market-insight-${Date.now()}.pdf`;
    pdfPath = path.join(reportsDir, fileName);

    console.log(" Creating PDF at:", pdfPath);

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'LETTER',
        bufferPages: true
      });
      const writeStream = fs.createWriteStream(pdfPath);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      
      doc.pipe(writeStream);
      // Header
      doc.font("Helvetica-Bold")
         .fontSize(24)
         .text("Market Insight Report", { align: "center" });
      doc.moveDown(0.3);
      doc.font("Helvetica-Bold")
         .fontSize(12)
         .fillColor('#666666')
         .text(dateLabel, { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .strokeColor('#cccccc')
         .stroke();
      
      doc.moveDown(1);
      const sections = reportText.split(/(?=\d+️⃣)/);
      
      sections.forEach((section, index) => {
        if (section.trim()) {
          const headerMatch = section.match(/^(\d+️⃣.*?)(?:\n|$)/);
          
          if (headerMatch) {
            const header = headerMatch[1].replace(/\d+️⃣\s*/, '').trim();
            const content = section.substring(headerMatch[0].length).trim();
            
            //header
            doc.font("Helvetica-Bold")
               .fontSize(14)
               .fillColor('#000000')
               .text(`${index + 1}. ${header}`, { 
                 align: "left",
                 continued: false 
               });
            
            doc.moveDown(0.5);
            //Section
            if (content) {
              doc.font("Helvetica-Bold")
                 .fontSize(7)
                 .fillColor('#333333')
                 .text(content, { 
                   align: "left",
                   lineGap: 4
                 });
              }
            doc.moveDown(1);
          } else {
            //text 
            doc.font("Helvetica-Bold")
               .fontSize(10)
               .fillColor('#333333')
               .text(section.trim(), { 
                 align: "left",
                 lineGap: 4
               });
            doc.moveDown(0.8);
          }
        }
      });
      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.font("Helvetica-Bold")
           .fontSize(8)
           .fillColor('#999999')
           .text(
             `Page ${i + 1} of ${pageCount} | Generated on ${new Date().toLocaleString()}`,
             50,
             doc.page.height - 50,
             { align: "center" }
           );
       }
      doc.end();
    });


    const fileBuffer = fs.readFileSync(pdfPath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("market_insights")
      .upload(fileName, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (uploadError) {
      console.error(" Supabase Upload Error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    console.log(" File uploaded:", uploadData);

    const { data: publicUrlData } = supabase.storage
      .from("market_insights")
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;
    console.log(" Public URL generated:", publicUrl);
    const reportTitle = `Market Insight – ${dateLabel}`;
    const insertPayload = {
      title: reportTitle,
      pdf_url: publicUrl,
      created_at: timestamp.toISOString(),
    };
    console.log(" Insert payload:", insertPayload);
    const { data: insertData, error: insertError } = await supabase
      .from("market_insights")
      .insert([insertPayload])
      .select();

    if (insertError) {
      console.error(" Database Insert Error:", insertError);
      console.error("Error details:", JSON.stringify(insertError, null, 2));
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log(" atabase record created:", insertData);

    try {
      fs.unlinkSync(pdfPath);
    } catch (cleanupErr) {
      console.warn(" Could not delete local file:", cleanupErr.message);
    }

    return { 
      success: true,
      title: `Market Insight – ${dateLabel}`, 
      pdf_url: publicUrl,
      created_at: timestamp.toISOString()
    };

  } catch (error) {
    console.error(" Report generation failed:", error.message);
    
    if (error.response) {
      console.error("API Error Status:", error.response.status);
      console.error("API Error Data:", error.response.data);
    }
    
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (cleanupErr) {
        console.warn(" Could not delete local file after error:", cleanupErr.message);
      }
    }
    
    throw error;
  }
}

router.post("/", async (req, res) => {
  try {
    const report = await generateMarketReport();
    res.json({ success: true, report });
  } catch (err) {
    console.error(" Manual generation failed:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      error: err.toString()
    });
  }
});

// CRON: Run automatically every Friday at 8:00 AM
cron.schedule("0 8 * * 5", async () => {
  console.log("[CRON] Weekly Market Insight generation started...");
  try {
    await generateMarketReport();
    console.log("[CRON]  Report generated successfully!");
  } catch (err) {
    console.error("[CRON] Report generation failed:", err.message);
  }
  }, {
  timezone: "America/Phoenix",
});


module.exports = { router, generateMarketReport };