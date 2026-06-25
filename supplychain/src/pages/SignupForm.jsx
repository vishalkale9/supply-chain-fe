import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import { Player } from "@lottiefiles/react-lottie-player";
import loginAnimation from "../assets/Login.json";

export default function SignupForm() {
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
      const response = await registerUser(
        data.name,
        data.email,
        data.password,
        data.role,
      );
      // Assuming response has a token and user object. Often after register, you auto-login
      if (response.token) {
        login(response.token, response.user || { email: data.email });
        navigate("/");
      } else {
        // If API just returns success and wants you to login manually
        navigate("/login");
      }
    } catch (error) {
      setServerError(error.message || "Failed to create account.");
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
                Create an account
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
                  htmlFor="name"
                  className="mb-2 text-slate-50 font-medium text-sm inline-block"
                >
                  Full Name / Company Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe Logistics"
                  {...register("name", { required: "Name is required" })}
                  className="px-3 py-2.5 text-sm text-slate-50 rounded-md bg-gray-800 w-full outline-1 -outline-offset-1 outline-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-700 dark:outline-neutral-600"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>
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
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className="px-3 py-2.5 text-sm text-slate-50 rounded-md bg-gray-800 w-full outline-1 -outline-offset-1 outline-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-700 dark:outline-neutral-600"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 text-slate-50 font-medium text-sm inline-block"
                >
                  Account Type
                </label>
                <select
                  id="role"
                  {...register("role", {
                    required: "Please select an account type",
                  })}
                  className="px-3 py-2.5 text-sm text-slate-50 rounded-md bg-gray-800 w-full outline-1 -outline-offset-1 outline-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-neutral-700 dark:outline-neutral-600"
                  defaultValue="Buyer"
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Transporter">Transporter</option>
                  <option value="WarehouseManager">Warehouse Manager</option>
                </select>
                {errors.role && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.role.message}
                  </span>
                )}
              </div>

              <div className="flex items-start flex-wrap gap-2">
                <label className="flex items-center group has-[input:checked]:text-slate-900">
                  <input
                    id="tmc"
                    type="checkbox"
                    className="sr-only"
                    {...register("tmc", {
                      required: "You must accept the terms",
                    })}
                  />
                  {/* Custom box */}
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded outline-1 outline-gray-700 bg-gray-800 dark:bg-neutral-700 dark:outline-neutral-600 
                              group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:outline-blue-600 group-focus-within:outline-2 group-focus-within:outline-blue-600"
                    aria-hidden="true"
                  >
                    {/* Checkmark */}
                    <svg
                      className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100"
                      viewBox="0 0 12 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 5l3 3 7-7" />
                    </svg>
                  </span>
                  <span className="ml-3 text-sm text-slate-300">
                    I accept the
                  </span>
                </label>

                <a
                  href="#"
                  className="ml-1 text-sm font-medium text-blue-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Terms and Conditions
                </a>
              </div>
              {errors.tmc && (
                <span className="text-red-500 text-xs block">
                  {errors.tmc.message}
                </span>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create an account"}
              </button>
            </form>

            <div className="mt-6 text-slate-50 text-sm text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
