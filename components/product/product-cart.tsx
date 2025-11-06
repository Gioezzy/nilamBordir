/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah, getProductImage } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    sample_images: any;
    category?: {
      name: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImage(product.sample_images);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {product.category.name}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:to-gray-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-gray-900">
          {formatRupiah(product.price)}
        </p>
      </div>
    </Link>
  );
}
