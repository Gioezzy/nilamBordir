'use client';

import { useState, ReactNode, useCallback } from 'react';
import { OrderCustomization } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import SalempangForm from './forms/salempang-form';
import BordirNamaForm from './forms/bordir-nama-form';
import BordirLogoForm from './forms/bordir-logo-form';

interface OrderFormBuilderProps {
  productBasePrice: number;
  onCustomizationChange: (customization: OrderCustomization) => void;
  categorySlug: string;
  actions?: ReactNode;
  headerContent?: ReactNode;
}

export default function OrderFormBuilder({
  productBasePrice,
  onCustomizationChange,
  categorySlug,
  actions,
  headerContent,
}: OrderFormBuilderProps) {
  const [customization, setCustomization] =
    useState<OrderCustomization | null>(null);

  const handleCustomizationChange = useCallback(
    (customization: OrderCustomization) => {
      setCustomization(customization);
      onCustomizationChange(customization);
    },
    [onCustomizationChange]
  );

  const renderForm = () => {
    switch (categorySlug) {
      case 'salempang-bordir':
        return (
          <SalempangForm
            productBasePrice={productBasePrice}
            onCustomizationChange={handleCustomizationChange}
          />
        );
      case 'bordir-nama':
        return (
          <BordirNamaForm
            productBasePrice={productBasePrice}
            onCustomizationChange={handleCustomizationChange}
          />
        );
      case 'bordir-logo':
        return (
          <BordirLogoForm
            productBasePrice={productBasePrice}
            onCustomizationChange={handleCustomizationChange}
          />
        );
      default:
        return (
          <p className="text-center col-span-3">
            Kategori produk ini tidak mendukung kustomisasi online.
          </p>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2">{renderForm()}</div>

      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 self-start space-y-6">
          {headerContent}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Ringkasan Harga</h3>
            <div className="space-y-1 text-sm">
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {formatRupiah(customization?.totalPrice ?? productBasePrice)}
                </span>
              </div>
            </div>
          </div>
          {actions}
        </div>
      </div>
    </div>
  );
}
