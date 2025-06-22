/**
 * Persistence Middleware
 * Handles state persistence to localStorage
 */

export const persistenceMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // Save critical state to localStorage
  if (action.type.startsWith('cart/') || action.type.startsWith('auth/') || action.type.startsWith('ui/')) {
    const state = store.getState();

    try {
      const criticalState = {
        cart: {
          cart: state.cart.cart,
          lastUpdated: state.cart.lastUpdated,
        },
        auth: {
          isAuthenticated: state.auth.isAuthenticated,
          token: state.auth.token,
          refreshToken: state.auth.refreshToken,
          user: state.auth.user,
        },
        ui: {
          theme: state.ui.theme,
          locale: state.ui.locale,
          productViewMode: state.ui.productViewMode,
        },
      };

      localStorage.setItem('hobbit-store-state', JSON.stringify(criticalState));
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }

  return result;
};
