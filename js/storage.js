// Storage Manager for Attempt History, Stats and Active Draft Recovery

const KEY_ATTEMPTS = "mock_test_attempts_v2";
const KEY_SUBTOPIC_STATS = "mock_test_subtopic_stats_v2";
const KEY_ACTIVE_DRAFT = "mock_test_active_draft_v2";

const StorageManager = {
    // Save completed test attempt
    saveAttempt(attemptRecord) {
        try {
            const attempts = this.getAttempts();
            attempts.unshift(attemptRecord);
            localStorage.setItem(KEY_ATTEMPTS, JSON.stringify(attempts));

            // Update subtopic summary stats
            const stats = this.getSubtopicStats();
            const stId = attemptRecord.subtopicId;
            const existing = stats[stId] || { 
                attempts: 0, 
                highScore: 0, 
                totalCorrect: 0, 
                totalQuestions: 0,
                lastScore: 0,
                lastAccuracy: 0
            };

            existing.attempts += 1;
            existing.lastScore = attemptRecord.score;
            existing.lastAccuracy = attemptRecord.accuracy;
            existing.totalCorrect += attemptRecord.correct;
            existing.totalQuestions += attemptRecord.total;
            if (attemptRecord.score > existing.highScore) {
                existing.highScore = attemptRecord.score;
            }
            existing.avgAccuracy = Math.round((existing.totalCorrect / existing.totalQuestions) * 100);
            stats[stId] = existing;

            localStorage.setItem(KEY_SUBTOPIC_STATS, JSON.stringify(stats));

            // Clear draft
            this.clearActiveDraft();
        } catch (e) {
            console.error("Failed to save attempt record", e);
        }
    },

    getAttempts() {
        try {
            const data = localStorage.getItem(KEY_ATTEMPTS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    getSubtopicStats() {
        try {
            const data = localStorage.getItem(KEY_SUBTOPIC_STATS);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    // Active Test Draft Auto-Recovery
    saveActiveDraft(draftData) {
        try {
            localStorage.setItem(KEY_ACTIVE_DRAFT, JSON.stringify(draftData));
        } catch (e) {}
    },

    getActiveDraft() {
        try {
            const data = localStorage.getItem(KEY_ACTIVE_DRAFT);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    clearActiveDraft() {
        localStorage.removeItem(KEY_ACTIVE_DRAFT);
    },

    // Clear all history
    clearAll() {
        localStorage.removeItem(KEY_ATTEMPTS);
        localStorage.removeItem(KEY_SUBTOPIC_STATS);
        localStorage.removeItem(KEY_ACTIVE_DRAFT);
    }
};
