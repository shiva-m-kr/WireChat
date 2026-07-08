import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";



function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  let [username, setUsername] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  let dispatch = useDispatch();
  const navigate = useNavigate();


  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      
      dispatch(setUserData(result.data));
      showMessage("Signup successful!");

      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);

      showMessage(
        error.response?.data?.message || "Something went wrong",
        true
      );
    } finally {
      setLoading(false);
      
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-4"
    >
      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${isError ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {message}
        </div>
      )}
      {/* Background Blur Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

      {/* Signup Card */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-4 bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="WireChat Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">
          Welcome to WireChat
        </h1>

        <p className="text-center text-slate-400 mb-8">
          Create your account and start chatting instantly.
        </p>

        {/* Form */}
        <form className="space-y-5"
          onSubmit={handleSignup}>

          {/* Username */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

          </div>

          {/* Password */}
          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}

          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;