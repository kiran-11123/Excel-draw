import { Request , Response } from "express"
import { SigninService , SignupService } from "../services/auth_services"
import {CreateUserSchema  , SigninSchema  } from "@repo/common/types"

export const SigninController= async(req:Request, res:Response)=>{
     
    try{

        

        const {email , password} = req.body;

        const data = SigninSchema.safeParse(req.body);

        if(!data.success){
            return res.status(400).json({
                message : "Invalid Credentials"  
            })
        }

        

        const result = await SigninService(email  , password);
          res.cookie("token", result, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000
        });
        return res.status(200).json({
            message : "User Logged in successfully",
            token:result
        })

    }
    catch(er){
         const err = er as Error;
        if(err.message === "Email not found"){
            return res.status(400).json({
                message : "Email not found"
            })
             
        }
        else if(err.message === "Password is Wrong"){
              return res.status(400).json({
                message : "Password Wrong"
            })
        }

        return res.status(500).json({
            message : 'Internal Server Error'
        })
         
    }
}



export const SignupController = async(req:Request , res:Response)=>{

   try {
        const { email, username, password } = req.body;
        
        const data = CreateUserSchema.safeParse(req.body);

        if(!data.success){
            return res.status(400).json({
                message : "Invalid Credentials"
            })
        }
        // Call service
        const user = await SignupService(email, username, password);


        return res.status(200).json({
            message: "Registration Successful"
        });
    }
    catch (err) {

        const er = err as Error
        
         
        if (er.message === "Email already registered") {
            return res.status(400).json({ message: "Email already exists." });
        }

        if (er.message === "Username already taken") {
            return res.status(400).json({ message: "Username already taken." });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            error: er.message
        });
    }
}