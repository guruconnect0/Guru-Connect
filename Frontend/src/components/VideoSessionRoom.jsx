import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function VideoSessionRoom({ booking, currentUserId, onSessionEnd }) {
  const { socket } = useSocket();
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(booking.duration * 60);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  // Start local video
  useEffect(() => {
    startLocalVideo();
    
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startLocalVideo = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
    } catch (err) {
      console.error('Error accessing camera/microphone:', err);
      alert('Please allow camera and microphone access');
    }
  };

  // WebRTC peer connection setup
  const createPeerConnection = () => {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnection.current = new RTCPeerConnection(config);

    // Add local tracks
    localStream.current.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc:ice-candidate', {
          roomId: booking.meetingLink,
          candidate: event.candidate
        });
      }
    };

    // Create and send offer
    peerConnection.current.createOffer().then(offer => {
      peerConnection.current.setLocalDescription(offer);
      socket.emit('webrtc:offer', {
        roomId: booking.meetingLink,
        offer: offer
      });
    });
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isInCall) return;

    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleIceCandidate);
    socket.on('session:extend-request', handleExtendRequest);
    socket.on('session:ended', handleSessionEnded);

    return () => {
      socket.off('webrtc:offer', handleOffer);
      socket.off('webrtc:answer', handleAnswer);
      socket.off('webrtc:ice-candidate', handleIceCandidate);
      socket.off('session:extend-request', handleExtendRequest);
      socket.off('session:ended', handleSessionEnded);
    };
  }, [socket, isInCall]);

  const handleOffer = async (data) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('webrtc:answer', {
        roomId: booking.meetingLink,
        answer: answer
      });
    } catch (err) {
      console.error('Error handling offer:', err);
    }
  };

  const handleAnswer = async (data) => {
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (err) {
      console.error('Error handling answer:', err);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  };

  const handleExtendRequest = (data) => {
    setShowExtendModal(true);
  };

  const handleSessionEnded = (data) => {
    alert('The other participant has ended the session');
    setIsInCall(false);
    onSessionEnd(data.actualDuration);
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

  // Start call
  const startCall = () => {
    socket.emit('join:room', booking.meetingLink);
    socket.emit('session:start', { roomId: booking.meetingLink });
    setIsInCall(true);
    createPeerConnection();
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // End call
  const endCall = () => {
    const actualDuration = booking.duration * 60 - timeRemaining;
    
    socket.emit('session:end', {
      roomId: booking.meetingLink,
      actualDuration: actualDuration
    });
    socket.emit('leave:room', booking.meetingLink);
    
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    
    setIsInCall(false);
    onSessionEnd(actualDuration);
  };

  // Extend session
  const extendSession = (minutes) => {
    socket.emit('session:extend-accepted', {
      roomId: booking.meetingLink,
      minutes: minutes
    });
    setTimeRemaining(prev => prev + minutes * 60);
    setShowExtendModal(false);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video (Big) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-900"
        />
        
        {/* Local Video (Small, Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover rounded-lg border-2 border-white shadow-lg ${
              isVideoOff ? 'bg-gray-800' : ''
            }`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <span className="text-white text-2xl">You</span>
            </div>
          )}
        </div>

        {/* Timer Display */}
        {isInCall && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white text-xl font-bold shadow-lg ${
            timeRemaining < 60 ? 'bg-red-500 animate-pulse' : 'bg-gray-800 bg-opacity-70'
          }`}>
            ⏱ {formatTime(timeRemaining)}
          </div>
        )}

        {/* Session Info */}
        <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <p className="font-bold">{booking.sessionType === 'demo' ? 'Demo Session' : 'Deep Session'}</p>
          <p className="text-sm">{booking.duration} minutes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-900">
        <div className="flex justify-center items-center gap-4">
          {!isInCall ? (
            <button
              onClick={startCall}
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg transition transform hover:scale-105"
            >
              📹 Start Session
            </button>
          ) : (
            <>
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                } text-white text-2xl`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>

              {/* Video Button */}
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                } text-white text-2xl`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? '📵' : '📹'}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 p-4 rounded-full transition text-white text-2xl"
                title="End Call"
              >
                📞
              </button>
            </>
          )}
        </div>
      </div>

      {/* Extension Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-4">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
            <p className="text-gray-600 mb-6">
              Would you like to extend your session?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Cost: <span className="font-bold text-green-600">₹10 per minute</span>
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => extendSession(15)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition"
              >
                +15 minutes (₹150)
              </button>
              <button
                onClick={() => extendSession(30)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition"
              >
                +30 minutes (₹300)
              </button>
              <button
                onClick={() => extendSession(60)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition"
              >
                +60 minutes (₹600)
              </button>
              <button
                onClick={endCall}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-bold transition"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
