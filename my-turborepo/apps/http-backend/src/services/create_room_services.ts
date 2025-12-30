import { prisma } from "@repo/db/prisma";


export const CreateRoomService = async(name :string)=>{
      
    try{

        const find_room = await prisma.room.findUnique({
             where:{
                name
             }
        })

        if(find_room){
            throw new Error("Room Name is Already Taken")
        }

        await prisma.room.create({
            data:{
                name :name
            }
        })

        



    }
    catch(er){
         throw er;
    }
}