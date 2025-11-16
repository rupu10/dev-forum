import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import useAuth from "../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import axios from "axios";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCamera, FaUserPlus } from "react-icons/fa";
import registerLottie from '../assets/lotties/register.json';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await createUser(data.email, data.password);
      
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Your account has been created successfully.",
          showConfirmButton: false,
          timer: 1500
        });

        // Update user info in database
        const userInfo = {
          email: data.email,
          name: data.name,
          image: profilePic,
          role: 'bronze_user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString()
        };

        const userRes = await axiosInstance.post('/users', userInfo);

        // Update user info in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic
        };
        
        await updateUserProfile(userProfile);
        navigate(from);
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    try {
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
      Swal.fire({
        icon: "success",
        title: "Image Uploaded!",
        text: "Your profile picture has been uploaded successfully.",
        showConfirmButton: false,
        timer: 1000
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Lottie Animation */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full border border-primary/20 mb-6">
                <FaUserPlus className="text-lg" />
                <span className="font-semibold">Join Our Community</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-base-content mb-4">
                Start Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Journey</span>
              </h1>
              
              <p className="text-xl text-base-content/70 max-w-md mx-auto">
                Join thousands of developers sharing knowledge and growing together.
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <Lottie 
                animationData={registerLottie} 
                loop={true}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-base-content mb-2">
                Create Account
              </h2>
              <p className="text-base-content/70">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="font-semibold text-base-content flex items-center gap-2">
                  <FaUser className="text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 py-4 text-lg"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <label className="font-semibold text-base-content flex items-center gap-2">
                  <FaCamera className="text-primary" />
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {profilePic && (
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full border-2 border-base-300">
                        <img src={profilePic} alt="Preview" className="w-full h-full rounded-full object-cover" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="file-input file-input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      accept="image/*"
                    />
                  </div>
                </div>
                <p className="text-sm text-base-content/50">
                  Upload a profile picture to personalize your account
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-semibold text-base-content flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 py-4 text-lg"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-semibold text-base-content flex items-center gap-2">
                  <FaLock className="text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                      }
                    })}
                    className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 py-4 text-lg pr-12"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.password.message}
                  </p>
                )}
                <div className="text-sm text-base-content/50 space-y-1">
                  <p>• At least 6 characters</p>
                  <p>• One uppercase letter</p>
                  <p>• One lowercase letter</p>
                  <p>• One number</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-primary btn-lg w-full rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="loading loading-spinner loading-sm"></div>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaUserPlus />
                    Create Account
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}

            {/* Social Login */}
            <SocialLogin />

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-base-300">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link 
                  state={{from}} 
                  className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200 underline" 
                  to="/join"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;