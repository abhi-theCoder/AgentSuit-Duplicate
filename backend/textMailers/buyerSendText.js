require("dotenv").config();
const twilio = require("twilio");
const supabase = require("../db/supabaseClient");
const cron = require("node-cron");
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(name, text, phone, stage) {
  try {
     let message = await client.messages.create({
      body: `Hey ${name}, ${text}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`, // assuming US numbers
    });

    console.log("✅ SMS sent:", message.sid);

    if (phone && stage) {
      const { error } = await supabase
        .from("leads")
        .update({ sms_stage: stage, updated_at: new Date() })
        .eq("phone_number", phone);

      if (error) console.error("❌ Error updating sms_stage:", error);
      else console.log(` Updated ${phone} → sms_stage = ${stage}`);
    }
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
  }
}

function scheduleLeadTexts(name, phone, city) {
  // Stage 1: Immediately
  sendSMS(
    name,
     `Hi ${name}, it was a pleasure meeting you! 
I’m excited to help you on your journey to buying a home. 
Please save my contact info so you can reach me anytime with questions. 
Talk soon!  
– Michael`,
        phone,
        "Stage 1"
        );

  
  function scheduleMessage(daysLater, stage, text) {
    const targetDate = new Date();
    // targetDate.setDate(targetDate.getDate() + daysLater);

    //for testing purpose only - changed delay to minutes
    targetDate.setMinutes(targetDate.getMinutes() + daysLater);
    const cronExpr = `${targetDate.getMinutes()} ${targetDate.getHours()} ${targetDate.getDate()} ${
      targetDate.getMonth() + 1
    } *`;

    cron.schedule(cronExpr, () => sendSMS(name, text, phone, stage));
  }

  // Stage 2 → 4 days later
  scheduleMessage(
    1,//2 for 24 hour
    "Stage 2",
`Hi ${name}, just sent you an email with a simple 3-step roadmap for buying your home. 
Check it out—what do you think of step one?`  );

  // Stage 3 → 12 days later
  scheduleMessage(
    1,
    "Stage 3",
       `sent You an email with the latest ${city} market update, Take a loock -it explain how buyers are 
winning right now, Did You get it ?`  );

  // Stage 4 → 20 days later
  scheduleMessage(
    1,
    "Stage 4",
      `Check Your Indox--I sent You an Email about financing & Pre-approvial
[the #1 step buyers often skip] Did you get a Chance to read it yet?`
  );

  // Stage 5 → 28 days later
  scheduleMessage(
    28,
    "Stage 5",
      `I just emailed you some insider info about how to access home BEFORE Zillow. Can you find that email? Let me know 
Your thougths.`
  );

  // Stage 6 → 36 days later
  scheduleMessage(
    36,
    "Stage 6",
      `Sent you email outlining 3 costly mistakes buyers make,
Did you see it? Worth a quick read.`
  );

  // Stage 7 → 44 days later
  scheduleMessage(
    44,
    "Stage 7",
      `just emallied you about setting up your own custome MI.5 search
(way better than zillow). Did that land in Your inbox ?`
  );

  // Stage 8 → 52 days later
  scheduleMessage(
    52,
    "Stage 8",
      `Check Your Email-- I sent a note about making your next move toward homeownership,
Did you see it?`
  );
}

module.exports = { sendSMS, scheduleLeadTexts };

