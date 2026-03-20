import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../interceptor/auth";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

const RegisterForm = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(
        { _id: res.data._id, name: res.data.name, email: res.data.email },
        res.data.token
      );
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 animate-fade-in">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">
          Name
        </label>
        <input
          className="input-base"
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">
          Email
        </label>
        <input
          className="input-base"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">
          Password
        </label>
        <input
          className="input-base"
          type="password"
          name="password"
          placeholder="Min 6 characters"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Spinner size="sm" /> : "Create account"}
      </button>

      <p className="text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;