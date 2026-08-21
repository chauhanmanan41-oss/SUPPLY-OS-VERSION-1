/**
 * useApi — generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi("/dashboard/kpis/");
 *   const { data, loading } = useApi("/products/", { immediate: false });
 *
 * Returns loading / error / data states and a refetch() function.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";

export function useApi(endpoint, {
  method = "GET",
  body = null,
  immediate = true,
  auth = true,
} = {}) {
  const [data, setData]       = useState(null);
  const [meta, setMeta]       = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (overrideBody) => {
    setLoading(true);
    setError(null);

    try {
      const result = method === "GET"
        ? await api.get(endpoint, { auth })
        : await api[method.toLowerCase()](endpoint, overrideBody ?? body, { auth });

      if (mountedRef.current) {
        // If the backend returns DRF StandardResultsPagination format or custom results array,
        // extract the array so that map() doesn't break, while storing full metadata object.
        if (result && typeof result === 'object' && result.results !== undefined) {
          setData(result.results);
          setMeta(result);
        } else {
          setData(result);
          setMeta(result);
        }
      }
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [endpoint, method, body, auth]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      fetchData();
    }
    return () => { mountedRef.current = false; };
  }, [endpoint]); // Re-fetch when endpoint changes

  return { data, meta, loading, error, refetch: fetchData };
}
