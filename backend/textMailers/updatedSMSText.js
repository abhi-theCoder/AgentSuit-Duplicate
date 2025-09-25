const supabase = require("../db/supabaseClient");
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 🔹 Fetch stage details from DB
async function getStageDetails(type, stage) {
  const table = type?.toLowerCase() === "seller" ? "seller_sms" : "buyer_sms";
  const { data, error } = await supabase
    .from(table)
    .select("stage, text, next_sms_delay")
    .eq("stage", stage)
    .single();

  if (error) {
    console.error("❌ Error fetching stage details:", error);
    return null;
  }
  return data;
}

// 🔹 Core SMS sender
async function sendSMS(name, text, phone, stage, leadId, nextSmsDelay, type, city) {
  try {
    const message = await client.messages.create({
      body: `Hey ${name}, ${text}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    console.log("✅ SMS sent:", message.sid);

    if (leadId && stage) {
      // compute next time
      const nextSmsDate = new Date();

      // ✅ Actual code (production)
      nextSmsDate.setDate(nextSmsDate.getDate() + nextSmsDelay);

      // 🧪 Testing code
      // nextSmsDate.setMinutes(nextSmsDate.getMinutes() + nextSmsDelay);

      // update DB
      await supabase
        .from("leads")
        .update({
          sms_stage: stage + 1,
          next_sms_date: nextSmsDate,
        })
        .eq("id", leadId);

      console.log(
        `Updated lead ${leadId} → sms_stage = ${stage + 1}, next_sms_date = ${nextSmsDate}`
      );

      // schedule next sms
      const nextStageDetails = await getStageDetails(type, stage + 1);
      if (nextStageDetails) {
        scheduleSMSAt(leadId, name, phone, city, stage + 1, nextStageDetails, type, nextSmsDate);
      }
    }
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
  }
}

// 🔹 Schedule SMS using setTimeout
function scheduleSMSAt(leadId, name, phone, city, stage, stageDetails, type, scheduledDate) {
  const delay = scheduledDate.getTime() - Date.now();
  if (delay <= 0) {
    console.log(`⚡ Sending overdue SMS immediately for lead ${leadId}, Stage ${stage}`);
    sendSMS(
      name,
      stageDetails.text.replace("{city}", city || "your city"),
      phone,
      stage,
      leadId,
      stageDetails.next_sms_delay,
      type,
      city
    );
    return;
  }

  console.log(`🕒 Scheduling Stage ${stage} SMS for lead ${leadId} in ${Math.round(delay / 1000)}s`);
  setTimeout(() => {
    sendSMS(
      name,
      stageDetails.text.replace("{city}", city || "your city"),
      phone,
      stage,
      leadId,
      stageDetails.next_sms_delay,
      type,
      city
    );
  }, delay);
}

// 🔹 Send Stage 1 immediately
async function sendImmediateStage1(lead) {
  const stageDetails = await getStageDetails(lead.type, 1);
  if (!stageDetails) return;

  await sendSMS(
    lead.first_name,
    stageDetails.text.replace("{city}", lead.preferred_location || "your city"),
    lead.phone_number,
    1,
    lead.id,
    stageDetails.next_sms_delay,
    lead.type,
    lead.preferred_location
  );
}

// 🔹 Restore schedules on restart
async function schedulePendingLeadTexts() {
  try {
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, first_name, phone_number, preferred_location, sms_stage, next_sms_date, type")
      .not("next_sms_date", "is", null);

    if (error) {
      console.error("❌ Error fetching pending leads:", error);
      return;
    }

    for (const lead of leads) {
      const currentStage = lead.sms_stage || 1;
      const stageDetails = await getStageDetails(lead.type, currentStage);
      if (!stageDetails) continue;

      const scheduledDate = new Date(lead.next_sms_date);

      // schedule from DB
      scheduleSMSAt(
        lead.id,
        lead.first_name,
        lead.phone_number,
        lead.preferred_location,
        currentStage,
        stageDetails,
        lead.type,
        scheduledDate
      );
    }
  } catch (error) {
    console.error("❌ Error scheduling pending texts:", error);
  }
}

module.exports = {
  sendImmediateStage1,
  schedulePendingLeadTexts,
};