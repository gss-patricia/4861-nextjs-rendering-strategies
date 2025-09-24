import { fetchProductsBySearch } from "../../../../lib/data-layer.js";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    const query = searchParams.get("q")?.trim();
    const limit = parseInt(searchParams.get("limit") || "20");

    // 🔍 Usar função do data-layer para busca
    const products = await fetchProductsBySearch(query, { limit });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store", // CSR/Search não precisa de cache
      },
    });
  } catch (error) {
    console.error("❌ Erro na API de busca:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
