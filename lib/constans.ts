export const CATEGORIES = {
  SALEMPANG: {
    slug: 'salempang-bordir',
    name: 'Salempang Bordir',
  },
  NAMA: {
    slug: 'bordir-nama',
    name: 'Bordir Nama',
  },
  LOGO: {
    slug: 'bordir-logo',
    name: 'Bordir Logo',
  },
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Menunggu Pembayaran',
  paid: 'Sudah Dibayar',
  in_production: 'Sedang Diproduksi',
  ready_for_pickup: 'Siap Diambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  ready_for_pickup: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const DESIGN_STATUS_LABELS: Record<string, string> = {
  uploaded: 'Diunggah',
  reviewed: 'Sedang Direview',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

export const DESIGN_STATUS_COLORS: Record<string, string> = {
  uploaded: 'bg-gray-100 text-gray-800',
  reviewed: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const PAYMENT_METHODS: Record<string, string> = {
  gopay: 'GoPay',
  qris: 'QRIS',
  credit_card: 'Kartu Kredit',
  bca_va: 'BCA Virtual Account',
  bni_va: 'BNI Virtual Account',
  bri_va: 'BRI Virtual Account',
  mandiri_va: 'Mandiri Virtual Account',
  permata_va: 'Permata Virtual Account',
  shopeepay: 'ShopeePay',
  dana: 'Dana',
};

export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
};

export const BORDIR_CONFIG = {
  TITIK_OPTIONS: [
    {value: '2', label: '2 Titik', price: 60000},
    {value: '3', label: '3 Titik Vertikal', price: 70000},
    {value: '4_datar', label: '4 Titik Datar', price: 70000},
    {value: '4', label: '4 Titik', price: 75000},
    {value: '4_vertikal', label: '4 Titik Vertila', price: 75000},
    {value: '4_garis', label: '4 Titik Garis', price: 75000},
    {value: '5_garus', label: '5 Titik Garis', price: 80000}
  ],

  LAYOUT_TYPES: [
    { value: 'vertikal', label: 'Vertikal', icon: '|' },
    { value: 'horizontal', label: 'Horizontal (Datar)', icon: '—' },
    { value: 'garis', label: 'Garis', icon: '/' },
  ],

  FONT_STYLES: [
    { value: 'arial', label: 'Arial', preview: 'Arial' },
    { value: 'casual_serif', label: 'Casual Serif', preview: 'Casual Serif' },
    { value: 'chancery', label: 'Chancery', preview: 'Chancery' },
    { value: 'seagul', label: 'Seagul', preview: 'Seagul' },
  ],

  THREAD_COLORS: [
    { value: 'hitam', label: 'Hitam', hex: '#000000' },
    { value: 'putih', label: 'Putih', hex: '#FFFFFF' },
    { value: 'merah', label: 'Merah', hex: '#DC2626' },
    { value: 'biru', label: 'Biru', hex: '#2563EB' },
    { value: 'hijau', label: 'Hijau', hex: '#16A34A' },
    { value: 'kuning', label: 'Kuning', hex: '#EAB308' },
    { value: 'orange', label: 'Orange', hex: '#EA580C' },
    { value: 'ungu', label: 'Ungu', hex: '#9333EA' },
    { value: 'emas', label: 'Emas', hex: '#F59E0B' },
    { value: 'silver', label: 'Silver', hex: '#94A3B8' },
  ],

  LOGO_POSITIONS: [
    { value: 'left', label: 'Kiri', icon: '◀' },
    { value: 'right', label: 'Kanan', icon: '▶' },
    { value: 'center', label: 'Tengah', icon: '●' },
    { value: 'top', label: 'Atas', icon: '▲' },
    { value: 'bottom', label: 'Bawah', icon: '▼' },
  ],

  LOGO_SIZES: [
    { value: 'small', label: 'Kecil (3x3 cm)', priceAdd: 0 },
    { value: 'medium', label: 'Sedang (5x5 cm)', priceAdd: 10000 },
    { value: 'large', label: 'Besar (8x8 cm)', priceAdd: 20000 },
  ]
}

export const DEFAULT_LEAD_TIME_DAYS = 3;
export const SITE_NAME = 'Nilam Bordir';
export const CONTACT_WHATSAPP = '6281234567890';
