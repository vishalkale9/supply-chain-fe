import { Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Hero from "./components/Hero";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
