import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import useAuthStore from "../../store/useAuthStore";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

// FunctionCard component
const FunctionCard = ({ icon, title, description, onClick }) => (
  <div onClick={onClick} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
    <div className="bg-[#a5c8a4]/30 p-3 rounded-full text-[#4c774a]">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-[#5a4e42]">{title}</h4>
      <p className="text-sm text-[#8a7c6c]">{description}</p>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Send user message and get response
  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    const initialBotMessage = {
      role: "model",
      parts: [
        "Hello! I'm Mind Mate, your wellness assistant. How are you feeling today?",
      ],
    };

    const userMessage = {
      role: "user",
      parts: [trimmedInput],
    };

    const updatedHistory = isChatActive
      ? [...messages, userMessage]
      : [initialBotMessage, userMessage];

    if (!isChatActive) {
      setIsChatActive(true);
    }

    setMessages(updatedHistory);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: updatedHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Network response was not ok");
      }

      const data = await response.json();

      const botMessage = {
        role: "model",
        parts: [data.reply],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to fetch bot reply:", error);
      const errorMessage = {
        role: "model",
        parts: [`Sorry, an error occurred: ${error.message}`],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setTyping(false);
    }
  };

  // End session button handler
  const handleEndSession = async () => {
    try {
      const sentimentResponse = await fetch("http://localhost:8000/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages }),
      });

      if (!sentimentResponse.ok) {
        const errorData = await sentimentResponse.json();
        throw new Error(errorData.detail || "Failed to get sentiment from FastAPI");
      }

      const sentimentData = await sentimentResponse.json();
      const sentiment = sentimentData.sentiment;

      if (authUser && authUser._id && sentiment) {
        const today = new Date().toISOString().split("T")[0];
        await axiosInstance.post(`/auth/users/${authUser._id}/sentiment`, {
          date: today,
          sentiment: sentiment,
          confidence: sentimentData.confidence,
        });
        console.log("User sentiment updated in Node.js backend.");
      } else {
        console.warn("Could not update user sentiment: authUser or sentiment missing.");
      }
    } catch (err) {
      console.error("Error during end session process:", err);
    } finally {
      setMessages([]);
      setIsChatActive(false);
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-[#5a4e42]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-[#a5c8a4]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <h1 className="text-2xl font-bold text-[#5a4e42]">Mind Mate</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-[#a5c8a4] text-[#5a4e42] px-4 py-2 rounded-full hover:bg-[#4c774a] hover:text-white transition-colors shadow"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col">
        <section className="flex-grow flex flex-col items-center justify-center py-8">
          <div className="container mx-auto px-6 w-full h-full flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col flex-grow">
              {/* Title */}
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#5a4e42]">
                  A safe space for your thoughts.
                </h2>
                <p className="text-lg md:text-xl text-[#8a7c6c] mb-8 max-w-2xl mx-auto">
                  Whatever's on your mind, I'm here to listen and help you find
                  the right tools.
                </p>
              </div>

              {/* Chat UI */}
              <div className="flex-grow flex flex-col min-h-0">
                {isChatActive && (
                  <div
                    ref={chatLogRef}
                    id="chat-log"
                    className="flex-grow mb-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 overflow-y-auto flex flex-col space-y-4"
                  >
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`chat-bubble ${
                          msg.role === "user" ? "user-bubble" : "bot-bubble"
                        }`}
                      >
                        {msg.parts[0]}
                      </div>
                    ))}
                    {typing && (
                      <div
                        className="chat-bubble bot-bubble"
                        id="typing-indicator"
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <div className="w-2 h-2 bg-[#8a7c6c] rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-[#8a7c6c] rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#8a7c6c] rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat input */}
              <div className="relative mt-auto">
                <input
                  type="text"
                  placeholder="Tell me what's on your mind..."
                  className="chatbot-input w-full py-4 px-6 text-lg text-[#5a4e42] bg-[#faf8f4] rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a5c8a4] focus:ring-opacity-75 transition-all duration-300"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#a5c8a4] text-[#5a4e42] p-3 rounded-full hover:bg-[#4c774a] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#a5c8a4] focus:ring-offset-2 transition-transform duration-200 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>

              {/* End session button */}
              {isChatActive && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleEndSession}
                    className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition-colors"
                  >
                    End Session
                  </button>
                </div>
              )}

              {/* Function cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                                <FunctionCard
                  onClick={() => navigate('/counsellor')}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  }
                  title="Councillors"
                  description="Write down your thoughts."
                />
                <FunctionCard
                  onClick={() => navigate('/peer')}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }
                  title="Peer to Peer Chat Forum"
                  description="Find calm in a few breaths."
                />
                
                <FunctionCard
                  onClick={() => navigate('/resources')}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  }
                  title="Resources Hub"
                  description="Explore helpful articles."
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;