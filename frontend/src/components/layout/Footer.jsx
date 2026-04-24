import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-dark-950 font-bold">⚡</div>
              <span className="text-lg font-bold font-display text-gradient">ElectroMart</span>
            </Link>
            <p className="text-dark-300 text-sm leading-relaxed max-w-xs">
              The premier marketplace for buying and selling pre-owned electronics. Get great deals, connect with sellers, and upgrade your tech.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold font-display mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['Browse', '/'], ['Sell Item', '/create-listing'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-dark-300 hover:text-primary-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold font-display mb-3 text-sm">Categories</h4>
            <ul className="space-y-2">
              {['Smartphones', 'Laptops', 'Cameras', 'Gaming', 'Audio'].map(cat => (
                <li key={cat}>
                  <Link to={`/?category=${cat.toLowerCase()}`} className="text-dark-300 hover:text-primary-400 text-sm transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dark-400 text-xs">© 2026 ElectroMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
