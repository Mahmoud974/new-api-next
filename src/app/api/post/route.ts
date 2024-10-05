import { NextResponse } from "next/server";
import { comments } from "../db/db";

export const POST = async (req: Request) => {
  try {
    const newComment = await req.json();

    if (
      !newComment.pseudo ||
      !newComment.comment ||
      !newComment.date ||
      !newComment.parentId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parentComment = comments.find(
      (comment) => comment.id === newComment.parentId
    );

    if (!parentComment) {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    parentComment.reply.push(newComment);

    const response = NextResponse.json(
      { message: "Reply added successfully!" },
      { status: 201 }
    );

    // Ajout des en-têtes CORS
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://interactive-comments-section-pink-rho.vercel.app"
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (err) {
    console.error(err);
    const errorResponse = NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
    errorResponse.headers.set(
      "Access-Control-Allow-Origin",
      "https://interactive-comments-section-pink-rho.vercel.app"
    );
    return errorResponse;
  }
};

export const OPTIONS = async () => {
  const response = new Response(null, { status: 204 });
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://interactive-comments-section-pink-rho.vercel.app"
  );
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
};
