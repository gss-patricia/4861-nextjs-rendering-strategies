import { fetchCategories } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

// Força execução dinâmica (sem cache do Next)
//Por que dynamic = 'force-dynamic'?
//Garante que cada request executa no servidor
//e nada é servido do Cache do Next.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await fetchCategories();

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store", // didático: browser/CDN
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de categorias:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
/**
 * “No Next existem caches do framework e existe cache HTTP (browser/CDN).”
“Aqui, para SSR, eu forço dinâmico com dynamic = 'force-dynamic'. 
Isso desliga o cache do Next para esta rota.”
“Com ambos: você tem dinâmico de ponta a ponta (Next não cacheia, browser/CDN também não).
Se você remover o force-dynamic e deixar só o header:
 o Next pode cachear/prerender GET de Route Handlers (comportamento padrão), 
 e o header não impede isso — só evita cache no navegador/CDN
 */
