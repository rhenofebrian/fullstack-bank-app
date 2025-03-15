"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiMoon, FiSun, FiMenu, FiX, FiLogIn } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
import { Magnetic } from "./effect/Magnet";

export default function Navbar() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 inset-x-0 mx-auto max-w-5xl bg-white/60 dark:bg-black/50 
  shadow-lg backdrop-blur-lg rounded-full px-8 py-4 flex items-center justify-between 
  border border-neutral-300 dark:border-white/20 z-50 transition-all duration-300"
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold font-poppins hover:text-blue-600 transition duration-300"
      >
        <span className="text-blue-600">C</span>
        <span className="text-gray-900 dark:text-white">Bank</span>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-sm font-medium">
        {[
          { name: "Services", link: "/services" },
          { name: "Loan Simulation", link: "/loan-simulation" },
          { name: "Promos & News", link: "/news" },
          { name: "Contact", link: "/contact" },
        ].map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.1 }}
            className="relative group"
          >
            <Link
              to={item.link}
              className="text-gray-700 dark:text-white transition 
              hover:text-blue-500 dark:hover:text-blue-400"
            >
              {item.name}
            </Link>
            {/* Hover Line Effect */}
            <span
              className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 
            transition-all duration-300 group-hover:w-full"
            ></span>
          </motion.li>
        ))}
      </ul>

      {/* Login Button with Magnetic Effect */}
      <Magnetic strength={30}>
        <Link
          to="/login"
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 
    text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 
    hover:shadow-lg hover:shadow-blue-500/30"
        >
          <FiLogIn className="text-white" />
          Login
        </Link>
      </Magnetic>

      {/* Right Section: Dark Mode + Hamburger */}
      <div className="flex items-center space-x-3">
        {/* Dark Mode Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition 
          hover:bg-blue-500 dark:hover:bg-blue-600"
        >
          {darkMode ? (
            <FiSun className="text-yellow-400 transition duration-300" />
          ) : (
            <FiMoon />
          )}
        </button>

        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition 
          hover:bg-blue-500 dark:hover:bg-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <FiX className="text-xl text-black dark:text-white" />
          ) : (
            <FiMenu className="text-xl text-black dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-black 
            shadow-lg rounded-lg flex flex-col border border-neutral-300 dark:border-white/20"
          >
            {[
              { name: "Services", link: "/services" },
              { name: "Loan Simulation", link: "/loan-simulation" },
              { name: "Promos & News", link: "/news" },
              { name: "Contact", link: "/contact" },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-white 
                hover:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Login Button for Mobile */}
            <Link
              to="/login"
              className="mt-2 mx-3 mb-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 
        text-white px-4 py-2 rounded-full font-medium text-sm transition-all"
              onClick={() => setIsOpen(false)}
            >
              <FiLogIn className="text-white" />
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
