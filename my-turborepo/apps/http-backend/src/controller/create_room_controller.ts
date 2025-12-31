import { Response , Request } from "express";
import { CreateRoomService } from "../services/create_room_services";
import { AuthRequest } from "../middleware";

interface CreateRoomBody {
  name: string;
}

export const CreateRoomContoller = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body as CreateRoomBody;

    const user_id = (req as AuthRequest).user.user_id;

    await CreateRoomService(name, user_id);

    return res.status(200).json({
      message: "Room Created Successfully"
    });
  } catch (er) {
    const err = er as Error;

    if (err.message === "Room Name is Already Taken") {
      return res.status(400).json({
        message: err.message
      });
    }

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
