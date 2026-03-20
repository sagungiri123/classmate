import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center px-4">

    {/* Background glow */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                      bg-brand-600/10 rounded-full blur-3xl" />
    </div>

    <div className="relative w-full max-w-sm animate-fade-in">

      {/* Logo mark */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center
                        text-lg font-display font-bold mb-4 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          CM
        </div>
        <h1 className="font-display text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-white/40 text-sm mt-1">Sign in to continue learning</p>
      </div>

      {/* Card */}
      <div className="card-glow p-6">
        <LoginForm />
      </div>
    </div>
  </div>
);

export default LoginPage;