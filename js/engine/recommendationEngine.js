// Recommendation Engine: Analyzes performance and generates intelligent practice suggestions

function findSubtopicGlobal(subtopicId) {
    if (typeof subjectsConfig === "undefined") return null;
    for (const subject of subjectsConfig) {
        for (const topic of subject.topics) {
            for (const subtopic of topic.subtopics) {
                if (subtopic.id === subtopicId) {
                    return { subject, topic, subtopic };
                }
            }
        }
    }
    return null;
}

const RecommendationEngine = {
    // Generate practice suggestions based on user history and performance
    generateSuggestions() {
        const stats = StorageManager.getSubtopicStats();
        const attempts = StorageManager.getAttempts();
        const suggestions = [];

        // If user has not attempted any test yet, return empty array
        if (!attempts || attempts.length === 0) {
            return [];
        }

        // 1. Identify Weak Subtopics among attempted subtopics
        const weakSubtopics = [];
        for (const [stId, data] of Object.entries(stats)) {
            if (data && data.attempts > 0 && (data.lastAccuracy < 65 || data.avgAccuracy < 65)) {
                const meta = findSubtopicGlobal(stId);
                if (meta) {
                    weakSubtopics.push({
                        subtopicId: stId,
                        name: meta.subtopic.name,
                        subjectName: meta.subject.name,
                        topicName: meta.topic.name,
                        subjectId: meta.subject.id,
                        topicId: meta.topic.id,
                        accuracy: data.lastAccuracy ?? data.avgAccuracy ?? 0,
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

        // 2. Recommend next subtopic in the SAME subject that the user has already practiced
        const attemptedIds = new Set(Object.keys(stats));
        const attemptedSubjects = new Set();
        for (const stId of attemptedIds) {
            const meta = findSubtopicGlobal(stId);
            if (meta) attemptedSubjects.add(meta.subject.id);
        }

        let nextInAttemptedSubject = null;
        for (const subId of attemptedSubjects) {
            const sub = subjectsConfig.find(s => s.id === subId);
            if (!sub) continue;
            for (const topic of sub.topics) {
                for (const st of topic.subtopics) {
                    if (!attemptedIds.has(st.id)) {
                        nextInAttemptedSubject = {
                            subtopicId: st.id,
                            name: st.name,
                            subjectId: sub.id,
                            topicId: topic.id,
                            subjectName: sub.name
                        };
                        break;
                    }
                }
                if (nextInAttemptedSubject) break;
            }
            if (nextInAttemptedSubject) break;
        }

        if (nextInAttemptedSubject) {
            suggestions.push({
                type: "unattempted_subtopic",
                badge: "Next in Your Subject",
                icon: "fa-compass",
                colorClass: "bg-info",
                title: `Try ${nextInAttemptedSubject.name}`,
                description: `Continue your ${nextInAttemptedSubject.subjectName} preparation by attempting 25 MCQs on ${nextInAttemptedSubject.name}.`,
                ctaText: `Start ${nextInAttemptedSubject.name}`,
                subtopicId: nextInAttemptedSubject.subtopicId,
                subjectId: nextInAttemptedSubject.subjectId,
                topicId: nextInAttemptedSubject.topicId
            });
        }

        // 3. Revision Suggestion based on recent attempted test
        if (attempts.length > 0) {
            const recent = attempts[0];
            const meta = findSubtopicGlobal(recent.subtopicId);
            if (meta && !suggestions.some(s => s.subtopicId === recent.subtopicId)) {
                suggestions.push({
                    type: "review_mistakes",
                    badge: "Revision Recommended",
                    icon: "fa-rotate-right",
                    colorClass: "bg-success",
                    title: `Retake ${meta.subtopic.name}`,
                    description: `You recently attempted ${meta.subtopic.name}. Retake with 25 fresh questions to improve your score.`,
                    ctaText: `Retake ${meta.subtopic.name}`,
                    subtopicId: meta.subtopic.id,
                    subjectId: meta.subject.id,
                    topicId: meta.topic.id
                });
            }
        }

        return suggestions;
    }
};
