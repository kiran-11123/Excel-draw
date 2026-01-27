import { Response  , Request} from "express";

import { CreateRoomService } from "../services/create_room_services";

export const CreateRoomContoller = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;

   const result =  await CreateRoomService(name, user_id);

    return res.status(200).json({
      message: "Room Created Successfully",
      room_id : result
    });
  } catch (er) {
    const err = er as Error;

    if (err.message === "Room Name is Already Taken") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
