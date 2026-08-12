// Recommendation Engine: Analyzes performance and generates intelligent practice suggestions

const RecommendationEngine = {
    // Generate practice suggestions based on attempt history and subtopic stats
    generateSuggestions() {
        const stats = StorageManager.getSubtopicStats();
        const attempts = StorageManager.getAttempts();
        const suggestions = [];

        // 1. Identify Weak Subtopics (Accuracy < 60% or Score < 60%)
        const weakSubtopics = [];
        for (const [stId, data] of Object.entries(stats)) {
            if (data.lastAccuracy < 65 || data.avgAccuracy < 65) {
                const meta = findSubtopicGlobal(stId);
                if (meta) {
                    weakSubtopics.push({
                        subtopicId: stId,
                        name: meta.subtopic.name,
                        subjectName: meta.subject.name,
                        topicName: meta.topic.name,
                        subjectId: meta.subject.id,
                        topicId: meta.topic.id,
                        accuracy: data.lastAccuracy || data.avgAccuracy || 0,
                        attempts: data.attempts
                    });
                }
            }
        }

        // Sort weak subtopics ascending by accuracy (weakest first)
        weakSubtopics.sort((a, b) => a.accuracy - b.accuracy);

        if (weakSubtopics.length > 0) {
            const topWeak = weakSubtopics[0];
            suggestions.push({
                type: "weak_subtopic",
                badge: "Weak Area Detected",
                icon: "fa-triangle-exclamation",
                colorClass: "bg-warning",
                title: `Practice ${topWeak.name} Again`,
                description: `Your accuracy in ${topWeak.name} is currently ${topWeak.accuracy}%. Attempt 25 fresh MCQs to strengthen this weak area.`,
                ctaText: `Practice ${topWeak.name}`,
                subtopicId: topWeak.subtopicId,
                subjectId: topWeak.subjectId,
                topicId: topWeak.topicId
            });
        }

        // 2. Identify Unattempted Subtopics in Active Subject
        const attemptedIds = new Set(Object.keys(stats));
        const unattemptedList = [];

        for (const sub of subjectsConfig) {
            for (const topic of sub.topics) {
                for (const st of topic.subtopics) {
                    if (!attemptedIds.has(st.id)) {
                        unattemptedList.push({
                            subtopicId: st.id,
                            name: st.name,
                            subjectId: sub.id,
                            topicId: topic.id,
                            subjectName: sub.name
                        });
                    }
                }
            }
        }

        if (unattemptedList.length > 0) {
            const nextUnattempted = unattemptedList[0];
            suggestions.push({
                type: "unattempted_subtopic",
                badge: "Unexplored Topic",
                icon: "fa-compass",
                colorClass: "bg-info",
                title: `Try New Subtopic: ${nextUnattempted.name}`,
                description: `Expand your preparation by attempting a 25-question test on ${nextUnattempted.name} (${nextUnattempted.subjectName}).`,
                ctaText: `Start ${nextUnattempted.name} Test`,
                subtopicId: nextUnattempted.subtopicId,
                subjectId: nextUnattempted.subjectId,
                topicId: nextUnattempted.topicId
            });
        }

        // 3. Revision Suggestion
        if (attempts.length >= 3) {
            const recent = attempts[0];
            const meta = findSubtopicGlobal(recent.subtopicId);
            if (meta) {
                suggestions.push({
                    type: "review_mistakes",
                    badge: "Revision Recommended",
                    icon: "fa-rotate-right",
                    colorClass: "bg-success",
                    title: `Review Mistakes in ${meta.subtopic.name}`,
                    description: `Re-evaluate your previous incorrect questions to eliminate recurring mistakes.`,
                    ctaText: `Retake ${meta.subtopic.name} Test`,
                    subtopicId: meta.subtopic.id,
                    subjectId: meta.subject.id,
                    topicId: meta.topic.id
                });
            }
        }

        // Fallback default suggestion if empty
        if (suggestions.length === 0) {
            const defaultSt = subjectsConfig[0].topics[0].subtopics[0];
            suggestions.push({
                type: "general",
                badge: "Recommended Practice",
                icon: "fa-circle-play",
                colorClass: "bg-primary",
                title: `Start Practice Test: ${defaultSt.name}`,
                description: "Test your preparation with a randomized 25-question mock test from a 100-MCQ bank.",
                ctaText: `Start Practice`,
                subtopicId: defaultSt.id,
                subjectId: subjectsConfig[0].id,
                topicId: subjectsConfig[0].topics[0].id
            });
        }

        return suggestions;
    }
};
