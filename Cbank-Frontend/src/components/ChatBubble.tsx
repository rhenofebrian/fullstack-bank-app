import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "../hooks/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingToSupport, setIsSendingToSupport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Process the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          responseText += chunk;

          // Update the assistant message as chunks arrive
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages.find(
              (m) => m.id === "temp-response"
            );

            if (lastMessage) {
              lastMessage.content = responseText;
            } else {
              newMessages.push({
                id: "temp-response",
                role: "assistant",
                content: responseText,
              });
            }

            return newMessages;
          });
        }

        // Finalize the message with a proper ID
        setMessages((prev) => {
          const newMessages = prev.filter((m) => m.id !== "temp-response");
          newMessages.push({
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: responseText,
          });
          return newMessages;
        });
      }
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToSupport = async () => {
    if (messages.length === 0) return;

    setIsSendingToSupport(true);

    try {
      const lastUserMessage = messages.filter((m) => m.role === "user").pop();

      if (!lastUserMessage) {
        toast.error("Please ask a question first.");
        return;
      }

      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: lastUserMessage.content,
          chatHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send to support");
      }

      toast.success("Our customer service team will contact you shortly.");
    } catch (error) {
      toast.error("Failed to send message to support. Please try again.");
    } finally {
      setIsSendingToSupport(false);
    }
  };

  return (
    <>
      {/* Floating chat bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-7 7v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7z" />
                    <path d="M5 8v1a7 7 0 0 0 14 0V8" />
                  </svg>
                  <h3 className="font-semibold">CBank Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendToSupport}
                    disabled={isSendingToSupport || messages.length === 0}
                    className="p-1.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                    title="Send to support"
                  >
                    {isSendingToSupport ? (
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-blue-700 transition-colors"
                    title="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-12 w-12 text-blue-600 mb-3"
                    >
                      <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-7 7v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7z" />
                      <path d="M5 8v1a7 7 0 0 0 14 0V8" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to CBank Assistant
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Ask me anything about our banking services, loan options,
                      or how to use our app.
                    </p>
                  </div>
                ) : (
                  <div>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start gap-2 mb-4 max-w-[85%]",
                          message.role === "user" ? "ml-auto" : ""
                        )}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            message.role === "user"
                              ? "bg-blue-600 order-2"
                              : "bg-gray-200 dark:bg-gray-700"
                          )}
                        >
                          {message.role === "user" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-white"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-gray-700 dark:text-gray-300"
                            >
                              <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-7 7v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7z" />
                              <path d="M5 8v1a7 7 0 0 0 14 0V8" />
                            </svg>
                          )}
                        </div>
                        <div
                          className={cn(
                            "py-2 px-3 rounded-lg text-sm",
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 p-1.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
