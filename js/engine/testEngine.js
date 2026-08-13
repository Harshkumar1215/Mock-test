// Test Engine: Handles Selection of Exactly 50 MCQs per Subtopic Session & Timer

const TestEngine = {
    // Generate a fresh test session of 50 questions
    createTestSession(subtopicId, timeLimitMinutes = 30) {
        // Fetch all 50 MCQs for subtopic
        const fullPool = QuestionBank.get50Questions(subtopicId) || [];

        if (!fullPool || fullPool.length === 0) {
            return {
                subtopicId: subtopicId,
                questions: [],
                userAnswers: {},
                markedReview: {},
                currentQuestionIndex: 0,
                startTime: Date.now(),
                totalTimeSeconds: timeLimitMinutes * 60,
                timeRemainingSeconds: timeLimitMinutes * 60,
                isCompleted: false,
                isEmpty: true
            };
        }

        // Process exactly 50 questions
        const processedQuestions = fullPool.slice(0, 50).map((q, idx) => {
            return {
                ...q,
                testIndex: idx,
                options: [...q.options],
                correctAnswer: q.correctAnswer,
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
