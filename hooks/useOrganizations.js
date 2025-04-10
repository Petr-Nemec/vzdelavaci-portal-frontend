// hooks/useOrganizations.js - Hook pro práci s organizacemi
import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchOrganizations } from '../api/organizations';

export const useOrganizations = (initialParams = {}) => {
  const [params, setParams] = useState(initialParams);
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery(
    ['organizations', params, page],
    () => fetchOrganizations({ ...params, page }),
    {
      keepPreviousData: true,
    }
  );

  return {
    organizations: data?.organizations || [],
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    setParams,
    setPage,
    refetch
  };
};
