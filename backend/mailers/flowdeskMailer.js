// require('dotenv').config();
// const axios = require('axios');
// const FLODESK_API_KEY = process.env.FLODESK_API_KEY;
// const FLODESK_BUYER_SEGMENT_ID = process.env.FLODESK_BUYER_SEGMENT_ID;
// const FLODESK_SELLER_SEGMENT_ID = process.env.FLODESK_SELLER_SEGMENT_ID;
// // Prepare Basic Auth header
// const basicAuth = Buffer.from(`${FLODESK_API_KEY}:`).toString('base64');
// const flodeskClient = axios.create({
//   baseURL: 'https://api.flodesk.com/v1',
//   headers: {
//     Authorization: `Basic ${basicAuth}`,
//     'Content-Type': 'application/json',
//   },
// });
// const triggerFlodeskWorkflow = async (email, firstName, lastName, segmentId) => {
//   try {
//     // Step 1: Create or update subscriber
//     const subscriberPayload = {
//       email,
//       first_name: firstName,
//       last_name: lastName,
//     };
//     const subscriberRes = await flodeskClient.post('/subscribers', subscriberPayload);
//     const subscriberId = subscriberRes.data.id;
//     console.log(`✅ Subscriber created/updated: ${subscriberId}`);
//     // Step 2: Add subscriber to a segment
//     await flodeskClient.post(`/subscribers/${subscriberId}/segments`, {
//       segment_ids: [segmentId],
//     });
//     console.log(`✅ Subscriber ${subscriberId} added to segment ${segmentId}`);
//     return subscriberRes.data;
//   } catch (error) {
//     console.error(
//       '❌ Error adding subscriber to Flodesk:',
//       error.response?.data || error.message
//     );
//     throw new Error('Failed to trigger Flodesk workflow.');
//   }
// };
// const initiateBuyerWorkflow = (email, firstName, lastName) => {
//   return triggerFlodeskWorkflow(email, firstName, lastName, FLODESK_BUYER_SEGMENT_ID);
// };
// const initiateSellerWorkflow = (email, firstName, lastName) => {
//   return triggerFlodeskWorkflow(email, firstName, lastName, FLODESK_SELLER_SEGMENT_ID);
// };
// module.exports = {
//   initiateBuyerWorkflow,
//   initiateSellerWorkflow,    };
