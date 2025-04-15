// src/controllers/auth.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import connection from '../../postgres/connect';
import jwt from 'jsonwebtoken';

export default async function(req: Request, res: Response){
  const { email, password,username } = req.body;
//  const JWT_SECRET = process.env.JWT_KEY
    console.log(req.body)

   if (!email || !password ||!username) {
      res.status(400).json({
       success: false,
       error: 'Email and password are required'
     });
             return
   }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
     res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
            return
  }

  if (password.length < 8) {
     res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters'
    });
        return
  }

  try {
    const existingUser = await connection.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
       res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
            return
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await connection.query(
      `INSERT INTO users (email, password_hash ,username)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [email, hashedPassword,username]
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_KEY as string,
      { expiresIn: '7d' }
    );

     res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
     res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
};
