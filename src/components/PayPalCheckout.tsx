'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '@/context/CartContext';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

interface PayPalCheckoutProps {
  onSuccess: () => void;
}

export function PayPalCheckout({ onSuccess }: PayPalCheckoutProps) {
  const { items, subtotal } = useCart();

  if (!clientId) {
    return (
      <div className="rounded-xl p-4 bg-amber-500/20 border border-amber-500/50">
        <p className="text-amber-200 text-sm">
          Add <code className="bg-black/20 px-1 rounded">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to your <code className="bg-black/20 px-1 rounded">.env.local</code> to enable PayPal checkout.
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
      }}
    >
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
            body: JSON.stringify({ items, subtotal }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to create order');
          return data.orderID;
        }}
        onApprove={async ({ orderID }) => {
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Payment failed');
          onSuccess();
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          alert('Payment failed. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
}
