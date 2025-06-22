/**
 * Analytics Middleware
 * Tracks user actions for analytics
 */

export const analyticsMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // Track specific actions for analytics
  const trackableActions = [
    'cart/addToCart',
    'cart/removeFromCart',
    'cart/updateCartItem',
    'cart/clearCart',
    'product/setSearchResults',
    'product/setCurrentProduct',
    'order/checkoutSuccess',
    'auth/loginSuccess',
    'auth/logout',
  ];

  if (trackableActions.some(actionType => action.type.includes(actionType))) {
    try {
      // Send analytics event (would integrate with real analytics service)
      const event = {
        name: action.type,
        properties: {
          ...action.payload,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
      };

      // In a real app, this would send to analytics service
      console.log('Analytics Event:', event);
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  }

  return result;
};
