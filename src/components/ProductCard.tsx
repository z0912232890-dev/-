import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const getCategoryLabel = (cat: Product['category']) => {
    switch (cat) {
      case 'food':
        return '主食凍乾 / 鮮肉罐';
      case 'treats':
        return '賞賜零食';
      case 'bedding':
        return '舒壓睡窩';
      case 'care':
        return '草本洗沐保健';
      case 'gear':
        return '日用玩具選品';
    }
  };

  const getPetTargetLabel = (target: Product['targetPet']) => {
    switch (target) {
      case 'dog':
        return '狗狗專用';
      case 'cat':
        return '貓咪專用';
      case 'all':
        return '全犬貓適用';
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all duration-300">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Floating Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? '從收藏移除' : '加入收藏'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-sm backdrop-blur transition-all cursor-pointer z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Subtle Tag Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="text-[11px] font-semibold tracking-wide text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded shadow-sm backdrop-blur">
              熱銷推薦
            </span>
          )}
          {product.isNew && (
            <span className="text-[11px] font-semibold tracking-wide text-stone-900 bg-white/90 px-2 py-0.5 rounded shadow-sm backdrop-blur">
              新上市
            </span>
          )}
        </div>

        {/* Quick View Hover Trigger */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={() => onSelectProduct(product)}
            className="px-3.5 py-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>查看詳情</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span>{getCategoryLabel(product.category)}</span>
            <span aria-hidden="true">·</span>
            <span>{getPetTargetLabel(product.targetPet)}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-medium text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-stone-500 line-clamp-1">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Rating & Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                NT$ {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  NT$ {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 mt-0.5 text-xs text-stone-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-stone-800">{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            aria-label={`將 ${product.name} 加入購物車`}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
