import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Kittiwin Phannachet",
    studentId: "650610747",
  });
};
