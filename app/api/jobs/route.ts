import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // This logs the data to your terminal so you can see it working
    console.log("Job Data Received:", body); 

    return NextResponse.json({ message: "Job saved!", status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error saving job" }, { status: 500 });
  }
}