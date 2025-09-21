import { fetchCategories } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await fetchCategories();

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erro interno no Servidor:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      {
        status: 500,
      }
    );
  }
}
