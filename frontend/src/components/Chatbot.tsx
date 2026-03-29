"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào! 👋 Tôi là trợ lý AI Yu Ling Store. Bạn cần tôi giúp gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Gửi kèm history (bỏ welcome) để AI nhớ ngữ cảnh
      const history = messages.filter((m) => m.id !== "welcome");
      const { data } = await api.post("/chat", {
        message: text.trim(),
        history,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.success ? data.data.text : "😅 Lỗi kết nối, thử lại nhé!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "😅 Không thể kết nối AI lúc này. Thử lại sau!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Nút mở/đóng */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#FE979B] to-[#FEAE97] shadow-lg flex items-center justify-center text-white text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? "✕" : "💬"}
      </motion.button>

      {/* Cửa sổ chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3E3C6E] to-[#FE979B] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🎨
              </div>
              <div>
                <p className="font-bold">Yu Ling AI Assistant</p>
                <p className="text-xs opacity-80">Powered by Gemini</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#FE979B] to-[#FEAE97] text-white"
                        : "bg-white shadow text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow flex gap-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="p-3 border-t flex gap-2 bg-white"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhắn tin..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FE979B] text-gray-900"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-[#FE979B] to-[#FEAE97] text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                Gửi
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
