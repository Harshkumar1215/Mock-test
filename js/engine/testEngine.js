// Test Engine: Handles Selection of Flexible Random Unique MCQs from 100-Question Pool per Attempt

const TestEngine = {
    // Generate a fresh test session of flexible random questions out of 100 MCQs
    createTestSession(subtopicId, timeLimitMinutes = 20, modeFilter = "random", questionCount = 25) {
        // Fetch full 100 MCQs pool for subtopic
        let full100Pool = QuestionBank.get100QuestionsForSubtopic(subtopicId) || [];

        const targetCount = Math.min(questionCount || 25, full100Pool.length);

        if (!full100Pool || full100Pool.length === 0) {
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
                isEmpty: true,
                modeFilter: modeFilter
            };
        }

        // Apply difficulty mode filtering if requested
        let candidatePool = [...full100Pool];
        if (modeFilter && modeFilter !== "random" && modeFilter !== "all") {
            const filtered = candidatePool.filter(q => q.difficulty === modeFilter);
            if (filtered.length >= targetCount) {
                candidatePool = filtered;
            }
        }

        // Randomly shuffle candidate questions from the 100 pool (Fisher-Yates)
        const shuffledPool = this._shuffleArray([...candidatePool]);

        // Select target unique questions for this attempt
        const selectedQuestions = shuffledPool.slice(0, targetCount);

        // Shuffle options for each selected question and update correctAnswer index
        const processedQuestions = selectedQuestions.map((q, idx) => {
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
            userAnswers: {},       // questionIndex -> selectedOptionIndex (0..3)
            markedReview: {},      // questionIndex -> boolean
            currentQuestionIndex: 0,
            startTime: Date.now(),
            totalTimeSeconds: timeLimitMinutes * 60,
            timeRemainingSeconds: timeLimitMinutes * 60,
            isCompleted: false,
            modeFilter: modeFilter,
            questionCount: targetCount
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
