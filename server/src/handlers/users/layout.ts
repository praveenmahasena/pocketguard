import { Request,Response } from "express";
import { decodeJWT } from "../../utils/jwt";
import connection from "../../postgres/connect";


export default async function (req:Request,res:Response){
    const query=`SELECT id FROM users WHERE id = $1 LIMIT 1`
    const {pocketguard_token}=req.cookies
    try{
        const decoded = decodeJWT(pocketguard_token,process.env.JWT_KEY as string)
        const {rows}=await connection.query(query,[decoded.userId])
        if(rows.length!=1){
            res.clearCookie('pocketguard_token')
        }
        res.status(200).json({msg:''})
    }catch(err){
        res.clearCookie('pocketguard_token')
    }
    return
}
