import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, Briefcase, Car, Building2, Trees, LandPlot, FlagIcon as Government } from "lucide-react";

const Hero = () => {
  return (
    <div
      id="hero-section"
      className="relative w-full h-[50vh] md:h-[45rem] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero.png')`,
      }}
    >
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[45rem] px-4 md:px-8 text-white">
        <div className="max-w-4xl p-4 text-center md:text-left">
          <div className="pt-4 md:pt-40">
            <p className="mb-4 flex items-center gap-2">
              Discover The District
              {/* <span className="w-12 h-0.5 bg-cyan-400 inline-block" /> */}
            </p>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Barangay Bahay Toro
            </h1>

            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              The most exciting district of Quezon City, Metro Manila. Get your opportunity
              to move forward together.
            </p>

            <Button
              variant="default"
              size="lg"
              className="bg-green-primary hover:bg-green-500"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 w-full lg:w-[82rem] lg:h-[10rem] -mb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-2 rounded-lg text-center flex-row">
            <Briefcase className="text-green-primary w-20 h-20 mx-auto" />
            <span className="text-xl">Offices</span>
          </div>
          <div className="p-2 rounded-lg text-center flex-row">
            <Car className="text-green-primary w-20 h-20 mx-auto" />
            <span className="text-xl">Parking</span>
          </div>
          <div className="p-2 rounded-lg text-center flex-row">
            <Building2 className="text-green-primary w-20 h-20 mx-auto" />
            <span className="text-xl">Hospital</span>
          </div>
          <div className="p-2 rounded-lg text-center flex-row">
            <Trees className="text-green-primary w-20 h-20 mx-auto" />
            <span className="text-xl">Recreation</span>
          </div>
          <div className="p-2 rounded-lg text-center flex-row">
            <Government className="text-green-primary w-20 h-20 mx-auto" />
            <span className="text-xl">Government</span>
          </div>
          <div className="p-2 rounded-lg text-center flex-row">
            <LandPlot className="text-green-primary w-20 h-20 mx-auto" />
            <span className="text-xl">Housing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
