import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import { Player } from "@lottiefiles/react-lottie-player";
import loginAnimation from "../assets/Login.json";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await loginUser(data.email, data.password);
      // Assuming response has a token and user object
      login(response.token, response.user || { email: data.email });
      navigate("/"); // Redirect to home
    } catch (error) {
      setServerError(
        error.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white md:min-h-screen pt-16">
      <div className="grid md:grid-cols-2 items-center w-full h-full">
        <div className="max-md:order-1 p-4 flex items-center justify-center">
          <Player
            autoplay
            loop
            src={loginAnimation}
            className="w-full max-w-md h-auto block mx-auto"
          />
        </div>

        <div className="flex items-center px-8 py-12 bg-[#0C172C] w-full h-full lg:p-12 dark:bg-neutral-800">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-slate-50">
                Sign in to your account
              </h1>
            </div>

            {serverError && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{serverError}</span>
              </div>
            )}

            <form
              className="space-y-4 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-slate-50 font-medium text-sm inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@readymadeui.com"
                  {...register("email", { required: "Email is required" })}
                  className="px-3 py-2.5 text-sm text-slate-50 rounded-md bg-gray-800 w-full outline-1 -outline-offset-1 outline-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-700 dark:outline-neutral-600"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 text-slate-50 font-medium text-sm inline-block"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="px-3 py-2.5 text-sm text-slate-50 rounded-md bg-gray-800 w-full outline-1 -outline-offset-1 outline-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-700 dark:outline-neutral-600"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-slate-50 text-sm text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
