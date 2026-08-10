import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, forgotPassword, isLoggingIn, isSendingResetLink } = useAuthStore();
  const { syncGuestCartOnLogin } = useCartStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    const success = await login(formData);
    if (success) {
      await syncGuestCartOnLogin();
      navigate("/");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error("Please enter your email");
    const success = await forgotPassword(resetEmail);
    if (success) setResetEmail("");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:flex flex-col items-center justify-center gap-4 bg-primary text-primary-content p-10">
          <ShoppingBag size={64} />
          <h2 className="text-3xl font-bold text-center">Welcome back to Verve</h2>
          <p className="text-center text-primary-content/80">
            Log in to track orders, save items, and check out faster.
          </p>
        </div>

        <div className="p-8 md:p-10">
          {!showForgotPassword ? (
            <>
              <h2 className="text-2xl font-bold mb-1">Log in</h2>
              <p className="text-base-content/60 mb-6">Enter your details to continue.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="••••••••"
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

                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>

                <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? <span className="loading loading-spinner loading-sm" /> : "Log in"}
                </button>
              </form>

              <p className="text-sm text-center mt-6 text-base-content/60">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>

              <p className="text-sm text-center mt-2">
                <Link to="/" className="text-base-content/50 hover:underline">
                  Continue browsing without an account
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1">Reset your password</h2>
              <p className="text-base-content/60 mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSendingResetLink}
                >
                  {isSendingResetLink ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to log in
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
