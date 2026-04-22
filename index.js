const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const SMILE_API_KEY = process.env.SMILE_API_KEY;
const VIP_TIER_ID = "YOUR_VIP_TIER_ID"; // yaha apna dalna

app.post("/webhook", async (req, res) => {
  const order = req.body;
  const customer = order.customer;

  if (!customer) return res.sendStatus(200);

  const tags = customer.tags || "";

  if (tags.includes("VIP")) {

    // ✅ 1. VIP Tier Assign
    await fetch("https://api.smile.io/v1/customers/vip_tier", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SMILE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: customer.email,
        tier_id: VIP_TIER_ID
      })
    });

    // ✅ 2. Points bhi de do
    await fetch("https://api.smile.io/v1/customers/points", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SMILE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: customer.email,
        points: 100
      })
    });

    console.log("VIP assign + points mil gaye");
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running"));
