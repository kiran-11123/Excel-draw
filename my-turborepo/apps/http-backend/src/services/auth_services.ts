import {JWT_SECRET} from "@repo/backend-common/config"
import {prisma} from "@repo/db/prisma"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const SigninService = async(email:string , password:string)=>{
    
    try{

        const find_user  =await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!find_user){
              throw new Error("Email not found")
        }

        const password_check = await bcrypt.compare(password , find_user.password);

        if(!password_check){
            throw new Error("Password is Wrong")
        }
       
        const token_details = {user_id : find_user.userId , user_name : find_user.username , email  :find_user.email }

        console.log("jwt secret in backend : " , JWT_SECRET);

        const token = jwt.sign(token_details , JWT_SECRET ,{expiresIn : "7d"})
        
        

        return token 




    }
    catch(er){
         throw er;
    }
}

export const SignupService = async(email :string , username:string , password:string)=>{

    try{

        const find_user  =await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(find_user){
              throw new Error("Email already registered")
        }

        const username_check = await prisma.user.findUnique({
            where:{
                username
            }
        })

        if(username_check){
             throw new Error("Username already taken")
        }
        const hash_password = await bcrypt.hash(password , 10);

          await prisma.user.create({
            data: {
                email,
                username,
                password: hash_password
            }
        });

    


    }
    catch(er){
         throw er;
    }
        
}