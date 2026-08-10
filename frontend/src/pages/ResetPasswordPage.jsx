import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuthStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setIsSubmitting(true);
    const success = await resetPassword(token, password);
    setIsSubmitting(false);
    if (success) navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-1">Set a new password</h2>
        <p className="text-base-content/60 mb-6">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
