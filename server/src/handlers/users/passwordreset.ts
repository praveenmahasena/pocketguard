import { Response } from "express";
import { PasswordReq } from "../../types/types";
import connection from "../../postgres/connect";
import bcrypt from 'bcrypt';
import { decodeJWT } from "../../utils/jwt";

export default async function (req:PasswordReq,res:Response){
  const { currentPassword, newPassword } = req.body;

  try {
    const {pocketguard_token} = req.cookies
    const {userId} = decodeJWT(pocketguard_token, process.env.JWT_KEY as string)
    const user = await connection.query('SELECT password_hash FROM users WHERE id = $1', [
      userId,
    ]);
    const valid = await bcrypt.compare(
      currentPassword,
      user.rows[0].password_hash
    );
    if (!valid) return res.status(401).json({ message: 'Incorrect current password' });

    const newHash = await bcrypt.hash(newPassword, 12);
    await connection.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      newHash,
      userId,
    ]);
    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update password' });
  }
}
