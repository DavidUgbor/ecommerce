// Static API client — drop-in replacement for the axios backend client.
// The storefront is fully self-contained: product/category reads are served
// from the bundled catalog, so the site runs on Vercel with no backend.
import { queryProducts, getProductBySlug, getProductById, getReviews, categories } from './catalog';

const ok = <T>(data: T): Promise<{ data: T }> => Promise.resolve({ data });

function handleGet(url: string): Promise<{ data: any }> {
  const [path, qs = ''] = url.split('?');
  const search = new URLSearchParams(qs);

  if (path === '/categories') return ok(categories);

  if (path === '/products') return ok(queryProducts(search));

  // /products/:id/reviews
  const reviewMatch = path.match(/^\/products\/([^/]+)\/reviews$/);
  if (reviewMatch) return ok(getReviews(reviewMatch[1]));

  // /products/:slug  (detail) — try slug first, fall back to id
  const detailMatch = path.match(/^\/products\/([^/]+)$/);
  if (detailMatch) {
    const key = detailMatch[1];
    const product = getProductBySlug(key) || getProductById(key);
    if (product) return ok(product);
    return Promise.reject({ response: { status: 404, data: { message: 'Not found' } } });
  }

  return Promise.reject({ response: { status: 404, data: { message: 'Not found' } } });
}

const notAvailable = (..._args: any[]): Promise<{ data: any }> =>
  Promise.reject({
    response: { status: 503, data: { message: 'This action is handled directly with Nie by email.' } },
  });

const api = {
  get: (url: string, ..._args: any[]) => handleGet(url),
  post: notAvailable,
  put: notAvailable,
  delete: notAvailable,
};

export default api;
