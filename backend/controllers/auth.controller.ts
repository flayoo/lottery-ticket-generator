import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';
import sqlite3 from 'sqlite3';
import { TokenPayload } from '../models/ticket.model';

export const signUp = (req: Request, res: Response): void => {
  const jwtSecret = process.env.JWT_SECRET as string;

  const { email, password } = req.body;

  db.get("SELECT email FROM users WHERE email = ?", [email], (err: Error | null, row: { email: string }) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "There was a problem with the registration." });
      return;
    }
    if (row) {
      res.status(400).json({ message: "This email is already registered." });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "There was a problem registering the user." });
        return;
      }
      const token = jwt.sign({ id: this.lastID }, jwtSecret, {
        expiresIn: 86400 // läuft in 24 Stunden ab
      });
      res.status(200).json({ auth: true, token });
    });
  });
};

export const signIn = (req: Request, res: Response): void => {

  const jwtSecret = process.env.JWT_SECRET as string;
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user: { id: number; password: string; } | undefined) => {

    if (err) return res.status(500).json({ message: "Error on the server." });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null, message: "Password not valid" });

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).json({ auth: true, token });
  });
};

export const checkLogin = (req: Request, res: Response): void => {
  const jwtSecret = process.env.JWT_SECRET as string;

  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <Token>

  if (!token) {
    res.status(403).json({ message: "No token provided." });
    return
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(500).json({ message: "Failed to authenticate token." });

    if (decoded) {
      const payload = decoded as TokenPayload;

      db.get("SELECT * FROM users WHERE id = ?", [payload.id], (err, user) => {
        if (err) return res.status(500).json({ message: "Error on the server." });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ bla: "hallo" });
      });
    }

  });
};