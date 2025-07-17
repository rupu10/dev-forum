import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

// import axios from "axios";
// import useAxios from "../../../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import axios from "axios";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser,updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState('')
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate()
  const from = location.state?.from || '/'

  const onSubmit = (data) => {
    // console.log(data);
    createUser(data.email, data.password)
      .then(async(result) => {
        console.log(result);
        if(result){
        Swal.fire({
          icon: "success",
          title: "Signin successful!",
          showConfirmButton: false,
          timer: 1500
        });
                }

        // update userinfo in database
        const userInfo = {
          email: data.email,
          name: data.name,
          image: profilePic,
          role: 'bronze_user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString()
        }

        const userRes = await axiosInstance.post('/users', userInfo);
        console.log(userRes.data);

        // update user info in firebase
        const userProfile ={
          displayName: data.name,
          photoURL: profilePic
        }
        updateUserProfile(userProfile)
        .then(()=>{
          // console.log('pp updated');
          navigate(from)
        })
        .catch((err)=>console.log(err))

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageUpload = async(e)=>{
    const image = e.target.files[0];
    // console.log(image);
    const formData = new FormData();
    formData.append('image', image)

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`

    const res = await axios.post(imageUploadUrl,formData)
    setProfilePic(res.data.data.url);
  }

  return (
    <div className="flex mt-10 justify-center">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Register now!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name")}
              className="input w-full"
              placeholder="Your name"
              required
            />
            {errors.Email?.type === "required" && (
              <p className="text-red-500">email is required</p>
            )}
            {/* image upload */}
            <label className="label">Image URL</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input w-full"
              placeholder="Your profile picture"
              required
            />


            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input w-full"
              placeholder="Email"
            />

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
              })}
              className="input w-full"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Password must be 6 character</p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="text-red-500">
                Password should be 6 character and okkhor de bda!
              </p>
            )}
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button className="btn btn-neutral bg-[#9ECAD6] mt-4 text-black">
              Register
            </button>
          </fieldset>
          <p>
            <small>
              Already have an account?{" "}
              <Link state={{from}} className="underline" to="/join">
                Login
              </Link>
            </small>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
    </div>
  );
};

export default Register;
