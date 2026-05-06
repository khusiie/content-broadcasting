import { useState, useEffect, useCallback } from 'react';
import contentService from '../services/content.service';
const useContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.getMyContent();
      setContent(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, []);
  const uploadContent = useCallback(async (formData) => {
    const data = await contentService.uploadContent(formData);
    await fetchContent();
    return data;
  }, [fetchContent]);
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);
  return { content, loading, error, fetchContent, uploadContent };
};
export default useContent;
