import React from "react";
import { FaUsers, FaRocket, FaShieldAlt, FaGraduationCap, FaCode, FaAward } from "react-icons/fa";

const WhyJoinUs = () => {
  const features = [
    {
      icon: FaUsers,
      title: "Vibrant Community",
      description: "Connect with thousands of developers, share knowledge, and grow together in a supportive environment.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaRocket,
      title: "Career Growth",
      description: "Accelerate your career with mentorship, job opportunities, and skill development resources.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaShieldAlt,
      title: "Trusted Platform",
      description: "Join a secure, moderated community where quality discussions and respectful interactions are prioritized.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaGraduationCap,
      title: "Continuous Learning",
      description: "Access exclusive tutorials, workshops, and learning resources to stay ahead in the tech industry.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaCode,
      title: "Real-world Projects",
      description: "Collaborate on open-source projects, coding challenges, and real-world problem-solving exercises.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaAward,
      title: "Recognition",
      description: "Earn badges, reputation points, and get recognized for your contributions and expertise.",
      color: "from-purple-500 to-pink-500"
    }
  ];


  return (
    <div className="min-h-screen bg-base-200 py-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 px-6 py-3 rounded-full border border-purple-500/20 mb-6">
            <FaRocket className="text-lg" />
            <span className="font-semibold">Why Join Our Community?</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
            Elevate Your
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Development Journey</span>
          </h1>
          
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who are accelerating their careers, building meaningful connections, 
            and staying at the forefront of technology innovation.
          </p>
        </div>


        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300 hover:shadow-xl hover:border-purple-500/20 transition-all duration-500"
            >
              {/* Icon with Gradient Background */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-2xl text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-base-content mb-4 group-hover:text-purple-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-base-content/70 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div className="w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mt-4 group-hover:w-full transition-all duration-500 rounded-full" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 rounded-3xl p-12 text-center border border-purple-500/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-6">
              Ready to Transform Your Coding Journey?
            </h2>
            
            <p className="text-xl text-base-content/70 mb-8 leading-relaxed">
              Join our community today and unlock endless opportunities for growth, learning, and collaboration 
              with like-minded developers from around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn btn-lg rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white">
                Join Now
              </button>
              
              <button className="btn btn-outline btn-lg rounded-2xl px-8 py-4 text-lg font-semibold border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Setup in 2 minutes
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Free forever plan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyJoinUs;