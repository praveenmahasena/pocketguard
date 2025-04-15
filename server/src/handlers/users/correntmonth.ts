import connection from '../../postgres/connect';
import {decodeJWT} from '../../utils/jwt';

export default async function (req,res){
  try {
    const {pocketguard_token} = req.cookies
    const {userId} = decodeJWT(pocketguard_token,process.env.JWT_KEY as string)

    // Calculate first and last day of current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const query = `
      SELECT
        expense_id,
        amount::numeric AS amount,
        place,
        expense_type,
        date,
        time
      FROM expenses
      WHERE user_id = $1
      AND date BETWEEN $2 AND $3
      ORDER BY date DESC, time DESC
    `;

    const { rows } = await connection.query(query, [userId, firstDay, lastDay]);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};
