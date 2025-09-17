-- 🗑️ Dropar tabelas existentes (cascade para remover dependências)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 🏗️ Tabela categories (colunas em camelCase COM ASPAS DUPLAS)
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  "imageSrc" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 🏗️ Tabela products (colunas em camelCase COM ASPAS DUPLAS)  
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  "imageSrc" TEXT,
  colors JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  "categoryId" BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  "isFeatured" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ⚡ Índices para performance (COM ASPAS DUPLAS)
CREATE INDEX "idx_products_categoryId" ON products("categoryId");
CREATE INDEX "idx_products_isFeatured" ON products("isFeatured");
CREATE INDEX "idx_products_isActive" ON products("isActive");
