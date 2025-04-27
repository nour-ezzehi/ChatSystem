'use client'
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import io, { Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // To decode the JWT token

let socket: Socket; // Declare socket variable with proper type

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [professorId] = useState('680d69051d1046052ef522eb'); 
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    
    if (token) {
      const decodedToken: any = jwtDecode(token);
      setUserId(decodedToken.userId);
      setRole(decodedToken.role);
    } else {
      console.error("No token found");
    }

    socket = io('http://localhost:5000');

    socket.on('connect', () => {
      if (userId) {
        socket.emit('register', { userId, role });
      }
    });

    socket.on('usersUpdate', (users) => {
      setConnectedUsers(users);
    });
    socket.on('receiveMessage', (msg) => {
      console.log('Received message:', msg);
      const formattedMessage = msg.senderId === userId 
        ? `You: ${msg.content}` 
        : `Professor: ${msg.content}`;
      
      setChat((prevChat) => [...prevChat, formattedMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit('register', { userId, role });
    }
  }, [userId, role]);

  const handleSend = () => {
    if (message.trim() !== '') {
      setIsLoading(true);

      const newMessage = {
        senderId: userId,
        receiverId: professorId,
        content: message,
      };

      socket.emit('sendMessage', newMessage);
      
      setMessage('');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const startNewChat = () => {
    setChat([]);
    setMessage(''); 
  };

  const renderChatUI = () => {
    if (role === 'student') {
      return (
        <div>
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Student Dashboard</h2>
        </div>
      );
    } else if (role === 'professor') {
      return (
        <div>
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Professor Dashboard</h2>
        </div>
      );
    } else {
      return <p>Loading...</p>;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start mb-6">
        Student Dashboard

        <div className="flex space-x-3">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            New Chat
            <PlusIcon className="h-5 w-5 text-white" />
          </button>

          <Link
            href="/signin"
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Logout
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>

      {connectedUsers.length > 0 && (
        <div className="mb-4 text-sm text-gray-500">
          {role === 'professor' 
            ? `${connectedUsers.length} student(s) online` 
            : `Professor ${connectedUsers.includes(professorId) ? 'online' : 'offline'}`
          }
        </div>
      )}

      <div className="bg-gradient-to-b from-white via-blue-50 to-white border rounded-xl shadow-md p-4 mb-4 overflow-y-auto space-y-4" style={{ height: '500px' }}>
        {chat.map((line, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg break-words ${
              line.startsWith('You:') ? 'bg-blue-100 ml-auto max-w-[60%]' : 'bg-gray-100 mr-auto max-w-[60%]'
            }`}
          >
            {line}
          </div>
        ))}
      </div>
      <div className="flex space-x-2 p-4 border-t">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            'Sending...'
          ) : (
            <>
              Send
              <PaperAirplaneIcon className="h-5 w-5 text-white transform rotate-90" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}