import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const EXPIRY = "25d";

export const createJWT = (user:any) => {
    const token = jwt.sign({name:user.name,email:user.email,password:user.password,id:user.id},process.env.JWT_SECRET as string,{expiresIn:EXPIRY});
    return token;
}

export const protect = (req:any,res:any,next:NextFunction) => {
    // Get Authorization Bearer
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const token = bearer.split(" ")[1]; // Get JWT 'token' : "Bearer token"

  if (!token) {
    res.status(401).json({ message: "Not Authorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: "Not Authorized" });
  }
}