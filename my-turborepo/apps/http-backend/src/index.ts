import express from 'express'
import cors from 'cors'
import Create_Room_Router from './routes/create-room';
import Auth_Router from './routes/auth_routes';
const app = express();
app.use(express.json())
app.use(cors())

app.use("/api/users" , Auth_Router);
app.use("/api/room" , Create_Room_Router)








app.listen(5000 , ()=>{
    console.log("Http Server is running")
})