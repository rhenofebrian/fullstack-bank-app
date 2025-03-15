import { motion } from "framer-motion";

interface IndonesiaProps {
  className?: string;
  dotPosition?: { x: string; y: string };
  cityName?: string;
}

export default function Indonesia({
  className = "",
  cityName = "Jakarta",
}: IndonesiaProps) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-2xl ${className}`}
    >
      {/* HD Photo Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1570789210967-2cac24afeb00?q=80&w=1200&auto=format&fit=crop')",
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
      />

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* Location Marker */}
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="relative">
          {/* Pulse animation */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-blue-500/30"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />

          {/* Location Pin */}
          <motion.div
            className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* City Name */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="bg-black/50 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
          <h3 className="text-white font-bold text-lg">{cityName}</h3>
          <p className="text-white/80 text-xs">Indonesia</p>
        </div>
      </motion.div>
    </div>
  );
}
