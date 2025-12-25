import { Outlet, NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png"

export default function Layout() {
  return (
    <>
      <nav className="flex justify-between items-center gap-2">
        <NavLink to="/" className="flex justify-center items-center gap-2">
            <img src={Logo} alt="Logo" />
            <p>SIMS PPOB</p>
        </NavLink>
        <NavLink to="/topup">Top Up</NavLink>
        <NavLink to="/transaction">Transaction</NavLink>
        <NavLink to="/profile">Akun</NavLink>
        
        
      </nav>

      <main style={{ padding: 12 }}>
        <Outlet />
      </main>
    </>
  );
}
