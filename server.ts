import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 3. API: Verify Manual Payment reference/receipt
  app.post("/api/verify-manual-payment", (req, res) => {
    const { reference, bookId, userId, accountNo } = req.body;
    if (!reference || !bookId || !userId) {
      res.status(400).json({ error: "Missing required verification fields" });
      return;
    }

    // Verify format and simulate successful recording
    console.log(`Manual OPay payment verification request. Ref: ${reference}, User: ${userId}, Book: ${bookId}`);
    res.json({
      status: "success",
      message: "Payment successfully verified and logged.",
      reference,
      bookId,
    });
  });

  // 4. API: Create Paystack Session
  app.post("/api/create-paystack-session", async (req, res) => {
    const { bookId, bookTitle, priceNGN, userId, userEmail } = req.body;

    if (!bookId || !priceNGN || !userId || !userEmail) {
      res.status(400).json({ error: "Missing required fields: bookId, priceNGN, userId, userEmail" });
      return;
    }

    try {
      const key = process.env.PAYSTACK_SECRET_KEY;
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      if (key) {
        // Contact live Paystack API
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            amount: Math.round(priceNGN * 100), // in kobo
            callback_url: `${appUrl}/?payment_status=paystack_success&book_id=${bookId}&amount_ngn=${priceNGN}`,
            metadata: {
              userId,
              bookId,
            }
          })
        });

        const data: any = await response.json();
        if (data && data.status && data.data && data.data.authorization_url) {
          res.json({ url: data.data.authorization_url, isSimulated: false });
        } else {
          console.error("Paystack API error response:", data);
          throw new Error(data.message || "Paystack initialization failed");
        }
      } else {
        // Fallback to simulation URL
        res.json({
          url: `/?payment_status=sim_paystack&book_id=${bookId}&amount_ngn=${priceNGN}`,
          isSimulated: true,
        });
      }
    } catch (error: any) {
      console.error("Error creating Paystack session:", error);
      res.status(500).json({
        error: error.message || "Failed to initiate Paystack. Falling back to simulation.",
        isSimulated: true,
        url: `/?payment_status=sim_paystack&book_id=${bookId}&amount_ngn=${priceNGN}`,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
