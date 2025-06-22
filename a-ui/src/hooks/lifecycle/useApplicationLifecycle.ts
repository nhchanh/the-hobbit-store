/**
 * Application Lifecycle Hook
 * Manages application state transitions and lifecycle events
 */

import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../types/common';
import { RootState } from '../../store/store';
import { setGlobalState, setOnlineStatus } from '../../store/slices/ui/uiSlice';

export const useApplicationLifecycle = () => {
  const dispatch = useDispatch();
  const globalState = useSelector((state: RootState) => state.ui.globalState);
  const isOnline = useSelector((state: RootState) => state.ui.isOnline);

  // State transition handler
  const transitionTo = useCallback((newState: ApplicationState, context?: any) => {
    dispatch(setGlobalState(newState));

    // Log state transition
    console.log(`State transition: ${globalState} -> ${newState}`, context);
  }, [dispatch, globalState]);

  // State checks
  const isLoading = useCallback(() => {
    return [
      ApplicationState.LOADING,
      ApplicationState.SUBMITTING,
      ApplicationState.PROCESSING,
      ApplicationState.NAVIGATING,
      ApplicationState.HYDRATING,
    ].includes(globalState);
  }, [globalState]);

  const canInteract = useCallback(() => {
    return [
      ApplicationState.IDLE,
      ApplicationState.SUCCESS,
      ApplicationState.ERROR,
    ].includes(globalState);
  }, [globalState]);

  const isInErrorState = useCallback(() => {
    return globalState === ApplicationState.ERROR;
  }, [globalState]);

  const isOffline = useCallback(() => {
    return globalState === ApplicationState.OFFLINE || !isOnline;
  }, [globalState, isOnline]);

  // Lifecycle event handlers
  useEffect(() => {
    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        transitionTo(ApplicationState.SUSPENDED);
      } else {
        transitionTo(ApplicationState.IDLE);
      }
    };

    // Handle online/offline status
    const handleOnline = () => {
      dispatch(setOnlineStatus(true));
      transitionTo(ApplicationState.RECONNECTING);
      setTimeout(() => transitionTo(ApplicationState.IDLE), 1000);
    };

    const handleOffline = () => {
      dispatch(setOnlineStatus(false));
      transitionTo(ApplicationState.OFFLINE);
    };

    // Handle beforeunload (user navigating away)
    const handleBeforeUnload = () => {
      transitionTo(ApplicationState.NAVIGATING);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [transitionTo]);

  // Initialize application
  useEffect(() => {
    if (globalState === ApplicationState.INIT) {
      transitionTo(ApplicationState.HYDRATING);

      // Simulate hydration process
      setTimeout(() => {
        transitionTo(ApplicationState.IDLE);
      }, 500);
    }
  }, [globalState, transitionTo]);

  return {
    currentState: globalState,
    isLoading,
    canInteract,
    isInErrorState,
    isOffline,
    isOnline,
    transitionTo,

    // Helper methods for common transitions
    startLoading: () => transitionTo(ApplicationState.LOADING),
    stopLoading: () => transitionTo(ApplicationState.IDLE),
    setError: (error: string) => transitionTo(ApplicationState.ERROR, { error }),
    setSuccess: () => transitionTo(ApplicationState.SUCCESS),
    startSubmitting: () => transitionTo(ApplicationState.SUBMITTING),
    startProcessing: () => transitionTo(ApplicationState.PROCESSING),
  };
};
