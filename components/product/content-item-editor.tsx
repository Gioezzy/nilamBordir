'use client';

import { ContentItem } from '@/lib/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { X, Upload } from 'lucide-react';
import { BORDIR_CONFIG } from '@/lib/constans';
import Image from 'next/image';

interface ContentItemEditorProps {
  item: ContentItem;
  index: number;
  onUpdate: (id: string, updated: Partial<ContentItem>) => void;
  onRemove: (id: string) => void;
  onLogoUpload?: (id: string, file: File) => void;
}

export default function ContentItemEditor({
  item,
  index,
  onUpdate,
  onRemove,
  onLogoUpload,
}: ContentItemEditorProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 5MB');
      return;
    }

    if (onLogoUpload) {
      onLogoUpload(item.id, file);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">
          Konten #{index + 1} ({item.type === 'text' ? 'Teks' : 'Logo'})
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {item.type === 'text' ? (
        <Input
          placeholder={`Teks konten ${index + 1}`}
          value={item.value}
          onChange={e => onUpdate(item.id, { value: e.target.value })}
        />
      ) : (
        <div className="space-y-2">
          {item.value ? (
            <div className="relative w-full h-24 border rounded-lg overflow-hidden bg-white">
              <Image
                src={item.value}
                alt="Logo preview"
                fill
                className="object-contain p-2"
              />
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
              <Upload className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Layout
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BORDIR_CONFIG.CONTENT_LAYOUT_OPTIONS.map(layout => (
            <button
              key={layout.value}
              type="button"
              onClick={() =>
                onUpdate(item.id, {
                  layout: layout.value as 'vertical' | 'horizontal',
                })
              }
              className={`p-2 border rounded-lg text-sm transition-all ${
                item.layout === layout.value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="mr-2">{layout.icon}</span>
              {layout.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Posisi
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BORDIR_CONFIG.CONTENT_POSITION_OPTIONS.map(pos => (
            <button
              key={pos.value}
              type="button"
              onClick={() =>
                onUpdate(item.id, { position: pos.value as 'left' | 'right' })
              }
              className={`p-2 border rounded-lg text-sm transition-all ${
                item.position === pos.value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="mr-2">{pos.icon}</span>
              {pos.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
