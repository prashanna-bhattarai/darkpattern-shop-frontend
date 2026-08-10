# Verve -- Dark Pattern Test Shop

A fully working MERN e-commerce demo, built specifically to give the Dark
Pattern Sentinel extension real, live pages to detect against. Browsing
products and adding to cart both work without an account; login is only
required at final checkout (itself a deliberate Forced Action pattern).

**What's deliberately built in, by dark-pattern class:**

| Class | Where |
|---|---|
| False Urgency | Sitewide sale banner + countdown timers on flash-sale products (`Wireless Bluetooth Earbuds Pro`, `1080p Home Security Camera`) |
| Scarcity | "Only N left in stock!" badges (`Leather Bifold Wallet`, `Home Security Camera`) |
| Social Proof | Rating/review counts, "X people bought this in 24h", "X people viewing now" (`Smart Fitness Watch`, `Yoga Mat`) |
| Forced Action | Price hidden behind signup (`Premium Skincare Gift Set`); guest checkout blocked at `/cart` |
| Obstruction | `CloudFit Premium Membership` cancellation flow (product page + Account page), buried behind a retention offer and a phone-only cancellation path |
| Sneaking | Hidden fee revealed only after checkout (`Chef Knife Set`, `Yoga Mat`), pre-checked paid add-on (`Chef Knife Set`) |
| Confirmshaming | Discount popup with a guilt-tripping decline button on `Studio Noise-Cancelling Headphones` |

Six additional "clean" products have **no** dark patterns at all, for
true-negative testing.

---

## 1. Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: paste your MongoDB Atlas URI and a JWT_SECRET (see Section 2 below)
npm run seed     # populates the database with the products above
npm run dev      # starts the API on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env    # default already points at http://localhost:5000/api
npm run dev              # starts the site on http://localhost:5173
```

Open `http://localhost:5173`, and point the extension at it like any other
live site.

---

## 2. MongoDB Atlas setup (free tier)

You don't need to install MongoDB locally -- Atlas's free tier is enough for
this.

1. Go to <https://www.mongodb.com/cloud/atlas/register> and create a free
   account (or log in if you already have one from your internship project).
2. Click **"Create a deployment"** → choose **M0 (Free)** → pick any region
   close to you → click **Create**.
3. When prompted for a database user, set a **username and password** --
   write these down, you'll need them in the connection string. Do not use
   `@`, `/`, or `:` in the password, since those characters need extra
   escaping inside a URL; letters, numbers, and `_-` are safest.
4. Under **Network Access**, click **Add IP Address** → **Allow Access from
   Anywhere** (`0.0.0.0/0`). This is fine for a course project; a production
   app would restrict this to specific server IPs.
5. Once the cluster finishes deploying, click **Connect** → **Drivers** →
   select **Node.js**. Copy the connection string, which looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<username>` and
   `<password>` with your actual credentials, and adding a database name
   before the `?`, e.g.:
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/darkpattern_shop?retryWrites=true&w=majority
   ```
7. Run `npm run seed` from the `backend/` folder once this is set -- you
   should see `Inserted 16 products.` printed. If you see an authentication
   or network error instead, it's almost always either the password or the
   Network Access step above.

You can browse your data anytime at Atlas's **Browse Collections** view, or
by connecting MongoDB Compass (which you already used in your internship
project) to the same connection string.

---

## 3. Deploying it for real

This matches the same Render (backend) + Vercel (frontend) split you already
used for your chat app.

### Backend → Render

1. Push this `backend/` folder to its own GitHub repo (or a subfolder of a
   monorepo -- Render supports setting a root directory).
2. On Render: **New → Web Service** → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables matching your `.env` (`MONGO_URI`, `JWT_SECRET`,
   `CLIENT_URL` -- set this to your eventual Vercel URL once you have it,
   e.g. `https://verve-shop.vercel.app`).
5. Once deployed, run the seed script once from your local machine pointed
   at the same `MONGO_URI` (you already will have, from Section 2), or add
   a one-off Render Shell command: `node seed/seed.js`.

### Frontend → Vercel

1. Push `frontend/` to GitHub, import it on Vercel.
2. Framework preset: **Vite**.
3. Add environment variable `VITE_API_URL` set to your Render backend URL
   plus `/api`, e.g. `https://verve-backend.onrender.com/api`.
4. Deploy. Go back to Render and update `CLIENT_URL` to the real Vercel URL
   you were given, then redeploy the backend so CORS and cookies line up.

**One production-specific gotcha:** since the frontend and backend live on
different domains, the login cookie needs `sameSite: "none"` and
`secure: true` (already handled in `authController.js` based on
`NODE_ENV=production`) -- and both domains must be HTTPS, which Render and
Vercel give you by default.

---

## 4. A note on the email-based password reset

No SMTP is configured out of the box -- when you click "forgot password",
the reset link is printed to the backend's console/logs instead of emailed.
That's completely fine for testing the extension. If you want it to actually
send real emails, set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in `.env` (Brevo's
free tier, which you already looked at for the chat app, works well here
too, since Render's free tier blocks outbound SMTP ports the same way it did
before).
