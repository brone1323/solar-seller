'use client';

import { MessageCircle } from 'lucide-react';

const DEFAULT_MESSAGE = 'Hi, I have a question about Solar DIY';
const SMS_NUMBER = process.env.NEXT_PUBLIC_SMS_NUMBER || '14378890383';

export function ChatButton() {
  const smsNumber = SMS_NUMBER.replace(/\D/g, '');
  const url = `sms:+${smsNumber}?body=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={url}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-solar-sky to-solar-leaf text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Text us"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
