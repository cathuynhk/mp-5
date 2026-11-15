// app/api/shorten/route.ts
// This file handles POST requests, validates the URL and alias, checks for duplicates,
// and inserts the document into MongoDB
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { url, alias } = await req.json();

        // --- Server-side URL validation ---
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL. Please enter a valid URL." },
                { status: 400 }
            );
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return NextResponse.json(
                { error: "Only HTTP and HTTPS URLs are allowed." },
                { status: 400 }
            );
        }

        // --- Alias validation ---
        if (!alias || !/^[a-zA-Z0-9_-]+$/.test(alias)) {
            return NextResponse.json(
                { error: "Alias can only contain letters, numbers, hyphens, and underscores." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("urlShortener"); // your database name
        const collection = db.collection("links");

        // Check for duplicate alias
        const existing = await collection.findOne({ alias });
        if (existing) {
            return NextResponse.json(
                { error: "This alias is already taken. Please choose another one." },
                { status: 409 }
            );
        }

        // Insert the new link
        await collection.insertOne({ alias, url, createdAt: new Date() });

        return NextResponse.json({ alias }, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}