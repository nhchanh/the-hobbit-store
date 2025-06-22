/**
 * Providers Component
 * Wraps the app with all necessary providers following DDD principles
 */

'use client';

import { ReactNode, createContext, useContext, Component, ErrorInfo } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '../store/store';
import { queryClient } from '../infrastructure/query/queryClient';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <TenantContextProvider>
            <ApplicationLifecycleProvider>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </ApplicationLifecycleProvider>
          </TenantContextProvider>
        </Provider>
        {/* Only show React Query devtools in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Application Lifecycle Provider
// Manages global application state and lifecycle events
function ApplicationLifecycleProvider({ children }: { children: ReactNode }) {
  // This would use the useApplicationLifecycle hook
  // and provide lifecycle context to child components

  return (
    <div data-testid="application-lifecycle-provider">
      {children}
    </div>
  );
}

// Tenant Context Provider
// Provides multi-tenancy context following DDD principles
function TenantContextProvider({ children }: { children: ReactNode }) {
  // Mock tenant context - would be real implementation
  const tenantContext = {
    tenantId: 'DEFAULT_TENANT',
    environmentId: 'DEV',
    tenantName: 'The Hobbit Store',
    features: ['cart', 'wishlist', 'orders', 'reviews'],
    settings: {
      currency: 'USD',
      language: 'en',
      theme: 'default',
    },
  };

  return (
    <TenantContext.Provider value={tenantContext}>
      {children}
    </TenantContext.Provider>
  );
}

// Loading Provider
// Manages global loading states and indicators
function LoadingProvider({ children }: { children: ReactNode }) {
  return (
    <div data-testid="loading-provider">
      {children}
    </div>
  );
}

// Tenant Context

interface TenantContextType {
  tenantId: string;
  environmentId: string;
  tenantName: string;
  features: string[];
  settings: Record<string, any>;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function useTenantContext(): TenantContextType {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantContextProvider');
  }
  return context;
}

// Error Boundary Component

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error Boundary caught an error:', error, errorInfo);

    // In a real app, you'd log this to an error reporting service
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Application Error
                </h3>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Something went wrong. Please refresh the page or try again later.
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
