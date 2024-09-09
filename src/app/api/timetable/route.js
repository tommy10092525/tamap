import { NextResponse } from "next/server";

export async function GET() {
  const data=require("../../../constants/timetable.json");
  return NextResponse.json(data);
}
