import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") return null;
    if (!(decoded as JwtPayload).user_id) return null;

    return (decoded as JwtPayload).user_id as string;
  } catch (er) {
    return null;
  }
}

interface User_interface {
  ws: WebSocket;
  rooms: string[];
  users: string;
}

const users: User_interface[] = [];

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded_user_id = checkUser(token);
  if (!decoded_user_id) {
    ws.close();
    return;
  }

  users.push({
    users: decoded_user_id,
    rooms: [],
    ws,
  });

  ws.on("message", (data: string) => {
    let parsedData;

    try {
      parsedData = JSON.parse(data.toString());
    } catch (err) {
      console.log("Invalid JSON:", data.toString());
      return;
    }

    if (parsedData.type === "join_room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return;

      if (!user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return;

      user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            })
          );
        }
      });
    }
  });
});
