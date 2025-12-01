/* eslint-disable @typescript-eslint/no-explicit-any */
import { BORDIR_CONFIG } from '@/lib/constans';
import { formatRupiah } from '@/lib/utils';

interface DesignDetailDisplayProps {
  categorySlug: string;
  customization: any;
  additionalNotes?: string;
}

export default function DesignDetailDisplay({
  categorySlug,
  customization,
  additionalNotes,
}: DesignDetailDisplayProps) {
  if (!customization) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-500 text-center">
          Data kustomisasi tidak tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categorySlug === 'salempang-bordir' && (
        <SalempangDetails customization={customization} />
      )}

      {categorySlug === 'bordir-nama' && (
        <BordirNamaDetails customization={customization} />
      )}

      {categorySlug === 'bordir-logo' && (
        <BordirLogoDetails customization={customization} />
      )}

      {additionalNotes && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📝</span>
            Catatan Tambahan
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {additionalNotes}
          </p>
        </div>
      )}

      {customization.totalPrice && (
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <h3 className="font-semibold mb-4 text-green-900">
            💰 Estimasi Harga
          </h3>
          <div className="space-y-2 text-sm">
            {customization.basePriceFromTitik && (
              <div className="flex justify-between">
                <span className="text-green-800">Harga Dasar:</span>
                <span className="font-medium text-green-900">
                  {formatRupiah(customization.basePriceFromTitik)}
                </span>
              </div>
            )}
            {customization.logoPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-green-800">Tambahan Logo:</span>
                <span className="font-medium text-green-900">
                  {formatRupiah(customization.logoPrice)}
                </span>
              </div>
            )}
            <div className="border-t border-green-300 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-green-900">Total:</span>
              <span className="font-bold text-lg text-green-900">
                {formatRupiah(customization.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SalempangDetails({ customization }: { customization: any }) {
  const {
    titik,
    salempangColor,
    threadColor,
    contentGap,
    contents = [],
  } = customization;

  const titikLabel = BORDIR_CONFIG.TITIK_OPTIONS.find(
    (t) => t.value === titik
  )?.label;
  const salempangLabel = BORDIR_CONFIG.SALEMPANG_COLORS.find(
    (c) => c.value === salempangColor
  )?.label;
  const threadLabel = BORDIR_CONFIG.THREAD_COLORS.find(
    (c) => c.value === threadColor
  )?.label;
  const gapLabel = BORDIR_CONFIG.CONTENT_GAP_OPTIONS.find(
    (g) => g.value === contentGap
  )?.label;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>🎀</span>
        Spesifikasi Salempang
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 mb-1">Jumlah Titik</p>
          <p className="font-medium">{titikLabel || titik}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">Warna Salempang</p>
          <p className="font-medium">{salempangLabel || salempangColor}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">Warna Benang</p>
          <p className="font-medium">{threadLabel || threadColor}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">Jarak Konten</p>
          <p className="font-medium">{gapLabel || contentGap}</p>
        </div>
      </div>

      {contents && contents.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Konten ({contents.length} item):</h4>
          <div className="space-y-3">
            {contents.map((content: any, idx: number) => (
              <div
                key={content.id || idx}
                className="bg-gray-50 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {content.type === 'text' ? '📝 Teks' : '🖼️ Logo'} #{idx + 1}
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {content.layout === 'vertical' ? '↕️ Vertikal' : '↔️ Horizontal'}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {content.position === 'left' ? '← Kiri' : '→ Kanan'}
                    </span>
                  </div>
                </div>
                {content.type === 'text' && content.value && (
                  <p className="text-gray-700 font-medium">&#34;{content.value}&#34;</p>
                )}
                {content.type === 'logo' && (
                  <p className="text-gray-500 italic">Logo uploaded</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BordirNamaDetails({ customization }: { customization: any }) {
  const { namaText, threadColor, backgroundColor, fontSize } = customization;

  const threadLabel = BORDIR_CONFIG.THREAD_COLORS.find(
    (c) => c.value === threadColor
  )?.label;
  const bgLabel = BORDIR_CONFIG.SALEMPANG_COLORS.find(
    (c) => c.value === backgroundColor
  )?.label;

  const fontSizeMap = {
    small: 'Kecil',
    medium: 'Sedang',
    large: 'Besar',
    xlarge: 'Sangat Besar',
  };
  const fontSizeLabel = fontSizeMap[fontSize as keyof typeof fontSizeMap] || fontSize;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>✍️</span>
        Spesifikasi Bordir Nama
      </h3>
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-600 mb-1">Teks Nama</p>
          <p className="font-medium text-lg">&#34;{namaText || '-'}&#34;</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-1">Warna Benang</p>
            <p className="font-medium">{threadLabel || threadColor}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Warna Background</p>
            <p className="font-medium">{bgLabel || backgroundColor}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Ukuran Font</p>
            <p className="font-medium">{fontSizeLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BordirLogoDetails({ customization }: { customization: any }) {
  const { logoSize, backgroundColor, borderColor } = customization;

  const bgLabel = BORDIR_CONFIG.SALEMPANG_COLORS.find(
    (c) => c.value === backgroundColor
  )?.label;
  const borderLabel = BORDIR_CONFIG.THREAD_COLORS.find(
    (c) => c.value === borderColor
  )?.label;

  const sizeMap = {
    small: 'Kecil (15cm x 15cm)',
    medium: 'Sedang (20cm x 20cm)',
    large: 'Besar (25cm x 25cm)',
    xlarge: 'Sangat Besar (30cm x 30cm)',
  };
  const sizeLabel = sizeMap[logoSize as keyof typeof sizeMap] || logoSize;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>🎨</span>
        Spesifikasi Bordir Logo
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 mb-1">Ukuran Logo</p>
          <p className="font-medium">{sizeLabel}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">Warna Background</p>
          <p className="font-medium">{bgLabel || backgroundColor}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">Warna Border</p>
          <p className="font-medium">{borderLabel || borderColor}</p>
        </div>
      </div>
    </div>
  );
}