const AdBanner = () => (
  <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl p-6 flex items-center justify-between">
    <div>
      <span className="badge badge-sm bg-white/20 border-none mb-2">
        Sponsored
      </span>
      <h3 className="text-xl font-bold">
        Get 30% off your first order -- today only!
      </h3>
      <p className="text-sm opacity-90">
        Join 12,000+ shoppers who saved this week.
      </p>
    </div>
    <button className="btn btn-sm bg-white text-primary border-none">
      Claim Offer
    </button>
  </div>
);

export default AdBanner;
