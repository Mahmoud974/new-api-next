import { NextResponse } from "next/server";
import { comments } from "../db/db";

const allowedOrigin = "https://interactive-comments-section-juef.vercel.app/";

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

    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (err) {
    console.error(err);
    const errorResponse = NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    return errorResponse;
  }
};

export const OPTIONS = async () => {
  const response = new Response(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
};
