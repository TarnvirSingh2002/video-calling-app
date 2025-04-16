import React, { useContext, useEffect, useCallback, useState } from 'react';
import {socketContext} from '../Cont.js';
import { context } from '../index.js'
import ReactPlayer from 'react-player';

export default function Room() {

    const[myStream,setMystream]=useState(null); 
    const[remoteId, setRemoteId]=useState()
    const {socket} = useContext(context);
    const { peer, createOfferr, createAnswerr, setRemoteAns, sendStream, remoteStream} = useContext(socketContext);

    const getUserMediaStream=useCallback(async()=>{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
      setMystream(stream);
    },[]);

    const handleJoin=useCallback(async(data)=>{//handlejoin
      const {email}=data;
      console.log("user-joined",email);

      const offer = await createOfferr();
      socket.emit('call-user',{email, offer});
      setRemoteId(email);
      console.log("to",email);
    },[createOfferr,socket]);


    const handleIncomming=useCallback(async(data)=>{//handle incomming
      console.log(data);
      console.log(!data?"data require":"got the data");
      const { fromEmail, offer} = data;
      console.log("in handle incomming");
      console.log(offer);
      console.log(fromEmail);
      const ans=await createAnswerr(offer);
      socket.emit("call-accepted",{email:fromEmail, ans});
      setRemoteId(fromEmail);
      console.log("from",fromEmail);
    },[socket, createAnswerr]);


    const handleCallAccept=useCallback(async({ans})=>{//when call is accepted
      console.log("call got accepted");
      console.log(ans);
      await setRemoteAns(ans);
    },[setRemoteAns]);

    useEffect(()=>{

      socket.on("user-joined",handleJoin);
      socket.on("incoming-call",handleIncomming);
      socket.on('call-ans',handleCallAccept);

      return ()=>{
        socket.off("user-joined",handleJoin);
        socket.off("incoming-call",handleIncomming);
        socket.off('call-ans',handleCallAccept);
      }

  },[socket,handleCallAccept,handleJoin,handleIncomming]);

  useEffect(()=>{
    getUserMediaStream();
  },[getUserMediaStream]);

  const handleNegociation = useCallback(async()=>{
    console.log("nego");
    const localOffer =await peer.createOffer();
    socket.emit("call-user",{email:remoteId, offer:localOffer});
  },[peer, remoteId, socket]);

  useEffect(()=>{
    peer.addEventListener('negotiationneeded',handleNegociation);

    return()=>{
      peer.removeEventListener('negotiationneeded',handleNegociation);
    }
  },[handleNegociation,peer]);

  return (
    <div>
      <h1>Room is joined</h1>
      <h2>You are connected to {remoteId}</h2>
      <button onClick={()=>{sendStream(myStream)}}>Send my video</button>
      <ReactPlayer url={myStream} playing muted/>
      <ReactPlayer url={remoteStream} playing/>
    </div>
  )
}