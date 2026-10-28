import React, { useState } from 'react';
import { X, Heart, Star, Check, ShieldCheck, Truck, RotateCcw, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'specs'>('details');

  if (!isOpen || !product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="關閉商品視窗"
          className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              <button
                onClick={() => onToggleWishlist(product.id)}
                aria-label="收藏商品"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur transition-all cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>

            {/* Tags strip */}
            <div className="flex flex-wrap gap-2 text-xs">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick Guarantees */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>全館滿 NT$ 1,000 即享免運 / 24-48小時內出貨</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% 產地原料履歷檢驗合格、天然無人工防腐劑</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-700 shrink-0" />
                <span>毛孩不適應享 14 天安心換貨服務</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category Breadcrumb */}
              <div className="text-xs text-stone-500 mb-2 flex items-center gap-2">
                <span>{product.targetPet === 'dog' ? '狗狗' : product.targetPet === 'cat' ? '貓咪' : '全齡犬貓'}</span>
                <span>/</span>
                <span>{product.category}</span>
                <span className="text-emerald-700 font-medium">· 現貨供應中</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-semibold text-stone-800">{product.rating}</span>
                </div>
                <span className="text-stone-400">·</span>
                <span className="text-stone-600">{product.reviewsCount} 則真實家長好評</span>
              </div>

              {/* Price */}
              <div className="mt-4 pb-4 border-b border-stone-200 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
                  NT$ {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                    NT$ {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded">
                  購買可獲贈 {Math.floor(product.price * 0.1)} 點 VIP 點數
                </span>
              </div>

              {/* Tabs for details */}
              <div className="mt-4">
                <div className="flex border-b border-stone-200 gap-6 text-sm">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2.5 font-medium transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    產品特色
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2.5 font-medium transition-colors cursor-pointer ${
                      activeTab === 'specs'
                        ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    規格說明
                  </button>
                  {product.nutrition && (
                    <button
                      onClick={() => setActiveTab('nutrition')}
                      className={`pb-2.5 font-medium transition-colors cursor-pointer ${
                        activeTab === 'nutrition'
                          ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      營養分析保證值
                    </button>
                  )}
                </div>

                <div className="py-4 text-xs text-stone-600 leading-relaxed min-h-[140px]">
                  {activeTab === 'details' && (
                    <div className="space-y-3">
                      <p className="text-stone-700">{product.description}</p>
                      <ul className="space-y-1.5 pt-1">
                        {product.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {product.specs.weightOrSize && (
                        <div>
                          <span className="text-stone-400 block">規格淨重</span>
                          <span className="font-medium text-stone-800">{product.specs.weightOrSize}</span>
                        </div>
                      )}
                      {product.specs.origin && (
                        <div>
                          <span className="text-stone-400 block">產地製造</span>
                          <span className="font-medium text-stone-800">{product.specs.origin}</span>
                        </div>
                      )}
                      {product.specs.suitableFor && (
                        <div className="col-span-2">
                          <span className="text-stone-400 block">適用對象</span>
                          <span className="font-medium text-stone-800">{product.specs.suitableFor}</span>
                        </div>
                      )}
                      {product.specs.material && (
                        <div className="col-span-2">
                          <span className="text-stone-400 block">材質面料</span>
                          <span className="font-medium text-stone-800">{product.specs.material}</span>
                        </div>
                      )}
                      {product.specs.shelfLife && (
                        <div>
                          <span className="text-stone-400 block">有效保存期限</span>
                          <span className="font-medium text-stone-800">{product.specs.shelfLife}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'nutrition' && product.nutrition && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="p-2 bg-stone-50 rounded border border-stone-200">
                          <div className="text-stone-400 text-[11px]">粗蛋白質</div>
                          <div className="font-mono font-bold text-stone-900">{product.nutrition.protein}</div>
                        </div>
                        <div className="p-2 bg-stone-50 rounded border border-stone-200">
                          <div className="text-stone-400 text-[11px]">粗脂肪</div>
                          <div className="font-mono font-bold text-stone-900">{product.nutrition.fat}</div>
                        </div>
                        <div className="p-2 bg-stone-50 rounded border border-stone-200">
                          <div className="text-stone-400 text-[11px]">粗纖維</div>
                          <div className="font-mono font-bold text-stone-900">{product.nutrition.fiber}</div>
                        </div>
                        <div className="p-2 bg-stone-50 rounded border border-stone-200">
                          <div className="text-stone-400 text-[11px]">水分</div>
                          <div className="font-mono font-bold text-stone-900">{product.nutrition.moisture}</div>
                        </div>
                        <div className="p-2 bg-stone-50 rounded border border-stone-200 col-span-2 sm:col-span-2">
                          <div className="text-stone-400 text-[11px]">代謝熱量</div>
                          <div className="font-mono font-bold text-stone-900">{product.nutrition.calories}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 pt-1">
                        *符合美國 AAFCO 犬貓全齡營養標準規範，請依毛孩活動量與體態調整每日餵食量。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-stone-700">購買數量：</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                  <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-stone-200 text-stone-600 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-mono font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="p-2 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-stone-500">
                  小計：<strong className="text-stone-900 font-mono text-sm">NT$ {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl border border-stone-900 text-stone-900 font-semibold text-sm hover:bg-stone-100 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>加入購物車</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>立即結帳</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
