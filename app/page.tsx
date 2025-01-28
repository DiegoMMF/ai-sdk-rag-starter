/* eslint-disable @next/next/no-img-element */
"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

/* 
The useChat hook enables the streaming of chat messages from your AI provider, 
manages the state for chat input, and updates the UI automatically as new messages 
are received.
*/

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: "/ai-assistant/api/chat",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Se ejecuta cada vez que cambia messages

  useEffect(() => {
    // Solo agregamos el mensaje de bienvenida si no hay mensajes
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-message",
          content: "¡Hola Luciano!\nMi nombre es Sophia y soy tu Asistente Inteligente de Recursos Humanos.",
          role: "assistant"
        }
      ]);
    }
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[503px] h-[715px] bg-gradient-to-tr from-[#18F2F3] to-[#1374C5] rounded-[20px] overflow-hidden relative flex flex-col justify-between items-start">
        {/* Círculos decorativos */}
        <div className="w-[227px] h-[227px] absolute -right-[50px] -top-[50px] bg-white/10 rounded-full" />
        <div className="w-[407px] h-[407px] absolute -left-[200px] -bottom-[200px] bg-white/10 rounded-full" />
        <div className="w-[147px] h-[147px] absolute -right-[50px] bottom-[100px] bg-white/10 rounded-full" />

        {/* Contenido principal */}
        <div className="w-full pt-[60px] pb-10 px-10 flex flex-col justify-center items-start gap-[35px] relative z-10">
          <div className="w-full flex justify-center items-center gap-2.5">
            <img
              className="w-[149px] h-[149px] rounded-full"
              src="/sophia-avatar.png"
              alt="Sophia AI Assistant"
            />
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-5">
            <div className="px-3 py-[7px] bg-white/10 rounded-[64px] border-[1.43px] border-white/60">
              <div className="flex justify-start items-center gap-[7.63px]">
                <div className="text-white text-[14px] font-semibold leading-[15.82px] font-['Proxima_Nova_Alt']">
                  AI - HR Assistant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes del chat */}
          <div className="w-full px-10 flex-1 overflow-y-auto scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-4 pb-4">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`
                  flex flex-col
                  ${m.role === "user" ? "items-end" : "items-start"}
                  w-full
                `}
              >
                <div 
                  className={`
                    rounded-lg p-4 text-white inline-block
                    max-w-[90%]
                    ${m.role === "user" 
                      ? "bg-white/20" 
                      : "bg-white/10"
                    }
                  `}
                >
                  <div className={`font-bold mb-1 ${m.role === "user" ? "text-right" : "text-left"}`}>
                    {m.role === "user" ? "Tú" : "AI - HR Assistant (Sophia)"}
                  </div>
                  <p className={`whitespace-pre-wrap ${m.role === "user" ? "text-right" : "text-left"}`}>
                    {m.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

          {/* Input y sugerencias */}
        <div className="w-full px-10 pb-8 flex flex-col gap-2 relative z-10">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative w-full">
              <input
                className="w-full h-[58px] px-5 py-2.5 bg-white rounded-[10px] border border-[#EEEEEE] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                placeholder="Pregúntale algo a Sophia..."
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 w-[38px] h-[38px] bg-[#0057FF] rounded-full flex items-center justify-center"
              >
                <svg
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.4375 10.02H18.5625"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.375 4.38L18.5625 10.02L12.375 15.66"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Botón de cerrar */}
        <button className="absolute top-5 right-5 w-10 h-10 text-white cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
