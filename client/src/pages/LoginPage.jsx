import LoginForm from "../components/auth/LoginForm";

const BookOpenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A9 9 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A9 9 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const LoginPage = () => (
  <div 
    className="min-h-screen flex items-center justify-center px-4"
    style={{ background: "#FAF7F2", position: "relative" }}
  >
    {/* Paper Texture Overlay */}
    <div 
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.025,
        pointerEvents: "none",
        zIndex: 0
      }}
    />

    <div className="relative z-10 w-full max-w-sm" style={{ animation: "fadeIn 0.5s ease-out" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Logo mark */}
      <div className="flex flex-col items-center mb-8">
        <div 
          className="w-14 h-14 flex items-center justify-center mb-4"
          style={{ 
            background: "#C17A5F", 
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(193, 122, 95, 0.3)"
          }}
        >
          <BookOpenIcon className="w-7 h-7 text-white" />
        </div>
        <h1 
          className="text-3xl font-semibold mb-2"
          style={{ 
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#2C2926"
          }}
        >
          Welcome back
        </h1>
        <p style={{ color: "#5A5652", fontSize: "0.95rem" }}>
          Sign in to continue learning
        </p>
      </div>

      {/* Card */}
      <div 
        className="p-6"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5DDD1",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(44, 41, 38, 0.08)"
        }}
      >
        <LoginForm />
      </div>
    </div>
  </div>
);

export default LoginPage;