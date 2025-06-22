/**
 * Product Data Transfer Objects
 * Used for API communication and Redux state
 */

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: CategoryDto;
  images: ProductImageDto[];
  inventory: InventoryDto;
  specifications: ProductSpecificationDto[];
  tags: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path: string;
  level: number;
  imageUrl?: string;
}

export interface ProductImageDto {
  id: string;
  productId: string;
  url: string;
  altText: string;
  displayOrder: number;
  isMain: boolean;
}

export interface InventoryDto {
  productId: string;
  stockQuantity: number;
  restockThreshold: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  lastRestocked?: string;
  locationCode?: string;
}

export interface ProductSpecificationDto {
  name: string;
  value: string;
  group?: string;
  displayOrder: number;
}

export interface ProductSearchDto {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface ProductSearchResultDto {
  products: ProductDto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets: {
    categories: CategoryFacetDto[];
    priceRanges: PriceRangeDto[];
    brands: string[];
    ratings: number[];
  };
}

export interface CategoryFacetDto {
  categoryId: string;
  name: string;
  count: number;
}

export interface PriceRangeDto {
  min: number;
  max: number;
  count: number;
}
