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

export const DEFAULT_LEAD_TIME_DAYS = 3;
export const SITE_NAME = 'Nilam Bordir';
export const CONTACT_WHATSAPP = '6281234567890';
