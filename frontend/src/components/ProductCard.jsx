import { Link } from "react-router";
import { Star } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

const formatPrice = (cents) => `Rs. ${(cents / 100).toFixed(0)}`;

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200"
    >
      {/* Product Image */}
      <figure className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="card-body p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-base leading-snug">{product.name}</h3>

        {/* Urgency / Stock Messages */}
        {(product.urgencyBadge || product.lowStockBadge) && (
          <div className="flex flex-wrap gap-2">
            {product.urgencyBadge && (
              <span className="badge badge-error text-white font-semibold">
                {product.urgencyBadge}
              </span>
            )}

            {product.lowStockBadge && (
              <span className="badge badge-warning font-semibold">
                {product.lowStockBadge}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-base-content/70">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span>{product.rating?.toFixed(1)}</span>

          {product.reviewCount > 0 && (
            <span>({product.reviewCount.toLocaleString()})</span>
          )}
        </div>

        {/* Recent Purchases */}
        {product.purchasesLast24h > 0 && (
          <p className="text-xs text-success font-medium">
            {product.purchasesLast24h} people bought this in the last 24 hours
          </p>
        )}

        {/* Price */}
        {product.requiresAccountToViewPrice ? (
          <p className="text-sm font-semibold text-primary">
            Sign up to reveal price
          </p>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatPrice(product.priceCents)}
            </span>

            {product.originalPriceCents && (
              <span className="text-sm line-through text-base-content/50">
                {formatPrice(product.originalPriceCents)}
              </span>
            )}
          </div>
        )}

        {/* Sale Countdown */}
        {product.saleEndsAt && (
          <CountdownTimer
            targetDate={product.saleEndsAt}
            className="text-xs text-error"
          />
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
