"use client";

import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../lib/config";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResuts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async (seachTerm = query) => {
    const term = searchTerm.trim();

    if (term?.length < 2) {
      setResuts([]);
      setError(null);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }

      const data = await response.json();
      setResuts(data);
    } catch (error) {
      console.error("Erro na busca:", error);
      setError("Erro ao buscar produtos. Tente novamente.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const performAutoSearch = async () => {
      const term = query.trim();

      if (term?.length < 2) {
        setResuts([]);
        setError(null);
        setHasSearched(false);
        return;
      }
      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await fetch(
          `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(term)}`
        );

        if (!response.ok) {
          throw new Error(`Erro na busca: ${response.status}`);
        }

        const data = await response.json();
        setResuts(data);
      } catch (error) {
        console.error("Erro na busca:", error);
        setError("Erro ao buscar produtos. Tente novamente.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performAutoSearch();
  }, [query]);

  const clear = () => {
    setQuery("");
    setResuts([]);
    setError(null);
    setHasSearched(false);
    setLoading(false);
  };

  const hasResults = results.length > 0;
  const isEmpty = hasSearched && !loading && !hasResults && !error;

  return {
    query,
    results,
    loading,
    error,
    hasSearched,
    isEmpty,
    hasResults,
    setQuery,
    search,
    clear,
  };
};
