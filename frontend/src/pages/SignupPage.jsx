import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();
  const { syncGuestCartOnLogin } = useCartStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    const success = await signup(formData);
    if (success) {
      await syncGuestCartOnLogin();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:flex flex-col items-center justify-center gap-4 bg-primary text-primary-content p-10">
          <ShoppingBag size={64} />
          <h2 className="text-3xl font-bold text-center">Join Verve</h2>
          <p className="text-center text-primary-content/80">
            Create an account to save your cart and track orders.
          </p>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-base-content/60 mb-6">It only takes a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full name</span>
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className="input input-bordered w-full pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? <span className="loading loading-spinner loading-sm" /> : "Sign up"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-sm text-center mt-2">
            <Link to="/" className="text-base-content/50 hover:underline">
              Continue browsing without an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
