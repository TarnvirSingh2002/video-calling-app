import React, { useContext, useEffect, useState } from "react";
import { context } from "../index.js";
import { useNavigate } from "react-router-dom";
const Home=()=>{
    const{socket}=useContext(context);

    const navigate=useNavigate();

    useEffect(()=>{
        socket.on("joined-room",({roomId})=>{
            navigate(`/room/${roomId}`);
        })
        
        return ()=>{
            socket.off("joined-room");
        }
    },[socket,navigate]);

    const [state,setState] = useState({
        email:"",
        roomId:""
    })
    const handleChange=(e)=>{
        setState((pre)=>({...pre,[e.target.name]:e.target.value}));
    }
    const handleClick=(e)=>{
        e.preventDefault();
        const {email,roomId} =state;
        socket.emit("join-room",{email,roomId});
    } 
    return(
    <div className="all">
    <form className="center" onSubmit={handleClick}>
        <input name="email" onChange={handleChange} value={state.email} type="email" placeholder="Enter your email Id" />
        <input name="roomId" onChange={handleChange} value={state.roomId} type="text" placeholder="Enter your Room number" />
        <button type="submit">Click me</button>
    </form>
    </div>);
}
export default Home;