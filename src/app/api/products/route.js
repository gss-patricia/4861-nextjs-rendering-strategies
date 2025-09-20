import { fetchProducts } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

// Força execução dinâmica (sem cache do Next)
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extrair parâmetros
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    const products = await fetchProducts({
      limit,
      featuredOnly: featured,
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store", // didático: browser/CDN
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
