import { useMemo } from 'react';

const useBaseUrl = () => {
    // You can configure the base URL dynamically based on env or mode
    const baseUrl = useMemo(() => {
        // Example: switch based on environment
        if (import.meta.env.MODE === 'development') {
            return 'http://192.168.29.245:3000';
        } else {
            return 'https://your-production-api.com';
        }
    }, []);

    return baseUrl;
};

export default useBaseUrl;
