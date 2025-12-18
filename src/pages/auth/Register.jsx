import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  photo: z.string().min(1, "Photo URL is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, updateUser, signInWithGoogle } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await createUser(data.email, data.password);
      const firebaseUser = res.user;

      await updateUser({
        displayName: data.name,
        photoURL: data.photo,
      });

      await axiosInstance.post("/users", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: data.name,
        photoURL: data.photo,
      });

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.code || "Registration failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      const firebaseUser = res.user;

      await axiosInstance.post("/users", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
      });

      toast.success("Signed up with Google!");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center px-4">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl py-8">
        <h2 className="font-bold text-2xl text-center mb-6">
          Signup Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="card-body pt-0">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`input input-bordered ${
                errors.name ? "input-error" : ""
              }`}
              {...register("name")}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>

          {/* Emails */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`input input-bordered ${
                errors.email ? "input-error" : ""
              }`}
              {...register("email")}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              </label>
            )}
          </div>

          {/* Photo URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Photo URL</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              className={`input input-bordered ${
                errors.photo ? "input-error" : ""
              }`}
              {...register("photo")}
            />
            {errors.photo && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.photo.message}
                </span>
              </label>
            )}
          </div>

          {/* Password.. */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`input input-bordered pr-12 ${
                errors.password ? "input-error" : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-7 btn btn-ghost btn-xs"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-neutral mt-6"
          >
            {isSubmitting ? "Creating account..." : "Signup"}
          </button>

          <div className="divider my-6">OR</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn bg-white text-black border border-gray-300 hover:bg-gray-50"
          >
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="mr-3"
            >
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              />
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              />
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              />
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-bold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
