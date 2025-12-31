import { prisma } from "@repo/db/prisma";


export const CreateRoomService = async(name :string , user_id : string)=>{
      
    try{

        const find_room = await prisma.room.findUnique({
            where:{
                slug : name
            }
        })

        if(find_room){
            throw new Error("Room Name is Already Taken")
        }

        await prisma.room.create({
            data:{
                slug :name,
                adminId : user_id
            }
        })

        



    }
    catch(er){
         throw er;
    }
}