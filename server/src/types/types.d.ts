import { Request,Response } from "express";


export interface ReqWithToken extends Request{
    cookies:{
        pocketguard_token:string;
        // This one is for extra auth stuff in the future V2
        token?:string;
    }
}

export interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

/* I stand with the status of everything comes into server is in byte format and when we decode it
 It's gonna be strings so yeah that's the definition for me to make all them string
 If I'm wrong yeah please correct me */
export interface NewExpencesReq extends Request{
    cookies:{
        pocketguard_token:string;
        token?:string;
    }
    body:{
        amount:string,
        place:string,
        expense_type:string,
        date:string,
        time:string
    }
}

export interface NameChangeReq extends Request{
    cookies:{
        pocketguard_token:string;
        token?:string;
    }
    body:{
        username:string;
    }
}

export interface PasswordReq extends Request{
    cookies:{
        pocketguard_token:string;
        token?:string;
    }
    body:{
        currentPassword:string;
        newPassword:string;
    }
}

