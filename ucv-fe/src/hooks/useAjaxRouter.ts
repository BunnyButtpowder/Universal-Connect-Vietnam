import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface RouterTransitionState {
  isNavigating: boolean;
  progress: number;
  fromPath: string | null;
  toPath: string | null;
}

interface UseAjaxRouterReturn {
  isNavigating: boolean;
  progress: number;
  fromPath: string | null;
  toPath: string | null;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  handleLinkClick: (event: MouseEvent | React.MouseEvent) => boolean;
}

export function useAjaxRouter(): UseAjaxRouterReturn {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [transitionState, setTransitionState] = useState<RouterTransitionState>({
    isNavigating: false,
    progress: 0,
    fromPath: null,
    toPath: null,
  });

  // Handle programmatic navigation with transition
  const handleNavigate = useCallback((path: string, options?: { replace?: boolean }) => {
    // Don't navigate if already on the same path
    if (path === location.pathname) return;
    
    // Don't handle external links or admin routes differently
    if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
      window.location.href = path;
      return;
    }

    // Start transition
    setTransitionState({
      isNavigating: true,
      progress: 0,
      fromPath: location.pathname,
      toPath: path,
    });

    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        clearInterval(progressInterval);
        setTransitionState(prev => ({ ...prev, progress: 90 }));
      } else {
        setTransitionState(prev => ({ ...prev, progress }));
      }
    }, 50);

    // Small delay to show the transition effect, but make it feel fast
    setTimeout(() => {
      clearInterval(progressInterval);
      setTransitionState(prev => ({ ...prev, progress: 100 }));
      
      // Perform the actual navigation
      navigate(path, options);
      
      // Complete the transition after navigation
      setTimeout(() => {
        setTransitionState({
          isNavigating: false,
          progress: 0,
          fromPath: null,
          toPath: null,
        });
      }, 150);
    }, 200);
  }, [navigate, location.pathname]);

  // Handle link clicks for AJAX navigation
  const handleLinkClick = useCallback((event: MouseEvent | React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a') as HTMLAnchorElement;
    
    if (!link) return false;
    
    const href = link.getAttribute('href');
    if (!href) return false;

    // Skip if it's an external link, email, phone, or hash link
    if (
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href.includes('#') ||
      link.getAttribute('target') === '_blank' ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return false;
    }

    // Skip if it's the same page
    if (href === location.pathname) {
      event.preventDefault();
      return true;
    }

    // Handle the navigation with AJAX
    event.preventDefault();
    handleNavigate(href);
    return true;
  }, [handleNavigate, location.pathname]);

  // Set up global link click handler
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      handleLinkClick(event);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [handleLinkClick]);

  return {
    isNavigating: transitionState.isNavigating,
    progress: transitionState.progress,
    fromPath: transitionState.fromPath,
    toPath: transitionState.toPath,
    navigate: handleNavigate,
    handleLinkClick,
  };
}
