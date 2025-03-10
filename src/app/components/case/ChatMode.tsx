import React, { useEffect, useRef } from "react";

type Message = {
  sender: string;
  text: string;
};

type ChatModeProps = {
  patientName: string;
  messages: Message[];
  inputText: string;
  options: string[];
  chatStarted: boolean;
  onSendMessage: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionSelect: (option: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ChatMode: React.FC<ChatModeProps> = ({
  patientName,
  messages,
  inputText,
  options,
  chatStarted,
  onSendMessage,
  onInputChange,
  onOptionSelect,
  onKeyPress,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      {!chatStarted && (
        <div className="flex flex-col gap-2 mt-4">
          {options.map((option, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              onClick={() => onOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {chatStarted && (
        <div className="flex flex-col gap-3 border-t pt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg p-2"
              placeholder="Type a message..."
              value={inputText}
              onChange={onInputChange}
              onKeyPress={onKeyPress}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              onClick={onSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMode;
