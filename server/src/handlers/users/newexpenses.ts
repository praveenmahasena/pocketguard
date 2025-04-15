import connection from "../../postgres/connect";
import { Response } from "express";
import { decodeJWT } from "../../utils/jwt";
import { NewExpencesReq } from "../../types/types";

export default async function(req:NewExpencesReq,res:Response){
  try {
    const {pocketguard_token} = req.cookies
    const {userId} = decodeJWT(pocketguard_token, process.env.JWT_KEY as string)
    const { amount, place, expense_type, date, time } = req.body;

    if (!amount || !expense_type || !date || !time) {
       res.status(400).json({ error: 'Missing required fields' });
        return
    }

    if (parseInt(amount) <= 0) {
       res.status(400).json({ error: 'Amount must be a positive number' });
            return
    }

    const validTypes = ['food', 'transport', 'housing', 'utilities', 'entertainment', 'shopping', 'health', 'other'];
    if (!validTypes.includes(expense_type.toLowerCase())) {
       res.status(400).json({ error: 'Invalid expense type' });
            return
    }

    if (!Date.parse(date)) {
       res.status(400).json({ error: 'Invalid date format' });
            return
    }

    const query = `
      INSERT INTO expenses
        (user_id, amount, place, expense_type, date, time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        expense_id,
        amount::numeric AS amount,
        place,
        expense_type,
        date,
        time
    `;

    const { rows } = await connection.query(query, [
      userId,
      amount,
      place,
      expense_type,
      date,
      time
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};
