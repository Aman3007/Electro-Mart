import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-8xl font-bold font-display text-gradient mb-4">404</div>
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold font-display text-white mb-3">Page Not Found</h1>
        <p className="text-dark-300 max-w-sm mx-auto mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have been unplugged. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary px-8 py-3">
            ⚡ Go Home
          </Link>
          <Link to="/contact" className="btn-secondary px-8 py-3">
            Get Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;