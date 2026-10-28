import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const popularKeywords = ['生肉凍乾', '無膠慕斯罐', '護脊記憶床', '植萃洗毛精', '貓草球', '魚油'];

  const filteredProducts = products.filter((p) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.shortDesc.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term)) ||
      (term.includes('狗') && (p.targetPet === 'dog' || p.targetPet === 'all')) ||
      (term.includes('貓') && (p.targetPet === 'cat' || p.targetPet === 'all'))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="搜尋商品關鍵字（如：凍乾、主食罐、洗毛精、護脊床）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base sm:text-lg focus:outline-none text-stone-900 placeholder:text-stone-400"
          />
          <button
            onClick={onClose}
            aria-label="關閉搜尋"
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular searches suggestions */}
        <div className="p-4 bg-stone-50 border-b border-stone-200/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-400 shrink-0">熱門搜尋：</span>
          <div className="flex gap-2">
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchTerm(kw)}
                className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-200 rounded-lg text-stone-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              請輸入關鍵字快速尋找您家毛孩所需的美食與選物
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              查無符合「{searchTerm}」的選品，請嘗試其他關鍵字
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs text-stone-500 block mb-2 font-medium">
                找到 {filteredProducts.length} 件相關選品：
              </span>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="p-3 bg-stone-50 hover:bg-amber-50/50 border border-stone-200/80 hover:border-amber-300 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">{p.shortDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-sm font-bold text-stone-900">
                      NT$ {p.price.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
