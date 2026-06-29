import { Player } from "@lottiefiles/react-lottie-player";
import { TypeAnimation } from "react-type-animation";
import Button from "./Button"; // Reusing our modular button!
import warehouseAnimation from "../assets/warehouse.json";

const Hero = () => {
  return (
    <section id="home" className="pt-8 pb-12 md:pt-16 md:pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Optimize your <br />
              <span className="text-blue-600 inline-block mt-2">
                {/* Typing Animation Component */}
                <TypeAnimation
                  sequence={[
                    "Warehouse",
                    2000,
                    "Logistics",
                    2000,
                    "Deliveries",
                    2000,
                    "Network",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>

            <p className="text-lg text-gray-600 md:max-w-lg">
              Streamline your entire supply chain process from end to end. Get
              real-time tracking, intelligent routing, and automated inventory
              management all in one platform.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="primary">Get Started</Button>
              <Button variant="outline">Book a Demo</Button>
            </div>
          </div>

          {/* Right Column: Lottie Animation */}
          <div className="relative flex justify-center items-center">
            {/* 
              Using the specific Lottie JSON URL you provided.
              Lottie animations are highly optimized vectors, much better than GIFs!
            */}
            <Player
              autoplay
              loop
              src={warehouseAnimation}
              style={{ height: "400px", width: "100%", maxWidth: "500px" }}
            ></Player>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
