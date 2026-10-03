import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, googleLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser(formData);

      login(response);

      navigate("/");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Login to PlayNest
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-lg mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-lg mb-4"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

  <div className="flex items-center gap-3 my-5">
   <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>

  <span className="text-sm text-gray-500 dark:text-gray-400">
    OR
  </span>

  <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
</div>

<button
  type="button"
  onClick={googleLogin}
  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
>
  Continue with Google
</button>

    <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
     Don't have an account?{" "}
    <button
      type="button"
      onClick={() => navigate("/register")}
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      Register
    </button>
  </p>
      </form>

    </div>
  );
}

export default Login;