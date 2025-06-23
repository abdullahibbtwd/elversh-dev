"use client"
import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const NAME = "admin";



interface ChatMessage {
  _id?: string;
  from: string;
  to: string;
  message: string;
  fromName?: string;
  fromImage?: string;
  timestamp?: number;
}

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(false); // for mobile
  const [chatInput, setChatInput] = useState("");
  const sendMessage = useMutation(api.chat.sendMessage);

  // Fetch all users
  const users = useQuery(api.users.getAllUsers);

  // Fetch chat history with the selected user
  const chatHistory = useQuery(
    api.chat.getChat,
    selectedUser ? { userId: selectedUser } : "skip"
  );

  // Build userId -> user map
  const userMap = React.useMemo(() => {
    const map: Record<string, { name?: string; imageUrl?: string }> = {};
    users?.forEach(u => {
      map[u.clerkUserId] = { name: u.name, imageUrl: u.imageUrl };
    });
    return map;
  }, [users]);

 
  const allChats = useQuery(api.chat.getAllChats);
  const uniqueUserIds = users?.map(u => u.clerkUserId) ?? [];

  console.log('allChats:', allChats);
  console.log('uniqueUserIds:', uniqueUserIds);
  console.log('userMap:', userMap);
  
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedUser) return;
    await sendMessage({
      from: NAME,
      to: selectedUser,
      message: chatInput,
      fromName: "Admin",
     
    });
    setChatInput("");
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row rounded-xl bg-gradient-to-br from-indigo-50 to-teal-50 shadow-lg overflow-hidden dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950">
      {/* User List Sidebar */}
      <div className={`lg:w-1/3 w-full lg:block ${showUserList ? '' : 'hidden'} lg:!block bg-gradient-to-br from-blue-50 to-purple-50 border-r border-gray-200 dark:border-gray-800 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-950`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 dark:text-gray-200 font-bold text-lg">Users</div>
        <ul>
          {uniqueUserIds.length === 0 && <li className="px-4 py-3 text-gray-400">No users yet</li>}
          {uniqueUserIds.map(userId => (
            <li
              key={userId}
              className={`cursor-pointer px-4 py-3 border-b text-gray-800 dark:text-gray-200 border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                userId === selectedUser ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''
              }`}
              onClick={() => {
                setSelectedUser(userId);
                setShowUserList(false);
              }}
            >
              {userMap[userId]?.name || userId}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between gap-1  bg-gradient-to-r from-blue-500 to-purple-600 dark:bg-gray-800 text-white px-6">
          <div>
            <h1 className="text-lg font-medium tracking-tight">Elversh dev Chat</h1>
            <p className="font-light">
              Chatting as <strong className="font-medium ml-1">{NAME}</strong> with <strong>{selectedUser ? (userMap[selectedUser]?.name || selectedUser) : "-"}</strong>
            </p>
          </div>
          <button
            className="lg:hidden p-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            onClick={() => setShowUserList(!showUserList)}
          >
            {showUserList ? 'Close' : 'Users'}
          </button>
        </header>

        {selectedUser ? (
          <>
            {/* Messages - Scrollable Area */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
              <div className="max-w-md mx-auto">
                {chatHistory && chatHistory.length > 0 ? (
                  (chatHistory as ChatMessage[]).map((message) => (
                    <article
                      key={message._id || message.timestamp}
                      className={`my-6 grid grid-cols-1 gap-1 max-w-[380px] mx-auto px-4 ${
                        message.from === NAME ? "ml-auto self-end text-right" : "mr-auto self-start text-left"
                      }`}
                    >
                      <div className={
                        message.from === NAME
                          ? "text-right text-[#121212] dark:text-[#E0E0E0]"
                          : "text-left text-[#121212] dark:text-[#E0E0E0]"
                      }>
                        {message.from === NAME
                          ? "Admin"
                          : userMap[message.from]?.name || message.from}
                      </div>
                      <p
                        className={`p-5 rounded-2xl flex gap-2 w-2/3 flex-col shadow-sm ${
                          message.from === NAME
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-gray-100 rounded-br-none ml-auto self-end text-right"
                            : "bg-gradient-to-r from-blue-900 to-purple-900 text-gray-100 dark:text-gray-200 rounded-bl-none mr-auto self-start text-left"
                        }`}
                      >
                        {message.message}
                        {message.timestamp && (
                          <span className='text-xs text-gray-300'> {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="text-center text-gray-400 mt-8">No messages yet.</div>
                )}
              </div>
            </div>

            {/* Message Form */}
            <form
              className="h-18 flex-shrink-0 mx-4 mb-4 rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-700/80 backdrop-blur-lg flex items-center px-2"
              onSubmit={handleSend}
            >
              <input
                className="w-full bg-transparent text-gray-900 dark:text-white text-lg py-4 pl-5 pr-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={`Message ${selectedUser ? (userMap[selectedUser]?.name || selectedUser) : "user"}…`}
                autoFocus
                disabled={!selectedUser}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || !selectedUser}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#888888] dark:bg-gray-800 disabled:opacity-70"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='white' %3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' /%3E%3C/svg%3E%0A")`,
                  backgroundSize: "24px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <span className="sr-only">Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;