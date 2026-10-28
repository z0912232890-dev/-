import React from 'react';
import { ShieldCheck, Heart, Mail, Phone, Clock } from 'lucide-react';

interface FooterProps {
  onOpenMember: () => void;
  onOpenQuiz: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMember,
  onOpenQuiz,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif text-white tracking-tight">
                萌寵森活
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                PAWPAL
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              致力於為台灣與全球毛孩家庭提供純淨天然無毒的生食凍乾、無膠慕斯罐、人體工學舒眠選品與專業會員客製健康照護系統。
            </p>

            <div className="pt-2 flex items-center gap-2 text-stone-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>全品項通過 SGS 重金屬、黃麴毒素與生菌數檢驗合格</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              選物品項
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('food')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  主食凍乾 / 鮮肉罐
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('treats')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  天然原肉零食
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bedding')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  護脊人體工學床
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('care')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  草本洗沐與深海魚油
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              會員與毛孩健康
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={onOpenMember}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  VIP 會員專屬禮遇 (9折優惠)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMember}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  毛孩健康檔案登錄
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  1 分鐘專屬配糧測驗
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMember}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  訂單即時配送歷程
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              毛孩管家客服
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>週一至週五 09:30 - 18:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>客服專線：(02) 2755-8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>service@pawpal-petlife.tw</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                全館提供 14 天鑑賞期、瑕疵免費換貨與滿千免運保障。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© 2026 萌寵森活 PAWPAL Co., Ltd. 版權所有 · 守護毛孩的每一刻日常</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">隱私權政策</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">購物配送須知</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">會員條款</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
