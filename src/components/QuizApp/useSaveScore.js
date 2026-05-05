/**
 * Custom hook for saving quiz scores to Supabase
 * Keeps database logic separate from quiz logic
 */

import { supabase } from "../../supabaseClient";

export const useSaveScore = () => {
  /**
   * Saves a quiz score to the leaderboard
   * Only saves if it's a new high score for that username/topic combination
   *
   * @param {string} username - User's entered name
   * @param {object} quizData - Contains topic, difficulty, score, total questions
   * @returns {boolean} - True if saved, false if not a high score
   */
  const saveQuizResult = async (username, quizData) => {
    const { selectedTopic, selectedDifficulty, score, questions } = quizData;

    if (!username || username.trim() === "") {
      console.error("No username provided");
      return false;
    }

    if (questions.length === 0) return false;

    console.log("=== SAVING SCORE ===");
    console.log("Username:", username);
    console.log("Topic:", selectedTopic);
    console.log("Score:", score, "/", questions.length);

    try {
      // Check if this username already has a score for this topic
      const { data: existingScores, error: fetchError } = await supabase
        .from("quiz_history")
        .select("score, id")
        .eq("username", username)
        .eq("topic", selectedTopic);

      if (fetchError) {
        console.error("Error checking existing scores:", fetchError);
      }

      // Find the highest existing score for this user/topic
      const highestExisting =
        existingScores && existingScores.length > 0
          ? Math.max(...existingScores.map((s) => s.score))
          : -1;

      // If new score is not higher, don't save (prevents spam)
      if (score <= highestExisting && highestExisting !== -1) {
        console.log("Not a high score - skipping save");
        return {
          success: false,
          message: `Not a high score (best: ${highestExisting}/${questions.length})`,
        };
      }

      // Delete old scores (we only want to keep the highest)
      if (existingScores && existingScores.length > 0) {
        const idsToDelete = existingScores.map((s) => s.id);
        await supabase.from("quiz_history").delete().in("id", idsToDelete);
      }

      // Save new high score
      const percentage = ((score / questions.length) * 100).toFixed(2);

      const { error: insertError } = await supabase
        .from("quiz_history")
        .insert({
          username: username,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          score: score,
          total_questions: questions.length,
          percentage: parseFloat(percentage),
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return {
          success: false,
          message: `Save failed: ${insertError.message}`,
        };
      } else {
        console.log("✅ Score saved for:", username);
        return {
          success: true,
          message: `🎉 NEW HIGH SCORE! ${score}/${questions.length} saved for ${username}!`,
        };
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, message: `Error: ${err.message}` };
    }
  };

  return { saveQuizResult };
};
