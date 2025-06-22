/**
 * Logging Middleware
 * Provides development logging for Redux actions
 */

export const loggingMiddleware = (store: any) => (next: any) => (action: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);

    const result = next(action);

    console.log('Next State:', store.getState());
    console.groupEnd();

    return result;
  }

  return next(action);
};
