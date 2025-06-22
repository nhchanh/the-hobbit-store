/**
 * Product Domain Hook
 * Manages product operations following DDD principles
 */

import { useCallback } from 'react';
import { ApplicationState } from '../../types/common';
import { ProductDto, ProductSearchParams } from '../../types/api';

// Mock hooks for now - would be real Redux hooks
const useAppSelector = (selector: any) => selector({
  product: {
    products: [],
    selectedProduct: null,
    categories: [],
    state: ApplicationState.IDLE,
    isLoading: false,
    isSearching: false,
    searchResults: [],
    filters: {},
  }
});
const useAppDispatch = () => (action: any) => console.log('Dispatch:', action);

export const useProduct = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const products = useAppSelector((state: any) => state.product.products);
  const selectedProduct = useAppSelector((state: any) => state.product.selectedProduct);
  const categories = useAppSelector((state: any) => state.product.categories);
  const productState = useAppSelector((state: any) => state.product.state);
  const isLoading = useAppSelector((state: any) => state.product.isLoading);
  const isSearching = useAppSelector((state: any) => state.product.isSearching);
  const searchResults = useAppSelector((state: any) => state.product.searchResults);
  const filters = useAppSelector((state: any) => state.product.filters);

  // Product operations
  const fetchProducts = useCallback(async (params?: ProductSearchParams) => {
    dispatch({
      type: 'product/fetchProducts',
      payload: params,
    });
  }, [dispatch]);

  const fetchProductById = useCallback(async (productId: string) => {
    dispatch({
      type: 'product/fetchProductById',
      payload: productId,
    });
  }, [dispatch]);

  const searchProducts = useCallback(async (searchParams: ProductSearchParams) => {
    dispatch({
      type: 'product/searchProducts',
      payload: searchParams,
    });
  }, [dispatch]);

  const fetchProductsByCategory = useCallback(async (categoryId: string) => {
    dispatch({
      type: 'product/fetchProductsByCategory',
      payload: categoryId,
    });
  }, [dispatch]);

  const createProduct = useCallback(async (productData: Partial<ProductDto>) => {
    dispatch({
      type: 'product/createProduct',
      payload: productData,
    });
  }, [dispatch]);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductDto>) => {
    dispatch({
      type: 'product/updateProduct',
      payload: { productId, productData },
    });
  }, [dispatch]);

  const deleteProduct = useCallback(async (productId: string) => {
    dispatch({
      type: 'product/deleteProduct',
      payload: productId,
    });
  }, [dispatch]);

  // Category operations
  const fetchCategories = useCallback(async () => {
    dispatch({
      type: 'product/fetchCategories',
    });
  }, [dispatch]);

  // Filter operations
  const setFilters = useCallback((newFilters: ProductSearchParams) => {
    dispatch({
      type: 'product/setFilters',
      payload: newFilters,
    });
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch({
      type: 'product/clearFilters',
    });
  }, [dispatch]);

  const applyFilters = useCallback(async () => {
    dispatch({
      type: 'product/applyFilters',
      payload: filters,
    });
  }, [dispatch]);

  // Selection operations
  const selectProduct = useCallback((product: ProductDto) => {
    dispatch({
      type: 'product/selectProduct',
      payload: product,
    });
  }, [dispatch]);

  const clearSelectedProduct = useCallback(() => {
    dispatch({
      type: 'product/clearSelectedProduct',
    });
  }, [dispatch]);

  // Helper functions
  const getProductById = useCallback((productId: string): ProductDto | undefined => {
    return products.find((product: ProductDto) => product.id === productId);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string): ProductDto[] => {
    return products.filter((product: ProductDto) => product.categoryId === categoryId);
  }, [products]);

  const getProductsInPriceRange = useCallback((minPrice: number, maxPrice: number): ProductDto[] => {
    return products.filter((product: ProductDto) =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }, [products]);

  const getProductsByRating = useCallback((minRating: number): ProductDto[] => {
    return products.filter((product: ProductDto) =>
      (product.rating || 0) >= minRating
    );
  }, [products]);

  const getTopRatedProducts = useCallback((): ProductDto[] => {
    return [...products]
      .sort((a: ProductDto, b: ProductDto) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  }, [products]);

  const getFeaturedProducts = useCallback((): ProductDto[] => {
    // Mock implementation - would be based on business rules
    return products.slice(0, 8);
  }, [products]);

  const getRelatedProducts = useCallback((productId: string): ProductDto[] => {
    const product = getProductById(productId);
    if (!product) return [];

    // Mock implementation - would use recommendation algorithm
    return getProductsByCategory(product.categoryId).filter(p => p.id !== productId).slice(0, 4);
  }, [getProductById, getProductsByCategory]);

  // Stock operations
  const checkStock = useCallback((productId: string): boolean => {
    const product = getProductById(productId);
    // Mock implementation - would check actual stock
    return true;
  }, [getProductById]);

  const getStockLevel = useCallback((productId: string): number => {
    // Mock implementation - would get actual stock level
    return 100;
  }, []);

  // Price operations
  const formatPrice = useCallback((price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  }, []);

  const calculateDiscount = useCallback((originalPrice: number, discountedPrice: number): number => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }, []);

  // Comparison operations
  const addToComparison = useCallback((product: ProductDto) => {
    dispatch({
      type: 'product/addToComparison',
      payload: product,
    });
  }, [dispatch]);

  const removeFromComparison = useCallback((productId: string) => {
    dispatch({
      type: 'product/removeFromComparison',
      payload: productId,
    });
  }, [dispatch]);

  const clearComparison = useCallback(() => {
    dispatch({
      type: 'product/clearComparison',
    });
  }, [dispatch]);

  // Loading states
  const isLoadingProducts = productState === ApplicationState.LOADING;
  const isProductSelected = selectedProduct !== null;

  return {
    // Data
    products,
    selectedProduct,
    categories,
    searchResults,
    filters,

    // Operations
    fetchProducts,
    fetchProductById,
    searchProducts,
    fetchProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,

    // Category operations
    fetchCategories,

    // Filter operations
    setFilters,
    clearFilters,
    applyFilters,

    // Selection operations
    selectProduct,
    clearSelectedProduct,

    // Helper functions
    getProductById,
    getProductsByCategory,
    getProductsInPriceRange,
    getProductsByRating,
    getTopRatedProducts,
    getFeaturedProducts,
    getRelatedProducts,

    // Stock operations
    checkStock,
    getStockLevel,

    // Price operations
    formatPrice,
    calculateDiscount,

    // Comparison operations
    addToComparison,
    removeFromComparison,
    clearComparison,

    // State
    isLoading: isLoadingProducts,
    isSearching,
    isProductSelected,
    state: productState,
  };
};

