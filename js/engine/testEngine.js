// Test Engine: Handles Selection of 25 Random Unique MCQs from 60 Question Pool per Attempt

const TestEngine = {
    // Generate a fresh test session of 25 random questions from 60 subtopic pool
    createTestSession(subtopicId, timeLimitMinutes = 20) {
        // Fetch all 60 MCQs pool for subtopic
        const full60Pool = QuestionBank.get60Questions(subtopicId) || [];

        if (!full60Pool || full60Pool.length === 0) {
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

        // Randomly shuffle all 60 questions from pool
        const shuffledPool = this._shuffleArray([...full60Pool]);

        // Select exactly 25 unique questions for this attempt
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
