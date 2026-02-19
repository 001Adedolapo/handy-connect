import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Bid Data Received:", body);

    return NextResponse.json({ message: "Bid saved!", status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error saving bid" }, { status: 500 });
  }
}