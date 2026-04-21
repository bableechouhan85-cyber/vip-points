const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const order = req.body;
  const customer = order.customer;

  if (!customer) return res.sendStatus(200);

  const tags = customer.tags || "";

  if (tags.includes("VIP")) {
    await fetch("https://api.smile.io/v1/customers/points", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_SMILE_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: customer.email,
        points: 100
      })
    });

    console.log("VIP ko points mil gaye");
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running"));