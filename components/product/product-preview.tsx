/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ContentItem } from '@/lib/types';
import { BORDIR_CONFIG } from '@/lib/constans';
import Image from 'next/image';

interface SalempangPreviewProps {
  titik: string;
  threadColor: string;
  salempangColor: string;
  contentGap: string;
  contents: ContentItem[];
  onContentsChange: (contents: ContentItem[]) => void;
}

export default function SalempangPreview({
  titik,
  threadColor,
  salempangColor,
  contentGap,
  contents,
}: SalempangPreviewProps) {
  const maxTitik = parseInt(titik) || 2;

  const gapValue =
    BORDIR_CONFIG.CONTENT_GAP_OPTIONS.find(g => g.value === contentGap)
      ?.spacing || 20;

  const salempangHex =
    BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === salempangColor)?.hex ||
    '#000000';

  const threadHex =
    BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === threadColor)?.hex ||
    '#000000';

  const leftContents = contents.filter(c => c.position === 'left');
  const rightContents = contents.filter(c => c.position === 'right');

  const renderContent = (content: ContentItem, side: 'left' | 'right') => {
    const isVertical = content.layout === 'vertical';

    if (content.type === 'text' && content.value) {
      return (
        <div
          key={content.id}
          className="flex items-center justify-center px-4 py-2"
          style={{
            color: threadHex,
            marginBottom: `${gapValue}px`,
          }}
        >
          <p
            className="font-serif text-sm font-semibold whitespace-nowrap"
            style={{
              writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
              textOrientation: isVertical ? 'upright' : 'mixed',
            }}
          >
            {content.value}
          </p>
        </div>
      );
    }

    if (content.type === 'logo' && content.value) {
      return (
        <div
          key={content.id}
          className="flex items-center justify-center py-2"
          style={{
            marginBottom: `${gapValue}px`,
          }}
        >
          <div
            className="w-14 h-14 relative"
            style={{
              transform: isVertical ? 'rotate(90deg)' : 'none',
              transformOrigin: 'center',
            }}
          >
            <Image
              src={content.value}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const getTextColorClass = () => {
    if (salempangColor === 'white' || salempangColor === 'yellow') {
      return 'text-gray-800';
    }
    return 'text-gray-400';
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium">
          📌 Preview Salempang ({maxTitik} Titik)
        </p>
        <div className="text-xs text-blue-700 mt-2 space-y-1">
          <p>
            <strong>Warna Salempang:</strong>{' '}
            {
              BORDIR_CONFIG.SALEMPANG_COLORS.find(
                c => c.value === salempangColor
              )?.label
            }
          </p>
          <p>
            <strong>Warna Benang:</strong>{' '}
            {
              BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === threadColor)
                ?.label
            }
          </p>
          <p>
            <strong>Jarak Konten:</strong> {gapValue}px (
            {
              BORDIR_CONFIG.CONTENT_GAP_OPTIONS.find(
                g => g.value === contentGap
              )?.label
            }
            )
          </p>
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-8 overflow-hidden shadow-inner">
        <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
          <div
            className="absolute left-0 top-0 bottom-0 w-[45%] rounded-l-lg flex flex-col justify-center items-center shadow-md"
            style={{
              backgroundColor: salempangHex,
              border: salempangColor === 'white' ? '1px solid #e5e7eb' : 'none',
            }}
          >
            {leftContents.length > 0 ? (
              <div className="w-full py-4">
                {leftContents.map(content => renderContent(content, 'left'))}
              </div>
            ) : (
              <div
                className={`text-center py-8 text-xs italic ${getTextColorClass()}`}
              >
                Konten Kiri
              </div>
            )}
          </div>

          <div className="absolute left-[45%] right-[45%] top-0 bottom-0 z-10">
            <svg
              viewBox="0 0 100 600"
              className="w-full h-full drop-shadow-md"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 100,0 50,150 0,0"
                fill="#A0826D"
                stroke="#8B7355"
                strokeWidth="2"
              />
              <polygon
                points="0,600 100,600 50,450 0,600"
                fill="#A0826D"
                stroke="#8B7355"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div
            className="absolute right-0 top-0 bottom-0 w-[45%] rounded-r-lg flex flex-col justify-center items-center shadow-md"
            style={{
              backgroundColor: salempangHex,
              border: salempangColor === 'white' ? '1px solid #e5e7eb' : 'none',
            }}
          >
            {rightContents.length > 0 ? (
              <div className="w-full py-4">
                {rightContents.map(content => renderContent(content, 'right'))}
              </div>
            ) : (
              <div
                className={`text-center py-8 text-xs italic ${getTextColorClass()}`}
              >
                Konten Kanan
              </div>
            )}
          </div>

          <div className="relative" style={{ paddingBottom: '150%' }} />
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-700">
            Konten: <span className="font-bold">{contents.length}</span> /{' '}
            {maxTitik}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <span>
              ← Kiri: <strong>{leftContents.length}</strong>
            </span>
            <span>|</span>
            <span>
              Kanan →: <strong>{rightContents.length}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          📖 Keterangan:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Setiap konten bisa diatur layout (vertikal/horizontal)</li>
          <li>• Setiap konten bisa diatur posisi (kiri/kanan)</li>
          <li>• Gap spacing mengatur jarak antar konten</li>
          <li>• Logo akan otomatis dirotasi jika layout-nya vertikal</li>
        </ul>
      </div>
    </div>
  );
}
