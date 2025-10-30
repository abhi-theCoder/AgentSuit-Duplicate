// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const cron = require("node-cron");
// const supabase = require("../db/supabaseClient");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
//  // Stage 1 - send immediately

//  async function sendSellerMail(name, subject, text, toEmail, stage) {
//   try {
//      let info = await transporter.sendMail({
//       from: `<${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject,
//       text: ` Hey ${name},\n\n${text}`,
//     });

//     console.log(" seller Email sent:", info.messageId);

//     if (toEmail && stage) {
//       const { error } = await supabase
//         .from("leads")
//         .update({ email_stage: stage, updated_at: new Date() })
//         .eq("email", toEmail);

//       if (error) console.error(" Error updating email_stage:", error);
//       else console.log(` Updated ${toEmail} → email_stage = ${stage}`);
//     }
//   } catch (error) {
//     console.error(" Error sending email:", error);
//   }
// }

// function scheduleSellerLeadEmails(name, email, city) {
//   const fourDaysLater = new Date();
//   fourDaysLater.setDate(fourDaysLater.getDate() + 4);
//   const cron4Days = `${fourDaysLater.getMinutes()} ${fourDaysLater.getHours()} ${fourDaysLater.getDate()} ${
//     fourDaysLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron4Days, () => {
//     sendSellerMail(
//       "The Secret to Selling Your Home for Top Dollar",
//       `Hi ${name},

// Thanks for reaching out! Selling your home is one of the biggest financial decisions you’ll make—and the right strategy makes all the difference.

// My approach is built on three things:

// 1. Strategic Pricing - Getting you top dollar without scaring buyers.  
// 2. Powerful Marketing - Professional photos, video, social ads, and a massive buyer network.  
// 3. Strong Negotiation - Protecting your equity every step of the way.

// The first step is easy: let’s schedule a Seller Strategy Call to talk about your goals and create a plan.

// 📅 [Book Your Strategy Call]

// Talk soon,  
// Michael`,
//       email,
//       "Stage 2"
//     );
//   });

//   const twelveDaysLater = new Date();
//   twelveDaysLater.setDate(twelveDaysLater.getDate() + 12);
//   const cron12Days = `${twelveDaysLater.getMinutes()} ${twelveDaysLater.getHours()} ${twelveDaysLater.getDate()} ${
//     twelveDaysLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron12Days, () => {
//     sendSellerMail(
//       name,
//       "How to Sell Your Home for More Money", // Subject
//       `Hi ${name},

// Over the years, I’ve learned that selling successfully comes down to 3 keys:

// 1. Pricing it Right – Too high and you sit. Too low and you leave money on the table.
// 2. Presenting it Well – Staging, photos, and small tweaks that add big value.
// 3. Marketing to the Right Buyers – It’s about exposure to the people most likely to pay top dollar.

// This is exactly what I do for my clients.

// 📅 [Schedule Your Seller Strategy Call] and let’s create your personalized plan.

// Talk soon,
// Michael`,
//       email,

//       "Stage 3"
//     );
//   });

//   const twentyDaysLater = new Date();
//   twentyDaysLater.setDate(twentyDaysLater.getDate() + 20);
//   const cron20Days = `${twentyDaysLater.getMinutes()} ${twentyDaysLater.getHours()} ${twentyDaysLater.getDate()} ${
//     twentyDaysLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron20Days, () => {
//     sendSellerMail(
//       name,
//       "How We Put Your Home in Front of the Right Buyers", // Subject
//       `Hi ${name},


// Did you know most buyers find their home online first? That’s why marketing matters.

// Here’s what I do to make your home stand out:
// - Professional photography & video tours.
// - Targeted social media and digital ads.
// - Direct outreach to my database of ready buyers.

// The goal? Maximum exposure to the buyers most likely to pay top dollar.

// 📅 [Let’s Discuss How I’d Market Your Home]

// Best,
// Michael`,
//       email,
//       "Stage 4"
//     );
//   });

