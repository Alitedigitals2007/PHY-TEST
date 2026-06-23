import { NextResponse } from "next/server";
import { db } from "@/db";
import { questionSets, questions } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const sets = await db
      .select({
        id: questionSets.id,
        name: questionSets.name,
        description: questionSets.description,
        questionCount: count(questions.id),
      })
      .from(questionSets)
      .leftJoin(questions, eq(questionSets.id, questions.setId))
      .groupBy(questionSets.id, questionSets.name, questionSets.description);

    return NextResponse.json(sets);
  } catch (error) {
    console.error("Error fetching sets:", error);
    return NextResponse.json([], { status: 500 });
  }
}
