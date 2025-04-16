import express from "express";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const io=new Server({
    cors:true
});

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection",(socket)=>{
    console.log("new connection");
    socket.on("join-room",(data)=>{
        const {email,roomId}=data;//console
        console.log("User",email," Joined-room",roomId);

        emailToSocketMapping.set(email, socket.id);
        socketToEmailMapping.set(socket.id, email);

        socket.join(roomId);
        socket.emit("joined-room",{roomId});
        socket.broadcast.to(roomId).emit("user-joined",{email});
    });

    socket.on('call-user',({email, offer})=>{
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(email);//
        console.log("socket id:"+socketId,"     ","email:"+email, "       ","from email:"+fromEmail
            ,"offer:",offer
        );
        socket.to(socketId).emit('incoming-call',{fromEmail:"jijiijijijij@gmail.com", offer});
    });

    socket.on("call-accepted",async({email, ans})=>{
        console.log(ans);
        const socketId=emailToSocketMapping.get(email);
        socket.to(socketId).emit('call-ans',{ans});
    })
})

io.listen(5000,()=>{
    console.log("Successfully connected!");
});