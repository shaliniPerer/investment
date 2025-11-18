import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // You can also hardcode or read from JSON body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ msg: "Email and password required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("test"); // Replace with your DB name

    // Check if an admin already exists
    const existing = await db.collection("admins").findOne({});
    if (existing) {
      // Update existing admin
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection("admins").updateOne(
        { _id: existing._id },
        { $set: { email, password: hashedPassword } }
      );
      return NextResponse.json({ msg: "Admin updated successfully" });
    }

    // If no admin exists, create one
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("admins").insertOne({ email, password: hashedPassword });

    return NextResponse.json({ msg: "Admin initialized successfully", id: result.insertedId });
  } catch (err) {
    console.error("Admin Init Error:", err);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
