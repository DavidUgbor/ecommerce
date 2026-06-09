// Static catalog — the full product/category dataset is bundled into the build.
// This lets the storefront run entirely on Vercel with no backend.
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

export const products: any[] = productsData as any[];
export const categories: any[] = categoriesData as any[];

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));

export const getProductBySlug = (slug: string) => bySlug.get(slug) || null;
export const getProductById = (id: string) => byId.get(id) || null;

// Mimics the backend GET /products query behaviour.
export function queryProducts(search: URLSearchParams) {
  let list = [...products];

  const category = search.get('category');
  if (category) list = list.filter((p) => p.category?.slug === category);

  if (search.get('featured') === 'true') list = list.filter((p) => p.featured);

  const term = search.get('search');
  if (term) {
    const q = term.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || '').toLowerCase().includes(q)
    );
  }

  const sort = search.get('sort');
  if (sort === 'newest') {
    list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } else if (sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  }

  const total = list.length;
  const limit = parseInt(search.get('limit') || '50', 10);
  const page = parseInt(search.get('page') || '1', 10);
  const start = (page - 1) * limit;
  const paged = list.slice(start, start + limit);

  return {
    products: paged,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export function getReviews(productId: string) {
  const p = getProductById(productId);
  const reviews = (p?.reviews as any[]) || [];
  return { avgRating: p?.avgRating || 0, total: reviews.length, reviews };
}
