import { Link, useNavigate } from "react-router";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-200 px-6 sticky top-0 z-40">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
          Verve
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="badge badge-sm badge-primary indicator-item">{itemCount}</span>
            )}
          </div>
        </Link>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <User size={22} />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li className="px-3 py-1 text-sm text-base-content/60">{user.name}</li>
              <li>
                <Link to="/account">Account settings</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut size={16} /> Log out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Log in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
