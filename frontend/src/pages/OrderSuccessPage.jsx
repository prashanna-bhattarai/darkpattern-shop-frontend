{
  order && (
    <div className="text-left space-y-1 text-sm mb-4">
      {order.lineItems.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>{formatPrice(item.priceCents * item.quantity)}</span>
          </div>
          {item.addons?.map((a) => (
            <div
              key={a.name}
              className="flex justify-between text-xs text-base-content/50 pl-3"
            >
              <span>+ {a.name}</span>
              <span>{formatPrice(a.priceCents)}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-between border-t pt-2 mt-2">
        <span>Subtotal</span>
        <span>{formatPrice(order.subtotalCents)}</span>
      </div>
      {order.addonsCents > 0 && (
        <div className="flex justify-between">
          <span>Add-ons</span>
          <span>{formatPrice(order.addonsCents)}</span>
        </div>
      )}
      {order.hiddenFeesCents > 0 && (
        <div className="flex justify-between text-warning">
          <span>Fees (revealed at checkout)</span>
          <span>{formatPrice(order.hiddenFeesCents)}</span>
        </div>
      )}
      <div className="flex justify-between font-bold border-t pt-2 mt-2">
        <span>Total paid</span>
        <span>{formatPrice(order.totalCents)}</span>
      </div>
    </div>
  );
}
