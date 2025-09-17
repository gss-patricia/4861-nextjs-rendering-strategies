import { fetchProducts } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extrair parâmetros
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    const products = await fetchProducts({
      limit,
      featuredOnly: featured,
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store", // Sem cache na API (SSR gerencia dados frescos)
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de produtos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
