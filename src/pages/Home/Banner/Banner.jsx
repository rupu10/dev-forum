import React from "react";
import { GiSparkles } from "react-icons/gi";

const Banner = () => {
  return (
    <div className="relative md:pt-20 overflow-hidden bg-base-200">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-fuchsia-500/10 dark:from-purple-600/20 dark:via-pink-600/10 dark:to-fuchsia-600/10"></div>
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.3) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-base-100/80 dark:bg-base-200/80 backdrop-blur-sm rounded-full px-6 py-3 border border-base-content/20 dark:border-base-content/30 shadow-lg">
            <GiSparkles className="h-5 w-5 text-pink-500" />
            <span className="text-sm font-semibold ">
              Built for Career Growth
            </span>
          </div>

          {/* Hero Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight font-urbanist tracking-tight">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400">
                Connect Through Code, Collaborate to Create,
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600">
                Ideas Shared Freely
              </span>
            </h1>

            <p className="text-lg lg:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community of developers, recruiters, and innovators
              engaging in thoughtful discussions, sharing ideas, and pushing the
              boundaries of technology.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn btn-lg bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-purple-700 hover:to-pink-700">
              Get Started
            </button>
            <button className="btn btn-lg btn-outline border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-2xl px-8 py-4 text-lg font-semibold hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;