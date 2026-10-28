import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Truck, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const FREE_SHIPPING_THRESHOLD = 1000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon === 'FREESHIP';
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : 100;

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon === 'PAWVIP') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedCoupon === 'NEWFRIEND') {
    discount = 150;
  }

  const finalTotal = Math.max(0, subtotal - discount + shippingFee);
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const ok = onApplyCoupon(couponCode.trim());
    if (ok) {
      setCouponCode('');
    } else {
      setCouponError('優惠代碼無效或已過期 (可試試 PAWVIP 或 NEWFRIEND)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 font-serif">購物車選物</h2>
            <span className="text-xs text-stone-500">
              ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} 件商品)
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉購物車"
            className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-stone-50 p-4 border-b border-stone-200/80 text-xs">
          <div className="flex items-center justify-between text-stone-700 font-medium mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-700" />
              <span>
                {isFreeShipping
                  ? '恭喜！已享有全館免運費優惠'
                  : `再消費 NT$ ${remainingForFreeShip.toLocaleString()} 即享免運`}
              </span>
            </div>
            <span className="font-mono text-stone-500">{Math.round(freeShipPercent)}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-full transition-all duration-300"
              style={{ width: `${freeShipPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-stone-700 font-medium">購物車目前是空的</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                為家裡的毛孩挑選天然主食生肉凍乾、無膠慕斯罐或人體工學舒眠沙發吧！
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer"
              >
                前往選購
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3.5 pb-4 border-b border-stone-100 last:border-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200/60"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      單價 NT$ {item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                        aria-label="減少數量"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                        aria-label="增加數量"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-mono font-bold text-stone-900">
                        NT$ {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        aria-label="刪除此商品"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupon and Summary Area */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                    <span>已套用優惠券：<strong>{appliedCoupon}</strong></span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-stone-500 hover:text-stone-800 text-[11px] underline cursor-pointer"
                  >
                    取消套用
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      placeholder="輸入優惠碼 (如 PAWVIP)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    套用
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/60 pt-3">
              <div className="flex justify-between">
                <span>商品小計</span>
                <span className="font-mono text-stone-900 tabular-nums">
                  NT$ {subtotal.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>會員折扣折抵</span>
                  <span className="font-mono tabular-nums">- NT$ {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>運費</span>
                <span className="font-mono text-stone-900 tabular-nums">
                  {shippingFee === 0 ? '免費' : `NT$ ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>應付結帳總額</span>
                <span className="font-mono tabular-nums">
                  NT$ {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>前往訂單結帳</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
