import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

const DICT = {
  en: {
    shop: "Shop",
    customize: "Customize",
    account: "Account",
    cart: "Cart",
    admin: "Admin",
    checkout: "Checkout",
    menu: "Menu",
    language: "Language",
    country: "Country",
    allProducts: "All products",
    tees: "T-Shirts",
    hoodies: "Hoodies",
    all: "All",
    addToCart: "Add to cart",
    outOfStock: "Out of stock",
    size: "Size",
    color: "Color",
    garment: "Garment",
    style: "Style",
    front: "Front",
    back: "Back",
    preview: "Preview",
    addImage: "Add image",
    addText: "Add text",
    textSettings: "Text settings",
    imageSettings: "Image settings",
    delete: "Delete",
    rotation: "Rotation",
    font: "Font",
    align: "Align",
    left: "Left",
    center: "Center",
    right: "Right",
    printableArea: "Recommended print area",
    editorHint: "Drag anywhere on the garment. Pinch or use the size slider to resize.",
    yourCart: "Your cart",
    emptyCart: "Your cart is empty.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    discount: "Discount",
    total: "Total",
    promoCode: "Promo code",
    apply: "Apply",
    placeOrder: "Place order",
    orderSummary: "Order summary",
    customer: "Customer",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    payment: "Cash on delivery",
    paymentNote: "Pay in cash when your order arrives.",
    continueShopping: "Shop now",
    remove: "Remove",
    qty: "Qty",
    sizeGuide: "Size & Dimensions",
    sizeGuideNote: "A = total length, B = chest width. Measured flat in cm, ±2cm tolerance.",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    password: "Password",
    loading: "Loading…",
    followUs: "Follow us",
    contact: "Contact",
    shippingInfo: "Shipping",
    returns: "Returns",
    orders: "Orders",
    startCustomizing: "Start customizing",
    latestDrops: "Latest drops",
    saveChanges: "Save changes",
    orderPlaced: "Order placed — we'll contact you shortly.",
  },
  ar: {
    shop: "المتجر",
    customize: "صمّم",
    account: "حسابي",
    cart: "السلة",
    admin: "الإدارة",
    checkout: "إتمام الطلب",
    menu: "القائمة",
    language: "اللغة",
    country: "الدولة",
    allProducts: "كل المنتجات",
    tees: "تيشيرتات",
    hoodies: "هوديز",
    all: "الكل",
    addToCart: "أضف إلى السلة",
    outOfStock: "غير متوفر",
    size: "المقاس",
    color: "اللون",
    garment: "القطعة",
    style: "الموديل",
    front: "الأمام",
    back: "الخلف",
    preview: "معاينة",
    addImage: "أضف صورة",
    addText: "أضف نص",
    textSettings: "إعدادات النص",
    imageSettings: "إعدادات الصورة",
    delete: "حذف",
    rotation: "التدوير",
    font: "الخط",
    align: "المحاذاة",
    left: "يسار",
    center: "وسط",
    right: "يمين",
    printableArea: "مساحة الطباعة المقترحة",
    editorHint: "اسحب التصميم في أي مكان على القطعة. استخدم شريط الحجم أو التقريب لتغيير الحجم.",
    yourCart: "سلتك",
    emptyCart: "سلتك فارغة.",
    subtotal: "المجموع",
    shipping: "الشحن",
    discount: "الخصم",
    total: "الإجمالي",
    promoCode: "كود الخصم",
    apply: "تطبيق",
    placeOrder: "تأكيد الطلب",
    orderSummary: "ملخص الطلب",
    customer: "بيانات العميل",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    city: "المدينة",
    payment: "الدفع عند الاستلام",
    paymentNote: "ادفع نقداً عند وصول طلبك.",
    continueShopping: "تسوق الآن",
    remove: "إزالة",
    qty: "الكمية",
    sizeGuide: "المقاسات والأبعاد",
    sizeGuideNote: "أ = الطول الكلي، ب = عرض الصدر. القياس بالسنتيمتر بفارق ±2 سم.",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    password: "كلمة المرور",
    loading: "جارٍ التحميل…",
    followUs: "تابعنا",
    contact: "تواصل معنا",
    shippingInfo: "الشحن",
    returns: "الإرجاع",
    orders: "الطلبات",
    startCustomizing: "ابدأ التصميم",
    latestDrops: "أحدث الإصدارات",
    saveChanges: "حفظ التغييرات",
    orderPlaced: "تم استلام طلبك — سنتواصل معك قريباً.",
  },
} as const;

export type TKey = keyof (typeof DICT)["en"];

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  /** picks the localized field of a DB row, e.g. pick(product, "name") */
  pick: <T extends Record<string, unknown>>(row: T | null | undefined, field: string) => string;
};

const LangContext = createContext<Ctx | null>(null);
const KEY = "jannar-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.classList.toggle("font-arabic", lang === "ar");
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };

  const value: Ctx = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    setLang,
    t: (key) => DICT[lang][key] ?? DICT.en[key] ?? String(key),
    pick: (row, field) => {
      if (!row) return "";
      const localized = row[`${field}_${lang}`];
      if (typeof localized === "string" && localized.trim()) return localized;
      const fallback = row[`${field}_en`];
      return typeof fallback === "string" ? fallback : "";
    },
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}