//   const twentyeightLater = new Date();
//   twentyeightLater.setDate(twentyeightLater.getDate() + 28);
//   const cron28Days = `${twentyeightLater.getMinutes()} ${twentyeightLater.getHours()} ${twentyeightLater.getDate()} ${
//     twentyeightLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron28Days, () => {
//     sendSellerMail(
//       name,
//       "Is Now the Best Time to Sell?",
//       `Hi ${name},

// One of the most common questions I get is: “When is the best time to sell?”

// The truth is, timing depends on two things:
// - Market Conditions – Buyer demand, inventory, and rates.
// - Your Goals – Whether you want speed, top dollar, or flexibility.

// I’d be happy to review the numbers for your neighborhood so you can decide if now is the right moment.

// 📅 [Schedule a Quick Call to Review Timing]

// Let’s make sure you sell when it benefits you most.

// Best,
// Michael`,
//       email,
//       "Stage 5"
//     );
//   });

//   const thirtysixLater = new Date();
//   thirtysixLater.setDate(thirtysixLater.getDate() + 36);
//   const cron36Days = `${thirtysixLater.getMinutes()} ${thirtysixLater.getHours()} ${thirtysixLater.getDate()} ${
//     thirtysixLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron36Days, () => {
//     sendSellerMail(
//       name,
//       "Don’t Make These Mistakes When Selling",
//       `Hi ${name},

// I see it all the time—sellers making costly mistakes.
// The most common are:

// 1. Overpricing their home.
// 2. Skipping preparation (staging, repairs).
// 3. Choosing weak marketing.

// These mistakes can cost thousands of dollars or lead to sitting on the market.

// My role is to help you avoid them and get the strongest possible result.

// 📅 [Book a Strategy Session Today]

// Talk soon,
// Michael`,
//       email,
//       "Stage 6"
//     );
//   });

//   const fourtyfourLater = new Date();
//   fourtyfourLater.setDate(fourtyfourLater.getDate() + 44);
//   const cron44Days = `${fourtyfourLater.getMinutes()} ${fourtyfourLater.getHours()} ${fourtyfourLater.getDate()} ${
//     fourtyfourLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron44Days, () => {
//     sendSellerMail(
//       name,
//       `Hi ${name},

// Here’s a quick story: Jenny wanted to sell their home in Scottsdale.

// With the right pricing, staging, and marketing, we generated multiple offers and sold for over asking price in just 20 days.

// That’s the power of the right strategy and the right marketing.

// I’d love to help you achieve the same success.

// 📅 [Schedule Your Seller Strategy Call Today]

// Best,
// Michael`,
//       email,
//       "Stage 7"
//     );
//   });

//   const fiftytwoLater = new Date();
//   fiftytwoLater.setDate(fiftytwoLater.getDate() + 52);
//   const cron52Days = `${fiftytwoLater.getMinutes()} ${fiftytwoLater.getHours()} ${fiftytwoLater.getDate()} ${
//     fiftytwoLater.getMonth() + 1
//   } *`;

//   cron.schedule(cron52Days, () => {
//     sendSellerMail(
//       name,
//       "Ready to Cash Out on Your Equity?",
//       `Hi ${name},

// You’ve built up equity in your home—don’t let the opportunity slip by.

// Buyer demand is strong, and homes like yours are still moving quickly.

// If you’re even thinking about selling, now is the time to get clarity.

// The best next step?
// 👉 [Book Your Seller Strategy Session Here]

// Let’s put a plan together and set you up for success.

// Talk soon,
// Michael`,
//       email,
//       "Stage 8"
//     );
//   });
//  }

// module.exports = { sendSellerMail, scheduleSellerLeadEmails };


// // require("dotenv").config();
// // const nodemailer = require("nodemailer");
// // const cron = require("node-cron");
// // const supabase = require("./db/supabaseClient");

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });
// // // Stage 1 - send immediately

