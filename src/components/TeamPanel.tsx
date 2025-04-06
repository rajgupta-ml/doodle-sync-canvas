
import { useCollaboration } from "@/context/CollaborationContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export const TeamPanel: React.FC = () => {
  const { currentUser, onlineUsers, messages, sendMessage, updateUserStatus } = useCollaboration();
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<"team" | "chat">("team");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText("");
    }
  };

  return (
    <div className="w-72 border-l bg-white h-full flex flex-col">
      <div className="border-b">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "team" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("team")}
          >
            Team
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "chat" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
        </div>
      </div>

      {activeTab === "team" ? (
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-medium mb-4">Collaborators</h3>
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "typing"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="font-medium">
                    {user.name}
                    {user.id === currentUser.id && " (You)"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.status === "typing" ? "Typing..." : "Online"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${
                  message.user.id === currentUser.id ? "mine" : "others"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{message.user.id === currentUser.id ? "You" : message.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  if (e.target.value) {
                    updateUserStatus(currentUser.id, "typing");
                  } else {
                    updateUserStatus(currentUser.id, "online");
                  }
                }}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!messageText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
