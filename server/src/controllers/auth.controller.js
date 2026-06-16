import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
// import { User } from "../models/User.js"; // if you have user model

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // No DB version
    const user = {
      email,
      name,
      avatar: picture
    };

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
  token,
  user: {
    email,
    name,
    avatar: picture
  }
});

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ error: "Google auth failed" });
  }
}