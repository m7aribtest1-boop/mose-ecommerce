import type { Product, Category } from '@/types';

export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 45;
export const RETURN_DAYS = 14;

export const products: Product[] = [
  { id: '1', name: 'الجلابة الفاسية', price: 299, originalPrice: 399, image: '/products/jellaba-fassi.jpg', category: 'جلابة', badge: 'الأكثر مبيعاً', rating: 4.9, reviews: 127 },
  { id: '2', name: 'القفطان المخزني', price: 1800, originalPrice: 2400, image: '/products/qaftan-makhzeni.jpg', category: 'قفطان', badge: 'جديد', rating: 4.8, reviews: 89 },
  { id: '3', name: 'الجلابة الصيفية (الكتانية)', price: 399, originalPrice: 499, image: '/products/jellaba-summer.jpg', category: 'جلابة', badge: 'عرض الصيف', rating: 4.7, reviews: 203 },
  { id: '4', name: 'قفطان العروس', price: 4500, originalPrice: 5500, image: '/products/qaftan-bride.jpg', category: 'قفطان', badge: 'حصري', rating: 5.0, reviews: 45 },
  { id: '5', name: 'تكشيطة العروس الفاسية', price: 3200, originalPrice: 4200, image: '/products/takchita-bride.jpg', category: 'تكشيطة', badge: 'الأكثر مبيعاً', rating: 4.9, reviews: 67 },
  { id: '6', name: 'الجلابة الشتوية (الصوف)', price: 599, originalPrice: 799, image: '/products/jellaba-winter.jpg', category: 'جلابة', badge: 'عرض الشتاء', rating: 4.8, reviews: 156 },
  { id: '7', name: 'قفطان مودرن يومي', price: 899, originalPrice: 1199, image: '/products/qaftan-modern.jpg', category: 'قفطان', badge: 'جديد', rating: 4.6, reviews: 134 },
  { id: '8', name: 'تكشيطة سهرة ذهبية', price: 2800, originalPrice: 3500, image: '/products/takchita-gold.jpg', category: 'تكشيطة', badge: 'عرض محدود', rating: 4.7, reviews: 92 },
  { id: '9', name: 'حزام جلدي مغربي', price: 249, originalPrice: 349, image: '/products/belt.jpg', category: 'إكسسوارات', badge: 'جديد', rating: 4.8, reviews: 78 },
  { id: '10', name: 'مضمة حرير', price: 199, originalPrice: 299, image: '/products/madma.jpg', category: 'إكسسوارات', badge: 'عرض', rating: 4.9, reviews: 234 },
  { id: '11', name: 'نعال مغربية جلدية', price: 349, originalPrice: 449, image: '/products/slippers.jpg', category: 'إكسسوارات', badge: 'الأكثر مبيعاً', rating: 4.8, reviews: 187 },
  { id: '12', name: 'حقيبة جلدية يدوية', price: 899, originalPrice: 1199, image: '/products/bag.jpg', category: 'إكسسوارات', badge: 'جديد', rating: 4.7, reviews: 56 },
];

export const categories: Category[] = [
  { id: 'jellaba', name: 'الجلابة', description: 'جلابة فاسية، صيفية، شتوية، للمناسبات', image: '/categories/jellaba.jpg', count: 24 },
  { id: 'qaftan', name: 'القفطان', description: 'قفطان مخزني، عروس، مودرن، يومي', image: '/categories/qaftan.jpg', count: 18 },
  { id: 'takchita', name: 'التكشيطة', description: 'تكشيطة عروس، سهرة، مناسبات', image: '/categories/takchita.jpg', count: 12 },
  { id: 'accessories', name: 'الإكسسوارات', description: 'أحزمة، مجوهرات، حقائب، نعال', image: '/categories/accessories.jpg', count: 35 },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return [];
  const bareName = category.name.replace(/^ال/, '');
  return products.filter(
    (p) => p.category === category.name || p.category === bareName
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return products.slice(0, limit);
  const related = products.filter(
    (p) => p.id !== productId && p.category === product.category
  );
  const others = products.filter(
    (p) => p.id !== productId && p.category !== product.category
  );
  return [...related, ...others].slice(0, limit);
}
