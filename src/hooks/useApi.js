import { useState, useCallback } from "react";
import axios from "axios";
import { useLoading } from "@context/LoadingContext";

const BASE_URL = "http://192.168.29.245:3000";

export default function useApi(path) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { showLoading, hideLoading } = useLoading();

    const request = useCallback(
        async (method, body = null, params = {}) => {
            showLoading({ type: 'spinner', size: 'md', fullscreen: true });
            setError(null);

            try {
                const res = await axios({
                    method,
                    url: `${BASE_URL}${path}`,
                    resData: body,
                    params,
                });

                setData(res.data);
                return res.data;
            } catch (err) {
                setError(err.response?.data || err.message);
                throw err;
            } finally {
                hideLoading()
            }
        },
        [path]
    );

    // Expose API methods
    const get = useCallback((params) => request("get", null, params), [request]);
    const post = useCallback((body) => request("post", body), [request]);
    const put = useCallback((body) => request("put", body), [request]);
    const patch = useCallback((body) => request("patch", body), [request]);
    const remove = useCallback(() => request("delete"), [request]);

    return { data, error, get, post, put, patch, remove };
}


// #################################### USAGE ###############################################//

// import useApi from '@hooks/useApi';

// function LoginComponent() {
//     const { resData, loading, error, post } = useApi('/auth/login');

//     const handleLogin = async () => {
//         const body = { email: 'user@example.com', password: 'pass123' };

//         try {
//             const response = await post(body);
//             console.log('Login Successful:', response);
//         } catch (err) {
//             console.error('Login Failed:', error);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleLogin} disabled={loading}>
//                 {loading ? 'Logging in...' : 'Login'}
//             </button>

//             {data && <p>Logged in successfully!</p>}
//             {error && <p className="text-danger">{error}</p>}
//         </div>
//     );
// }
