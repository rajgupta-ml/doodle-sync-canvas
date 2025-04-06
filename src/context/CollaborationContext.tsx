
import React, { createContext, useContext, useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { User, currentUser, teamMembers, allUsers } from "@/lib/user";

interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

interface CollaborationContextType {
  currentUser: User;
  onlineUsers: User[];
  messages: Message[];
  sendMessage: (text: string) => void;
  updateUserStatus: (userId: string, status: User["status"]) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>(allUsers);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: teamMembers[0],
      text: "Let's start with the header section",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "2",
      user: currentUser,
      text: "Good idea! I'll work on that",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);

  useEffect(() => {
    // Here we would connect to the socket and listen for events
    socket.connect();
    
    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      user: currentUser,
      text,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    
    // In a real app, you would emit this to the socket
    socket.emit("send-message", newMessage);
  };

  const updateUserStatus = (userId: string, status: User["status"]) => {
    setOnlineUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId
          ? { ...user, status }
          : user
      )
    );
    
    // In a real app, you would emit this to the socket
    socket.emit("update-status", { userId, status });
  };

  return (
    <CollaborationContext.Provider
      value={{
        currentUser,
        onlineUsers,
        messages,
        sendMessage,
        updateUserStatus,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error("useCollaboration must be used within a CollaborationProvider");
  }
  return context;
};
