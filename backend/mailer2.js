require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const supabase = require("./db/supabaseClient");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Stage 1 - send immediately


async function sendSellerMail(name, subject, text, toEmail, stage) {

  try {

    let info = await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      text: ` Hey ${name},\n\n${text}`,
    });

    console.log("✅ seller Email sent:", info.messageId);

    if (toEmail && stage) {
      const { error } = await supabase
        .from("leads")
        .update({ email_stage: stage, updated_at: new Date() })
        .eq("email", toEmail);

      if (error) console.error(" Error updating email_stage:", error);
      else console.log(` Updated ${toEmail} → email_stage = ${stage}`);
    }
  } catch (error) {
    console.error(" Error sending email:", error);
  }
}

function scheduleSellerLeadEmails(name, email, city) {
  const fourDaysLater = new Date();
  fourDaysLater.setDate(fourDaysLater.getDate() + 4);
  const cron4Days = `${fourDaysLater.getMinutes()} ${fourDaysLater.getHours()} ${fourDaysLater.getDate()} ${
    fourDaysLater.getMonth() + 1
  } *`;

  cron.schedule(cron4Days, () => {
    sendSellerMail(
      name,
      `Thanks for reaching out! Selling a home in ${city} can feel overwhelming, 
but with the right plan, you’ll get the best price in the shortest time.

I’ll walk you through pricing strategy, staging tips, and my proven marketing plan.

Talk soon,  
Michael K`,
      email,
      "Stage 2"
    );
  });

  const twelveDaysLater = new Date();
  twelveDaysLater.setDate(twelveDaysLater.getDate() + 12);
  const cron12Days = `${twelveDaysLater.getMinutes()} ${twelveDaysLater.getHours()} ${twelveDaysLater.getDate()} ${
    twelveDaysLater.getMonth() + 1
  } *`;

  cron.schedule(cron12Days, () => {
    sendSellerMail(
      name,
      "What’s Your Home Really Worth?",
      `Hi ${name},  

Pricing your home correctly is the #1 factor in getting it sold quickly.  
I offer a **free comparative market analysis (CMA)** that shows what buyers are 
willing to pay in ${city} today.  

Would you like me to put one together for you?  

Best,  
Michael K`,
      email,
      "Stage 3"
    );
  });

  const twentyDaysLater = new Date();
  twentyDaysLater.setDate(twentyDaysLater.getDate() + 20);
  const cron20Days = `${twentyDaysLater.getMinutes()} ${twentyDaysLater.getHours()} ${twentyDaysLater.getDate()} ${
    twentyDaysLater.getMonth() + 1
  } *`;

  cron.schedule(cron20Days, () => {
    sendSellerMail(
      name,
      "The #1 Step Most Sellers Skip (Don’t!)",
      `One of the biggest mistakes sellers make is waiting too long to prepare their home for the market. Without planning ahead, you could:

Lose qualified buyers who move on to better-presented homes.

Overestimate what buyers will pay without improvements.

Be taken less seriously by serious buyers.

The good news? Preparing your home for sale doesn’t have to be stressful. I work with trusted professionals who can help you highlight your property’s best features.

If you’d like, I can share exactly what buyers are looking for right now.

💡 Let’s Chat About Preparing Your Home for Sale!

Getting ready now means you’ll attract stronger offers when the right buyer comes along.

Talk soon,  
Michael`,
      email,
      "Stage 4"
    );
  });

  const twentyeightLater = new Date();
  twentyeightLater.setDate(twentyeightLater.getDate() + 28);
  const cron28Days = `${twentyeightLater.getMinutes()} ${twentyeightLater.getHours()} ${twentyeightLater.getDate()} ${
    twentyeightLater.getMonth() + 1
  } *`;

  cron.schedule(cron28Days, () => {
    sendSellerMail(
      name,
      "How to Attract Buyers BEFORE You List on Zillow",
      `Here’s something most sellers don’t realize: many of the best offers come *before* a home ever goes public online.

Because of my network and active buyers list, I can often connect sellers with qualified buyers who are ready to act quickly.

This can mean:

✅ Selling faster, sometimes before showings even start.  
✅ Avoiding the stress of endless open houses.  
✅ Attracting serious buyers who are motivated.  

[Schedule a Quick Call to Discuss Pre-Market Opportunities]

Let’s talk about how I can help you position your property for strong interest—even before it’s listed.

Best,  
Michael`,
      email,
      "Stage 5"
    );
  });

  const thirtysixLater = new Date();
  thirtysixLater.setDate(thirtysixLater.getDate() + 36);
  const cron36Days = `${thirtysixLater.getMinutes()} ${thirtysixLater.getHours()} ${thirtysixLater.getDate()} ${
    thirtysixLater.getMonth() + 1
  } *`;

  cron.schedule(cron36Days, () => {
    sendSellerMail(
      name,
      "Don’t Let These Mistakes Cost You Thousands",
      `When selling a home, small mistakes can cost you big.

Here are the 3 most common I see:

❌ Pricing the property too high (causing it to sit on the market).  
❌ Skipping essential repairs or staging.  
❌ Accepting the first offer without proper negotiation.  

My job is to help you avoid these mistakes and protect your equity every step of the way.

The best way to do that is by creating a smart selling strategy before you list your home.

[Book Your Seller Strategy Call Today]

Talk soon,  
Michael`,
      email,
      "Stage 6"
    );
  });

  const fourtyfourLater = new Date();
  fourtyfourLater.setDate(fourtyfourLater.getDate() + 44);
  const cron44Days = `${fourtyfourLater.getMinutes()} ${fourtyfourLater.getHours()} ${fourtyfourLater.getDate()} ${
    fourtyfourLater.getMonth() + 1
  } *`;

  cron.schedule(cron44Days, () => {
    sendSellerMail(
      name,
      "I’ll Help You Find the Perfect Buyer",
      `Every seller has a unique goal. Maybe for you it’s selling quickly, maximizing profit, or finding a buyer who truly values your home.

I’d love to create a customized selling strategy for you. Unlike generic online listings, this will highlight your property’s strengths and attract the right buyers—sometimes even before it goes public.

Tell me your top priorities, or better yet:  
[Schedule a Quick Call] and we’ll build your selling plan together.

Let’s find the perfect buyer who checks every box.

Best,  
Michael`,
      email,
      "Stage 7"
    );
  });

  const fiftytwoLater = new Date();
  fiftytwoLater.setDate(fiftytwoLater.getDate() + 52);
  const cron52Days = `${fiftytwoLater.getMinutes()} ${fiftytwoLater.getHours()} ${fiftytwoLater.getDate()} ${
    fiftytwoLater.getMonth() + 1
  } *`;

  cron.schedule(cron52Days, () => {
    sendSellerMail(
      name,
      "How We Helped Sarah and Mark Sell Their Home Quickly (and for Top Dollar)",
      `I want to share a quick story about Sarah and Mark. They were ready to sell their home in Downtown Gilbert but felt overwhelmed and unsure how to get the best price.

Together, we created a clear selling strategy, prepared the home to shine, and attracted multiple strong offers. In the end, they sold quickly—at a price that exceeded their expectations.

I’d love to help you have the same success.

[Book Your Seller Strategy Call Here]

Let’s make your story the next success.

Talk soon,  
Michael`,
      email,
      "Stage 8"
    );
  });

  const sixtyoLater = new Date();
  sixtyoLater.setDate(sixtyoLater.getDate() + 60);
  const cron60Days = `${sixtyoLater.getMinutes()} ${sixtyoLater.getHours()} ${sixtyoLater.getDate()} ${
    sixtyoLater.getMonth() + 1
  } *`;

  cron.schedule(cron60Days, () => {
    sendSellerMail(
      name,
      "Ready to Sell Your Home? Let’s Get Started",
      `Over the past few weeks, I’ve shared insights to help you succeed, but the truth is, the real results happen once we build a clear, personalized selling plan.

The market moves quickly—waiting could mean missing serious buyers who are ready right now.

The best next step?  
[Book Your Seller Strategy Session Now]

Let’s put your plan in place and get you on the path to a successful sale.

Best,  
Michael`,
      email,
      "Stage 9"
    );
  });
}

 module.exports = { sendSellerMail, scheduleSellerLeadEmails };

 
// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const cron = require("node-cron");
// const supabase = require('./db/supabaseClient');

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function sendMail(name, subject, text, toEmail, stage) {
//   try {
//     let info = await transporter.sendMail({
//       from: `<${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject,
//       text: `Hey ${name},\n\n${text}`,
//     });

//     console.log("✅ Email sent:", info.messageId);

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

// function scheduleLeadEmails(name, email, city) {
//   const fourDaysLater = new Date();
//   fourDaysLater.setMinutes(fourDaysLater.getMinutes() + 1);
//   const cron4Days = `${fourDaysLater.getMinutes()} ${fourDaysLater.getHours()} ${fourDaysLater.getDate()} ${fourDaysLater.getMonth() + 1} *`;

//   cron.schedule(cron4Days, () => {
//     sendMail(
//       name,
//       "Your Home Search Simplified",
//       `Thanks again for reaching out! Buying a home can be an overwhelming journey,
// but with the right plan it becomes simple and exciting.

// We’ll help you find the perfect home in ${city}.

// Talk soon,
// Michael K`,
//       email,
//       "Stage 2"
//     );
//   });

//   const twelveDaysLater = new Date();
//   twelveDaysLater.setMinutes(twelveDaysLater.getMinutes() + 2);
//   const cron12Days = `${twelveDaysLater.getMinutes()} ${twelveDaysLater.getHours()} ${twelveDaysLater.getDate()} ${twelveDaysLater.getMonth() + 1} *`;

//   cron.schedule(cron12Days, () => {
//     sendMail(
//       name,
//       "What's Really Happening in Real Estate",
//       `This week, the market in ${city} is changing in important ways:

// Inventory is [low/high], meaning competition is [strong/weak].

// Average home prices are [trending up/down].

// The best homes are selling in [X] days.

// When you’re buying, the difference between success and frustration often comes down to timing and preparation.

// That’s why I offer my clients a personalized strategy session—you know exactly how to win in today’s market.

//  [Book Your Strategy Call]

// Let’s put a plan together before your dream home hits the market.

// Best,
// Michael`,
//       email,
//       "Stage 3"
//     );
//   });

//   const twentyDaysLater = new Date();
//   twentyDaysLater.setMinutes(twentyDaysLater.getMinutes() + 4);
//   const cron20Days = `${twentyDaysLater.getMinutes()} ${twentyDaysLater.getHours()} ${twentyDaysLater.getDate()} ${twentyDaysLater.getMonth() + 1} *`;

//   cron.schedule(cron20Days, () => {
//     sendMail(
//       name,
//       "The #1 Step Most Buyers Skip (Don’t!)",
//       `One of the biggest mistakes buyers make is waiting to get pre-approved. Without it, you could:

// Miss out on the home you love.

// Overestimate what you can afford.

// Be taken less seriously by sellers.

// The good news? Pre-approval is simple. I work with trusted lenders who make the process smooth and stress-free.

// If you don’t already have someone, I’d be happy to connect you with the best.

// 💡 Let’s Chat About Financing Options!

// Being prepared now means you’ll be ready when the right home comes along.

// Talk soon,
// Michael`,
//       email,
//       "Stage 4"
//     );
//   });

//   const twentyeightLater = new Date();
//   twentyeightLater.setMinutes(twentyeightLater.getMinutes() + 5);
//   const cron28Days = `${twentyeightLater.getMinutes()} ${twentyeightLater.getHours()} ${twentyeightLater.getDate()} ${twentyeightLater.getMonth() + 1} *`;

//   cron.schedule(cron28Days, () => {
//     sendMail(
//       name,
//       "How to Find Homes BEFORE They Hit Zillow",
//       `Here’s something most buyers don’t know: not all homes are online.

// Some are sold before they ever get listed on Zillow, Redfin, or Realtor.com.

// Because of my network and MLS access, I can connect my clients with homes that are coming soon but not yet public.

// A few off-market opportunities.

// Fit their unique needs perfectly.

// This can be the difference between winning your dream home or missing it.

//  [Schedule a Quick Call to Get Access]

// Let’s talk about how I can give you the edge in today’s market.

// Best,
// Michael`,
//       email,
//       "Stage 5"
//     );
//   });

//   const thirtysixLater = new Date();
//   thirtysixLater.setMinutes(thirtysixLater.getMinutes() + 6);
//   const cron36Days = `${thirtysixLater.getMinutes()} ${thirtysixLater.getHours()} ${thirtysixLater.getDate()} ${thirtysixLater.getMonth() + 1} *`;

//   cron.schedule(cron36Days, () => {
//     sendMail(
//       name,
//       "Don’t Let These Mistakes Cost You Thousands",
//       `When buying a home, small mistakes can cost you big.

// Here are the 3 most common I see:

// Waiting too long to make an offer.

// Skipping pre-approval before house hunting.

// Waiving important inspections without guidance.

// My job is to help you avoid these mistakes and protect your money every step of the way.

// The best way to do that is by creating a plan before you fall in love with a home.

//  [Book Your Buyer Strategy Call Today]

// Talk soon,
// Michael`,
//       email,
//       "Stage 6"
//     );
//   });

//   const fourtyfourLater = new Date();
//   fourtyfourLater.setMinutes(fourtyfourLater.getMinutes() + 7);
//   const cron44Days = `${fourtyfourLater.getMinutes()} ${fourtyfourLater.getHours()} ${fourtyfourLater.getDate()} ${fourtyfourLater.getMonth() + 1} *`;

//   cron.schedule(cron44Days, () => {
//     sendMail(
//       name,
//       "I’ll Help You Find the Perfect Fit",
//       `Every buyer has a unique list of must-haves. Maybe for you it’s a community pool, extra office space, or a quick commute.

// I’d love to set up a customized MLS search for you. Unlike Zillow or Redfin, this will send you listings that actually match your criteria—often before they’re public.

// Send me your must-haves, or better yet:
//  [Schedule a Quick Call] and we’ll build your perfect search together.

// Let’s find the home that checks every box.

// Best,
// Michael`,
//       email,
//       "Stage 7"
//     );
//   });

//   const fiftytwoLater = new Date();
//   fiftytwoLater.setMinutes(fiftytwoLater.getMinutes() + 8);
//   const cron52Days = `${fiftytwoLater.getMinutes()} ${fiftytwoLater.getHours()} ${fiftytwoLater.getDate()} ${fiftytwoLater.getMonth() + 1} *`;

//   cron.schedule(cron52Days, () => {
//     sendMail(
//       name,
//       "How We Helped Jamie and Randall Buy Their Dream Home",
//       `I want to share a quick story about Jamie and Randall. They were looking for a single-family home in Downtown Gilbert. Like many buyers, they were feeling overwhelmed and unsure how to compete.

// Together, we created a clear strategy, found the perfect home, and negotiated an amazing deal. Today, they’re happily settled in a place they love.

// I’d love to help you have the same success.

//  [Book Your Buyer Strategy Call Here]

// Let’s make your story the next success.

// Talk soon,
// Michael`,
//       email,
//       "Stage 8"
//     );
//   });

//   const sixtyoLater = new Date();
//   sixtyoLater.setMinutes(sixtyoLater.getMinutes() + 9);
//   const cron60Days = `${sixtyoLater.getMinutes()} ${sixtyoLater.getHours()} ${sixtyoLater.getDate()} ${sixtyoLater.getMonth() + 1} *`;

//   cron.schedule(cron60Days, () => {
//     sendMail(
//       name,
//       "Ready to Find Your Home? Let’s Get Started",
//       `Over the past few weeks, I’ve shared insights to help you succeed, but the truth is, the magic happens once we build a clear, personalized plan.

// The market moves quickly—waiting could mean missing the perfect home.

// The best next step?
//  [Book Your Buyer Strategy Session Now]

// Let’s put your plan in place and get you on the path to your dream home.

// Best,
// Michael`,
//       email,
//       "Stage 9"
//     );
//   });
// }

// module.exports = { sendMail, scheduleLeadEmails };