// Additional specialized hooks
export const useProductSearch = () => {
  const { searchProducts, searchResults, isSearching, setFilters, applyFilters } = useProduct();

  const performSearch = useCallback(async (query: string, filters?: ProductSearchParams) => {
    const searchParams: ProductSearchParams = {
      name: query,
      ...filters,
    };

    await searchProducts(searchParams);
  }, [searchProducts]);

  const performAdvancedSearch = useCallback(async (searchParams: ProductSearchParams) => {
    await searchProducts(searchParams);
  }, [searchProducts]);

  return {
    searchResults,
    isSearching,
    performSearch,
    performAdvancedSearch,
    setFilters,
    applyFilters,
  };
};

export const useProductComparison = () => {
  const dispatch = useAppDispatch();
  const comparisonList = useAppSelector((state: any) => state.product.comparisonList || []);

  const addToComparison = useCallback((product: ProductDto) => {
    if (comparisonList.length >= 4) {
      throw new Error('Cannot compare more than 4 products');
    }

    dispatch({
      type: 'product/addToComparison',
      payload: product,
    });
  }, [dispatch, comparisonList.length]);

  const removeFromComparison = useCallback((productId: string) => {
    dispatch({
      type: 'product/removeFromComparison',
      payload: productId,
    });
  }, [dispatch]);

  const clearComparison = useCallback(() => {
    dispatch({
      type: 'product/clearComparison',
    });
  }, [dispatch]);

  const isInComparison = useCallback((productId: string): boolean => {
    return comparisonList.some((product: ProductDto) => product.id === productId);
  }, [comparisonList]);

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount: comparisonList.length,
    canAddMore: comparisonList.length < 4,
  };
};
