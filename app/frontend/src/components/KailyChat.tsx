import { useEffect } from 'react';

export function KailyChat() {
  useEffect(() => {
    // Load Kaily chat widget script
    const script = document.createElement('script');
    script.src = 'https://www.kaily.ai/widget.js';
    script.async = true;
    script.setAttribute('data-kaily-id', import.meta.env.VITE_KAILY_WIDGET_ID || 'demo');
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}