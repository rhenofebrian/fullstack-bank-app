import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "../hooks/utils";
import axios from "axios";

interface Message {
  sender: string;
  text: string;
  containsWhatsAppLink?: boolean;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingToSupport, setIsSendingToSupport] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Apa saja produk tabungan di CBank?",
    "Berapa suku bunga KPR?",
    "Bagaimana cara mengajukan kartu kredit?",
    "Dimana lokasi ATM terdekat?",
  ]);
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

  const sendMessage = async (
    e?: React.FormEvent,
    suggestedMessage?: string
  ) => {
    if (e) e.preventDefault();

    const messageToSend = suggestedMessage || input;
    if (!messageToSend.trim()) return;

    setIsLoading(true);

    const newMessages = [...messages, { sender: "User", text: messageToSend }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        userId: "12345", // Replace with valid user ID
        message: messageToSend,
        useNLP: true,
      });

      // Check if response contains WhatsApp link
      const responseText = res.data.response;
      const containsWhatsAppLink =
        responseText.includes("wa.me/") || responseText.includes("WhatsApp");

      setMessages([
        ...newMessages,
        {
          sender: "Bot",
          text: responseText,
          containsWhatsAppLink,
        },
      ]);

      // Generate new suggestions based on the conversation context
      generateNewSuggestions(messageToSend, responseText);
    } catch (error) {
      console.error("❌ Error fetching response:", error);
      setMessages([
        ...newMessages,
        {
          sender: "Bot",
          text: "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi atau hubungi customer service kami.",
          containsWhatsAppLink: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  const generateNewSuggestions = (userMessage: string, botResponse: string) => {
    // Simple logic to generate contextual follow-up questions
    const bankingTopics = {
      tabungan: [
        "Apa syarat membuka rekening tabungan?",
        "Berapa setoran awal minimum?",
        "Apakah ada biaya admin bulanan?",
      ],
      kredit: [
        "Berapa lama proses persetujuan kredit?",
        "Dokumen apa saja yang diperlukan?",
        "Apakah ada biaya pelunasan dipercepat?",
      ],
      kartu: [
        "Apa keuntungan kartu kredit CBank?",
        "Bagaimana cara mengaktifkan kartu?",
        "Apakah ada program cicilan 0%?",
      ],
      atm: [
        "Berapa limit penarikan harian?",
        "Apakah ada biaya tarik tunai?",
        "Dimana saya bisa melihat lokasi ATM?",
      ],
      mobile: [
        "Bagaimana cara mendaftar mobile banking?",
        "Apakah transaksi mobile banking dikenakan biaya?",
        "Fitur apa saja yang tersedia di mobile banking?",
      ],
    };

    // Determine context from conversation
    let newSuggestions: string[] = [];

    if (
      userMessage.toLowerCase().includes("tabungan") ||
      botResponse.toLowerCase().includes("tabungan")
    ) {
      newSuggestions = [...bankingTopics.tabungan];
    } else if (
      userMessage.toLowerCase().includes("kredit") ||
      botResponse.toLowerCase().includes("kredit") ||
      userMessage.toLowerCase().includes("kpr") ||
      botResponse.toLowerCase().includes("kpr") ||
      userMessage.toLowerCase().includes("pinjaman") ||
      botResponse.toLowerCase().includes("pinjaman")
    ) {
      newSuggestions = [...bankingTopics.kredit];
    } else if (
      userMessage.toLowerCase().includes("kartu") ||
      botResponse.toLowerCase().includes("kartu")
    ) {
      newSuggestions = [...bankingTopics.kartu];
    } else if (
      userMessage.toLowerCase().includes("atm") ||
      botResponse.toLowerCase().includes("atm")
    ) {
      newSuggestions = [...bankingTopics.atm];
    } else if (
      userMessage.toLowerCase().includes("mobile") ||
      botResponse.toLowerCase().includes("mobile") ||
      userMessage.toLowerCase().includes("aplikasi") ||
      botResponse.toLowerCase().includes("aplikasi")
    ) {
      newSuggestions = [...bankingTopics.mobile];
    } else {
      // Default suggestions if no specific context is detected
      newSuggestions = [
        "Apa saja produk unggulan CBank?",
        "Bagaimana cara menghubungi customer service?",
        "Jam operasional kantor cabang?",
        "Apakah ada promo khusus bulan ini?",
      ];
    }

    // Shuffle and take 3-4 suggestions
    newSuggestions.sort(() => Math.random() - 0.5);
    setSuggestions(newSuggestions.slice(0, 3));
  };

  const handleSendToSupport = async () => {
    if (messages.length === 0) return;

    setIsSendingToSupport(true);

    try {
      const whatsappNumber = "628211763760";

      // Open WhatsApp in a new tab
      window.open(
        `https://wa.me/${whatsappNumber}?text=Halo, saya butuh bantuan mengenai layanan CBank.`,
        "_blank"
      );

      // Add a message to the chat
      setMessages([
        ...messages,
        {
          sender: "Bot",
          text: "Anda telah diarahkan ke WhatsApp Customer Service kami. Terima kasih telah menghubungi CBank Assistant.",
          containsWhatsAppLink: true,
        },
      ]);
    } catch (error) {
      console.error("Error redirecting to WhatsApp:", error);
    } finally {
      setIsSendingToSupport(false);
    }
  };

  // Function to render message text with clickable WhatsApp link
  const renderMessageText = (text: string, containsWhatsAppLink?: boolean) => {
    if (!containsWhatsAppLink) {
      return <p>{text}</p>;
    }

    // Simple regex to find WhatsApp links
    const whatsappRegex = /wa\.me\/(\d+)/;
    const match = text.match(whatsappRegex);

    if (match) {
      const parts = text.split(whatsappRegex);
      const phoneNumber = match[1];

      return (
        <div>
          {parts[0]}
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
          >
            Hubungi Customer Service <ExternalLink className="h-3 w-3" />
          </a>
          {parts[2]}
        </div>
      );
    }

    // If no exact match but contains WhatsApp mention
    if (text.includes("WhatsApp") || text.includes("CS")) {
      return (
        <div>
          <p>{text}</p>
          <button
            onClick={handleSendToSupport}
            className="mt-2 text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
          >
            Hubungi Customer Service <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      );
    }

    return <p>{text}</p>;
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
                    disabled={isSendingToSupport}
                    className="p-1.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                    title="Hubungi Customer Service"
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
                      Selamat Datang di CBank Assistant
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Tanyakan tentang produk perbankan, layanan, atau informasi
                      lainnya seputar CBank.
                    </p>

                    {/* Quick suggestions */}
                    <div className="w-full space-y-2 mt-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(undefined, suggestion)}
                          className="w-full text-left p-2 text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md text-blue-700 dark:text-blue-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex mb-4",
                          message.sender === "User"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-start gap-2 max-w-[85%]",
                            message.sender === "User"
                              ? "flex-row-reverse"
                              : "flex-row"
                          )}
                        >
                          <div
                            className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                              message.sender === "User"
                                ? "bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-700"
                            )}
                          >
                            {message.sender === "User" ? (
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
                              message.sender === "User"
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none"
                            )}
                          >
                            {message.sender === "User" ? (
                              <p>{message.text}</p>
                            ) : (
                              <>
                                {renderMessageText(
                                  message.text,
                                  message.containsWhatsAppLink
                                )}

                                {/* Feedback buttons for bot messages */}
                                {!message.containsWhatsAppLink && (
                                  <div className="flex items-center justify-end gap-2 mt-2 text-gray-400">
                                    <button
                                      className="hover:text-green-500 transition-colors p-1"
                                      title="Jawaban membantu"
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      className="hover:text-red-500 transition-colors p-1"
                                      title="Jawaban tidak membantu"
                                      onClick={handleSendToSupport}
                                    >
                                      <ThumbsDown className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Contextual suggestions after messages */}
                    {messages.length > 0 && !isLoading && (
                      <div className="mt-4 mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Pertanyaan lanjutan:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(undefined, suggestion)}
                              className="text-xs py-1 px-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={sendMessage}
                className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
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
