import React, { createContext, useMemo } from 'react'


export const socketContext= createContext();
export default function Cont(props) {
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

    const createAnswerr=async(offer)=>{
      await peer.setRemoteDescription(offer);
      const ans=await peer.createAnswer();
      await peer.setLocalDescription(ans);
      return ans;
    }

    const setRemoteAns=async(ans)=>{
      await peer.setRemoteDescription(ans);
    }


  return (
    <socketContext.Provider value={{peer, createOfferr, createAnswerr, setRemoteAns}}>
      {props.children}
    </socketContext.Provider>
  )
}
