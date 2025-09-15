#!/usr/bin/env node

/**
 * 🌱 Script de Seed - Meteora Store
 *
 * Popula o banco Supabase com dados iniciais
 *
 * Uso:
 * npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// 🔧 Carregar especificamente o .env.local
dotenv.config({ path: ".env.local" });

// 🔑 Configuração Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Erro: Variáveis de ambiente do Supabase não encontradas!");
  console.log("📝 Certifique-se de que .env.local contém:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL=...");
  console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=...");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 📊 Dados para seed
const categorias = [
  {
    name: "Camisetas",
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/camiseta.png",
  },
  {
    name: "Bolsas",
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/bolsa.png",
  },
  {
    name: "Calçados",
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/tenis.png",
  },
  {
    name: "Calças",
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/calca.png",
  },
  {
    name: "Casacos",
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/casaco.png",
  },
  {
    name: "Óculos",
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/categorias/oculos.png",
  },
];

const produtos = [
  {
    name: "Camiseta conforto",
    colors: [{ hexa: "#b39628", name: "Mostarda" }],
    price: "R$ 70,00",
    sizes: ["P", "PP", "M", "G", "GG"],
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/camiseta-conforto.jpeg",
    description:
      "Multicores e tamanhos. Tecido de algodão 100%, fresquinho para o verão. Modelagem unissex.",
    category_name: "Camisetas",
    is_featured: true,
  },
  {
    name: "Calça Alfaiataria",
    colors: [{ hexa: "#ebe2c2", name: "Creme" }],
    price: "R$ 180,00",
    sizes: ["P", "PP", "M", "G", "GG"],
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/calca-alfaitaria.jpeg",
    description:
      "Snicker casual com solado mais alto e modelagem robusta. Modelo unissex.",
    category_name: "Calças",
    is_featured: true,
  },
  {
    name: "Tênis Chunky",
    colors: [{ hexa: "#ffffff", name: "Branco" }],
    price: "R$ 50,00",
    sizes: ["35", "36", "37", "38", "39"],
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/tenis-chunky.jpeg",
    description:
      "Snicker casual com solado mais alto e modelagem robusta. Modelo unissex.",
    category_name: "Calçados",
    is_featured: true,
  },
  {
    name: "Jaqueta Jeans",
    colors: [
      { hexa: "#112d96", name: "Azul" },
      { hexa: "#fefffe", name: "OffWhite" },
      { hexa: "#000000", name: "Preto" },
    ],
    price: "R$ 150,00",
    sizes: ["P", "PP", "M", "G", "GG"],
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/jaqueta-jeans.jpeg",
    description:
      "Modelo unissex oversized com gola de camurça. Atemporal e autêntica!",
    category_name: "Casacos",
    is_featured: false,
  },
  {
    name: "Óculos Redondo",
    colors: [
      { hexa: "#fefffe", name: "OffWhite" },
      { hexa: "#000000", name: "Preto" },
    ],
    price: "R$ 120,00",
    sizes: ["Único"],
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/oculos-redondo.jpeg",
    description:
      "Armação metálica em grafite com lentes arredondadas. Sem erro!",
    category_name: "Óculos",
    is_featured: false,
  },
  {
    name: "Bolsa coringa",
    colors: [{ hexa: "#c65038", name: "Castanho" }],
    price: "R$ 120,00",
    sizes: ["Único"],
    image_src:
      "https://raw.githubusercontent.com/gss-patricia/meteora-assets/main/produtos/bolsa-coringa.jpeg",
    description:
      "Bolsa camel em couro sintético de alta duração. Ideal para acompanhar você por uma vida!",
    category_name: "Bolsas",
    is_featured: false,
  },
];

// 🚀 Funções principais
async function limparDados() {
  console.log("🧹 Limpando dados existentes...");

  const { error: produtosError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  const { error: categoriasError } = await supabase
    .from("categories")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (produtosError) console.log("⚠️ Aviso produtos:", produtosError.message);
  if (categoriasError)
    console.log("⚠️ Aviso categorias:", categoriasError.message);
}

async function inserirCategorias() {
  console.log("📂 Inserindo categorias...");

  const { data, error } = await supabase
    .from("categories")
    .insert(categorias)
    .select();

  if (error) {
    console.error("❌ Erro ao inserir categorias:", error);
    throw error;
  }

  console.log(`✅ ${data.length} categorias inseridas com sucesso!`);
  return data;
}

async function inserirProdutos() {
  console.log("🛍️ Inserindo produtos...");

  // Buscar IDs das categorias
  const { data: categoriasDados } = await supabase
    .from("categories")
    .select("id, name");

  const categoriaMap = {};
  categoriasDados.forEach((cat) => {
    categoriaMap[cat.name] = cat.id;
  });

  // Preparar produtos com category_id
  const produtosSeed = produtos.map((produto) => ({
    name: produto.name,
    description: produto.description,
    price: produto.price,
    image_src: produto.image_src,
    colors: produto.colors,
    sizes: produto.sizes,
    category_id: categoriaMap[produto.category_name],
    is_featured: produto.is_featured,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from("products")
    .insert(produtosSeed)
    .select();

  if (error) {
    console.error("❌ Erro ao inserir produtos:", error);
    throw error;
  }

  console.log(`✅ ${data.length} produtos inseridos com sucesso!`);
  return data;
}

async function verificarDados() {
  console.log("🔍 Verificando dados inseridos...\n");

  const { data: categorias } = await supabase.from("categories").select("*");

  const { data: produtos } = await supabase.from("products").select("*");

  console.log(`📊 Resumo:`);
  console.log(`   📂 Categorias: ${categorias?.length || 0}`);
  console.log(`   🛍️ Produtos: ${produtos?.length || 0}`);
  console.log(
    `   ⭐ Em destaque: ${produtos?.filter((p) => p.is_featured).length || 0}\n`
  );

  if (categorias?.length > 0) {
    console.log("📂 Categorias criadas:");
    categorias.forEach((cat) => console.log(`   • ${cat.name}`));
  }

  if (produtos?.length > 0) {
    console.log("\n🛍️ Produtos criados:");
    produtos.forEach((prod) => {
      const destaque = prod.is_featured ? " ⭐" : "";
      console.log(`   • ${prod.name} - ${prod.price}${destaque}`);
    });
  }
}

// 🎯 Execução principal
async function executarSeed() {
  try {
    console.log("🌱 INICIANDO SEED DO METEORA STORE\n");
    console.log("🔗 Supabase URL:", supabaseUrl);
    console.log("🔑 Anon Key:", supabaseKey.substring(0, 20) + "...\n");

    await limparDados();
    await inserirCategorias();
    await inserirProdutos();
    await verificarDados();

    console.log("\n🎉 SEED CONCLUÍDO COM SUCESSO!");
    console.log("🚀 Agora você pode testar suas APIs:\n");
    console.log("   📂 Categorias: http://localhost:3000/api/categories");
    console.log("   🛍️ Produtos: http://localhost:3000/api/products");
    console.log(
      "   ⭐ Em destaque: http://localhost:3000/api/products?featured=true\n"
    );
  } catch (error) {
    console.error("\n💥 ERRO NO SEED:", error.message);
    process.exit(1);
  }
}

// 🚀 Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  executarSeed();
}

export { executarSeed };
