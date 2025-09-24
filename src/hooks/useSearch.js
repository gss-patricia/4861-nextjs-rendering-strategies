"use client";

import { useState, useEffect } from "react";

// 🎓 Custom Hook de Busca - vamos criar do zero!
export const useSearch = () => {
  // 📊 Estados que precisamos gerenciar:
  const [query, setQuery] = useState(""); // 🔤 O que usuário digita
  const [results, setResults] = useState([]); // 📋 Produtos encontrados
  const [loading, setLoading] = useState(false); // ⏳ Está buscando?
  const [error, setError] = useState(null); // ❌ Tem erro?
  const [hasSearched, setHasSearched] = useState(false); // ✅ Já buscou?

  // 🔍 Função para buscar produtos (async porque faz fetch)
  const search = async (searchTerm = query) => {
    const term = searchTerm.trim(); // 🧹 Remove espaços

    // 🚫 Se tem menos de 2 chars, limpa tudo e para
    if (term?.length < 2) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      return; // Para aqui!
    }

    // 🎬 Preparando para buscar
    setLoading(true); // Liga spinner
    setError(null); // Limpa erros antigos
    setHasSearched(true); // Marca que tentou buscar

    // 🌐 Fazendo a requisição
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(term)}&limit=20` // 📡 Encode protege chars especiais
      );

      if (!response.ok) {
        // ⚠️ Fetch não rejeita 4xx/5xx automático
        throw new Error(`Erro na busca: ${response.status}`);
      }

      const data = await response.json(); // 📄 Converte resposta para JSON
      setResults(data); // 📋 Salva produtos
    } catch (err) {
      console.error("❌ Erro na busca:", err); // 🚨 Log para debug
      setError("Erro ao buscar produtos. Tente novamente.");
      setResults([]); // 📋 Limpa produtos antigos
    } finally {
      setLoading(false); // ✅ Always para o loading
    }
  };

  // 🔄 useEffect: busca automática quando query muda
  useEffect(() => {
    // 🔍 Função interna async (useEffect não pode ser async direto)
    const performAutoSearch = async () => {
      const term = query.trim();

      if (term?.length < 2) {
        // 🚫 Validação
        setResults([]);
        setError(null);
        setHasSearched(false);
        return;
      }

      setLoading(true); // 🎬 Preparação
      setError(null);
      setHasSearched(true);

      try {
        // 🌐 Requisição
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(term)}&limit=20`
        );

        if (!response.ok) {
          throw new Error(`Erro na busca: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("❌ Erro na busca:", err);
        setError("Erro ao buscar produtos. Tente novamente.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performAutoSearch(); // 🚀 Executa busca
  }, [query]); // 📋 Só executa quando query muda!

  // 🧹 Função para limpar busca (volta ao estado inicial)
  const clear = () => {
    setQuery(""); // 🔤 Limpa input
    setResults([]); // 📋 Remove produtos
    setError(null); // ❌ Remove erro
    setHasSearched(false); // ✅ "Não buscou ainda"
    setLoading(false); // ⏳ Para loading
  };

  // 📊 Estados derivados (calculados, não precisam useState)
  const isEmpty = hasSearched && !loading && results.length === 0 && !error; // 🔍 "Buscou mas vazio"
  const hasResults = results.length > 0; // 📋 "Tem produtos"

  // 🎁 Retorna tudo que o componente precisa
  return {
    // Estados básicos
    query,
    results,
    loading,
    error,
    hasSearched,

    // Estados computados
    isEmpty,
    hasResults,

    // Funções
    setQuery, // 🔤 Muda query → dispara busca automática
    search, // 🔍 Busca manual
    clear, // 🧹 Reset completo
  };
};

// 💡 Como usar no componente:
// const { query, setQuery, results, loading, clear } = useSearch();
// <Input value={query} onChange={e => setQuery(e.target.value)} />
// {loading && <Spinner />}
// {results.map(product => <ProductCard key={product.id} product={product} />)}
