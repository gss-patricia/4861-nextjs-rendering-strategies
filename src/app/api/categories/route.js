import { fetchCategories } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await fetchCategories();

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store", // Sem cache na API (ISR gerencia o cache)
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
