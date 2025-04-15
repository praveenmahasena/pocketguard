import connection from "../../postgres/connect";
import { decodeJWT } from "../../utils/jwt";

export default async function(req,res){

  const { amount, source, category, date, notes } = req.body;
  try {
    const {pocketguard_token} = req.cookies
    const {userId} = decodeJWT(pocketguard_token, process.env.JWT_KEY as string)
    await connection.query(
      `INSERT INTO income (user_id, amount, source, category, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, amount, source, category, date, notes || null]
    );
    res.status(201).json({ message: 'Income added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add income' });
  }
}
