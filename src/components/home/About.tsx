"use client";

import { useState } from "react";
import Image from "next/image";

const About = () => {
  const [selected, setSelected] = useState("vision");
  
  return (
    <div id="about-section" className="relative w-full justify-center py-24">
      <div className="container grid h-auto grid-cols-1 gap-8 px-4 md:h-[45rem] md:grid-cols-2 md:px-8">
        {/* Image Section */}
        <div className="mt-8 flex justify-center md:pt-24">
          <Image
            src="/bht.png"
            alt="bht"
            width={900}
            height={900}
            className="w-full max-w-[400px] md:h-[600px] md:max-w-[700px]"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 text-center md:text-left">
          <div className="pt-4 md:pt-40">
            <h1 className="text-lg">About us</h1>
            <p className="mt-4 text-3xl md:text-5xl">
              If you change your city, you&apos;re changing the world.
            </p>
            <p className="text-md mt-6 md:text-xl">
              Barangay Bahay Toro is determined to address everything that
              hinders its way to being the best.
            </p>

            <div>
              {/* Selection Buttons */}
              <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-3">
                <div
                  className={`flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 p-4 md:justify-start ${selected === "mission" ? "bg-gray-400" : ""}`}
                  onClick={() => setSelected("mission")}
                >
                  <input
                    type="radio"
                    id="mission"
                    name="selection"
                    className="hidden"
                  />
                  <label htmlFor="mission" className="cursor-pointer pl-3">
                    Our Mission
                  </label>
                </div>

                <div
                  className={`flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 p-4 md:justify-start ${selected === "vision" ? "bg-gray-400" : ""}`}
                  onClick={() => setSelected("vision")}
                >
                  <input
                    type="radio"
                    id="vision"
                    name="selection"
                    className="hidden"
                  />
                  <label htmlFor="vision" className="cursor-pointer pl-3">
                    Our Vision
                  </label>
                </div>

                <div
                  className={`flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 p-4 md:justify-start ${selected === "goal" ? "bg-gray-400" : ""}`}
                  onClick={() => setSelected("goal")}
                >
                  <input
                    type="radio"
                    id="goal"
                    name="selection"
                    className="hidden"
                  />
                  <label htmlFor="goal" className="cursor-pointer pl-3">
                    Our Goal
                  </label>
                </div>
              </div>

              {/* Content Section */}
              <div className="pt-6">
                {selected === "mission" && (
                  <p>
                    To deliver exceptional solutions that drive progress,
                    enhance lives, and foster a better future for all.
                  </p>
                )}
                {selected === "vision" && (
                  <p>
                    To empower individuals and organizations globally through
                    innovative solutions, fostering growth, and creating a
                    positive impact in every community we serve.
                  </p>
                )}
                {selected === "goal" && (
                  <p>
                    To continuously improve and provide top-tier services that
                    meet the evolving needs of our clients and communities.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
