import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, isLocalApi } from '../lib/apiConfig';

type BeStatus = 'checking' | 'online' | 'offline';

export function DevApiIndicator() {
    const [beStatus, setBeStatus] = useState<BeStatus>('checking');

    const ping = useCallback(async () => {
        const controller = new AbortController();
        const t = window.setTimeout(() => controller.abort(), 2500);
        try {
            const res = await fetch(`${API_BASE_URL}/`, {
                method: 'GET',
                signal: controller.signal
            });
            window.clearTimeout(t);
            setBeStatus(res.ok ? 'online' : 'offline');
        } catch {
            window.clearTimeout(t);
            setBeStatus('offline');
        }
    }, []);

    useEffect(() => {
        if (!isLocalApi()) return;
        void ping();
        const id = window.setInterval(() => void ping(), 5000);
        return () => window.clearInterval(id);
    }, [ping]);

    // Chỉ hiện khi test local (VITE_API_URL = localhost). Production build / API production: ẩn hoàn toàn.
    if (import.meta.env.PROD || !isLocalApi()) {
        return null;
    }

    const statusLabel =
        beStatus === 'checking'
            ? 'BE: …'
            : beStatus === 'online'
              ? 'BE: online'
              : 'BE: OFFLINE';

    return (
        <div
            className="fixed bottom-2 left-2 z-[9999] max-w-[min(100vw-1rem,28rem)] rounded-md px-3 py-1.5 text-xs font-mono shadow-lg border"
            style={{
                background: '#ecfdf5',
                borderColor: beStatus === 'offline' ? '#ef4444' : '#10b981',
                color: '#0f172a'
            }}
            title="Chỉ hiện khi dev + API local. FE gọi BE local → MariaDB local."
        >
            <div>API: {API_BASE_URL} (local BE / DB local)</div>
            <div className="mt-0.5 opacity-90">
                {statusLabel}
                {beStatus === 'offline' && (
                    <span className="text-red-600"> — F5 để xác nhận dữ liệu mới</span>
                )}
            </div>
        </div>
    );
}
