require("dotenv").config();
const twilio = require("twilio");
const supabase = require("../db/supabaseClient");
const cron = require("node-cron");
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(name, text, phone, stage) {
  try {
     let message = await client.messages.create({
      body: `${text}`,
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

function scheduleSellerTexts(name, phone, city) {
  // Stage 1: Immediately
  sendSMS(
    name,
`Hi ${name}, it was great speaking with you! 
I specialize in helping homeowners like you sell quickly and for top dollar. 
Please save my contact information and feel free to reach out anytime with questions about your home’s value, the market, or the selling process. 
Looking forward to working together! 
– Michael`,
    phone,
    "Stage 1"
  );

  
  function scheduleMessage(daysLater, stage, text) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysLater);
    const cronExpr = `${targetDate.getMinutes()} ${targetDate.getHours()} ${targetDate.getDate()} ${
      targetDate.getMonth() + 1
    } *`;

    cron.schedule(cronExpr, () => sendSMS(name, text, phone, stage));
  }

  // Stage 2 → 4 days later
  scheduleMessage(
    4,//2 for 24 hour
    "Stage 2",
`Hi ${name}, i just sent youy an email about the 3 keys to selling for top dollar. can you take a 
quick look and tell me What you Think?`  );

  // Stage 3 → 12 days later
  scheduleMessage(
    12,
    "Stage 3",
`Check Your Inbox--I sent you an email about finding out What Your home is Worth today.
Did it Came through? `  );

  // Stage 4 → 20 days later
  scheduleMessage(
    20,
    "Stage 4",
`Sent you an email outline the 3 keys to selling fast and for more.
Can you Check and let me know if you saw it?`
  );

  // Stage 5 → 28 days later
  scheduleMessage(
    28,
    "Stage 5",
`Just emalied you details about how i market homes [beyound a yard sign].
Did you see that in Your indox? `
  );

  // Stage 6 → 36 days later
  scheduleMessage(
    36,
    "Stage 6",
    "Home Value Report"
`Check Your email-- I sent some info about timming the market to maximize Your sale.
Did it Come throungh?`
  );

  // Stage 7 → 44 days later
  scheduleMessage(
    44,
    "Stage 7",
`Sent you an email about the 3 biggest mistakes sellers make.
Can You take a quick look and tell me what you think?`
  );

  // Stage 8 → 52 days later
  scheduleMessage(
    52,
    "Stage 8",
    
`just emailed you about cashing out on your equity while demand is still strong.
Did You see that Email Yetr?`
  );
}

module.exports = { sendSMS, scheduleSellerTexts };