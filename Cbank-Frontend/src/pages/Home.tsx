import Hero from "../components/Hero";
import MarqueePromo from "../components/MarqueePromo";
import About from "../components/About";
import Team from "../components/Team";
import FAQ from "../components/FAQ";
import ChatBubble from "../components/ChatBubble";
import PremiumAdCard from "../components/PremiumAdCard";

const Home = () => {
  return (
    <div>
      <Hero />
      <MarqueePromo />
      <About />
      <Team />
      <FAQ />
      <ChatBubble />
      <PremiumAdCard />
    </div>
  );
};

export default Home;
