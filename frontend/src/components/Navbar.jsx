import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/claims', label: 'Claims' },
  { to: '/profile', label: 'Profile' },
];

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">SaatDin</p>
        <h1 className="brand-title">Income insurance for Bangalore riders</h1>
      </div>
      <nav className="nav-grid" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
