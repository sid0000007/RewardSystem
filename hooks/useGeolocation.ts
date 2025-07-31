import { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinates } from '@/types';

export interface GeolocationState {
  coordinates: Coordinates | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
  requestPermission?: boolean;
}

const DEFAULT_OPTIONS: Required<GeolocationOptions> = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 300000, // 5 minutes
  watchPosition: false,
  requestPermission: true
};

// Helper function to check if we're in browser environment
const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const watchIdRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const permissionRef = useRef<GeolocationState['permission']>('unknown');
  const isInitialized = useRef(false);

  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    accuracy: null,
    error: null,
    isLoading: false,
    isSupported: false, // ✅ Default to false, will be updated in useEffect
    permission: 'unknown'
  });

  // Check if geolocation is supported - moved to useEffect
  const isSupported = isBrowser && 'geolocation' in navigator;

  // Update isSupported in useEffect after component mounts
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isSupported: isBrowser && 'geolocation' in navigator
    }));
  }, []);

  // Get current permission status
  const checkPermission = useCallback(async () => {
    if (!isSupported) {
      setState(prev => ({ ...prev, permission: 'denied' }));
      return;
    }

    try {
      // Check permission using the Permissions API if available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        const newPermission = permission.state;

        // Only update if permission actually changed
        if (permissionRef.current !== newPermission) {
          permissionRef.current = newPermission;
          setState(prev => ({ ...prev, permission: newPermission }));
        }

        // Listen for permission changes
        permission.addEventListener('change', () => {
          const updatedPermission = permission.state;
          if (permissionRef.current !== updatedPermission) {
            permissionRef.current = updatedPermission;
            setState(prev => ({ ...prev, permission: updatedPermission }));
          }
        });
      }
    } catch {
      // Permissions API not supported, we'll determine permission from the geolocation request
      if (permissionRef.current !== 'unknown') {
        permissionRef.current = 'unknown';
        setState(prev => ({ ...prev, permission: 'unknown' }));
      }
    }
  }, [isSupported]);

  // Success callback for geolocation
  const onSuccess = useCallback((position: GeolocationPosition) => {
    const coordinates: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    setState(prev => ({
      ...prev,
      coordinates,
      accuracy: position.coords.accuracy,
      error: null,
      isLoading: false,
      permission: 'granted'
    }));

    // Clear timeout if set
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Error callback for geolocation
  const onError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unknown error occurred';
    let permission: GeolocationState['permission'] = 'unknown';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        permission = 'denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
      permission
    }));

    // Clear timeout if set
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(
    (customOptions?: GeolocationOptions) => {
      const opts = { ...mergedOptions, ...customOptions };

      if (!isBrowser || !isSupported) {
        const errorMsg = !isBrowser
          ? 'Geolocation is not available in server environment'
          : 'Geolocation is not supported by this browser';

        setState(prev => ({
          ...prev,
          error: errorMsg,
          isLoading: false
        }));
        return Promise.reject(new Error(errorMsg));
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Set a custom timeout if needed
      if (opts.timeout && opts.timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            error: 'Location request timed out',
            isLoading: false
          }));
        }, opts.timeout);
      }

      return new Promise<Coordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            onSuccess(position);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            onError(error);
            reject(new Error(error.message));
          },
          {
            enableHighAccuracy: opts.enableHighAccuracy,
            timeout: opts.timeout,
            maximumAge: opts.maximumAge
          }
        );
      });
    },
    [isSupported, mergedOptions, onSuccess, onError]
  );

  // Start watching position
  const startWatching = useCallback(() => {
    if (!isBrowser || !isSupported) {
      const errorMsg = !isBrowser
        ? 'Geolocation is not available in server environment'
        : 'Geolocation is not supported by this browser';

      setState(prev => ({
        ...prev,
        error: errorMsg
      }));
      return;
    }

    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: mergedOptions.maximumAge
      }
    );
  }, [isSupported, mergedOptions, onSuccess, onError]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && isBrowser) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setState(prev => ({ ...prev, isLoading: false }));

    // Clear timeout if set
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = useCallback(
    (coord1: Coordinates, coord2: Coordinates): number => {
      const R = 6371000; // Earth's radius in meters
      const lat1Rad = (coord1.latitude * Math.PI) / 180;
      const lat2Rad = (coord2.latitude * Math.PI) / 180;
      const deltaLatRad = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
      const deltaLonRad = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

      const a =
        Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLonRad / 2) *
        Math.sin(deltaLonRad / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  // Check if user is within radius of a location
  const isWithinRadius = useCallback(
    (targetCoords: Coordinates, radius: number): boolean => {
      if (!state.coordinates) return false;
      const distance = calculateDistance(state.coordinates, targetCoords);
      return distance <= radius;
    },
    [state.coordinates, calculateDistance]
  );

  // Get distance to a specific location
  const getDistanceTo = useCallback(
    (targetCoords: Coordinates): number | null => {
      if (!state.coordinates) return null;
      return calculateDistance(state.coordinates, targetCoords);
    },
    [state.coordinates, calculateDistance]
  );

  // Request permission explicitly
  const requestPermission = useCallback(async () => {
    if (!isBrowser || !isSupported) {
      return Promise.reject(new Error('Geolocation not supported'));
    }

    try {
      await getCurrentPosition({ timeout: 5000 });
      return 'granted';
    } catch (error) {
      if (error instanceof Error && error.message.includes('denied')) {
        return 'denied';
      }
      throw error;
    }
  }, [isSupported, getCurrentPosition]);

  // Initialize geolocation on mount
  useEffect(() => {
    if (isInitialized.current || !isBrowser) return;

    checkPermission();

    if (mergedOptions.requestPermission && isSupported) {
      if (mergedOptions.watchPosition) {
        startWatching();
      } else {
        getCurrentPosition().catch(() => {
          // Ignore errors on initial load
        });
      }
    }

    isInitialized.current = true;

    // Cleanup on unmount
    return () => {
      stopWatching();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkPermission, mergedOptions.requestPermission, mergedOptions.watchPosition, isSupported, startWatching, getCurrentPosition, stopWatching]);

  return {
    ...state,
    getCurrentPosition,
    startWatching,
    stopWatching,
    calculateDistance,
    isWithinRadius,
    getDistanceTo,
    requestPermission,
    refresh: () => getCurrentPosition()
  };
};

// Utility hook for simple one-time location requests
export const useCurrentLocation = (options?: GeolocationOptions) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialized = useRef(false);

  const getLocation = useCallback(async () => {
    if (!isBrowser || !('geolocation' in navigator)) {
      const errorMsg = !isBrowser
        ? 'Geolocation is not available in server environment'
        : 'Geolocation is not supported';
      setError(errorMsg);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          timeout: options?.timeout ?? 10000,
          maximumAge: options?.maximumAge ?? 300000
        });
      });

      const coordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setLocation(coordinates);
      setIsLoading(false);
      return coordinates;
    } catch (err) {
      const error = err as GeolocationPositionError;
      let errorMessage = 'Unknown error occurred';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, [options]);

  // Auto-initialize if not already done
  useEffect(() => {
    if (!isInitialized.current && isBrowser && options?.requestPermission !== false) {
      getLocation().catch(() => {
        // Ignore errors on initial load
      });
      isInitialized.current = true;
    }
  }, [getLocation, options?.requestPermission]);

  return {
    location,
    error,
    isLoading,
    getLocation
  };
};