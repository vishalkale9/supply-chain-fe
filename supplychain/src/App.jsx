import Navbar from "./layouts/Navbar";
import Hero from "./components/Hero";

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      <Hero />
    </div>
  );
};

export default App;
