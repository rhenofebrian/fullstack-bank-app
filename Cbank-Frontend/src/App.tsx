import AppRouter from "./router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBubble from "./components/ChatBubble";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./components/effect/ScrollToTop";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAdmin = location.pathname.startsWith("/admin");
  const hideNavbarFooter = isDashboard || isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {!hideNavbarFooter && <Navbar />}
      <ScrollToTop />
      <main className="flex-grow">
        <AppRouter />
      </main>
      {!hideNavbarFooter && <Footer />}
      <ToastContainer />

      {!hideNavbarFooter && <ChatBubble />}
    </div>
  );
}

export default App;
