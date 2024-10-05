import { NextResponse } from "next/server";
import { comments } from "../db/db";

export const GET = async () => {
  try {
    const response = NextResponse.json(comments, { status: 200 });
    // Ajout des en-têtes CORS
    response.headers.set("Access-Control-Allow-Origin", "*"); // Remplacez '*' par votre domaine pour plus de sécurité
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return response;
  } catch (err) {
    console.error(err);
    const errorResponse = NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
};
