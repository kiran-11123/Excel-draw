import { CreateRoomService } from "../services/create_room_services";
import { Request , Response } from "express";

export const CreateRoomContoller = async(req:Request , res:Response)=>{
       
    try{

        const {name}  = req.body

        const result  =CreateRoomService(name);

        return res.status(200).json({
            message : "Room Created Successfully"
        })

    }
    catch(er){
        const err = er as Error;

        if(err.message === "Room Name is Already Taken"){
            return res.status(400).json({
                message : "Room Name is Already Taken"
            })
        }
        return res.status(500).json({
            message : "Internal Server Error"
        })

    }
}