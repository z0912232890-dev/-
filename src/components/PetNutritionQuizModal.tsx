import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface PetNutritionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddBundleToCart: (productsToAdd: { product: Product; quantity: number }[]) => void;
  onSelectProduct: (product: Product) => void;
}

export const PetNutritionQuizModal: React.FC<PetNutritionQuizModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddBundleToCart,
  onSelectProduct,
}) => {
  const [step, setStep] = useState<number>(1);
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [ageGroup, setAgeGroup] = useState<'puppy' | 'adult' | 'senior'>('adult');
  const [focusArea, setFocusArea] = useState<'skin' | 'digestion' | 'joints' | 'hydration'>('skin');

  if (!isOpen) return null;

  // Compute matched products
  const matchedProducts: Product[] = [];

  if (petType === 'dog') {
    const dogFood = products.find((p) => p.id === 'prod-01') || products[0];
    const treats = products.find((p) => p.id === 'prod-05') || products[4];
    const care = focusArea === 'skin'
      ? products.find((p) => p.id === 'prod-04') || products[3]
      : products.find((p) => p.id === 'prod-06') || products[5];
    matchedProducts.push(dogFood, treats, care);
  } else {
    const catFood = products.find((p) => p.id === 'prod-02') || products[1];
    const treats = products.find((p) => p.id === 'prod-05') || products[4];
    const waterCare = products.find((p) => p.id === 'prod-07') || products[6];
    matchedProducts.push(catFood, treats, waterCare);
  }

  const bundleSubtotal = matchedProducts.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscountPrice = Math.round(bundleSubtotal * 0.88); // 88折組合優惠

  const handleAddAll = () => {
    onAddBundleToCart(matchedProducts.map((p) => ({ product: p, quantity: 1 })));
    onClose();
  };

  const handleReset = () => {
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-lg font-serif">
                毛孩專屬配糧與日常護理測驗
              </h3>
              <p className="text-xs text-amber-200/90">
                僅需 3 個問題，由獸醫師與寵物營養師團隊量身精算
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉測驗"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-amber-800 tracking-wider uppercase block">
                問題 1 / 3
              </span>
              <h4 className="text-lg font-bold text-stone-900">
                家裡的毛孩是哪位可愛成員呢？
              </h4>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPetType('dog');
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    petType === 'dog'
                      ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-5xl block mb-2">🐕</span>
                  <span className="font-bold text-stone-900 block">汪星人 (狗狗)</span>
                  <span className="text-xs text-stone-500 mt-1 block">活潑忠誠的探險家</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPetType('cat');
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    petType === 'cat'
                      ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-5xl block mb-2">🐈</span>
                  <span className="font-bold text-stone-900 block">喵星人 (貓咪)</span>
                  <span className="text-xs text-stone-500 mt-1 block">優雅敏銳的家庭皇室</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-amber-800 tracking-wider uppercase block">
                問題 2 / 3
              </span>
              <h4 className="text-lg font-bold text-stone-900">
                毛孩目前的成長年齡階段是？
              </h4>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'puppy', label: '幼年期 (0 - 1 歲)', desc: '骨骼發育關鍵期，需高能量、高鈣磷平衡與免疫強化' },
                  { id: 'adult', label: '成犬/成貓活躍期 (1 - 7 歲)', desc: '體態維持、皮膚亮澤與肌肉耐力維持' },
                  { id: 'senior', label: '熟齡長青期 (7 歲以上)', desc: '關節守護、心血管保健與低鈉無膠高消化性配方' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAgeGroup(item.id as any);
                      setStep(3);
                    }}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      ageGroup === item.id
                        ? 'border-stone-900 bg-stone-50 font-semibold'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-sm">{item.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  ← 返回上一題
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-amber-800 tracking-wider uppercase block">
                問題 3 / 3
              </span>
              <h4 className="text-lg font-bold text-stone-900">
                您目前最希望為毛孩加強照護的重點是？
              </h4>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { id: 'skin', label: '皮毛搔癢與脆弱易敏', sub: '舒敏燕麥與草本洗護' },
                  { id: 'digestion', label: '挑嘴軟便、消化道吸收', sub: '無穀凍乾純肉與活菌' },
                  { id: 'joints', label: '活力跑跳、關節與脊椎保護', sub: '護脊記憶床與深海魚油' },
                  { id: 'hydration', label: '不愛喝水、泌尿道健康維持', sub: '流動智慧活水機與慕斯罐' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFocusArea(item.id as any);
                      setStep(4);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      focusArea === item.id
                        ? 'border-amber-700 bg-amber-50/60 font-semibold shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-xs sm:text-sm">{item.label}</div>
                    <div className="text-[11px] text-stone-500 mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  ← 返回上一題
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Results & Bundle Recommendation */}
          {step === 4 && (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>測驗分析完成</span>
                </div>
                <h4 className="text-xl font-bold font-serif text-stone-900">
                  專為您的毛孩打造的「天然純淨日常護理套組」
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  針對 {petType === 'dog' ? '狗狗' : '貓咪'} 在此成長階段的高優質蛋白與生活需求調配
                </p>
              </div>

              {/* Matched Products Strip */}
              <div className="space-y-2.5">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg bg-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-stone-900 block truncate">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          {p.shortDesc}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-900 shrink-0">
                      NT$ {p.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bundle Pricing Card */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-900 font-medium block">
                    測驗專屬 3 件特惠套組 (88 折優惠)
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold font-mono text-stone-900">
                      NT$ {bundleDiscountPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-stone-400 line-through">
                      NT$ {bundleSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddAll}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>一鍵打包入購物車</span>
                </button>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs text-stone-500">
                <button
                  type="button"
                  onClick={handleReset}
                  className="hover:text-stone-800 underline cursor-pointer"
                >
                  重新測驗
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-stone-800 underline cursor-pointer"
                >
                  關閉
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
