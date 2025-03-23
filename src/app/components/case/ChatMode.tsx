import React, { useEffect, useRef, useState } from "react";

type Message = {
  sender: string;
  text: string;
};

type ChatModeProps = {
  patientName: string;
  messages: Message[];
  inputText: string;
  onSendMessage: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ChatMode: React.FC<ChatModeProps> = ({
  patientName,
  messages,
  inputText,
  onSendMessage,
  onInputChange,
  onKeyPress,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="bg-gray-100 p-4 rounded-lg text-black flex-1 overflow-y-auto space-y-3">
        <p className="font-bold text-blue-600">{patientName}</p>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-2xl max-w-[75%] w-fit ${
              msg.sender === "patient"
                ? "bg-gray-200 text-left self-start hover:bg-gray-300"
                : "bg-blue-500 text-white self-end hover:bg-blue-600"
            }`}
            style={{
              alignSelf: msg.sender === "student" ? "flex-end" : "flex-start",
              marginLeft: msg.sender === "student" ? "auto" : "0",
              marginRight: msg.sender === "student" ? "0" : "auto",
              textAlign: msg.sender === "student" ? "right" : "left",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-3 border-t pt-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2"
            placeholder="Type a message..."
            value={inputText}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            {...(isMounted ? {} : { "data-has-listeners": "true" })}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            onClick={onSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatMode;
