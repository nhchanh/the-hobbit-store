/**
 * API Middleware
 * Handles API-related actions and error handling
 */

export const apiMiddleware = (store: any) => (next: any) => (action: any) => {
  // Handle API errors globally
  if (action.type.endsWith('/rejected')) {
    const state = store.getState();

    // Handle authentication errors
    if (action.payload?.includes('unauthorized') || action.payload?.includes('403')) {
      store.dispatch({ type: 'auth/logout' });
      store.dispatch({
        type: 'ui/addNotification',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Session Expired',
          message: 'Please log in again to continue.',
          duration: 5000,
        }
      });
    }

    // Handle network errors
    if (action.payload?.includes('fetch') || action.payload?.includes('network')) {
      store.dispatch({
        type: 'ui/setOnlineStatus',
        payload: false,
      });
    }
  }

  // Handle successful API calls
  if (action.type.endsWith('/fulfilled')) {
    // Mark as online if we were offline
    const state = store.getState();
    if (!state.ui.isOnline) {
      store.dispatch({
        type: 'ui/setOnlineStatus',
        payload: true,
      });
    }
  }

  return next(action);
};
