import { Request,Response } from "express";

export default function (req:Request,res:Response){
    res.clearCookie('pocketguard_token')
    res.status(200).json({ message: 'Logged out' });
}
