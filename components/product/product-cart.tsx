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
      className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-secondary/50 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 border-0">
              {product.category.name}
            </Badge>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-primary">
          {formatRupiah(product.price)}
        </p>
      </div>
    </Link>
  );
}
