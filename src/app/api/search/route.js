import { fetchProductsBySearch } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    const query = searchParams.get("q")?.trim();

    const products = await fetchProductsBySearch(query);

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error na API de busca:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
