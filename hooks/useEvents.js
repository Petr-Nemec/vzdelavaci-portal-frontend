// hooks/useEvents.js - Hook pro práci s událostmi
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchEvents } from '../api/events';

export const useEvents = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);

  // Použití React Query pro načítání dat
  const { data, isLoading, error, refetch } = useQuery(
    ['events', filters, page],
    () => fetchEvents({ ...filters, page }),
    {
      keepPreviousData: true, // Zachová předchozí data dokud nové nejsou načteny
    }
  );

  // Reset stránky při změně filtrů
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return {
    events: data?.events || [],
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    setFilters,
    setPage,
    refetch
  };
};
