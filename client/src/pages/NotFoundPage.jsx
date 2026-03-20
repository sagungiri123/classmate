import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-4">
    <p className="font-mono text-6xl font-bold text-brand-600 mb-4">404</p>
    <h1 className="font-display text-2xl font-semibold text-white mb-2">Page not found</h1>
    <p className="text-white/40 text-sm mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/chat" className="btn-primary">
      Go to chat
    </Link>
  </div>
);

export default NotFoundPage;