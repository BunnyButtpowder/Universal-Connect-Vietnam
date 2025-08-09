import { ReactNode } from 'react';
import { useAjaxRouter } from '@/hooks/useAjaxRouter';
import { LoadingBar } from './LoadingBar';

interface AjaxRouterProps {
    children: ReactNode;
}

export function AjaxRouter({ children }: AjaxRouterProps) {
    const { isNavigating, progress } = useAjaxRouter();

    return (
        <>
            <LoadingBar
                isVisible={isNavigating}
                progress={progress}
            />
            {children}
        </>
    );
}

export default AjaxRouter;
