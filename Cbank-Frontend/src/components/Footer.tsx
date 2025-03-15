import { ArrowUp, Instagram, Linkedin, Twitter } from "lucide-react";
import { Magnetic } from "./effect/Magnet";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-white/60 dark:bg-black/50  py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Social Media Section */}
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-6">
              Follow us on:
            </h3>
            <div className="flex gap-4">
              {[
                { icon: Instagram, link: "https://instagram.com" },
                { icon: Linkedin, link: "https://linkedin.com" },
                { icon: Twitter, link: "https://twitter.com" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-100 hover:border-gray-900 hover:text-gray-900 dark:hover:text-blue-600 transition-colors duration-300"
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-6">
              Get In Touch
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-4">
              {[
                { name: "Services", link: "/services" },
                { name: "Loan Simulation", link: "/loan-simulation" },
                { name: "News", link: "/news" },
                { name: "Contacts", link: "/contact" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link} // ✅ Pakai Link agar navigasi tidak reload halaman
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-600 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-blue-600">C</span>Bank
            </h2>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>© 2025 CBank. All rights reserved</span>
          </div>

          <Magnetic strength={30}>
            <button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-300"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
