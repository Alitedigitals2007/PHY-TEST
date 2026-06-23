import { NextResponse } from "next/server";
import { db } from "@/db";
import { quizAttempts, questionSets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, department, setId, score, totalQuestions, timeTakenSeconds } = body;

    if (!studentName || !department || !setId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        studentName,
        department,
        setId,
        score,
        totalQuestions,
        timeTakenSeconds,
      })
      .returning();

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Error saving attempt:", error);
    return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const attempts = await db
      .select({
        id: quizAttempts.id,
        studentName: quizAttempts.studentName,
        department: quizAttempts.department,
        setId: quizAttempts.setId,
        setName: questionSets.name,
        score: quizAttempts.score,
        totalQuestions: quizAttempts.totalQuestions,
        timeTakenSeconds: quizAttempts.timeTakenSeconds,
        completedAt: quizAttempts.completedAt,
      })
      .from(quizAttempts)
      .leftJoin(questionSets, eq(quizAttempts.setId, questionSets.id))
      .orderBy(desc(quizAttempts.completedAt));

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json([], { status: 500 });
  }
}
