import { Request,Response } from "express";
import bcrypt from 'bcrypt';
import connection from "../../postgres/connect";
import jwt from 'jsonwebtoken';

interface userLogin extends Request{
    body:{
        email:string;
        password:string
    }
}

export default async function(req: userLogin, res: Response){
    const { email, password } = req.body;
    console.log('came?')

    if (!email || !password) {
        res.status(400).json({
            error: 'Email and password are required'
        });
        return
    }

    try {
        const userQuery = await connection.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (userQuery.rows.length === 0) {
            res.status(401).json({
                error: 'Invalid email or password'
            });
            return
        }

        const user = userQuery.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            res.status(401).json({
                error: 'Invalid email or password'
            });
            return
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_KEY as string,
            { expiresIn: '30d' }
        );

        res.cookie('pocketguard_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email
            }
        });
        return
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Something went wrong during login'
        });
    }
}
