import { WebSocketServer, WebSocket } from "ws"
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_SECRET} from "@repo/backend-common/config"
const wss = new WebSocketServer({port : 8080})


function checkUser(token : string):string | null{

    try{

    
    const decoded = jwt.verify(token , JWT_SECRET);

     if(typeof decoded === 'string'){
        
         return null;
    }

    if(!decoded || !(decoded as JwtPayload).user_id){
       
          return null;
    }
return decoded.user_id;


    }

    catch(er){
        return null;
    }
     
}

//simplest to store the state in backend is global variable

/*
const users = [{

    userId : 1,
    rooms  :["room1" , "room2"] , 
    ws : socket
}
] 

*/

interface User_interface{
     
    ws: WebSocket,
    rooms :String[],
    users : String,
}



const users: User_interface[]   = [];




wss.on('connection', function connection(ws, request) {

      
    const url = request.url;

    if(!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]); 
    const token = queryParams.get('token') || "";   

    const decoded_user_id :string  | null  = checkUser(token);
    
    if(decoded_user_id ==null ){
        ws.close();
        return;
       
    }

    users.push({
        users : decoded_user_id ,
        rooms :[],
        ws

    })

/*
    message will be
    {

        type : "join_room",
        roomId : "1" 
    }

    */

    ws.on("message" , function message( data:string){
       

        const parsedData = JSON.parse(data as unknown as string);
       
        if(parsedData.type === 'join_room'){

             const user = users.find(u => u.ws === ws);
    if (!user) return;

    if (parsedData.type === "join_room") {
        if (!user.rooms.includes(parsedData.roomId)) {
            user.rooms.push(parsedData.roomId);
        }
    }
               }


        if(parsedData.type === 'leave_room'){
            const user = users.find(x => x.ws === ws);
            
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room);
        }

        if(parsedData.type ==='chat'){
             const roomId = parsedData.roomId;
             const message   = parsedData.message;

             users.forEach(user=>{
                 if(user.rooms.includes(roomId)){
                     user.ws.send(JSON.stringify({
                        type:"chat",
                        message : message ,
                        roomId
                     }))
                 }
             })

        }
    })

})