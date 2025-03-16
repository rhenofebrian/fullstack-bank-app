import { FiMoon, FiSun } from "react-icons/fi";
import useDarkMode from "../../hooks/useDarkMode";

const DashboardHeader: React.FC = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
