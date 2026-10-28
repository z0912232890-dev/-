import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { CartItem, MemberUser, OrderRecord } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  member: MemberUser | null;
  appliedCoupon: string | null;
  onCompleteOrder: (newOrder: OrderRecord) => void;
  onViewOrderInMemberCenter: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  member,
  appliedCoupon,
  onCompleteOrder,
  onViewOrderInMemberCenter,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'linepay' | 'cod'>('credit');
  const [shippingMethod, setShippingMethod] = useState<'home' | 'convenience'>('home');

  // Form Fields
  const [name, setName] = useState(member ? member.name.split(' ')[0] : '林心怡');
  const [phone, setPhone] = useState(member ? member.phone : '0912-232-890');
  const [address, setAddress] = useState(member ? member.address : '台北市大安區敦化南路二段 128 號 7 樓');
  const [notes, setNotes] = useState('如不在請放警衛室，謝謝');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= 1000 || appliedCoupon === 'FREESHIP';
  const shippingFee = isFreeShipping ? 0 : 100;

  let discount = 0;
  if (appliedCoupon === 'PAWVIP') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedCoupon === 'NEWFRIEND') {
    discount = 150;
  }

  const finalAmount = Math.max(0, subtotal - discount + shippingFee);
  const pointsToEarn = Math.floor(finalAmount * 0.1);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date();
    const orderId = `ORD-${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(timestamp.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingCode = `TC-${Math.floor(1000000000 + Math.random() * 9000000000)}TW`;

    const paymentLabel =
      paymentMethod === 'credit'
        ? '信用卡線上刷卡 (一次付清)'
        : paymentMethod === 'linepay'
        ? 'LINE Pay 行動支付'
        : '黑貓宅急便 貨到付款 (現金)';

    const shippingLabel =
      shippingMethod === 'home'
        ? '黑貓冷藏常溫專車宅配到府'
        : '7-11 超商取貨不付款';

    const newOrder: OrderRecord = {
      id: orderId,
      date: timestamp.toLocaleString('zh-TW', { hour12: false }),
      items: [...cartItems],
      totalAmount: subtotal,
      discount,
      shippingFee,
      finalAmount,
      pointsEarned: pointsToEarn,
      status: 'processing',
      paymentMethod: paymentLabel,
      shippingMethod: shippingLabel,
      recipient: {
        name,
        phone,
        address,
      },
      trackingCode,
    };

    setLastPlacedOrder(newOrder);
    onCompleteOrder(newOrder);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-900">
              {step === 'form' ? '結帳與配送確認' : '訂單成立成功'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {step === 'form'
                ? '請確認收件人資訊與付款方式，將立即為毛孩安排出貨'
                : '感謝您的購買！萌寵森活正細心為您的毛孩備貨中'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉結帳視窗"
            className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-6">
            {/* Order Items Preview */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs">
              <span className="font-semibold text-stone-800 block mb-2">
                購買品項 ({cartItems.length} 項)
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center text-stone-700"
                  >
                    <span className="truncate max-w-[260px] sm:max-w-xs">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-mono tabular-nums font-medium">
                      NT$ {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-200 mt-3 pt-2 flex justify-between font-bold text-stone-900">
                <span>應付總額（含運費）</span>
                <span className="font-mono text-sm">NT$ {finalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>收件人與配送資訊</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    收件人姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    聯絡手機號碼 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 font-medium mb-1">
                    配送地址 *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 font-medium mb-1">
                    配送備註 / 警衛室代收
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                配送方式
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingMethod('home')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    shippingMethod === 'home'
                      ? 'border-stone-900 bg-stone-50 font-semibold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-stone-800" />
                    <span>宅配到府 (推薦)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-1">
                    黑貓冷藏/常溫溫控專車
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('convenience')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    shippingMethod === 'convenience'
                      ? 'border-stone-900 bg-stone-50 font-semibold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-stone-800" />
                    <span>超商取貨</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-1">
                    7-ELEVEN / 全家便利商店
                  </span>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                付款方式
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-stone-900 bg-stone-50 font-bold text-stone-900 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-stone-800" />
                  <span>線上刷卡</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('linepay')}
                  className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                    paymentMethod === 'linepay'
                      ? 'border-stone-900 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="font-bold text-sm block mb-0.5 text-emerald-600">LINE</span>
                  <span>LINE Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 bg-stone-50 font-bold text-stone-900 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Truck className="w-4 h-4 mx-auto mb-1 text-amber-700" />
                  <span>貨到付款</span>
                </button>
              </div>
            </div>

            {/* Points Earn Preview */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>此筆訂單完成後將獲得 VIP 會員點數：</span>
              </div>
              <strong className="font-mono text-sm text-amber-950 font-bold">
                +{pointsToEarn} 點
              </strong>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              確認並送出訂單 (NT$ {finalAmount.toLocaleString()})
            </button>
          </form>
        ) : (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold font-serif text-stone-900">
                訂單已成功送出！
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                我們已傳送簡訊與 Email 訂單明細給您，倉儲將於 24 小時內完成低溫裝箱。
              </p>
            </div>

            {lastPlacedOrder && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-400">訂單編號</span>
                  <span className="font-mono font-bold text-stone-900">{lastPlacedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">配送包裹單號</span>
                  <span className="font-mono text-stone-700">{lastPlacedOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">結帳金額</span>
                  <span className="font-mono font-bold text-stone-900">NT$ {lastPlacedOrder.finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">獲得 VIP 點數</span>
                  <span className="font-mono text-amber-700 font-bold">+{lastPlacedOrder.pointsEarned} 點</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">預計送達日期</span>
                  <span className="font-medium text-stone-800">48 小時內冷藏宅配出貨</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onClose();
                  onViewOrderInMemberCenter();
                }}
                className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer"
              >
                在會員中心查看此訂單進度
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100 transition-all cursor-pointer"
              >
                繼續選購商品
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
