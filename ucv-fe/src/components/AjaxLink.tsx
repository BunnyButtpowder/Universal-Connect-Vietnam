import React, { forwardRef } from 'react';
import { useAjaxRouter } from '@/hooks/useAjaxRouter';

interface AjaxLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  replace?: boolean;
  children: React.ReactNode;
}

export const AjaxLink = forwardRef<HTMLAnchorElement, AjaxLinkProps>(
  ({ to, href, replace = false, onClick, children, className = '', ...props }, ref) => {
    const { navigate, handleLinkClick } = useAjaxRouter();
    
    const targetHref = to || href || '#';

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Call custom onClick if provided
      if (onClick) {
        onClick(event);
      }

      // Handle AJAX navigation if not prevented
      if (!event.defaultPrevented) {
        const handled = handleLinkClick(event);
        if (handled && to) {
          // Use programmatic navigation for controlled behavior
          event.preventDefault();
          navigate(to, { replace });
        }
      }
    };

    return (
      <a
        ref={ref}
        href={targetHref}
        onClick={handleClick}
        className={`transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }
);

AjaxLink.displayName = 'AjaxLink';

export default AjaxLink;
