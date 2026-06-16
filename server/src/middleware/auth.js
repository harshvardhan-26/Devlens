// import admin from "firebase-admin";
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = {
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}


export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";

    const token = header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : null;

    if (!token) {
      req.user = {
        email: "demo-user@example.com",
        name: "Demo User"
      };

      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    next(error);
  }
}
