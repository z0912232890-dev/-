import React, { useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_MEMBER,
  INITIAL_ORDERS,
} from './data/mockData';
import { Product, MemberUser, OrderRecord, CartItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MemberCenterModal } from './components/MemberCenterModal';
import { PetNutritionQuizModal } from './components/PetNutritionQuizModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { Sparkles, Heart, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export default function App() {
  // Products
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Member state with local persistence
  const [member, setMember] = useState<MemberUser>(() => {
    const saved = localStorage.getItem('pawpal_member_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MEMBER;
      }
    }
    return INITIAL_MEMBER;
  });

  // Orders state with local persistence
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem('pawpal_orders_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Cart state with local persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pawpal_cart_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Prepopulate with 1 popular item for delightful initial preview
    return [{ product: INITIAL_PRODUCTS[0], quantity: 1 }];
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pawpal_wishlist_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['prod-01', 'prod-03'];
      }
    }
    return ['prod-01', 'prod-03'];
  });

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('PAWVIP');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [memberTab, setMemberTab] = useState<'overview' | 'pets' | 'orders' | 'wishlist'>('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Filter & Sort
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pawpal_member_v1', JSON.stringify(member));
  }, [member]);

  useEffect(() => {
    localStorage.setItem('pawpal_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pawpal_cart_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('pawpal_wishlist_v1', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`已將 ${product.name} 加入購物車！`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast('已從收藏清單移除');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('已成功加入毛孩心願收藏清單！');
        return [...prev, productId];
      }
    });
  };

  const handleApplyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'PAWVIP' || upper === 'FREESHIP' || upper === 'NEWFRIEND') {
      setAppliedCoupon(upper);
      showToast(`已成功套用優惠代碼：${upper}`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('已取消套用優惠券');
  };

  // Reorder from history
  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      handleAddToCart(item.product, item.quantity);
    });
    setIsMemberOpen(false);
    setIsCartOpen(true);
    showToast(`已將訂單 #${order.id} 的商品重新加入購物車！`);
  };

  // Complete Order
  const handleCompleteOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Award points and update member spending
    setMember((prev) => ({
      ...prev,
      points: prev.points + newOrder.pointsEarned,
      spentTotal: prev.spentTotal + newOrder.finalAmount,
      nextTierSpend: Math.max(0, prev.nextTierSpend - newOrder.finalAmount),
    }));
    setCartItems([]);
    showToast(`訂單 ${newOrder.id} 成立！已為您累積 ${newOrder.pointsEarned} VIP 點數！`);
  };

  // Add quiz bundle to cart
  const handleAddBundleToCart = (itemsToAdd: { product: Product; quantity: number }[]) => {
    itemsToAdd.forEach((item) => {
      handleAddToCart(item.product, item.quantity);
    });
    setIsCartOpen(true);
    showToast('已將測驗專屬特惠套組加入購物車！');
  };

  // Filter products
  const filteredProducts = products
    .filter((p) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'dog') return p.targetPet === 'dog' || p.targetPet === 'all';
      if (activeFilter === 'cat') return p.targetPet === 'cat' || p.targetPet === 'all';
      return p.category === activeFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Toast feedback notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        member={member}
        cartItems={cartItems}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMember={(tab = 'overview') => {
          setMemberTab(tab);
          setIsMemberOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        activeNav={activeFilter}
        onSelectNav={(cat) => {
          setActiveFilter(cat);
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <Hero
        onExploreProducts={() => {
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenMemberPets={() => {
          setMemberTab('pets');
          setIsMemberOpen(true);
        }}
      />

      {/* Member VIP Perks Spotlight Strip */}
      <section className="bg-amber-50/60 border-b border-amber-200/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
              ★
            </span>
            <div>
              <span className="font-bold text-stone-900">
                歡迎光臨 PAWPAL 會員俱樂部
              </span>
              <span className="text-stone-600 ml-2 hidden md:inline">
                登錄毛孩生日即贈 $200 禮金 · 結帳可折抵點數與專屬折扣
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMemberTab('pets');
                setIsMemberOpen(true);
              }}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 text-amber-900 font-semibold rounded-lg border border-amber-200 shadow-xs cursor-pointer transition-colors"
            >
              管理毛孩檔案 ({member.pets.length})
            </button>
            <button
              onClick={() => {
                setMemberTab('overview');
                setIsMemberOpen(true);
              }}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              查看我的 VIP 權益
            </button>
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <main id="products-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              Natural Curated Pet Supplies
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              天然純淨 · 毛孩生活精選物
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              嚴格把關每一份食材與材質，守護毛孩身體無負擔的健康美味。
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">排序方式：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="featured">熱銷推薦排序</option>
              <option value="rating">顧客好評最高</option>
              <option value="price-asc">價格：由低到高</option>
              <option value="price-desc">價格：由高到低</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Controls (Interactive Filter Buttons adhering to Section 1.A) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/60 rounded-xl overflow-x-auto mb-8 text-xs font-medium max-w-full">
          {[
            { id: 'all', label: '全部選品' },
            { id: 'dog', label: '🐕 汪星人專區' },
            { id: 'cat', label: '🐈 喵星人專區' },
            { id: 'food', label: '🥩 主食生肉凍乾/罐罐' },
            { id: 'treats', label: '🍖 賞賜原肉零食' },
            { id: 'bedding', label: '🛏️ 護脊釋壓睡窩' },
            { id: 'care', label: '🌿 草本洗沐與保健' },
            { id: 'gear', label: '🐾 日用玩具選品' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-500">
            <p className="text-base font-semibold">此分類目前尚無相關品項</p>
            <p className="text-xs text-stone-400 mt-1">您可以點擊「全部選品」查看所有毛孩商品</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              重設分類
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Personalized Member Recommended Section */}
        {member.pets.length > 0 && (
          <div className="mt-16 p-6 sm:p-8 bg-gradient-to-r from-amber-50/70 via-stone-50 to-stone-100 rounded-3xl border border-amber-200/60">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐾</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                    根據您家毛孩「{member.pets.map((p) => p.name).join('、')}」體質特別推薦
                  </h3>
                  <p className="text-xs text-stone-500">
                    依據體重、敏弱過敏原與日常喜好，為您的家庭精挑細選最無負擔的營養與生活提案。
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMemberTab('pets');
                  setIsMemberOpen(true);
                }}
                className="text-xs font-semibold text-amber-900 hover:text-amber-800 underline shrink-0 cursor-pointer"
              >
                編輯或新增毛孩檔案 →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-white p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all flex gap-3 cursor-pointer shadow-xs"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {prod.tags.join(' · ')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        NT$ {prod.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(prod, 1);
                        }}
                        className="px-2 py-1 bg-stone-900 text-white rounded text-[10px] font-semibold hover:bg-stone-800 cursor-pointer"
                      >
                        加入車
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenMember={() => {
          setMemberTab('overview');
          setIsMemberOpen(true);
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onSelectCategory={(cat) => {
          setActiveFilter(cat);
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={(prod, qty) => {
          handleAddToCart(prod, qty);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        member={member}
        appliedCoupon={appliedCoupon}
        onCompleteOrder={handleCompleteOrder}
        onViewOrderInMemberCenter={() => {
          setMemberTab('orders');
          setIsMemberOpen(true);
        }}
      />

      {/* Member Center Modal */}
      <MemberCenterModal
        isOpen={isMemberOpen}
        onClose={() => setIsMemberOpen(false)}
        initialTab={memberTab}
        member={member}
        orders={orders}
        products={products}
        wishlistIds={wishlistIds}
        onUpdateMember={(updated) => {
          setMember(updated);
          showToast('會員與毛孩健康檔案已更新！');
        }}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onReorder={handleReorder}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Nutrition Quiz Modal */}
      <PetNutritionQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        onAddBundleToCart={handleAddBundleToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}
