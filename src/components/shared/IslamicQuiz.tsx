import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { format } from "../../utils/dateUtils";
import { quizQuestions } from "../../data/quizQuestions";
import type { QuizQuestion, QuizRecord } from "../../types";
import { cn } from "../../utils/cn";
import { HelpCircle, Award, CheckCircle2, AlertCircle, HelpCircleIcon } from "lucide-react";

export default function IslamicQuiz() {
  const [quizRecord, setQuizRecord] = useStorage<QuizRecord>("quizRecord", {
    date: "",
    questionId: "",
    answeredCorrectly: false,
    totalCorrect: 0,
    totalAnswered: 0
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const question = quizQuestions[seed % quizQuestions.length];

  // Sync state if already answered today
  const hasAnsweredToday = quizRecord.date === today && quizRecord.questionId === question.id;

  const handleOptionClick = (index: number) => {
    if (answered || hasAnsweredToday) return;

    setSelectedIndex(index);
    setAnswered(true);

    const isCorrect = index === question.correctIndex;

    setQuizRecord({
      date: today,
      questionId: question.id,
      answeredCorrectly: isCorrect,
      totalCorrect: quizRecord.totalCorrect + (isCorrect ? 1 : 0),
      totalAnswered: quizRecord.totalAnswered + 1
    });
  };

  const getDifficultyColor = (diff: QuizQuestion["difficulty"]) => {
    switch (diff) {
      case "easy":
        return "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20";
      case "medium":
        return "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20";
      case "hard":
        return "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20";
      default:
        return "text-stone-700 bg-stone-50";
    }
  };

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Daily Islamic Quiz
          </p>
          <span className="text-[9px] text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider block mt-0.5">
            Category: {question.category}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", getDifficultyColor(question.difficulty))}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 flex gap-2">
        <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx || (hasAnsweredToday && quizRecord.answeredCorrectly && idx === question.correctIndex) || (hasAnsweredToday && !quizRecord.answeredCorrectly && idx === question.correctIndex); // wait, let's keep it simple
          
          let optionStyle = "border-stone-200 dark:border-stone-800 bg-stone-50/50 hover:bg-stone-100/50 dark:bg-stone-900/30 dark:hover:bg-stone-800/30 text-stone-700 dark:text-stone-300";
          
          // Displaying feedback state
          if (answered || hasAnsweredToday) {
            const isCorrectAnswer = idx === question.correctIndex;
            const isWrongSelection = (selectedIndex === idx || (hasAnsweredToday && !quizRecord.answeredCorrectly && idx !== question.correctIndex)) && !isCorrectAnswer; // Wait, actually:
            // Let's check who did what. If we just answered, or if it is already answered:
            if (isCorrectAnswer) {
              // Highlight the correct answer in emerald
              optionStyle = "bg-emerald-700 text-white border-emerald-800 shadow-sm";
            } else if (selectedIndex === idx || (hasAnsweredToday && !quizRecord.answeredCorrectly && idx === question.correctIndex)) {
              // Wait, if this was selected and it is wrong, highlight in rose
              optionStyle = "bg-rose-700 text-white border-rose-800 shadow-sm";
            } else if (hasAnsweredToday && !quizRecord.answeredCorrectly && idx !== question.correctIndex) {
              // Wait, if it was answered today, we don't know the exact selected index, but we know if it was correct or not.
              // Let's just highlight the correct one. If they answered wrong, we can just show the correct one in emerald, and leave the others.
              optionStyle = "opacity-60 border-stone-200 dark:border-stone-800 bg-stone-50/50 text-stone-500 dark:text-stone-400";
            } else {
              // Others disabled / faded
              optionStyle = "opacity-60 border-stone-200 dark:border-stone-800 bg-stone-50/50 text-stone-500 dark:text-stone-400";
            }
          }

          return (
            <button
              key={idx}
              disabled={answered || hasAnsweredToday}
              onClick={() => handleOptionClick(idx)}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-[0.99]",
                optionStyle
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation section */}
      {(answered || hasAnsweredToday) && (
        <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-150 dark:border-stone-850 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-1.5">
            {hasAnsweredToday ? (
              quizRecord.answeredCorrectly ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">Incorrect</span>
                </>
              )
            ) : (
              selectedIndex === question.correctIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">Incorrect</span>
                </>
              )
            )}
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Lifetime Score Banner */}
      <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>Lifetime Score</span>
        </div>
        <span>
          {quizRecord.totalCorrect} / {quizRecord.totalAnswered} Correct
        </span>
      </div>
    </div>
  );
}
