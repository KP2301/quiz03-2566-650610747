import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomid = request.nextUrl.searchParams.get("roomId");
  const foundroom = DB.messages.find((x) => x.roomId === roomid);
  if (!foundroom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  } else {
    const filtered = DB.messages.filter((x) => x.roomId === roomid);
    return NextResponse.json(
      {
        ok: true,
        message: filtered,
      },
      { status: 200 }
    );
  }
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText } = body;
  const foundroom = DB.messages.find((x) => x.roomId === roomId);
  if (!foundroom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  const messageId = nanoid();

  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  let role = null;
  try {
    const payload = checkToken();
    role = payload.role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  if (role !== "SUPER_ADMIN")
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  readDB();
  const body = await request.json();
  const { messageId } = body;
  const foundmessageid = DB.messages.find((x) => x.messageId === messageId);
  if (!foundmessageid)
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );

  const findIndexofmesid = DB.messages.findIndex(
    (x) => x.messageId === messageId
  );
  DB.messages.splice(findIndexofmesid, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
