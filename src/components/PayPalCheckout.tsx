'use client';

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useCart } from '@/context/CartContext';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

interface PayPalCheckoutProps {
  onSuccess: () => void;
  shippingCost?: number; // cents
  gstCost?: number; // cents
}

function PayPalButtonsWrapper({ onSuccess, shippingCost = 0, gstCost = 0 }: { onSuccess: () => void; shippingCost?: number; gstCost?: number }) {
  const { items, subtotal } = useCart();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="min-h-[120px] flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
        <p className="text-slate-400">Loading PayPal…</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="min-h-[120px] flex flex-col items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 p-4 gap-2">
        <p className="text-amber-200 text-sm font-medium">PayPal could not load</p>
        <p className="text-amber-200/80 text-xs text-center">
          Check your connection or try again. You can also contact us to complete your order.
        </p>
        <a
          href="mailto:info@solardiystore.ca"
          className="text-solar-leaf hover:underline text-sm mt-1"
        >
          info@solardiystore.ca
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-[120px] rounded-xl bg-white p-4 flex items-center justify-center">
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, subtotal, shipping: shippingCost || 0, gst: gstCost || 0 }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to create order');
          return data.orderID;
        }}
        onApprove={async ({ orderID }) => {
          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID }),
            });
            const data = await res.json();
            if (!res.ok) {
              alert(data.error || 'Payment failed. Please try again.');
              return;
            }
            onSuccess();
          } catch (err) {
            alert(err instanceof Error ? err.message : 'Payment failed. Please try again.');
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          alert('Payment failed. Please try again.');
        }}
      />
    </div>
  );
}

export function PayPalCheckout({ onSuccess, shippingCost = 0, gstCost = 0 }: PayPalCheckoutProps) {
  if (!clientId) {
    return (
      <div className="rounded-xl p-4 bg-amber-500/20 border border-amber-500/50">
        <p className="text-amber-200 text-sm">
          Add <code className="bg-black/20 px-1 rounded">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to your Vercel Environment Variables to enable PayPal checkout.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'CAD',
        intent: 'capture',
        components: 'buttons',
      }}
    >
      <PayPalButtonsWrapper onSuccess={onSuccess} shippingCost={shippingCost} gstCost={gstCost} />
    </PayPalScriptProvider>
  );
}
