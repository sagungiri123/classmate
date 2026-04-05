import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../interceptor/auth";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

const LoginForm = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(
        { _id: res.data._id, name: res.data.name, email: res.data.email },
        res.data.token
      );
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div 
          className="text-sm rounded-lg px-4 py-3 animate-fade-in"
          style={{ 
            background: "rgba(193, 122, 95, 0.1)", 
            border: "1px solid rgba(193, 122, 95, 0.3)", 
            color: "#A5634A" 
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label 
          className="block text-xs mb-1.5 uppercase tracking-widest font-semibold"
          style={{ color: "#5A5652" }}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
          style={{ 
            background: "#FFFFFF",
            border: "1px solid #E5DDD1",
            borderRadius: "10px",
            color: "#2C2926"
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#C17A5F";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(193, 122, 95, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5DDD1";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      <div>
        <label 
          className="block text-xs mb-1.5 uppercase tracking-widest font-semibold"
          style={{ color: "#5A5652" }}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
          style={{ 
            background: "#FFFFFF",
            border: "1px solid #E5DDD1",
            borderRadius: "10px",
            color: "#2C2926"
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#C17A5F";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(193, 122, 95, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5DDD1";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-all duration-200"
        style={{ 
          background: "#C17A5F",
          color: "#FFFFFF",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(193, 122, 95, 0.3)"
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = "#A5634A";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#C17A5F";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {loading ? <Spinner size="sm" /> : "Sign in"}
      </button>

      <p className="text-center text-sm" style={{ color: "#5A5652" }}>
        No account?{" "}
        <Link 
          to="/register" 
          className="font-semibold transition-colors"
          style={{ color: "#C17A5F" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#A5634A"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#C17A5F"}
        >
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;