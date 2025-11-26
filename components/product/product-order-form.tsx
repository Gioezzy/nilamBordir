'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { OrderCostomization } from '@/lib/types';
import OrderFormBuilder from './order-form-builder';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ShoppingCart } from 'lucide-react';
import { getProductImage } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface ProductOrderFormProps {
  product: Product;
}

export default function ProductOrderForm({ product }: ProductOrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<
    OrderCostomization | undefined
  >(undefined);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!customization) {
      toast.error('Mohon tunggu kustomisasi selesai dimuat.');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: customization.totalPrice, // Use the final price from the builder
      quantity,
      image: getProductImage(product.sample_images),
      customization: customization,
    });

    toast.success('Produk ditambahkan ke keranjang!');
  };

  const ActionButtons = (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <Separator />
      <div className="space-y-2">
        <Label>Jumlah</Label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={e =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="w-full"
        disabled={!customization}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Tambah ke Keranjang
      </Button>
    </div>
  );

  return (
    <OrderFormBuilder
      productBasePrice={product.price}
      onCustomizationChange={setCustomization}
      actions={ActionButtons}
    />
  );
}
