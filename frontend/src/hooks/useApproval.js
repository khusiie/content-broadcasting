import { useState, useEffect, useCallback } from 'react';
import approvalService from '../services/approval.service';
const useApproval = () => {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyMeta, setHistoryMeta] = useState({ total: 0, totalPages: 1 });
  const fetchPending = useCallback(async () => {
    try {
      const data = await approvalService.getPending();
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pending content');
    }
  }, []);
  const fetchHistory = useCallback(async (params = {}) => {
    try {
      const data = await approvalService.getAll(params);
      setHistory(data.data || data);
      if (data.pagination) setHistoryMeta(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch content history');
    }
  }, []);
  const fetchAll = useCallback(async (historyParams = {}) => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchPending(), fetchHistory(historyParams)]);
    setLoading(false);
  }, [fetchPending, fetchHistory]);
  const approve = useCallback(async (contentId) => {
    await approvalService.approve(contentId);
    await fetchPending();
  }, [fetchPending]);
  const reject = useCallback(async (contentId, reason) => {
    await approvalService.reject(contentId, reason);
    await fetchPending();
  }, [fetchPending]);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  return {
    pending,
    history,
    loading,
    error,
    historyMeta,
    fetchPending,
    fetchHistory,
    fetchAll,
    approve,
    reject,
  };
};
export default useApproval;
