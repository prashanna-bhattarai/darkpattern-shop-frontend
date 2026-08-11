import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../lib/axios";

const formatPrice = (cents) => `Rs. ${(cents / 100).toFixed(0)}`;

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return setIsLoading(false);
    api
      .get(`/payment/order/${orderId}`)
      .then((res) => setOrder(res.data.order))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Payment successful!</h2>
        <p className="text-base-content/60 mb-6 text-sm">
          Your order has been confirmed via eSewa.
        </p>
        {order && (
          <div className="text-left space-y-1 text-sm mb-4">
            {order.lineItems.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.priceCents * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total paid</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        )}
        <Link to="/" className="btn btn-primary w-full">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;