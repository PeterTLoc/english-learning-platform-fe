"use client";
import AiService from "@/services/aiService";
import { AxiosError } from "axios";
import React, { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const aiService = new AiService();
export default function TutorModal({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const [messages, setMessages] = useState([
    {
      from: "tutor",
      text: "Hello! I'm your English tutor. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearMessages = () => {
    setMessages([
      {
        from: "tutor",
        text: "Hello! I'm your English tutor. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    try {
      setInput("");
      setIsTyping(true);
      if (!input.trim()) return;

      setMessages((msgs) => [
        ...msgs,
        { from: "user", text: input, timestamp: new Date() },
      ]);

      const response = await aiService.askTutor(input);
      console.log(response);
      setMessages((msgs) => [
        ...msgs,
        { from: "tutor", text: response.response, timestamp: new Date() },
      ]);

      setIsTyping(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response.status === 402) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "tutor",
            text: error.response.data.message,
            timestamp: new Date(),
          },
        ]);
      } else
        setMessages((msgs) => [
          ...msgs,
          {
            from: "tutor",
            text: "Sorry, I'm having trouble answering your question. Please try again later.",
            timestamp: new Date(),
          },
        ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[95vw] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-cyan-400/30 flex flex-col backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300 max-h-[60vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-2xl border-b border-cyan-400/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-pulse"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          <span className="font-bold text-lg text-white drop-shadow-lg">
            English Tutor
          </span>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={handleClearMessages}
            disabled={messages.length <= 1 || isTyping}
            className="text-white/70 hover:text-white disabled:text-white/30 text-sm transition-all duration-200 hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed"
            aria-label="Clear all messages"
            title="Clear conversation"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white text-xl font-bold transition-all duration-200 hover:scale-110"
            aria-label="Minimize chat"
          >
            {isMinimized ? "□" : "−"}
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold transition-all duration-200 hover:scale-110 hover:rotate-90"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages Container */}
      {!isMinimized && (
        <div className="flex flex-col">
          <div
            className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-400/30 scrollbar-track-transparent"
            style={{ minHeight: 250, maxHeight: 400 }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in-50 slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                      : "bg-gradient-to-r from-slate-700 to-slate-600 text-white border border-slate-500/30 shadow-lg"
                  }`}
                >
                  <div className="mb-1">
                    <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
                  </div>
                  <div
                    className={`text-xs opacity-70 ${
                      msg.from === "user" ? "text-cyan-100" : "text-slate-300"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in-50">
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-3 rounded-2xl border border-slate-500/30 shadow-lg">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-300 ml-2">
                      Tutor is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-600/30 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-b-2xl backdrop-blur-sm">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-xl outline-none border border-slate-600/50 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 placeholder-slate-400 backdrop-blur-sm"
                placeholder="Ask me anything about English..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  ×
                </button>
              )}
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 shadow-lg shadow-cyan-500/25 disabled:shadow-none"
              aria-label="Send message"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
