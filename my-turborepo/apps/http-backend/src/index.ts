import express from 'express'
import cors from 'cors'
import Create_Room_Router from './routes/create-room';
import Auth_Router from './routes/auth_routes';
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser())

app.use("/api/users" , Auth_Router);
app.use("/api/room" , Create_Room_Router)








app.listen(5000 , ()=>{
    console.log("Http Server is running")
})