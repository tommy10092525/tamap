import { NextResponse } from "next/server";

export async function GET() {
  const data=require("../../../constants/TimeTable.json");
  return NextResponse.json(data);
}
