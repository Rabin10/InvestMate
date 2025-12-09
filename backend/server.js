import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import investmentsRouter from "./routes/investments.js";
import { setupPassport } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

setupPassport();
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    session: true,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_ORIGIN || "http://localhost:5173");
  }
);

app.get("/auth/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect(process.env.CLIENT_ORIGIN || "http://localhost:5173");
  });
});

app.get("/auth/failure", (req, res) => {
  res.status(401).json({ error: "Google auth failed" });
});

app.get("/api/me", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

app.use("/api/investments", investmentsRouter);

app.get("/", (req, res) => {
  res.send("InvestMate API running");
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
