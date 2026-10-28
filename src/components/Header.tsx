import React from 'react';
import { ShoppingBag, Heart, User, Search, Sparkles } from 'lucide-react';
import { MemberUser, CartItem } from '../types';

interface HeaderProps {
  member: MemberUser | null;
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenMember: (tab?: 'overview' | 'pets' | 'orders' | 'wishlist') => void;
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
  activeNav: string;
  onSelectNav: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  member,
  cartItems,
  wishlistCount,
  onOpenCart,
  onOpenMember,
  onOpenSearch,
  onOpenQuiz,
  activeNav,
  onSelectNav,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>全館消費滿 NT$ 1,000 享冷藏常溫免運費</span>
        <span className="text-stone-500" aria-hidden="true">·</span>
        <button
          onClick={onOpenQuiz}
          className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>毛孩專屬配糧測驗</span>
        </button>
      </div>

      {/* Main 3-zone Header Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectNav('all')}
          className="text-left group cursor-pointer shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-serif">
              萌寵森活
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              PAWPAL
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <button
            onClick={() => onSelectNav('all')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-0.5 ${
              activeNav === 'all'
                ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                : 'hover:text-stone-950'
            }`}
          >
            全部選品
          </button>
          <button
            onClick={() => onSelectNav('dog')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-0.5 ${
              activeNav === 'dog'
                ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                : 'hover:text-stone-950'
            }`}
          >
            狗狗專區
          </button>
          <button
            onClick={() => onSelectNav('cat')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-0.5 ${
              activeNav === 'cat'
                ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                : 'hover:text-stone-950'
            }`}
          >
            貓貓專區
          </button>
          <button
            onClick={() => onSelectNav('care')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-0.5 ${
              activeNav === 'care'
                ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                : 'hover:text-stone-950'
            }`}
          >
            草本保健與洗沐
          </button>
          <button
            onClick={() => onOpenMember('overview')}
            className="cursor-pointer transition-colors whitespace-nowrap hover:text-stone-950 text-amber-800 font-semibold"
          >
            VIP 會員俱樂部
          </button>
        </nav>

        {/* Zone 3: Functional Affordances (Search, Wishlist, Cart, Member) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="搜尋商品"
            className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => onOpenMember('wishlist')}
            aria-label="收藏清單"
            className="relative p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            aria-label="購物車"
            className="relative p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Member Profile Quick Trigger */}
          <button
            onClick={() => onOpenMember('overview')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-full transition-colors cursor-pointer text-xs font-medium"
          >
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
              {member ? member.name.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden sm:inline-block max-w-[90px] truncate">
              {member ? member.name.split(' ')[0] : '會員登入'}
            </span>
            {member && (
              <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-bold">
                VIP
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