// // async function sendSellerMail(name, subject, text, toEmail, stage) {
// //   try {
// //     let info = await transporter.sendMail({
// //       from: `<${process.env.EMAIL_USER}>`,
// //       to: toEmail,
// //       subject,
// //       text: ` Hey ${name},\n\n${text}`,
// //     });

// //     console.log("✅ seller Email sent:", info.messageId);

// //     if (toEmail && stage) {
// //       const { error } = await supabase
// //         .from("leads")
// //         .update({ email_stage: stage, updated_at: new Date() })
// //         .eq("email", toEmail);

// //       if (error) console.error(" Error updating email_stage:", error);
// //       else console.log(` Updated ${toEmail} → email_stage = ${stage}`);
// //     }
// //   } catch (error) {
// //     console.error(" Error sending email:", error);
// //   }
// // }

// // function scheduleSellerLeadEmails(name, email, city) {
// //   const fourDaysLater = new Date();
// //   fourDaysLater.setDate(fourDaysLater.getDate() + 4);
// //   const cron4Days = `${fourDaysLater.getMinutes()} ${fourDaysLater.getHours()} ${fourDaysLater.getDate()} ${
// //     fourDaysLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron4Days, () => {
// //     sendSellerMail(
// //       "The Secret to Selling Your Home for Top Dollar",
// //       `Hi ${name},

// // Thanks for reaching out! Selling your home is one of the biggest financial decisions you’ll make—and the right strategy makes all the difference.

// // My approach is built on three things:

// // 1. Strategic Pricing - Getting you top dollar without scaring buyers.  
// // 2. Powerful Marketing - Professional photos, video, social ads, and a massive buyer network.  
// // 3. Strong Negotiation - Protecting your equity every step of the way.

// // The first step is easy: let’s schedule a Seller Strategy Call to talk about your goals and create a plan.

// // 📅 [Book Your Strategy Call]

// // Talk soon,  
// // Michael`,
// //       email,
// //       "Stage 2"
// //     );
// //   });

// //   const twelveDaysLater = new Date();
// //   twelveDaysLater.setDate(twelveDaysLater.getDate() + 12);
// //   const cron12Days = `${twelveDaysLater.getMinutes()} ${twelveDaysLater.getHours()} ${twelveDaysLater.getDate()} ${
// //     twelveDaysLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron12Days, () => {
// //     sendSellerMail(
// //       name,
// //       "How to Sell Your Home for More Money", // Subject
// //       `Hi ${name},

// // Over the years, I’ve learned that selling successfully comes down to 3 keys:

// // 1. Pricing it Right – Too high and you sit. Too low and you leave money on the table.
// // 2. Presenting it Well – Staging, photos, and small tweaks that add big value.
// // 3. Marketing to the Right Buyers – It’s about exposure to the people most likely to pay top dollar.

// // This is exactly what I do for my clients.

// // 📅 [Schedule Your Seller Strategy Call] and let’s create your personalized plan.

// // Talk soon,
// // Michael`,
// //       email,

// //       "Stage 3"
// //     );
// //   });

// //   const twentyDaysLater = new Date();
// //   twentyDaysLater.setDate(twentyDaysLater.getDate() + 20);
// //   const cron20Days = `${twentyDaysLater.getMinutes()} ${twentyDaysLater.getHours()} ${twentyDaysLater.getDate()} ${
// //     twentyDaysLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron20Days, () => {
// //     sendSellerMail(
// //       name,
// //       "How We Put Your Home in Front of the Right Buyers", // Subject
// //       `Hi ${name},


// // Did you know most buyers find their home online first? That’s why marketing matters.

// // Here’s what I do to make your home stand out:
// // - Professional photography & video tours.
// // - Targeted social media and digital ads.
// // - Direct outreach to my database of ready buyers.

// // The goal? Maximum exposure to the buyers most likely to pay top dollar.

// // 📅 [Let’s Discuss How I’d Market Your Home]

