/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BORDIR_CONFIG } from '@/lib/constans';

interface DesignPreviewViewerProps {
  categorySlug: string;
  customization: any;
  fileUrl?: string;
}

export default function DesignPreviewViewer({
  categorySlug,
  customization,
  fileUrl,
}: DesignPreviewViewerProps) {
  const [showOriginalFile, setShowOriginalFile] = useState(false);

  if (showOriginalFile && fileUrl) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">File Asli yang Diupload</h3>
          <button
            onClick={() => setShowOriginalFile(false)}
            className="text-sm text-blue-600 hover:underline"
          >
            Lihat Preview
          </button>
        </div>
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border">
          <Image
            src={fileUrl}
            alt="Original Design"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Preview Design</h3>
        {fileUrl && (
          <button
            onClick={() => setShowOriginalFile(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Lihat File Asli
          </button>
        )}
      </div>

      {categorySlug === 'salempang-bordir' && (
        <SalempangPreview customization={customization} />
      )}

      {categorySlug === 'bordir-nama' && (
        <BordirNamaPreview customization={customization} />
      )}

      {categorySlug === 'bordir-logo' && (
        <BordirLogoPreview customization={customization} fileUrl={fileUrl} />
      )}
    </div>
  );
}

function SalempangPreview({ customization }: { customization: any }) {
  if (!customization) {
    return (
      <div className="text-center py-8 text-gray-500">
        Data kustomisasi tidak tersedia
      </div>
    );
  }

  const {
    salempangColor = 'black',
    threadColor = 'hitam',
    contentGap = 'normal',
    contents = [],
  } = customization;

  const salempangHex =
    BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === salempangColor)?.hex ||
    '#000000';

  const threadHex =
    BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === threadColor)?.hex ||
    '#000000';

  const gapValue =
    BORDIR_CONFIG.CONTENT_GAP_OPTIONS.find(g => g.value === contentGap)
      ?.spacing || 20;

  const leftContents = contents.filter((c: any) => c.position === 'left');
  const rightContents = contents.filter((c: any) => c.position === 'right');

  const renderContent = (content: any, side: 'left' | 'right') => {
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
              {leftContents.map((content: any) =>
                renderContent(content, 'left')
              )}
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
              {rightContents.map((content: any) =>
                renderContent(content, 'right')
              )}
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
    </div>
  );
}

function BordirNamaPreview({ customization }: { customization: any }) {
  if (!customization) {
    return (
      <div className="text-center py-8 text-gray-500">
        Data kustomisasi tidak tersedia
      </div>
    );
  }

  const {
    namaText = '',
    threadColor = 'hitam',
    backgroundColor = 'white',
    fontSize = 'medium',
  } = customization;

  const threadHex =
    BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === threadColor)?.hex ||
    '#000000';

  const bgHex =
    BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === backgroundColor)
      ?.hex || '#FFFFFF';

  const fontSizeMap = {
    small: '1.5rem',
    medium: '2rem',
    large: '2.5rem',
    xlarge: '3rem',
  };

  return (
    <div
      className="relative rounded-lg p-12 shadow-lg flex items-center justify-center min-h-[300px]"
      style={{ backgroundColor: bgHex }}
    >
      <div className="text-center">
        <p
          className="font-bold tracking-wider"
          style={{
            color: threadHex,
            fontSize:
              fontSizeMap[fontSize as keyof typeof fontSizeMap] || '2rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {namaText || 'Nama Anda'}
        </p>
      </div>

      <div
        className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 opacity-30"
        style={{ borderColor: threadHex }}
      />
      <div
        className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 opacity-30"
        style={{ borderColor: threadHex }}
      />
      <div
        className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 opacity-30"
        style={{ borderColor: threadHex }}
      />
      <div
        className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 opacity-30"
        style={{ borderColor: threadHex }}
      />
    </div>
  );
}

function BordirLogoPreview({
  customization,
  fileUrl,
}: {
  customization: any;
  fileUrl?: string;
}) {
  if (!customization) {
    return (
      <div className="text-center py-8 text-gray-500">
        Data kustomisasi tidak tersedia
      </div>
    );
  }

  const {
    logoSize = 'medium',
    backgroundColor = 'white',
    borderColor = 'hitam',
  } = customization;

  const bgHex =
    BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === backgroundColor)
      ?.hex || '#FFFFFF';

  const borderHex =
    BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === borderColor)?.hex ||
    '#000000';

  const sizeMap = {
    small: '150px',
    medium: '200px',
    large: '250px',
    xlarge: '300px',
  };

  return (
    <div
      className="relative rounded-lg p-12 shadow-lg flex items-center justify-center min-h-[400px]"
      style={{
        backgroundColor: bgHex,
        border: `3px solid ${borderHex}`,
      }}
    >
      {fileUrl ? (
        <div
          className="relative"
          style={{
            width: sizeMap[logoSize as keyof typeof sizeMap] || '200px',
            height: sizeMap[logoSize as keyof typeof sizeMap] || '200px',
          }}
        >
          <Image
            src={fileUrl}
            alt="Logo Preview"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="text-gray-400 text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>
          <p className="text-sm">Logo akan ditampilkan di sini</p>
        </div>
      )}
    </div>
  );
}
