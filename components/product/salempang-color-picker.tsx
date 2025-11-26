'use client';

import { BORDIR_CONFIG } from '@/lib/constans';
import { Label } from '../ui/label';

interface SalempangColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

export default function SalempangColorPicker({
  selectedColor,
  onChange,
}: SalempangColorPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Warna Salempang</Label>
      <div className="grid grid-cols-8 gap-2">
        {BORDIR_CONFIG.SALEMPANG_COLORS.map(color => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
              selectedColor === color.value
                ? 'border-gray-900 scale-110 shadow-lg'
                : 'border-gray-300 hover:scale-105 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.label}
          >
            {color.value === 'white' && (
              <div className="absolute inset-0 border border-gray-300" />
            )}

            {selectedColor === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    color.value === 'white' || color.value === 'yellow'
                      ? 'bg-gray-900'
                      : 'bg-white'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      color.value === 'white' || color.value === 'yellow'
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Dipilih:{' '}
        <span className="font-medium">
          {BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === selectedColor)
            ?.label || 'Hitam'}
        </span>
      </p>
    </div>
  );
}
