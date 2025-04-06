
import { io } from "socket.io-client";

// For local development mode, we'll use a mock socket
// In a real app, you would connect to your real socket server
export const socket = {
  on: (event: string, callback: (...args: any[]) => void) => {
    console.log(`Socket would listen to: ${event}`);
    return {
      off: () => console.log(`Socket would stop listening to: ${event}`)
    };
  },
  emit: (event: string, ...args: any[]) => {
    console.log(`Socket would emit: ${event}`, args);
  },
  connect: () => {
    console.log("Socket would connect");
  },
  disconnect: () => {
    console.log("Socket would disconnect");
  }
};

// Comment this in when you have a real socket server
// export const socket = io("https://your-socket-server.com");
