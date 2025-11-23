'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

interface SalempangContent {
  id: string;
  type: 'text' | 'logo';
  value: string;
  position: 'left' | 'right';
}

interface SalempangPreviewProps {
  titik: string;
  textLines: string[];
  logoUrl?: string;
  threadColor: string;
  contents: SalempangContent[];
  onContentsChange: (contents: SalempangContent[]) => void;
}

export default function SalempangPreview({
  titik,
  textLines,
  logoUrl,
  threadColor,
  contents,
  onContentsChange,
}: SalempangPreviewProps) {
  const [leftContents, setLeftContents] = useState<SalempangContent[]>([]);
  const [rightContents, setRightContents] = useState<SalempangContent[]>([]);

  const maxTitik = parseInt(titik) || 2;

  useEffect(() => {
    setLeftContents(contents.filter(c => c.position === 'left'));
    setRightContents(contents.filter(c => c.position === 'right'));
  }, [contents]);

  const moveContent = (id: string, newPosition: 'left' | 'right') => {
    const updatedContents = contents.map(c =>
      c.id === id ? { ...c, position: newPosition } : c
    );
    onContentsChange(updatedContents);
  };

  const renderContent = (content: SalempangContent, side: 'left' | 'right') => {
    const colorMap: { [key: string]: string } = {
      hitam: '#000000',
      putih: '#FFFFFF',
      merah: '#DC2626',
      biru: '#2563EB',
      hijau: '#16A34A',
      kuning: '#EAB308',
      orange: '#EA580C',
      ungu: '#9333EA',
      emas: '#F59E0B',
      silver: '#94A3B8',
    };

    const textColor = colorMap[threadColor] || '#000000';

    if (content.type === 'text') {
      return (
        <div
          key={content.id}
          className="py-4 px-6 text-center relative group"
          style={{ color: textColor }}
        >
          <p className="font-serif text-lg font-semibold break-words">
            {content.value || 'Text Kosong'}
          </p>

          <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            {side === 'left' && (
              <button
                type="button"
                onClick={() => moveContent(content.id, 'right')}
                className="absolute -right-8 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs"
                title="Pindah ke Kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {side === 'right' && (
              <button
                type="button"
                onClick={() => moveContent(content.id, 'left')}
                className="absolute -left-8 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs"
                title="Pindah ke Kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
    }

    if (content.type === 'logo' && content.value) {
      return (
        <div
          key={content.id}
          className="py-4 flex justify-center items-center relative group"
        >
          <div className="w-16 h-16 relative">
            <Image
              src={content.value}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            {side === 'left' && (
              <button
                type="button"
                onClick={() => moveContent(content.id, 'right')}
                className="absolute -right-8 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs"
                title="Pindah ke Kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {side === 'right' && (
              <button
                type="button"
                onClick={() => moveContent(content.id, 'left')}
                className="absolute -left-8 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs"
                title="Pindah ke Kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium">
          📌 Preview Salempang ({maxTitik} Titik)
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Klik tombol panah untuk memindahkan posisi konten (kiri/kanan)
        </p>
      </div>

      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-8 overflow-hidden">
        <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[45%] bg-black rounded-l-lg flex flex-col justify-center">
            {leftContents.map(content => renderContent(content, 'left'))}
            
            {leftContents.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm italic">
                Konten Kiri
              </div>
            )}
          </div>

          <div className="absolute left-[45%] right-[45%] top-0 bottom-0">
            <svg
              viewBox="0 0 100 600"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 100,0 50,150 0,0"
                fill="#A0826D"
              />
              <polygon
                points="0,600 100,600 50,450 0,600"
                fill="#A0826D"
              />
            </svg>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-black rounded-r-lg flex flex-col justify-center">
            {rightContents.map(content => renderContent(content, 'right'))}
            
            {rightContents.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-sm italic">
                Konten Kanan
              </div>
            )}
          </div>

          <div className="relative" style={{ paddingBottom: '150%' }}>
            {/* Spacer for aspect ratio */}
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Konten: <span className="font-bold">{contents.length}</span> / {maxTitik}
          </p>
        </div>
      </div>
    </div>
  )
}
