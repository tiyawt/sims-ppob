import { Outlet, NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Layout() {
  const navClass = ({ isActive }) =>
    (isActive
      ? "text-red-600 font-semibold"
      : "text-gray-700 hover:text-red-600") +
    " transition-colors text-base";

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-6 h-6" />
            <span className="font-semibold text-gray-900 text-base">SIMS PPOB</span>
          </NavLink>
          <nav className="flex justify-between items-center gap-12 text-sm">
            <NavLink to="/topup" className={navClass}>
              Top Up
            </NavLink>
            <NavLink to="/transaction" className={navClass}>
              Transaction
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              Akun
            </NavLink>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <main className="bg-white">
        <Outlet />
      </main>
    </div>
  );
}