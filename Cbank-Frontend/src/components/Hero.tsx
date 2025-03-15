import {
  Megaphone,
  MessageCircle,
  TrendingUp,
  Zap,
  Gift,
  CreditCard,
  ShoppingCart,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { Magnetic } from "./effect/Magnet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // responsive
  const showCards = {
    topLeft: !isMobile,
    topRight: !isMobile,
    middleLeft: !isMobile && !isTablet,
    middleRight: !isMobile && !isTablet,
    bottomLeft: !isMobile,
    bottomRight: !isMobile,
    creditCard: !isMobile,
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-indigo-900/90 via-blue-800/70 to-indigo-900/50 text-gray-900 dark:text-white overflow-hidden relative">
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 relative mt-16 md:mt-28">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-xs md:text-sm mb-6"
        >
          <Megaphone className="text-xl md:text-2xl text-inherit" />
          <span className="text-inherit">
            Announcement! Our newest products and services are here
          </span>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 text-inherit"
          >
            Manage Your Finances Safely & Comfortably
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-lg mb-8 text-inherit"
          >
            Enjoy seamless transactions and exclusive benefits with us.
          </motion.p>
          <Magnetic strength={40}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-900 hover:bg-blue-600 text-white font-medium rounded-full px-6 md:px-8 py-2 md:py-2.5 shadow-lg"
              onClick={() => navigate("/login")}
            >
              Join Now
            </motion.button>
          </Magnetic>
        </div>

        {/* Phone and Cards Layout */}
        <div className="relative max-w-6xl mx-auto min-h-[400px] md:min-h-[600px] lg:min-h-[800px] flex items-center justify-center">
          {/* Center - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-20"
          >
            <div className="relative w-[220px] h-[440px] md:w-[300px] md:h-[600px] bg-gradient-to-b from-blue-800 to-blue-900 rounded-[40px] md:rounded-[50px] border-[8px] md:border-[12px] border-blue-950 overflow-hidden shadow-[0_0_0_2px_rgba(255,255,255,0.1),0_0_30px_5px_rgba(0,0,0,0.3)]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-blue-950 rounded-b-xl z-10"></div>

              {/* Status Bar */}
              <div className="bg-blue-950/80 backdrop-blur-sm flex justify-between items-center px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-xs">
                <div>9:41</div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-white"></div>
                  <div className="h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-white"></div>
                  <div className="h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-white"></div>
                  <div className="h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-white"></div>
                </div>
              </div>

              {/* Hero Content */}
              <div className="p-3 md:p-5">
                {/* Hero Header */}
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <div>
                    <h2 className="text-base md:text-xl font-bold">
                      Dashboard
                    </h2>
                    <p className="text-[10px] md:text-xs text-blue-200">
                      Welcome back, Asep!
                    </p>
                  </div>

                  {/* Profile Circle */}
                  <div className="bg-white rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center border-2 border-amber-400">
                    <div className="bg-amber-400 h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs md:text-sm">
                        🌞
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points Display */}
                <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 mb-3 md:mb-5 border border-blue-700/50">
                  <div className="flex justify-between items-center mb-1 md:mb-2">
                    <p className="text-xs md:text-sm text-blue-200">
                      Total Points
                    </p>
                    <div className="bg-blue-700/50 rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs flex items-center">
                      <Zap className="h-2 w-2 md:h-3 md:w-3 mr-1 text-amber-400" />
                      Level 4
                    </div>
                  </div>

                  <motion.h2
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    className="text-2xl md:text-4xl font-bold flex items-center"
                  >
                    1,200
                    <span className="text-amber-400 text-base md:text-xl ml-2">
                      🪙
                    </span>
                  </motion.h2>

                  <div className="flex justify-between items-center mt-2 md:mt-3">
                    <div className="text-[8px] md:text-xs text-blue-200">
                      <span className="text-green-400">+120</span> this week
                    </div>
                    <div className="text-[8px] md:text-xs text-blue-200">
                      Next reward: 2,000
                    </div>
                  </div>
                </div>

                {/* Graph */}
                <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 mb-3 md:mb-5 border border-blue-700/50">
                  <div className="flex justify-between items-center mb-2 md:mb-4">
                    <p className="text-xs md:text-sm font-medium">
                      Points History
                    </p>
                    <div className="flex space-x-1 md:space-x-2">
                      <button className="bg-blue-700/50 rounded-full px-1.5 md:px-2 py-0.5 md:py-1 text-[8px] md:text-xs">
                        Week
                      </button>
                      <button className="bg-blue-900 rounded-full px-1.5 md:px-2 py-0.5 md:py-1 text-[8px] md:text-xs">
                        Month
                      </button>
                    </div>
                  </div>

                  <div className="h-24 md:h-40">
                    {/* SVG graph with blue line */}
                    <svg viewBox="0 0 300 150" className="w-full h-full">
                      <defs>
                        <linearGradient
                          id="blueGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a855f7"
                            stopOpacity="0.8"
                          />
                          <stop
                            offset="100%"
                            stopColor="#a855f7"
                            stopOpacity="0.1"
                          />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="30"
                        x2="300"
                        y2="30"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="60"
                        x2="300"
                        y2="60"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="90"
                        x2="300"
                        y2="90"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="120"
                        x2="300"
                        y2="120"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />

                      {/* X-axis labels */}
                      <text
                        x="0"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Mon
                      </text>
                      <text
                        x="50"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Tue
                      </text>
                      <text
                        x="100"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Wed
                      </text>
                      <text
                        x="150"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Thu
                      </text>
                      <text
                        x="200"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Fri
                      </text>
                      <text
                        x="250"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Sat
                      </text>
                      <text
                        x="290"
                        y="145"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                      >
                        Sun
                      </text>

                      {/* Area fill */}
                      <path
                        d="M0,120 C30,100 60,70 90,80 C120,90 150,60 180,70 C210,80 240,40 270,50 L300,40 L300,150 L0,150 Z"
                        fill="url(#blueGradient)"
                      />

                      {/* Line */}
                      <path
                        d="M0,120 C30,100 60,70 90,80 C120,90 150,60 180,70 C210,80 240,40 270,50 L300,40"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Data points */}
                      <circle
                        cx="0"
                        cy="120"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <circle
                        cx="50"
                        cy="100"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <circle
                        cx="100"
                        cy="70"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <circle
                        cx="150"
                        cy="80"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <circle
                        cx="200"
                        cy="60"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <circle
                        cx="250"
                        cy="70"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <circle
                        cx="300"
                        cy="40"
                        r="4"
                        fill="#a855f7"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="bg-blue-950/80 backdrop-blur-sm rounded-full p-2 md:p-3 flex items-center gap-1 md:gap-2 border border-blue-800"
                  >
                    <MessageCircle className="h-3 w-3 md:h-5 md:w-5 text-amber-400" />
                    <span className="text-xs md:text-sm">
                      Hello Friend! 100 points in your account
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Left Card */}
          {showCards.topLeft && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: -3,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute top-[5%] left-[20%] z-10 bg-white rounded-2xl p-4 text-black shadow-xl w-48 md:w-64 rotate-[-5deg] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-xs md:text-sm">
                    Points Growth
                  </h3>
                  <p className="text-gray-500 text-[10px] md:text-xs">
                    Last 30 days
                  </p>
                </div>
                <div className="bg-green-100 text-green-600 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium flex items-center">
                  <TrendingUp className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                  +38%
                </div>
              </div>
              <div className="mb-1">
                <span className="text-xs md:text-sm font-bold text-green-500">
                  +20,000 points
                </span>
              </div>
              <div className="h-12 md:h-16">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#FFA500" />
                      <stop offset="100%" stopColor="#FFD700" />
                    </linearGradient>
                    <linearGradient
                      id="areaGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFA500" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#FFD700"
                        stopOpacity="0.05"
                      />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M0,80 C30,70 60,90 90,75 C120,60 150,50 180,40 C210,30 240,25 270,20 L300,15 L300,100 L0,100 Z"
                    fill="url(#areaGradient)"
                  />
                  {/* Line */}
                  <path
                    d="M0,80 C30,70 60,90 90,75 C120,60 150,50 180,40 C210,30 240,25 270,20 L300,15"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </motion.div>
          )}

          {/* Top Right Card */}
          {showCards.topRight && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: 3,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute top-[5%] right-[20%] z-10 bg-white rounded-2xl p-4 text-black shadow-xl w-48 md:w-64 rotate-[5deg] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-xs md:text-sm">Rewards</h3>
                  <p className="text-gray-500 text-[10px] md:text-xs">
                    Claim now
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium flex items-center">
                  <Gift className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                  New
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-1.5 md:p-2 rounded-lg">
                  <div className="bg-amber-500 text-white p-0.5 md:p-1 rounded-md w-4 h-4 md:w-6 md:h-6 flex items-center justify-center mb-1">
                    <Gift className="h-2 w-2 md:h-3 md:w-3" />
                  </div>
                  <h4 className="font-bold text-[10px] md:text-xs">
                    $10 Gift Card
                  </h4>
                  <p className="text-[8px] md:text-xs text-gray-600">
                    5,000 pts
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-1.5 md:p-2 rounded-lg">
                  <div className="bg-blue-500 text-white p-0.5 md:p-1 rounded-md w-4 h-4 md:w-6 md:h-6 flex items-center justify-center mb-1">
                    <CreditCard className="h-2 w-2 md:h-3 md:w-3" />
                  </div>
                  <h4 className="font-bold text-[10px] md:text-xs">
                    Cash Back
                  </h4>
                  <p className="text-[8px] md:text-xs text-gray-600">
                    10,000 pts
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Middle Right Card */}
          {showCards.middleRight && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: 6,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="absolute top-[35%] right-[10%] z-30 bg-white rounded-2xl p-4 text-black shadow-xl w-48 md:w-64 rotate-[8deg] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-xs md:text-sm">
                    Premium Status
                  </h3>
                  <p className="text-gray-500 text-[10px] md:text-xs">
                    Member benefits
                  </p>
                </div>
                <div className="bg-amber-100 text-amber-600 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium flex items-center">
                  <Award className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                  Gold
                </div>
              </div>

              <div className="mt-2 space-y-1 md:space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <div className="h-2 w-2 md:h-3 md:w-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-[10px] md:text-xs">
                    Priority Customer Support
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <div className="h-2 w-2 md:h-3 md:w-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-[10px] md:text-xs">
                    2x Points on Purchases
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <div className="h-2 w-2 md:h-3 md:w-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-[10px] md:text-xs">
                    Exclusive Monthly Rewards
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Left Card */}
          {showCards.bottomLeft && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: -6,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute bottom-[5%] left-[20%] z-10 bg-white rounded-2xl p-4 text-black shadow-xl w-48 md:w-64 rotate-[-8deg] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-xs md:text-sm">
                    Monthly Progress
                  </h3>
                  <p className="text-gray-500 text-[10px] md:text-xs">
                    Target: $100
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium">
                  75%
                </div>
              </div>

              <div className="mt-2">
                <div className="text-center mb-1 text-xs md:text-sm font-bold">
                  $75 / $100
                </div>
                <div className="h-8 md:h-12 border border-dashed border-gray-300 rounded-lg flex items-end p-1 gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: [10, 20, 15, 30, 25, 35][i] }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                      className={`bg-blue-500 w-full rounded-t-lg`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] md:text-[10px] text-gray-500 mt-1">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Middle Left Card */}
          {showCards.middleLeft && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: -3,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="absolute top-[35%] left-[10%] z-30 bg-white rounded-2xl p-4 text-black shadow-xl w-48 md:w-64 rotate-[-5deg] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-xs md:text-sm">Transactions</h3>
                  <p className="text-gray-500 text-[10px] md:text-xs">
                    Last 7 days
                  </p>
                </div>
                <div className="text-blue-600 text-[10px] md:text-xs font-medium">
                  View All
                </div>
              </div>

              <div className="space-y-2 mt-1">
                <div className="flex items-center justify-between p-1.5 md:p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="bg-blue-100 p-0.5 md:p-1 rounded-md">
                      <ShoppingCart className="h-2 w-2 md:h-3 md:w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[10px] md:text-xs">
                        Amazon
                      </p>
                      <p className="text-[8px] md:text-[10px] text-gray-500">
                        May 21
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[10px] md:text-xs">$42.50</p>
                    <p className="text-[8px] md:text-[10px] text-green-500">
                      +85 pts
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-1.5 md:p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="bg-blue-100 p-0.5 md:p-1 rounded-md">
                      <CreditCard className="h-2 w-2 md:h-3 md:w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[10px] md:text-xs">
                        Netflix
                      </p>
                      <p className="text-[8px] md:text-[10px] text-gray-500">
                        May 20
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[10px] md:text-xs">$14.99</p>
                    <p className="text-[8px] md:text-[10px] text-green-500">
                      +30 pts
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Right Card */}
          {showCards.bottomRight && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.95, duration: 0.5 }}
              className="absolute bottom-[5%] right-[20%] z-10 bg-white rounded-2xl p-4 text-black shadow-xl w-48 md:w-64 rotate-[3deg] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-xs md:text-sm">
                    Upcoming Payments
                  </h3>
                  <p className="text-gray-500 text-[10px] md:text-xs">
                    Next 7 days
                  </p>
                </div>
                <div className="bg-red-100 text-red-600 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium">
                  3 Due
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between p-1.5 md:p-2 bg-gray-50 rounded-lg border-l-2 border-amber-500">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="bg-amber-100 p-0.5 md:p-1 rounded-md">
                      <CreditCard className="h-2 w-2 md:h-3 md:w-3 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[10px] md:text-xs">
                        Electricity Bill
                      </p>
                      <p className="text-[8px] md:text-[10px] text-gray-500">
                        Tomorrow
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[10px] md:text-xs">$85.00</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-1.5 md:p-2 bg-gray-50 rounded-lg border-l-2 border-blue-500">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="bg-blue-100 p-0.5 md:p-1 rounded-md">
                      <ShoppingCart className="h-2 w-2 md:h-3 md:w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[10px] md:text-xs">
                        Internet
                      </p>
                      <p className="text-[8px] md:text-[10px] text-gray-500">
                        May 25
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[10px] md:text-xs">$49.99</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Credit Card */}
          {showCards.creditCard && (
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 15 }}
              animate={{ opacity: 1, y: 0, rotate: 15 }}
              whileHover={{
                scale: 1.05,
                rotate: 12,
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute bottom-[15%] right-[5%] z-40 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl p-2 md:p-3 shadow-lg w-36 md:w-48 h-20 md:h-28 relative">
                <div className="absolute top-2 md:top-3 left-2 md:left-3">
                  <div className="bg-green-500 h-3 w-3 md:h-4 md:w-4 rounded-full flex items-center justify-center text-white text-[6px] md:text-[8px]">
                    ✓
                  </div>
                </div>
                <div className="absolute top-2 md:top-3 right-2 md:right-3 text-gray-400 font-bold text-[10px] md:text-xs">
                  VISA
                </div>
                <div className="absolute bottom-6 md:bottom-8 left-2 md:left-3 text-gray-500 tracking-widest text-[8px] md:text-xs">
                  1234 5678 9012 3456
                </div>
                <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 text-gray-500 text-[8px] md:text-[10px]">
                  11/25
                </div>
                <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 flex gap-1">
                  <div className="h-2 w-2 md:h-3 md:w-3 bg-red-600 rounded-sm"></div>
                  <div className="h-2 w-2 md:h-3 md:w-3 bg-yellow-500 rounded-sm flex items-center justify-center text-[6px] md:text-[8px]">
                    a
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Hero;
