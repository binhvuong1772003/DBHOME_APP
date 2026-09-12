export type DiscoveryMockService = {
  id: string;
  name: string;
  shopName: string;
  shopSlug: string;
  location: string;
  description: string;
  price: number;
  durationMin: number;
  imageUrl: string;
};

export type DiscoveryMockShop = {
  id: string;
  name: string;
  slug: string;
  type: "NAIL" | "SPA" | "HAIR" | "COMBO";
  location: string;
  description: string;
  coverUrl: string;
};

export type DiscoveryCategory = {
  id: string;
  labelKey: "nails" | "hair" | "spa" | "studios";
  shopType: ShopType;
  icon: "sparkles" | "scissors" | "flower" | "hand" | "heart";
};

/**
 * Preview content for the first discovery iteration. The ranking algorithm is
 * intentionally not implied here; replace these arrays with a backend
 * recommendation/popularity contract when the product rules are decided.
 */
export const recommendedMockServices: DiscoveryMockService[] = [
  {
    id: "preview-service-ritual",
    name: "Soft Gel Ritual",
    shopName: "Mimo bán Pate",
    shopSlug: "mimo-ban-pate",
    location: "Đồng Văn, Hà Giang",
    description: "A clean, polished manicure with a quiet finish.",
    price: 320000,
    durationMin: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "preview-service-reset",
    name: "Calm Skin Reset",
    shopName: "Mimo bán Pate",
    shopSlug: "mimo-ban-pate",
    location: "Đồng Văn, Hà Giang",
    description: "A gentle facial ritual for a slower hour.",
    price: 450000,
    durationMin: 75,
    imageUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "preview-service-sculpt",
    name: "Sculpted Nail Set",
    shopName: "Mimo bán Pate",
    shopSlug: "mimo-ban-pate",
    location: "Đồng Văn, Hà Giang",
    description: "A structured set with a refined silhouette.",
    price: 560000,
    durationMin: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=82",
  },
];

export const popularMockServices: DiscoveryMockService[] = [
  {
    id: "preview-service-art",
    name: "Hand-painted Nail Art",
    shopName: "Mimo bán Pate",
    shopSlug: "mimo-ban-pate",
    location: "Đồng Văn, Hà Giang",
    description: "Fine detail and a little more personality.",
    price: 420000,
    durationMin: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "preview-service-head",
    name: "Scalp Reset",
    shopName: "Mimo bán Pate",
    shopSlug: "mimo-ban-pate",
    location: "Đồng Văn, Hà Giang",
    description: "A restorative treatment for a refreshed feeling.",
    price: 390000,
    durationMin: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "preview-service-care",
    name: "Express Care",
    shopName: "Mimo bán Pate",
    shopSlug: "mimo-ban-pate",
    location: "Đồng Văn, Hà Giang",
    description: "A considered refresh when time is short.",
    price: 260000,
    durationMin: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=82",
  },
];

export const recommendedMockShops: DiscoveryMockShop[] = [
  {
    id: "preview-shop-mimo",
    name: "Mimo bán Pate",
    slug: "mimo-ban-pate",
    type: "COMBO",
    location: "Đồng Văn, Hà Giang",
    description: "A warm studio for unhurried beauty rituals.",
    coverUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "preview-shop-studio",
    name: "The Quiet Studio",
    slug: "mimo-ban-pate",
    type: "NAIL",
    location: "Đồng Văn, Hà Giang",
    description: "Detail-led nail care in a calm, intimate setting.",
    coverUrl:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "preview-shop-reset",
    name: "Reset House",
    slug: "mimo-ban-pate",
    type: "SPA",
    location: "Đồng Văn, Hà Giang",
    description: "A simple place to make room for a slower hour.",
    coverUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=82",
  },
];

export const popularMockShops: DiscoveryMockShop[] = [
  {
    id: "preview-shop-nail",
    name: "Mimo bán Pate",
    slug: "mimo-ban-pate",
    type: "NAIL",
    location: "Đồng Văn, Hà Giang",
    description: "A polished menu of everyday and occasion-ready nails.",
    coverUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "preview-shop-wellness",
    name: "Mimo bán Pate",
    slug: "mimo-ban-pate",
    type: "SPA",
    location: "Đồng Văn, Hà Giang",
    description: "Quiet treatments with space to reset.",
    coverUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "preview-shop-hair",
    name: "Mimo bán Pate",
    slug: "mimo-ban-pate",
    type: "HAIR",
    location: "Đồng Văn, Hà Giang",
    description: "A considered edit for hair and self-care.",
    coverUrl:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=82",
  },
];

export const discoveryCategories: DiscoveryCategory[] = [
  { id: "nails", labelKey: "nails", shopType: "NAIL", icon: "sparkles" },
  { id: "hair", labelKey: "hair", shopType: "HAIR", icon: "scissors" },
  { id: "spa", labelKey: "spa", shopType: "SPA", icon: "flower" },
  { id: "studios", labelKey: "studios", shopType: "COMBO", icon: "heart" },
];
import type { ShopType } from "@/type/shop";
