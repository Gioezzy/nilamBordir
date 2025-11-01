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

export const PAYMENT_METHODS: Record<string, string> = {
  bank_transfer: 'Transfer Bank',
  gopay: 'Gopay',
  shopeepay: 'Shopeepay',
  qris: 'QRIS',
  dana: 'Dana',
};

export const DEFAULT_LEAD_TIME_DAYS = 3;
export const SITE_NAME = 'Nilam Bordir';
export const CONTACT_WHATSAPP = '6281234567890';
