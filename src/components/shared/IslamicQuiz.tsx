import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { format } from "../../utils/dateUtils";
import { quizQuestions } from "../../data/quizQuestions";
import type { QuizQuestion, QuizRecord } from "../../types";
import { cn } from "../../utils/cn";
import { HelpCircle, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";

export default function IslamicQuiz() {
  const [quizRecord, setQuizRecord] = useStorage<QuizRecord>("quizRecord", {
    date: "",
    questionId: "",
    answeredCorrectly: false,
    totalCorrect: 0,
    totalAnswered: 0
  });

  const [settings] = useSettings();
  const [questionOffset, setQuestionOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const today = format(new Date(), "yyyy-MM-dd");
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const currentQuestionIndex = (seed + questionOffset) % quizQuestions.length;
  const question = quizQuestions[currentQuestionIndex];

  // Reset answer states when offset changes
  useEffect(() => {
    setSelectedIndex(null);
    setAnswered(false);
  }, [questionOffset]);

  // Sync state if already answered today
  const hasAnsweredToday = quizRecord.date === today && quizRecord.questionId === quizQuestions[seed % quizQuestions.length].id;
  const isAnswered = answered || (questionOffset === 0 && hasAnsweredToday);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;

    setSelectedIndex(index);
    setAnswered(true);

    const isCorrect = index === question.correctIndex;

    if (questionOffset === 0) {
      // Daily question: Save completion status and update lifetime stats
      setQuizRecord({
        date: today,
        questionId: question.id,
        answeredCorrectly: isCorrect,
        totalCorrect: quizRecord.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: quizRecord.totalAnswered + 1,
        selectedIndex: index
      });
    } else {
      // Practice question: Update lifetime stats only
      setQuizRecord({
        ...quizRecord,
        totalCorrect: quizRecord.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: quizRecord.totalAnswered + 1
      });
    }
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
            {questionOffset === 0 ? t("dailyIslamicQuiz") : t("islamicQuizPractice")}
          </p>
          <span className="text-[9px] text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider block mt-0.5">
            {t("category")}: {question.category}
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
          const isCorrectAnswer = idx === question.correctIndex;
          let optionStyle = "border-stone-200 dark:border-stone-800 bg-stone-50/50 hover:bg-stone-100/50 dark:bg-stone-900/30 dark:hover:bg-stone-800/30 text-stone-700 dark:text-stone-300";

          if (isAnswered) {
            const chosenIndex = questionOffset === 0 && hasAnsweredToday
              ? (quizRecord.selectedIndex !== undefined ? quizRecord.selectedIndex : (quizRecord.answeredCorrectly ? question.correctIndex : -1))
              : selectedIndex;

            const wasChosen = chosenIndex === idx;

            if (isCorrectAnswer) {
              optionStyle = "bg-emerald-600 text-white border-emerald-800 dark:bg-emerald-700 shadow-sm";
            } else if (wasChosen) {
              optionStyle = "bg-rose-600 text-white border-rose-700 dark:bg-rose-700 shadow-sm";
            } else {
              optionStyle = "opacity-50 border-stone-200 dark:border-stone-800 bg-stone-50/30 text-stone-400 dark:text-stone-500 cursor-not-allowed";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
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

      {/* Explanation section & Next Button */}
      {isAnswered && (
        <div className="space-y-4 animate-in slide-in-from-top duration-200">
          <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-150 dark:border-stone-850 space-y-2">
            <div className="flex items-center gap-1.5">
              {(questionOffset === 0 && hasAnsweredToday ? quizRecord.answeredCorrectly : selectedIndex === question.correctIndex) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-500">{t("correct")}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                  <span className="text-xs font-black text-rose-600 dark:text-rose-500">{t("incorrect")}</span>
                </>
              )}
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {question.explanation}
            </p>
          </div>

          <div className="flex gap-2">
            {questionOffset > 0 && (
              <button
                onClick={() => setQuestionOffset(0)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-bold transition-all duration-200"
              >
                {t("dailyQuiz")}
              </button>
            )}
            <button
              onClick={() => setQuestionOffset(prev => prev + 1)}
              className="flex-[2] flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-all duration-200"
            >
              {t("nextQuestion")}
            </button>
          </div>
        </div>
      )}

      {/* Lifetime Score Banner */}
      <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>{t("lifetimeScore")}</span>
        </div>
        <span>
          {quizRecord.totalCorrect} / {quizRecord.totalAnswered} {t("correct")}
        </span>
      </div>
    </div>
  );
}
