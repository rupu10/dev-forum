import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import SocialLogin from "./SocialLogin";


const JoinUs = () => {
  const {signIn} = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate()
  const from = location.state?.from || '/'
  const onSubmit = (data) => {
    signIn(data.email, data.password)
    .then(res=>{
      console.log(res.user);
      navigate(from)
    })
    .catch(err=>console.log(err))
  };
  return (
    <div className="flex justify-center mt-25">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Log in now!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input w-full"
              placeholder="Email"
              required
            />
            {errors.Email?.type === "required" && (
              <p className="text-red-500">email is required</p>
            )}
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
            <button className="btn bg-[#9ECAD6] mt-4 text-black ">Login</button>
        </fieldset>
        <p><small>don't have an account? <Link state={{from}} className="underline" to='/register'>register</Link></small></p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
    </div>
  );
};

export default JoinUs;
