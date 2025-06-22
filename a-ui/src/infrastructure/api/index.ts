/**
 * Infrastructure Layer API Clients
 * Re-export all API clients for easy importing
 */

export { ApiClient, apiClient } from './ApiClient';
export type { ApiResponse, ApiError } from './ApiClient';

export { CartApiClient } from './CartApiClient';
export { ProductApiClient } from './ProductApiClient';
export { ReviewApiClient } from './ReviewApiClient';
export { InventoryApiClient } from './InventoryApiClient';
export { PromotionApiClient } from './PromotionApiClient';
export { CustomerApiClient } from './CustomerApiClient';
export { OrderApiClient } from './OrderApiClient';

// Import classes for singleton creation
import { CartApiClient } from './CartApiClient';
import { ProductApiClient } from './ProductApiClient';
import { ReviewApiClient } from './ReviewApiClient';
import { InventoryApiClient } from './InventoryApiClient';
import { PromotionApiClient } from './PromotionApiClient';
import { CustomerApiClient } from './CustomerApiClient';
import { OrderApiClient } from './OrderApiClient';

// Create singleton instances for easy usage
export const cartApiClient = new CartApiClient();
export const productApiClient = new ProductApiClient();
export const reviewApiClient = new ReviewApiClient();
export const inventoryApiClient = new InventoryApiClient();
export const promotionApiClient = new PromotionApiClient();
export const customerApiClient = new CustomerApiClient();
export const orderApiClient = new OrderApiClient();
