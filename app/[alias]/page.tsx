// app/[alias]/page.tsx
// This is a Server Component that reads the alias from the URL, looks it up in the database,
// and uses the redirect() function to send the user to the original URL
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

export default async function AliasPage({
                                            params,
                                        }: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params; // Next.js 15+ requires awaiting params

    const client = await clientPromise;
    const db = client.db("urlShortener");
    const collection = db.collection("links");

    const link = await collection.findOne({ alias });

    if (!link) {
        redirect("/?error=notfound"); // or show a custom 404 page
    }

    redirect(link.url); // sends the user to the original URL
}