import React, { useContext, useEffect, useCallback } from 'react';
import {socketContext} from '../Cont.js';
import { context } from '../index.js'

export default function Room() {

    const {socket} = useContext(context);
    const { createOfferr, createAnswerr, setRemoteAns} = useContext(socketContext);

    const handleJoin=useCallback(async(data)=>{//handlejoin
      const {email}=data;
      console.log("user-joined",email);

      const offer = await createOfferr();
      socket.emit('call-user',{email, offer});
    },[createOfferr,socket]);


    const handleIncomming=useCallback(async(data)=>{//handle incomming
      const {from, offer} = data;
      console.log(from,"   ",offer);
      const ans=await createAnswerr(offer);
      socket.emit("call-accepted",{email:from, ans});
    },[socket, createAnswerr]);


    const handleCallAccept=useCallback(async({ans})=>{//when call is accepted
      console.log("call got accepted");
      await setRemoteAns(ans);
    },[setRemoteAns]);

    useEffect(()=>{

      socket.on("user-joined",handleJoin);
      socket.on("incomming-call",handleIncomming);
      socket.on('call-ans',handleCallAccept);

      return ()=>{
        socket.off("user-joined",handleJoin);
        socket.off("incomming-call",handleIncomming);
        socket.off('call-ans',handleCallAccept);
      }

  },[socket,handleCallAccept,handleJoin,handleIncomming]);


  return (
    <div>
      <h1>Room is joined</h1>
    </div>
  )
}
