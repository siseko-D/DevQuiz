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
   * @returns {object} - Success status and message
   */
  const saveQuizResult = async (username, quizData) => {
    const { selectedTopic, selectedDifficulty, score, questions, timerDuration } = quizData;

    if (!username || username.trim() === "") {
      console.error("No username provided");
      return { success: false, message: "Please enter a username" };
    }

    if (questions.length === 0) {
      return { success: false, message: "No questions to save" };
    }

    console.log("=== SAVING SCORE ===");
    console.log("Username:", username);
    console.log("Topic:", selectedTopic);
    console.log("Score:", score, "/", questions.length);
    console.log("Timer:", timerDuration);

    try {
      // Test database connection first
      const { error: testError } = await supabase
        .from("quiz_history")
        .select("count", { count: 'exact', head: true });
      
      if (testError) {
        console.error("❌ Database connection error:", testError);
        return { success: false, message: `Database error: ${testError.message}` };
      }
      console.log("✅ Database connection OK");

      // Check if this username already has a score for this topic
      const { data: existingScores, error: fetchError } = await supabase
        .from("quiz_history")
        .select("score, id")
        .eq("username", username.trim())
        .eq("topic", selectedTopic);

      if (fetchError) {
        console.error("Error checking existing scores:", fetchError);
        return { success: false, message: `Failed to check existing scores: ${fetchError.message}` };
      }

      console.log("Existing scores:", existingScores);

      // Find the highest existing score for this user/topic
      const highestExisting = existingScores && existingScores.length > 0
        ? Math.max(...existingScores.map((s) => s.score))
        : -1;

      console.log("Highest existing score:", highestExisting);

      // If new score is not higher, don't save
      if (score <= highestExisting && highestExisting !== -1) {
        console.log("Not a high score - skipping save");
        return {
          success: false,
          message: `Not a high score (best: ${highestExisting}/${questions.length})`,
        };
      }

      // Delete old scores (only keep the highest)
      if (existingScores && existingScores.length > 0) {
        const idsToDelete = existingScores.map((s) => s.id);
        console.log("Deleting old scores:", idsToDelete);
        const { error: deleteError } = await supabase
          .from("quiz_history")
          .delete()
          .in("id", idsToDelete);
        
        if (deleteError) {
          console.error("Delete error:", deleteError);
        }
      }

      // Save new high score
      const percentage = ((score / questions.length) * 100).toFixed(2);
      const now = new Date().toISOString();

      const insertData = {
        username: username.trim(),
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        score: score,
        total_questions: questions.length,
        percentage: parseFloat(percentage),
        created_at: now,
      };
      
      // Try to add timer_seconds - if column doesn't exist, Supabase will return error
      // and we'll retry without it
      insertData.timer_seconds = timerDuration || 60;

      console.log("Attempting to insert:", insertData);

      const { error: insertError } = await supabase
        .from("quiz_history")
        .insert(insertData);

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        
        // If error is about timer_seconds column, try without it
        if (insertError.message && insertError.message.includes("timer_seconds")) {
          console.log("⚠️ timer_seconds column missing, retrying without it...");
          delete insertData.timer_seconds;
          
          const { error: retryError } = await supabase
            .from("quiz_history")
            .insert(insertData);
          
          if (retryError) {
            console.error("Retry also failed:", retryError);
            return { success: false, message: `Database error: ${retryError.message}` };
          }
          
          console.log("✅ Score saved successfully without timer_seconds");
          return {
            success: true,
            message: `🎉 NEW HIGH SCORE! ${score}/${questions.length} saved for ${username}!`,
          };
        }
        
        return { success: false, message: `Save failed: ${insertError.message}` };
      }

      console.log("✅ Score saved successfully!");
      return {
        success: true,
        message: `🎉 NEW HIGH SCORE! ${score}/${questions.length} saved for ${username}!`,
      };
      
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, message: `Error: ${err.message}` };
    }
  };

  return { saveQuizResult };
};