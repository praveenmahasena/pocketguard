import {NextFunction, Response} from "express";
import { ReqWithToken } from "../types/types";


// I don't like doing this way but meh okay for now

export function userMiddleware(req: ReqWithToken, res: Response, next: NextFunction) {
  const {pocketguard_token} = req.cookies
  if (pocketguard_token) {
        next()
        return //
  }
  res.status(401).json({message : 'Unauthorized'});
  // also it's gonna be hanging
  // help me with a good idea
}
