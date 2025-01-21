import Image from "next/image";

const Hero = () => {
  return (
    <div id="first-section" className="relative justify-center w-full py-8">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[45rem] px-4 md:px-8">
        {/* Image Section */}
        <div className="flex justify-center pt-8 md:pt-24">
          <Image
            src="/bht.png"
            alt="bht"
            width={900}
            height={900}
            className="w-full max-w-[400px] md:max-w-[600px]"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 text-center md:text-left">
          <div className="pt-8 md:pt-28">
            <h1 className="text-lg">About us</h1>
            <p className="text-3xl md:text-5xl pt-4">
              If you change your city, you&apos;re changing the world.
            </p>
            <p className="text-md md:text-xl pt-6">
              Barangay Bahay Toro is determined to address everything that
              hinders its way to being the best.
            </p>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-center md:justify-start">
                <input type="checkbox" id="checkbox1" name="checkbox1" />
                <label htmlFor="checkbox1" className="pl-3">
                  Our Mission
                </label>
              </div>
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-center md:justify-start">
                <input type="checkbox" id="checkbox2" name="checkbox2" />
                <label htmlFor="checkbox2" className="pl-3">
                  Our Vision
                </label>
              </div>
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-center md:justify-start">
                <input type="checkbox" id="checkbox3" name="checkbox3" />
                <label htmlFor="checkbox3" className="pl-3">
                  Our Goal
                </label>
              </div>
            </div>

            {/* Vision Statement */}
            <div className="pt-6">
              <p>
                Our vision is to empower individuals and organizations globally
                through innovative solutions, fostering growth, and creating a
                positive impact in every community we serve. We aspire to be a
                catalyst for transformative change, inspiring excellence and
                sustainability in all our endeavors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
