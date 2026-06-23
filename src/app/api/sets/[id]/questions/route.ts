import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const setId = parseInt(id);
    if (isNaN(setId)) {
      return NextResponse.json({ error: "Invalid set ID" }, { status: 400 });
    }

    const questionList = await db
      .select({
        id: questions.id,
        questionText: questions.questionText,
        optionA: questions.optionA,
        optionB: questions.optionB,
        optionC: questions.optionC,
        optionD: questions.optionD,
        correctOption: questions.correctOption,
        explanation: questions.explanation,
        orderIndex: questions.orderIndex,
      })
      .from(questions)
      .where(eq(questions.setId, setId))
      .orderBy(asc(questions.orderIndex));

    return NextResponse.json(questionList);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json([], { status: 500 });
  }
}
