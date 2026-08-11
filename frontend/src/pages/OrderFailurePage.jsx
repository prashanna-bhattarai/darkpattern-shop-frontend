import { Link } from "react-router";

const OrderFailurePage = () => (
  <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-md p-8 text-center">
      <h2 className="text-2xl font-bold mb-2 text-error">Payment failed</h2>
      <p className="text-base-content/60 mb-6 text-sm">
        Something went wrong or the payment was cancelled. Your cart has been
        kept, so you can try again.
      </p>
      <Link to="/cart" className="btn btn-primary w-full">
        Back to cart
      </Link>
    </div>
  </div>
);

export default OrderFailurePage;
