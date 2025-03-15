import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { brandLogos } from "../data";

export default function BrandMarquee() {
  const [duplicateLogos, setDuplicateLogos] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        const containerWidth = scrollRef.current.offsetWidth;
        const contentWidth =
          scrollRef.current.scrollWidth / (duplicateLogos ? 2 : 1);

        setDuplicateLogos(contentWidth < containerWidth * 2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [duplicateLogos]);

  return (
    <div className="mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          <span className="text-blue-600">C</span>Bank - Shop Anything, Anytime
        </h2>
        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
          Enjoy the convenience of shopping at your favorite merchants
        </p>
      </motion.div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden py-2">
        <div
          ref={scrollRef}
          className="flex items-center gap-8 animate-marquee whitespace-nowrap"
        >
          {brandLogos.map((logo, index) => (
            <motion.div
              key={`logo-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.1, y: -3 }}
              className="flex items-center justify-center min-w-[120px] h-20"
            >
              <img
                src={logo.image}
                alt={logo.name}
                className="h-14 object-contain"
                onError={(e) => (e.currentTarget.src = "/fallback-logo.png")}
              />
            </motion.div>
          ))}

          {/* Duplicate logos for seamless scrolling */}
          {duplicateLogos &&
            brandLogos.map((logo, index) => (
              <motion.div
                key={`logo-dup-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="flex items-center justify-center min-w-[120px] h-20"
              >
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="h-14 object-contain"
                  onError={(e) => (e.currentTarget.src = "/fallback-logo.png")}
                />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
