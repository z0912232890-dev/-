import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenQuiz: () => void;
  onOpenMemberPets: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onOpenQuiz,
  onOpenMemberPets,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/70 to-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>毛孩家庭的純淨選物所 · 會員專屬生活禮遇</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.2]">
              給毛孩最純淨的呵護，<br className="hidden sm:inline" />
              宛如家人般的溫柔陪伴
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              嚴選紐西蘭天然草飼原肉生食凍乾、野生海魚無膠主食罐與北歐護脊睡窩。每位會員皆可建立專屬「毛孩健康檔案」，依據年齡、體態與過敏原，量身推薦專屬日常營養提案。
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>探索當季熱銷選物</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenMemberPets}
                className="px-5 py-3 bg-white hover:bg-stone-100 text-stone-800 font-medium text-sm rounded-xl border border-stone-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>查看毛孩健康檔案</span>
              </button>
            </div>

            {/* Adjacency Trust Indicators */}
            <div className="pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AAFCO 營養標準</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>無防腐劑人工香精</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>VIP 點數 10% 回饋</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 aspect-[16/10] bg-stone-100">
              <img
                src="/src/assets/images/hero_pet_living_1793168332117.jpg"
                alt="在明亮北歐客廳安穩休憩的黃金獵犬與英國短毛貓"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

              {/* Quiet overlay caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <div>
                  <p className="font-medium text-stone-100">波波 (黃金獵犬) & 咪咪 (英短貓)</p>
                  <p className="text-stone-300 text-[11px]">萌寵森活會員專屬生活空間</p>
                </div>
                <button
                  onClick={onOpenQuiz}
                  className="bg-white/90 hover:bg-white text-stone-900 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur transition-colors cursor-pointer"
                >
                  開始 1 分鐘測驗 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
