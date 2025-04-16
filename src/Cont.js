import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const socketContext= createContext();

export default function Cont(props) {

  const [remoteStream, setRemoteStream]=useState(null);

    const peer= useMemo(()=>new RTCPeerConnection({
      iceServers:[// in this peer we are sending req to turn server and getting our information.
        {
          urls:[
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478"
          ]
        }
      ]
    }),[]);
    // request to turn server to get their public information 

    const createOfferr=async()=>{ 
      //in this basically we are creating the offer which helps to join the other peer
      const offer=await peer.createOffer();
      await peer.setLocalDescription(offer);// remember our local state
      return offer;
    }

    const createAnswerr=async(offer)=>{ // it is created to send the answer to the request
      await peer.setRemoteDescription(offer);
      const ans=await peer.createAnswer();
      await peer.setLocalDescription(ans);
      return ans;
    }

    const setRemoteAns=async(ans)=>{// it is used to store the answer
      await peer.setRemoteDescription(ans);
    }

    const sendStream = async(stream)=>{ // it will take all the tracks and send it to the peers
      const tracks = stream.getTracks();
      console.log("track",tracks);
      
      const senders = peer.getSenders();//chatg
      for(const track of tracks){// this track include all the parameters that we gave(eg. audio, video)
        const existingSender = senders.find(sender => sender.track === track);//chatg

        if (existingSender) {
          // Optional: remove existing track
          peer.removeTrack(existingSender);//chatg
        }
        peer.addTrack(track, stream);
      }
    };

    const handleTrackEvent = useCallback((event)=>{
      const stream = event.streams;//there can be multiple streams like audio,video etc
      console.log("stream:",stream);
      setRemoteStream(stream[0]);
    },[])


    useEffect(()=>{
      peer.addEventListener('track',handleTrackEvent); //create a function for good practice

      return ()=>{
        peer.removeEventListener('track',handleTrackEvent);
      }
    },[peer, handleTrackEvent]);

  return (
    <socketContext.Provider value={{peer, createOfferr, createAnswerr, setRemoteAns, sendStream, remoteStream}}>
      {props.children}
    </socketContext.Provider>
  )
}
