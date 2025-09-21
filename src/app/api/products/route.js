import { fetchProducts } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

// Força a execução dinamica (sem cache do Next)
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    //Extrair Parametros
    const limit = parseInt(searchParams.get("limit") || 6);
    const featured = searchParams.get("featured") === "true";

    const products = await fetchProducts({ limit, featuredOnly: featured });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store", // didatico, apenas para lembrar browser/CDN
      },
    });
  } catch (error) {
    console.error("Erro na API de produtos:", error);

    return NextResponse.json(
      { error: "Error interno do servidor:" },
      { status: 500 }
    );
  }
}