// // Best,
// // Michael`,
// //       email,
// //       "Stage 4"
// //     );
// //   });

// //   const twentyeightLater = new Date();
// //   twentyeightLater.setDate(twentyeightLater.getDate() + 28);
// //   const cron28Days = `${twentyeightLater.getMinutes()} ${twentyeightLater.getHours()} ${twentyeightLater.getDate()} ${
// //     twentyeightLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron28Days, () => {
// //     sendSellerMail(
// //       name,
// //       "Is Now the Best Time to Sell?",
// //       `Hi ${name},

// // One of the most common questions I get is: “When is the best time to sell?”

// // The truth is, timing depends on two things:
// // - Market Conditions – Buyer demand, inventory, and rates.
// // - Your Goals – Whether you want speed, top dollar, or flexibility.

// // I’d be happy to review the numbers for your neighborhood so you can decide if now is the right moment.

// // 📅 [Schedule a Quick Call to Review Timing]

// // Let’s make sure you sell when it benefits you most.

// // Best,
// // Michael`,
// //       email,
// //       "Stage 5"
// //     );
// //   });

// //   const thirtysixLater = new Date();
// //   thirtysixLater.setDate(thirtysixLater.getDate() + 36);
// //   const cron36Days = `${thirtysixLater.getMinutes()} ${thirtysixLater.getHours()} ${thirtysixLater.getDate()} ${
// //     thirtysixLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron36Days, () => {
// //     sendSellerMail(
// //       name,
// //       "Don’t Make These Mistakes When Selling",
// //       `Hi ${name},

// // I see it all the time—sellers making costly mistakes.
// // The most common are:

// // 1. Overpricing their home.
// // 2. Skipping preparation (staging, repairs).
// // 3. Choosing weak marketing.

// // These mistakes can cost thousands of dollars or lead to sitting on the market.

// // My role is to help you avoid them and get the strongest possible result.

// // 📅 [Book a Strategy Session Today]

// // Talk soon,
// // Michael`,
// //       email,
// //       "Stage 6"
// //     );
// //   });

// //   const fourtyfourLater = new Date();
// //   fourtyfourLater.setDate(fourtyfourLater.getDate() + 44);
// //   const cron44Days = `${fourtyfourLater.getMinutes()} ${fourtyfourLater.getHours()} ${fourtyfourLater.getDate()} ${
// //     fourtyfourLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron44Days, () => {
// //     sendSellerMail(
// //       name,
// //       `Hi ${name},

// // Here’s a quick story: Jenny wanted to sell their home in Scottsdale.

// // With the right pricing, staging, and marketing, we generated multiple offers and sold for over asking price in just 20 days.

// // That’s the power of the right strategy and the right marketing.

// // I’d love to help you achieve the same success.

// // 📅 [Schedule Your Seller Strategy Call Today]

// // Best,
// // Michael`,
// //       email,
// //       "Stage 7"
// //     );
// //   });

// //   const fiftytwoLater = new Date();
// //   fiftytwoLater.setDate(fiftytwoLater.getDate() + 52);
// //   const cron52Days = `${fiftytwoLater.getMinutes()} ${fiftytwoLater.getHours()} ${fiftytwoLater.getDate()} ${
// //     fiftytwoLater.getMonth() + 1
// //   } *`;

// //   cron.schedule(cron52Days, () => {
// //     sendSellerMail(
// //       name,
// //       "Ready to Cash Out on Your Equity?",
// //       `Hi ${name},

// // You’ve built up equity in your home—don’t let the opportunity slip by.

// // Buyer demand is strong, and homes like yours are still moving quickly.

// // If you’re even thinking about selling, now is the time to get clarity.

// // The best next step?
// //  [Book Your Seller Strategy Session Here]

// // Let’s put a plan together and set you up for success.

// // Talk soon,
// // Michael`,
// //       email,
// //       "Stage 8"
// //     );
// //   });
// //  }

// // module.exports = { sendSellerMail, scheduleSellerLeadEmails };
