import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const formatPrice = (cents) => `Rs. ${(cents / 100).toFixed(0)}`;

const CartPage = () => {
  const { user } = useAuthStore();

  const { cart, fetchCart, updateQuantity, removeItem } = useCartStore();

  const navigate = useNavigate();

  const [showForcedAccountModal, setShowForcedAccountModal] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  const subtotalCents = cart.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );

  const addonsCents = cart.reduce(
    (sum, item) =>
      sum +
      (item.addons || []).reduce(
        (addonSum, addon) => addonSum + addon.priceCents,
        0,
      ) *
        item.quantity,
    0,
  );

  const visibleTotalCents = subtotalCents + addonsCents;

  const handleCheckout = async () => {
    if (!user) {
      setShowForcedAccountModal(true);
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsStartingPayment(true);

      // Ask the backend to create the pending order
      // and prepare the eSewa payment form.
      const response = await api.post("/payment/esewa/initiate");

      const { formAction, fields } = response.data;

      if (!formAction || !fields) {
        throw new Error("Invalid payment response from server");
      }

      // eSewa requires a normal HTML form POST.
      const form = document.createElement("form");

      form.method = "POST";
      form.action = formAction;

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = value;

        form.appendChild(input);
      });

      document.body.appendChild(form);

      form.submit();
    } catch (err) {
      console.error("eSewa payment initialization failed:", err);

      toast.error(
        err.response?.data?.message || err.message || "Could not start payment",
      );

      setIsStartingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base-content/60 mb-4">Your cart is empty.</p>

            <Link to="/" className="btn btn-primary">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 bg-base-100 rounded-xl p-4 shadow-sm"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>

                    {item.addons?.map((addon) => (
                      <p
                        key={addon.name}
                        className="text-xs text-base-content/50"
                      >
                        + {addon.name} ({formatPrice(addon.priceCents)})
                      </p>
                    ))}

                    <p className="text-sm text-base-content/60">
                      {formatPrice(item.product.priceCents)} each
                    </p>
                  </div>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.product._id,
                        Number(event.target.value),
                      )
                    }
                    className="input input-bordered input-sm w-16"
                  />

                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => removeItem(item.product._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-base-100 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>

              {addonsCents > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Add-ons</span>
                  <span>{formatPrice(addonsCents)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(visibleTotalCents)}</span>
              </div>

              <p className="text-xs text-base-content/40">
                Additional fees may apply and will be shown at checkout.
              </p>

              <button
                className="btn btn-primary w-full mt-2"
                onClick={handleCheckout}
                disabled={isStartingPayment}
              >
                {isStartingPayment ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Starting payment...
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {showForcedAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-2">
              Create an account to check out
            </h3>

            <p className="text-base-content/70 mb-5 text-sm">
              You must have a Verve account to complete your order.
            </p>

            <button
              className="btn btn-primary w-full mb-2"
              onClick={() => navigate("/signup")}
            >
              Create account
            </button>

            <button
              className="btn btn-ghost btn-xs w-full text-base-content/40"
              onClick={() => setShowForcedAccountModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
