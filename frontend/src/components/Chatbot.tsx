"use client";
import { useReducer, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
}

type ChatState = {
  open: boolean;
  messages: ChatMessage[];
  draft: string;
  busy: boolean;
};

type ChatAction =
  | { type: "TOGGLE" }
  | { type: "SET_DRAFT"; value: string }
  | { type: "PUSH_USER"; text: string }
  | { type: "PUSH_BOT"; text: string };

const WELCOME: ChatMessage = {
  id: "init",
  role: "bot",
  content: "Xin chao! Toi la tro ly AI Yu Ling Store. Ban can toi giup gi?",
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, open: !state.open };
    case "SET_DRAFT":
      return { ...state, draft: action.value };
    case "PUSH_USER":
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: `u-${Date.now()}`, role: "user", content: action.text },
        ],
        draft: "",
        busy: true,
      };
    case "PUSH_BOT":
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: `b-${Date.now()}`, role: "bot", content: action.text },
        ],
        busy: false,
      };
  }
}

export default function Chatbot() {
  const [state, dispatch] = useReducer(chatReducer, {
    open: false,
    messages: [WELCOME],
    draft: "",
    busy: false,
  });
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || state.busy) return;
    dispatch({ type: "PUSH_USER", text });
    try {
      const history = state.messages.filter((m) => m.id !== "init");
      const { data } = await api.post("/chat", { message: text.trim(), history });
      dispatch({
        type: "PUSH_BOT",
        text: data.success ? data.data.text : "Loi ket noi, thu lai nhe!",
      });
    } catch {
      dispatch({
        type: "PUSH_BOT",
        text: "Khong the ket noi AI luc nay. Thu lai sau!",
      });
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => dispatch({ type: "TOGGLE" })}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#3E3C6E] to-[#FE979B] shadow-xl flex items-center justify-center text-white text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={state.open ? "Dong chat" : "Mo chat"}
      >
        {state.open ? "X" : "Chat"}
      </motion.button>

      {/* Chat panel — slides in from the right */}
      <AnimatePresence>
        {state.open && (
          <motion.section
            role="dialog"
            aria-label="Chat voi Yu Ling AI"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 h-[70vh] sm:h-[560px] max-h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <header className="bg-gradient-to-r from-[#3E3C6E] to-[#FE979B] text-white px-4 py-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">
                AI
              </span>
              <div>
                <p className="font-semibold text-sm leading-none">
                  Yu Ling AI Assistant
                </p>
                <p className="text-xs opacity-75 mt-0.5">Powered by Gemini</p>
              </div>
            </header>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              {state.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#FE979B] to-[#FEAE97] text-white"
                        : "bg-white shadow-sm text-gray-700"
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              ))}

              {/* Pulsing typing indicator */}
              {state.busy && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={anchorRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(state.draft);
              }}
              className="px-3 py-2 border-t border-gray-100 flex gap-2 bg-white"
            >
              <input
                value={state.draft}
                onChange={(e) =>
                  dispatch({ type: "SET_DRAFT", value: e.target.value })
                }
                placeholder="Nhan tin voi Yu Ling AI..."
                disabled={state.busy}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FE979B]/60 text-gray-800 disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={state.busy || !state.draft.trim()}
                className="bg-gradient-to-br from-[#FE979B] to-[#FEAE97] text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity"
              >
                Gui
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
