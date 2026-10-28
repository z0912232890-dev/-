import React, { useState } from 'react';
import {
  X,
  User,
  Heart,
  Package,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Weight,
  AlertCircle,
  CheckCircle,
  Truck,
  RotateCcw,
  ArrowRight,
  Shield,
  Gift,
} from 'lucide-react';
import { MemberUser, PetProfile, OrderRecord, Product } from '../types';

interface MemberCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'pets' | 'orders' | 'wishlist';
  member: MemberUser;
  orders: OrderRecord[];
  products: Product[];
  wishlistIds: string[];
  onUpdateMember: (updated: MemberUser) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onReorder: (order: OrderRecord) => void;
}

export const MemberCenterModal: React.FC<MemberCenterModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
  member,
  orders,
  products,
  wishlistIds,
  onUpdateMember,
  onSelectProduct,
  onAddToCart,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pets' | 'orders' | 'wishlist'>(initialTab);

  // New Pet Form Modal state
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'dog' | 'cat'>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetGender, setNewPetGender] = useState<'boy' | 'girl'>('boy');
  const [newPetAge, setNewPetAge] = useState<number>(2);
  const [newPetWeight, setNewPetWeight] = useState<number>(5.5);
  const [newPetBirthday, setNewPetBirthday] = useState('2024-05-20');
  const [newPetDiet, setNewPetDiet] = useState('喜好原肉乾糧，偏愛酥脆口感');
  const [newPetAllergy, setNewPetAllergy] = useState('穀物過敏');

  // Edit Member Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(member.name);
  const [editPhone, setEditPhone] = useState(member.phone);
  const [editEmail, setEditEmail] = useState(member.email);
  const [editAddress, setEditAddress] = useState(member.address);

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Handler for adding a pet
  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim() || !newPetBreed.trim()) return;

    const newPet: PetProfile = {
      id: `pet-${Date.now()}`,
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim(),
      gender: newPetGender,
      ageYears: Number(newPetAge),
      weightKg: Number(newPetWeight),
      birthday: newPetBirthday,
      dietNotes: newPetDiet.trim(),
      allergies: newPetAllergy
        ? newPetAllergy.split(/[,， ]+/).filter(Boolean)
        : [],
      avatarIcon: newPetSpecies === 'dog' ? '🐕' : '🐈',
    };

    onUpdateMember({
      ...member,
      pets: [...member.pets, newPet],
    });

    setIsAddingPet(false);
    setNewPetName('');
    setNewPetBreed('');
  };

  const handleDeletePet = (petId: string) => {
    if (confirm('確定要刪除此毛孩的健康履歷嗎？')) {
      onUpdateMember({
        ...member,
        pets: member.pets.filter((p) => p.id !== petId),
      });
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMember({
      ...member,
      name: editName,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Member Header Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="關閉會員中心"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xl font-bold font-serif shadow-inner">
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif text-stone-100">
                    {member.name}
                  </h2>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-semibold">
                    {member.tier === 'GOLD_VIP' ? '★ VIP 金卡會員' : '一般會員'}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  會員編號 #{member.id} · 於 {member.joinDate} 加入
                </p>
              </div>
            </div>

            {/* Quick Points & Coupon Counter */}
            <div className="flex items-center gap-4 bg-black/20 p-2.5 rounded-xl border border-white/10 text-xs">
              <div className="text-center px-2">
                <span className="text-stone-400 text-[11px] block">萌寵點數</span>
                <span className="text-amber-300 font-mono text-base font-bold">
                  {member.points.toLocaleString()}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="text-center px-2">
                <span className="text-stone-400 text-[11px] block">可用優惠券</span>
                <span className="text-stone-100 font-mono text-base font-bold">
                  {member.couponsCount} 張
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="text-center px-2">
                <span className="text-stone-400 text-[11px] block">登錄毛孩</span>
                <span className="text-stone-100 font-mono text-base font-bold">
                  {member.pets.length} 隻
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 overflow-x-auto gap-6 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>會員特權與禮遇</span>
          </button>

          <button
            onClick={() => setActiveTab('pets')}
            className={`py-3 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pets'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>毛孩健康檔案 ({member.pets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4 text-stone-700" />
            <span>歷史訂單歷程 ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4 text-stone-500" />
            <span>收藏清單 ({wishlistIds.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white space-y-6">
          {/* TAB 1: VIP Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* VIP Progress Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-900 tracking-wide uppercase">
                      VIP 等級進度
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-serif">
                      距離升級「白金鑽石會員」僅差 NT$ {member.nextTierSpend.toLocaleString()}
                    </h3>
                  </div>
                  <span className="text-xs text-amber-800 font-medium">
                    累計消費 NT$ {member.spentTotal.toLocaleString()} / 20,000
                  </span>
                </div>

                <div className="w-full bg-amber-200/70 h-2.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (member.spentTotal / (member.spentTotal + member.nextTierSpend)) * 100
                      )}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-700">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-stone-400 block text-[11px]">專屬折扣</span>
                    <strong className="text-stone-900 text-sm">全館結帳享 9 折</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-stone-400 block text-[11px]">生日禮遇</span>
                    <strong className="text-stone-900 text-sm">NT$ 200 生日購物金</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-stone-400 block text-[11px]">專屬毛孩配糧</span>
                    <strong className="text-stone-900 text-sm">免費獸醫營養諮詢</strong>
                  </div>
                </div>
              </div>

              {/* Member Coupons Available */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-700" />
                  <span>您目前可使用的專屬優惠券</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">
                        VIP 專屬 9 折折價券
                      </span>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        全館商品無門檻適用 · 結帳優惠碼：<strong>PAWVIP</strong>
                      </p>
                    </div>
                    <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded font-bold">
                      可使用
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-dashed border-stone-300 bg-stone-50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">
                        新會員迎新禮金 NT$ 150
                      </span>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        滿 NT$ 1,200 可折抵 · 結帳優惠碼：<strong>NEWFRIEND</strong>
                      </p>
                    </div>
                    <span className="text-xs bg-stone-200 text-stone-800 px-2 py-1 rounded font-bold">
                      可使用
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Profile Info */}
              <div className="p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                    <User className="w-4 h-4 text-stone-700" />
                    <span>會員基本資料</span>
                  </h4>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-stone-600 hover:text-stone-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isEditingProfile ? '取消' : '修改資料'}</span>
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-stone-500 block mb-1">姓名</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-stone-500 block mb-1">電話</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-stone-500 block mb-1">電子郵件</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-stone-500 block mb-1">預設宅配地址</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      儲存更新
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
                    <div>聯絡人姓名：<strong className="text-stone-800">{member.name}</strong></div>
                    <div>聯絡手機：<strong className="text-stone-800">{member.phone}</strong></div>
                    <div>註冊信箱：<strong className="text-stone-800">{member.email}</strong></div>
                    <div>預設地址：<strong className="text-stone-800">{member.address}</strong></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Pet Health Dossier */}
          {activeTab === 'pets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    毛孩專屬健康檔案與食譜推薦
                  </h3>
                  <p className="text-xs text-stone-500">
                    建立毛孩的年齡與過敏原資訊，我們將自動過濾不適宜成分，推薦專屬天然配糧。
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingPet(true)}
                  className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增毛孩檔案</span>
                </button>
              </div>

              {/* Add Pet Form */}
              {isAddingPet && (
                <form
                  onSubmit={handleSavePet}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-300 space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h4 className="font-bold text-sm text-stone-900">
                      填寫新毛孩基本資料
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingPet(false)}
                      className="text-stone-500 hover:text-stone-800 text-xs"
                    >
                      取消
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">毛孩名字 *</label>
                      <input
                        type="text"
                        required
                        placeholder="例如：波波"
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 font-medium mb-1">物種種類</label>
                      <select
                        value={newPetSpecies}
                        onChange={(e) =>
                          setNewPetSpecies(e.target.value as 'dog' | 'cat')
                        }
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="dog">狗狗 (汪星人)</option>
                        <option value="cat">貓咪 (喵星人)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 font-medium mb-1">品種 *</label>
                      <input
                        type="text"
                        required
                        placeholder="例如：黃金獵犬 / 米克斯"
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 font-medium mb-1">性別</label>
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={newPetGender === 'boy'}
                            onChange={() => setNewPetGender('boy')}
                          />
                          <span>小男生 (Boy)</span>
                        </label>
                        <label className="flex items-center gap-1 text-xs cursor-pointer ml-3">
                          <input
                            type="radio"
                            name="gender"
                            checked={newPetGender === 'girl'}
                            onChange={() => setNewPetGender('girl')}
                          />
                          <span>小女生 (Girl)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 font-medium mb-1">年齡 (歲)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={newPetAge}
                        onChange={(e) => setNewPetAge(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 font-medium mb-1">體重 (kg)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.1"
                        value={newPetWeight}
                        onChange={(e) => setNewPetWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-stone-600 font-medium mb-1">過敏原或需避開成分 (逗號分隔)</label>
                      <input
                        type="text"
                        placeholder="例如：小麥麩質, 人工膠, 大豆"
                        value={newPetAllergy}
                        onChange={(e) => setNewPetAllergy(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-stone-600 font-medium mb-1">日常飲食習慣與健康備註</label>
                      <input
                        type="text"
                        placeholder="例如：喜歡咬肉乾、易軟便、不愛喝水"
                        value={newPetDiet}
                        onChange={(e) => setNewPetDiet(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPet(false)}
                      className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-xs hover:bg-stone-200"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                    >
                      建立檔案
                    </button>
                  </div>
                </form>
              )}

              {/* Pets List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {member.pets.map((pet) => {
                  // Find personalized recommended product based on pet
                  const recommendedProduct =
                    pet.species === 'dog'
                      ? products.find((p) => p.targetPet === 'dog' || p.targetPet === 'all')
                      : products.find((p) => p.targetPet === 'cat' || p.targetPet === 'all');

                  return (
                    <div
                      key={pet.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl p-2 bg-amber-100 rounded-2xl">
                              {pet.avatarIcon}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-stone-900 text-base font-serif">
                                  {pet.name}
                                </h4>
                                <span className="text-[11px] text-stone-500">
                                  {pet.gender === 'boy' ? '♂ 男孩' : '♀ 女孩'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500">{pet.breed}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeletePet(pet.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                            title="刪除檔案"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Pet Stats */}
                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                          <div className="p-2 bg-white rounded-lg border border-stone-200/80 flex items-center gap-1.5 text-stone-700">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>年齡：{pet.ageYears} 歲</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-stone-200/80 flex items-center gap-1.5 text-stone-700">
                            <Weight className="w-3.5 h-3.5 text-amber-600" />
                            <span>體重：{pet.weightKg} kg</span>
                          </div>
                        </div>

                        {/* Allergies / Notes */}
                        <div className="mt-3 space-y-1.5 text-xs">
                          {pet.allergies.length > 0 && (
                            <div className="flex items-start gap-1.5 text-rose-700">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>需避開成分：{pet.allergies.join('、')}</span>
                            </div>
                          )}
                          <p className="text-stone-500 text-[11px]">
                            備註：{pet.dietNotes}
                          </p>
                        </div>
                      </div>

                      {/* Tailored recommendation box */}
                      {recommendedProduct && (
                        <div className="mt-4 pt-3 border-t border-stone-200 text-xs">
                          <span className="text-[11px] font-bold text-amber-800 block mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>專為 {pet.name} 推薦的配糧</span>
                          </span>
                          <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-stone-200">
                            <div className="min-w-0">
                              <p className="font-medium text-stone-900 truncate">
                                {recommendedProduct.name}
                              </p>
                              <span className="font-mono text-stone-700 font-bold">
                                NT$ {recommendedProduct.price.toLocaleString()}
                              </span>
                            </div>
                            <button
                              onClick={() => onAddToCart(recommendedProduct)}
                              className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer"
                            >
                              加入車
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Order History */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                您的歷史訂單與即時配送追蹤
              </h3>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="text-stone-600 font-medium">尚無歷史訂單紀錄</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200/80 pb-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-sm">
                            {order.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status === 'delivered'
                              ? '已配送完成'
                              : '冷藏倉儲備貨出貨中'}
                          </span>
                        </div>
                        <p className="text-stone-400 text-[11px] mt-0.5">
                          下單時間：{order.date} · 物流單號：{order.trackingCode}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-stone-500 text-[11px] block">結帳金額</span>
                        <span className="font-mono font-bold text-base text-stone-900">
                          NT$ {order.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 text-xs">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-stone-700"
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-sm sm:max-w-md">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <span className="font-medium text-stone-900 block truncate">
                                {item.product.name}
                              </span>
                              <span className="text-stone-400 text-[11px]">
                                數量：{item.quantity} 件
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-medium tabular-nums text-stone-900">
                            NT$ {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Reorder */}
                    <div className="pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs text-stone-500 border-t border-stone-100">
                      <span>付款方式：{order.paymentMethod}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onReorder(order)}
                          className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>再次購買此清單</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                我的毛孩心願收藏清單 ({wishlistedProducts.length})
              </h3>

              {wishlistedProducts.length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  <Heart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="text-stone-600 font-medium">目前尚無收藏的商品</p>
                  <p className="text-xs text-stone-400 mt-1">
                    在選物列表點擊愛心圖示，即可將想為毛孩添購的選品加入此清單。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all flex gap-3"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-20 h-20 rounded-xl object-cover bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4
                            onClick={() => onSelectProduct(prod)}
                            className="text-xs font-semibold text-stone-900 truncate hover:text-amber-800 cursor-pointer"
                          >
                            {prod.name}
                          </h4>
                          <span className="font-mono font-bold text-stone-900 text-sm">
                            NT$ {prod.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="px-3 py-1 bg-stone-900 text-white text-[11px] font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
                          >
                            加入購物車
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
