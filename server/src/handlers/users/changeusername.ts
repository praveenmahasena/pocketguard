import { Response } from "express";
import { NameChangeReq } from "../../types/types";
import connection from "../../postgres/connect";
import { decodeJWT } from "../../utils/jwt";

export default async function(req:NameChangeReq,res:Response){
    try{
    const {pocketguard_token} = req.cookies
    const {userId} = decodeJWT(pocketguard_token, process.env.JWT_KEY as string)
        await connection.query('UPDATE users SET username = $1 WHERE id = $2', [req.body.username,userId]);
        res.status(200).json({ message: 'Username updated' });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to update username' });
    }

}
