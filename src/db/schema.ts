import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const questionSets = pgTable("question_sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  setId: integer("set_id")
    .references(() => questionSets.id)
    .notNull(),
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: text("correct_option").notNull(), // "A", "B", "C", or "D"
  explanation: text("explanation"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  department: text("department").notNull(),
  setId: integer("set_id")
    .references(() => questionSets.id)
    .notNull(),
  score: integer("score").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  timeTakenSeconds: integer("time_taken_seconds"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});
