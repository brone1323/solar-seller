'use client';

import { useState, useRef, useEffect } from 'react';

interface DateTimePickerProps {
  value: string; // ISO string or ''
  onChange: (iso: string) => void;
  onSave?: (iso: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getLocalMidnight(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function DateTimePicker({ value, onChange, onSave, placeholder = 'Pick date and time', className = '' }: DateTimePickerProps) {
  const initial = value ? new Date(value) : new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(initial.getMonth());
  const [year, setYear] = useState(initial.getFullYear());
  const [day, setDay] = useState(value ? initial.getDate() : null as number | null);
  const [hour, setHour] = useState(value ? initial.getHours() % 12 || 12 : 12);
  const [minute, setMinute] = useState(value ? initial.getMinutes() : 0);
  const [amPm, setAmPm] = useState<'AM' | 'PM'>(value ? (initial.getHours() >= 12 ? 'PM' : 'AM') : 'AM');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (!open) return;
    const d = value ? new Date(value) : new Date();
    setMonth(d.getMonth());
    setYear(d.getFullYear());
    setDay(value ? d.getDate() : null);
    setHour(d.getHours() % 12 || 12);
    setMinute(d.getMinutes());
    setAmPm(d.getHours() >= 12 ? 'PM' : 'AM');
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setOpenUpward(rect.bottom + 380 > window.innerHeight);
    }
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const buildDate = () => {
    const d = day ?? new Date().getDate();
    const h = amPm === 'PM' ? (hour % 12) + 12 : hour % 12;
    return new Date(year, month, d, h, minute, 0, 0);
  };

  const handleSave = () => {
    const d = buildDate();
    const iso = d.toISOString();
    onChange(iso);
    onSave?.(iso);
    setOpen(false);
  };

  const displayStr = value
    ? new Date(value).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    : '';

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const grid: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) grid.push(null);
  for (let i = 1; i <= daysInMonth; i++) grid.push(i);

  return (
    <div className="relative" ref={panelRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-left text-white flex items-center justify-between ${className}`}
      >
        <span className={displayStr ? '' : 'text-slate-500'}>{displayStr || placeholder}</span>
        <span className="text-slate-400">▼</span>
      </button>
      {open && (
        <div className={`absolute left-0 z-50 rounded-xl border border-white/20 bg-solar-dark shadow-xl p-4 min-w-[320px] ${openUpward ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
          <div className="flex gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{MONTHS[month]} {year}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
                    className="p-1 rounded hover:bg-white/10 text-slate-400"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
                    className="p-1 rounded hover:bg-white/10 text-slate-400"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-slate-400 mb-1">
                {DAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {grid.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => d !== null && setDay(d)}
                    className={`w-8 h-8 rounded text-sm ${d === null ? 'invisible' : day === d ? 'bg-solar-leaf text-white' : 'hover:bg-white/10 text-white'}`}
                  >
                    {d ?? ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-l border-white/10 pl-4 flex flex-col gap-2">
              <span className="text-slate-400 text-sm">Time</span>
              <div className="flex items-center gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-slate-400">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                  ))}
                </select>
                <select
                  value={amPm}
                  onChange={(e) => setAmPm(e.target.value as 'AM' | 'PM')}
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
