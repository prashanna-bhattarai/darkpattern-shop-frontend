import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const AccountPage = () => {
  const { user, changePassword } = useAuthStore();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- Obstruction demo state: cancelling "CloudFit Premium Membership" ---
  const [cancelStep, setCancelStep] = useState(0);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error("Both fields are required");
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>

        <div className="card bg-base-100 shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Profile</h2>
          <p className="text-sm text-base-content/60">Name</p>
          <p className="mb-3">{user.name}</p>
          <p className="text-sm text-base-content/60">Email</p>
          <p>{user.email}</p>
        </div>

        <div className="card bg-base-100 shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              className="input input-bordered w-full"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Update password
            </button>
          </form>
        </div>

        {/* --- Obstruction dark pattern demo --- */}
        <div className="card bg-base-100 shadow-md p-6">
          <h2 className="font-semibold text-lg mb-2">Active Subscriptions</h2>
          <div className="flex items-center justify-between border rounded-lg p-4 border-base-300">
            <div>
              <p className="font-medium">CloudFit Premium Membership</p>
              <p className="text-sm text-base-content/60">Rs. 1,499 / month</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setCancelStep(1)}>
              Manage
            </button>
          </div>

          {cancelStep === 1 && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-3">
              <p className="font-medium">
                Wait -- before you go, did you know Premium members save an average of Rs. 3,200
                per month on classes booked elsewhere?
              </p>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => setCancelStep(0)}>
                  Keep my membership
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCancelStep(2)}>
                  I still want to cancel
                </button>
              </div>
            </div>
          )}

          {cancelStep === 2 && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-2">
              <p className="font-medium">To cancel your membership:</p>
              <p className="text-sm">
                Please call our support line (Mon-Fri, 9am-5pm) at{" "}
                <span className="font-semibold">+977-01-4567153</span> and provide cancellation
                code <span className="font-semibold">CANCEL-2026</span> to your representative.
                Cancellation requests cannot be processed by email or through this page.
              </p>
              <button className="btn btn-ghost btn-sm mt-2" onClick={() => setCancelStep(0)}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
