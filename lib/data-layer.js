import { supabase } from "./supabase";

// Buscar categories - SUPABASE DIRETO
export const fetchCategories = async () => {
  try {
    const { data: rawCategories, error } = await supabase
      .from("categories")
      .select('id, name, "imageSrc"')
      .order("name");

    if (error) {
      console.error("Erro ao buscar categorias do Supabase:", error);

      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }

    return rawCategories;
  } catch (error) {
    console.error("Erro no fetchCategories:", error);
    throw error;
  }
};

//Buscar produtos - SUPABASE DIRETO
export const fetchProducts = async (options = {}) => {
  try {
    const { limit = 6, featuredOnly = false } = options;

    let query = supabase
      .from("products")
      .select(
        `
    id,
    name,
    description,
    price,
    "imageSrc",
    colors,
    sizes,
    "categoryId",
    category:categories(id, name, "imageSrc"),
    "isFeatured"
    `
      )
      .eq('"isActive"', true)
      .order('"isFeatured"', { ascending: false })
      .order('"createdAt"', { ascending: false });

    //Filtro por featured se solicitado
    if (featuredOnly) {
      query = query.eq('"isFeatured"', true);
    }

    //Aplicar o limite
    query = query.limit(limit);

    const { data: rawProducts, error } = await query;

    if (error) {
      console.error("Erro ao buscar produtos do Supabase:", error);
      throw new Error(`Erro ao buscar productos: ${error.message}`);
    }

    return rawProducts;
  } catch (error) {
    console.error("Erro no fetchProducts:", error);
    throw error;
  }
};

// Buscar produto por ID
export const fetchProductById = async (id) => {
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
       id,
    name,
    description,
    price,
    "imageSrc",
    colors,
    sizes,
    "categoryId",
    category:categories(id, name, "imageSrc"),
    "isFeatured"
      `
      )
      .eq("id", id)
      .eq('"isActive"', true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }

      console.error("Erro ao buscar produto por ID:", error);
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }

    return product;
  } catch (error) {
    console.error("Erro no fetchProductById:", error);
    throw error;
  }
};

//Buscar produtos por termo de busca
export const fetchProductsBySearch = async (searchTerm, options = {}) => {
  try {
    const { limit = 20 } = options;

    if (searchTerm?.trim().length < 2) {
      return [];
    }

    const query = searchTerm.trim();

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
      id,
      name,
      description,
      price,
      "imageSrc",
      colors,
      sizes,
      "categoryId",
      "isFeatured"
      `
      )
      .eq('"isActive"', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('"isFeatured"', { ascending: false })
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar produtos por termo:", error);
      throw new Error(`Erro na busca: ${error.message}`);
    }

    return products || [];
  } catch (error) {
    console.error("Erro no fetchProductsBySearch:", error);
    throw error;
  }
};
