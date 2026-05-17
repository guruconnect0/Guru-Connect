import React, { useEffect, useRef, useState } from 'react';
import socket from '../hooks/useSocket';

function VideoSessionRoom({ booking, onEnd }) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(booking.duration * 60);
  const [showExtendModal, setShowExtendModal] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  
  // Start local video preview
  useEffect(() => {
    startLocalVideo();
    return () => {
      // Cleanup on unmount
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const startLocalVideo = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localVideoRef.current.srcObject = localStream.current;
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };
  
  // Join the room when in call
  const startCall = () => {
    socket.emit('join:room', booking.roomId);
    socket.emit('session:start', { roomId: booking.roomId });
    setIsInCall(true);
    createPeerConnection();
  };
  
  const createPeerConnection = () => {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };
    
    peerConnection.current = new RTCPeerConnection(config);
    
    // Add local tracks to connection
    localStream.current.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, localStream.current);
    });
    
    // Handle incoming remote stream
    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
    
    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc:ice-candidate', {
          roomId: booking.roomId,
          candidate: event.candidate
        });
      }
    };
    
    // Create and send offer
    peerConnection.current.createOffer().then(offer => {
      peerConnection.current.setLocalDescription(offer);
      socket.emit('webrtc:offer', {
        roomId: booking.roomId,
        offer: offer
      });
    });
  };
  
  // Handle incoming WebRTC events
  useEffect(() => {
    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleIceCandidate);
    socket.on('session:extend-request', handleExtendRequest);
    
    return () => {
      socket.off('webrtc:offer', handleOffer);
      socket.off('webrtc:answer', handleAnswer);
      socket.off('webrtc:ice-candidate', handleIceCandidate);
      socket.off('session:extend-request', handleExtendRequest);
    };
  }, []);
  
  const handleOffer = async (data) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit('webrtc:answer', {
      roomId: booking.roomId,
      answer: answer
    });
  };
  
  const handleAnswer = async (data) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
  };
  
  const handleIceCandidate = async (data) => {
    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  };
  
  const handleExtendRequest = (data) => {
    setShowExtendModal(true);
  };
  
  // Timer countdown
  useEffect(() => {
    if (!isInCall) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowExtendModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isInCall]);
  
  const toggleMute = () => {
    localStream.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };
  
  const toggleVideo = () => {
    localStream.current.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff(!isVideoOff);
  };
  
  const endCall = () => {
    socket.emit('session:end', { 
      roomId: booking.roomId,
      actualDuration: booking.duration * 60 - timeRemaining
    });
    socket.emit('leave:room', booking.roomId);
    setIsInCall(false);
    onEnd();
  };
  
  const acceptExtension = (minutes) => {
    socket.emit('session:extend-accepted', { 
      roomId: booking.roomId,
      minutes 
    });
    setTimeRemaining(prev => prev + minutes * 60);
    setShowExtendModal(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="video-room">
      <div className="video-container">
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className="local-video"
        />
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className="remote-video"
        />
        
        {/* Timer Display */}
        {isInCall && (
          <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="controls">
        {!isInCall ? (
          <button onClick={startCall} className="start-btn">
            Start Session
          </button>
        ) : (
          <>
            <button onClick={toggleMute} className={isMuted ? 'off' : ''}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button onClick={toggleVideo} className={isVideoOff ? 'off' : ''}>
              {isVideoOff ? 'Start Video' : 'Stop Video'}
            </button>
            <button onClick={endCall} className="end-btn">
              End Call
            </button>
          </>
        )}
      </div>
      
      {/* Extension Modal */}
      {showExtendModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Time's Up!</h3>
            <p>Would you like to extend the session?</p>
            <p>Cost: ₹10 per minute</p>
            <div className="extension-options">
              <button onClick={() => acceptExtension(15)}>Extend 15 min (+₹150)</button>
              <button onClick={() => acceptExtension(30)}>Extend 30 min (+₹300)</button>
              <button onClick={() => acceptExtension(60)}>Extend 60 min (+₹600)</button>
              <button onClick={endCall}>End Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoSessionRoom;
