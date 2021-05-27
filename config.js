try {
  require("dotenv").config();
} catch (e) {
  console.error("error loading dotenv", e);
}

module.exports = {
  twilio: {
    accountSid: "AC58941c4201fa09443ae7464d5f4d49aa",
    authToken: "3cb0f00c3bb425ee9a2686f0d964881f",
    apiKey: "SKe84e7abda8fac5bdbbf486b75e1723b7",
    apiSecret: "sGWypPft8lA2QYTj025z77oG3QhNPaMt",
    chatServiceSid: "ISfa45f24c75614e26afcbce635188f3dd"
  },
  port: process.env.PORT || 3001,
  ngrokSubdomain: "ajtack"
};
