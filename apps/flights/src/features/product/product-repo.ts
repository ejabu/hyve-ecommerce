import type { Product } from "./product.types";

const PRODUCTS: Product[] = [
  { id: "p-perfume", name: "Oud Eau de Parfum 50ml", category: "duty-free", price: 85, emoji: "🧴", blurb: "Warm, woody signature scent." },
  { id: "p-choc", name: "Swiss Chocolate Box", category: "duty-free", price: 24, emoji: "🍫", blurb: "24 assorted pralines." },
  { id: "p-watch", name: "Classic Steel Watch", category: "duty-free", price: 210, emoji: "⌚", blurb: "Sapphire glass, 5 ATM." },
  { id: "p-shades", name: "Aviator Sunglasses", category: "duty-free", price: 95, emoji: "🕶️", blurb: "Polarised, UV400." },
  { id: "p-pillow", name: "Memory Foam Neck Pillow", category: "travel", price: 22, emoji: "😴", blurb: "Washable cover." },
  { id: "p-adapter", name: "Universal Travel Adapter", category: "travel", price: 18, emoji: "🔌", blurb: "150+ countries, dual USB." },
  { id: "p-tags", name: "Luggage Tag Set (4)", category: "travel", price: 9, emoji: "🏷️", blurb: "Leather, with ID window." },
  { id: "p-mask", name: "Silk Sleep Mask", category: "travel", price: 14, emoji: "🌙", blurb: "Blocks out cabin light." },
  { id: "p-dates", name: "Premium Medjool Dates", category: "snacks", price: 12, emoji: "🌴", blurb: "500g gift tin." },
  { id: "p-nuts", name: "Roasted Nut Mix", category: "snacks", price: 8, emoji: "🥜", blurb: "Lightly salted, 300g." },
  { id: "p-tea", name: "Saffron Tea Tin", category: "snacks", price: 16, emoji: "🍵", blurb: "20 pyramid bags." },
  { id: "p-buds", name: "Noise-Cancelling Earbuds", category: "tech", price: 79, emoji: "🎧", blurb: "28h battery with case." },
  { id: "p-bank", name: "10,000mAh Power Bank", category: "tech", price: 29, emoji: "🔋", blurb: "Cabin-safe, USB-C." },
  { id: "p-tracker", name: "Bag Tracker Tag", category: "tech", price: 25, emoji: "📍", blurb: "Never lose your luggage." },
];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

class ProductRepo {
  async list(): Promise<Product[]> {
    await delay(250);
    return PRODUCTS;
  }
}

export const productRepo = new ProductRepo();
