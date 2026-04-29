/**
 * hooks/useApi.js
 *
 * ─── THE MOST IMPORTANT FILE TO UNDERSTAND ───────────────────────────────────
 *
 * React communicates with backends using THREE pieces of state:
 *   1. data    — what the server sent back
 *   2. loading — are we still waiting?
 *   3. error   — did something go wrong?
 *
 * Every "fetch data from server" pattern in React follows this exact shape.
 * These custom hooks wrap that pattern so you don't repeat it everywhere.
 *
 * HOW CUSTOM HOOKS WORK:
 *   A custom hook is just a regular function that starts with "use" and calls
 *   other React hooks (useState, useEffect) inside it.
 *   You call it from a component, and it returns whatever state you need.
 */

import { useState, useEffect, useCallback, useRef, use } from "react";

// ─── useQuery ────────────────────────────────────────────────────────────────
/**
 * Fetches data from the server when the component mounts (or when deps change).
 * This covers every "show me the list" or "show me one record" use case.
 *
 * @param {Function} fetchFn    - an API function from /api/*.js
 * @param {Array}    deps       - refetch whenever any value in this array changes
 *
 * Usage:
 *   const { data, loading, error, refetch } = useQuery(
 *     () => fetchClasses({ page: 1 }),
 *     [page]   ← re-runs the fetch when `page` changes
 *   );
 */
export function useQuery(fetchFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // useCallback keeps the same function reference between renders so
  // we can safely put it in the useEffect dependency array.
  const stableFetch = useCallback(fetchFn, deps); // eslint-disable-line

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await stableFetch();
      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      // Always runs — loading stops whether it succeeded or failed.
      setLoading(false);
    }
  }, [stableFetch]);

  // useEffect runs AFTER the component renders.
  // The second argument [] means "run once after first render".
  // When deps change, React re-runs this effect automatically.
  useEffect(() => {
    run();
  }, [run]);//this is here for when 'run' change we run the use effect, or the run() inside it, pretty much

  return { data, loading, error, refetch: run };
}


// ─── useMutation ─────────────────────────────────────────────────────────────
/**
 * Sends data TO the server (create, update, delete).
 * Unlike useQuery, this does NOT run automatically — you call `mutate()` yourself
 * (e.g. when the user clicks "Save").
 *
 * Usage:
 *   const { mutate, loading, error, success } = useMutation(createClass);
 *
 *   async function handleSubmit(formData) {
 *     const result = await mutate(formData); 
 * if this succed then do redirect to class index
 *     if (result) navigate("/classes");
 *   }
 */
export function useMutation(mutateFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate =  (async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await mutateFn(...args);
      setSuccess(true);
      return result; // caller can use this to navigate, show message, etc.
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false); //so this is how htis is use, i never thought about it
    }
  }, [mutateFn]);

  // reset() lets you clear error/success state when user starts editing again
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { mutate, loading, error, success, reset };
}



// i dont get this part am lost

// ─── usePaginatedQuery ────────────────────────────────────────────────────────
/**
 * Like useQuery but manages page number and total count too.
 * The backend must return: { data: [...], total: 50, page: 1, pageSize: 10 }
 *
 * Usage:
 *   const { data, loading, page, setPage, total } = usePaginatedQuery(
 *     (p) => fetchClasses({ page: p, pageSize: 10 }),
 *   );
 */
export function usePaginatedQuery(fetchFn, extraDeps = []) {
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Keep latest fetchFn in a ref so we don't need it as a dep
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  useEffect(() => {
    let cancelled = false; // prevents stale responses overwriting fresh ones
    setLoading(true);
    setError(null);

    fetchRef.current(page)
      .then((res) => {
        if (cancelled) return;
        // Handles both { data: [], total: 0 } and plain arrays
        if (Array.isArray(res)) {
          setData(res);
          setTotal(res.length);
        } else {
          setData(res.data ?? []);
          setTotal(res.total ?? 0);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Cleanup: if the component unmounts or page changes before the request
    // finishes, mark the response as cancelled so we don't update state.
    return () => { cancelled = true; };

  }, [page, ...extraDeps]); // eslint-disable-line

  return { data, loading, error, page, setPage, total };
}