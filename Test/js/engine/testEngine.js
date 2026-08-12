// Test Engine: Handles Random Selection of 25 MCQs from 100 Pool, Option Shuffling & Timer

const TestEngine = {
    // Generate a fresh test session of 25 random questions from 100 subtopic pool
    createTestSession(subtopicId, timeLimitMinutes = 20) {
        // Fetch all 100 MCQs
        const full100Pool = QuestionBank.get100Questions(subtopicId);

        if (!full100Pool || full100Pool.length < 25) {
            console.warn("Not enough questions in pool, fallback available");
        }

        // Randomly shuffle all 100 questions
        const shuffledPool = this._shuffleArray([...full100Pool]);

        // Select exactly 25 unique questions
        const selected25 = shuffledPool.slice(0, 25);

        // Shuffle options for each question and update correctAnswer index
        const processedQuestions = selected25.map((q, idx) => {
            const originalCorrectText = q.options[q.correctAnswer];
            const shuffledOptions = this._shuffleArray([...q.options]);
            const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

            return {
                ...q,
                testIndex: idx,
                options: shuffledOptions,
                correctAnswer: newCorrectIndex,
                originalCorrectIndex: q.correctAnswer
            };
        });

        return {
            subtopicId: subtopicId,
            questions: processedQuestions,
            userAnswers: {},       // questionIndex -> selectedOptionIndex
            markedReview: {},      // questionIndex -> boolean
            currentQuestionIndex: 0,
            startTime: Date.now(),
            totalTimeSeconds: timeLimitMinutes * 60,
            timeRemainingSeconds: timeLimitMinutes * 60,
            isCompleted: false
        };
    },

    // Array Shuffler using Fisher-Yates algorithm
    _shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};
