import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import CountdownTimer from "../components/CountdownTimer";

const formatPrice = (cents) => `Rs. ${(cents / 100).toFixed(0)}`;

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Confirmshaming: a discount popup appears once per view, with an accept
  // button and a deliberately guilt-tripping decline button.
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data.product);
        if (res.data.product.declineButtonText) {
          setShowDiscountPopup(true);
        }
      } catch {
        toast.error("Product not found");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  if (!product) return null;

  const priceLocked = product.requiresAccountToViewPrice && !user;

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 bg-base-100 rounded-2xl shadow-md p-6 md:p-10">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-3 text-sm">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span>{product.rating?.toFixed(1)}</span>
            {product.reviewCount > 0 && (
              <span className="text-base-content/60">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            )}
            {product.viewingNowCount > 0 && (
              <span className="text-base-content/60">
                &middot; {product.viewingNowCount} people viewing this right now
              </span>
            )}
          </div>

          {product.purchasesLast24h > 0 && (
            <p className="text-sm text-success font-medium mb-3">
              🔥 {product.purchasesLast24h} people bought this in the last 24 hours
            </p>
          )}

          {product.urgencyBadge && (
            <div className="badge badge-error text-white font-semibold mb-2">
              {product.urgencyBadge}
            </div>
          )}
          {product.lowStockBadge && (
            <div className="badge badge-warning font-semibold mb-2 ml-2">
              {product.lowStockBadge}
            </div>
          )}
          {product.saleEndsAt && (
            <p className="text-error text-sm mb-3">
              <CountdownTimer targetDate={product.saleEndsAt} />
            </p>
          )}

          {priceLocked ? (
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2">Create a free account to reveal member pricing</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/signup")}>
                Sign up to see price
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold">{formatPrice(product.priceCents)}</span>
              {product.originalPriceCents && (
                <span className="text-lg line-through text-base-content/50">
                  {formatPrice(product.originalPriceCents)}
                </span>
              )}
            </div>
          )}

          {product.hiddenFeeLabel && (
            <p className="text-xs text-base-content/50 mb-2">
              * A {product.hiddenFeeLabel.toLowerCase()} applies at checkout.
            </p>
          )}

          {product.preCheckedAddon?.enabled && (
            <label className="flex items-center gap-2 text-sm mb-3 bg-base-200 rounded-lg p-3">
              <input type="checkbox" defaultChecked className="checkbox checkbox-sm" />
              Add {product.preCheckedAddon.name} (+{formatPrice(product.preCheckedAddon.priceCents)})
            </label>
          )}

          <p className="text-base-content/70 mb-6">{product.description}</p>

          {product.obstructionNote && (
            <div className="alert alert-warning text-sm mb-4">
              <span>{product.obstructionNote}</span>
            </div>
          )}

          {!priceLocked && (
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                addItem(product, 1);
              }}
            >
              Add to cart
            </button>
          )}

          {product.forcedNewsletterOptIn && (
            <p className="text-xs text-base-content/50 mt-2">
              By continuing, you agree to receive marketing emails. This cannot be unchecked
              during signup.
            </p>
          )}
        </div>
      </div>

      {/* Confirmshaming popup */}
      {showDiscountPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Wait! Here's 15% off</h3>
            <p className="text-base-content/70 mb-5">
              Just for you -- take 15% off {product.name} if you check out in the next 10 minutes.
            </p>
            <button
              className="btn btn-primary w-full mb-2"
              onClick={() => setShowDiscountPopup(false)}
            >
              Yes! Give me 15% off
            </button>
            <button
              className="btn btn-ghost btn-sm w-full text-base-content/50"
              onClick={() => setShowDiscountPopup(false)}
            >
              {product.declineButtonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
