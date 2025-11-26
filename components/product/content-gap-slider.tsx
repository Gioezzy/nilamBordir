'use client';

import { BORDIR_CONFIG } from '@/lib/constans';
import { Label } from '../ui/label';

interface ContentGapSliderProps {
  selectedGap: string;
  onChange: (gap: string) => void;
}

export default function ContentGapSlider({
  selectedGap,
  onChange,
}: ContentGapSliderProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Jarak Antar Konten</Label>
      <div className="grid grid-cols-2 gap-2">
        {BORDIR_CONFIG.CONTENT_GAP_OPTIONS.map(gap => (
          <button
            key={gap.value}
            type="button"
            onClick={() => onChange(gap.value)}
            className={`p-3 border rounded-lg text-sm transition-all ${
              selectedGap === gap.value
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">{gap.label}</div>
            <div
              className={`text-xs mt-1 ${
                selectedGap === gap.value ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              {gap.spacing}px
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Jarak yang lebih besar akan memberikan ruang lebih antar konten
      </p>
    </div>
  );
}
