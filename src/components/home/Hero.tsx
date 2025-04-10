import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, Briefcase, Car, Building2, Trees, LandPlot, FlagIcon as Government } from "lucide-react";

const Hero = () => {
  return (
    <div
      id="hero-section"
      className="relative flex h-[50vh] w-full items-center justify-center bg-cover bg-center bg-no-repeat md:h-[45rem]"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero.png')",
      }}
    >
      <div className="container grid h-auto grid-cols-1 gap-8 px-4 text-white md:h-[45rem] md:grid-cols-2 md:px-8">
        <div className="max-w-4xl p-4 text-center md:text-left">
          <div className="pt-4 md:pt-40">
            <p className="mb-4 flex items-center gap-2">
              Discover The District
              {/* <span className="w-12 h-0.5 bg-cyan-400 inline-block" /> */}
            </p>

            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Barangay Bahay Toro
            </h1>

            <p className="mb-8 max-w-2xl text-xl md:text-2xl">
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

      <div className="absolute bottom-0 left-1/2 -mb-20 w-full -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg lg:h-[10rem] lg:w-[82rem]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="flex-row rounded-lg p-2 text-center">
            <Briefcase className="mx-auto h-20 w-20 text-green-primary" />
            <span className="text-xl">Offices</span>
          </div>
          <div className="flex-row rounded-lg p-2 text-center">
            <Car className="mx-auto h-20 w-20 text-green-primary" />
            <span className="text-xl">Parking</span>
          </div>
          <div className="flex-row rounded-lg p-2 text-center">
            <Building2 className="mx-auto h-20 w-20 text-green-primary" />
            <span className="text-xl">Hospital</span>
          </div>
          <div className="flex-row rounded-lg p-2 text-center">
            <Trees className="mx-auto h-20 w-20 text-green-primary" />
            <span className="text-xl">Recreation</span>
          </div>
          <div className="flex-row rounded-lg p-2 text-center">
            <Government className="mx-auto h-20 w-20 text-green-primary" />
            <span className="text-xl">Government</span>
          </div>
          <div className="flex-row rounded-lg p-2 text-center">
            <LandPlot className="mx-auto h-20 w-20 text-green-primary" />
            <span className="text-xl">Housing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
