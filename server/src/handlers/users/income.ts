import connection from "../../postgres/connect";
import { decodeJWT } from "../../utils/jwt";

// routes/income.ts
export default async function(req,res){

    try {
        const {pocketguard_token} = req.cookies
        const {userId} = decodeJWT(pocketguard_token, process.env.JWT_KEY as string)

        const result = await connection.query(
            'SELECT * FROM income WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching income data' });
    }
}
