import AppRouter from "./router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {!isDashboard && <Navbar />}
      <main className="flex-grow pt-6">
        <AppRouter />
      </main>
      {!isDashboard && <Footer />}
      <ToastContainer />
    </div>
  );
}

export default App;
