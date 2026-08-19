// Analytics Engine: Score Math, Chart.js Visualizations & Performance Analysis

const AnalyticsEngine = {
    // Chart instances cache to prevent canvas reuse errors
    _charts: {},

    // Calculate test result metrics
    evaluateTestSession(session) {
        let correct = 0;
        let wrong = 0;
        let unattempted = 0;

        const total = session.questions.length; // 25 questions

        const itemizedResults = session.questions.map((q, idx) => {
            const userAns = session.userAnswers[idx];
            const isUnans = (userAns === undefined || userAns === null);
            const isCorr = (!isUnans && userAns === q.correctAnswer);

            if (isUnans) unattempted++;
            else if (isCorr) correct++;
            else wrong++;

            return {
                questionIndex: idx,
                question: q,
                userAnswer: userAns,
                correctAnswer: q.correctAnswer,
                isCorrect: isCorr,
                isUnattempted: isUnans
            };
        });

        const attempted = correct + wrong;
        const percentage = Math.round((correct / total) * 100);
        const accuracy = attempted > 0 ? parseFloat(((correct / attempted) * 100).toFixed(2)) : 0;
        const timeTakenSeconds = session.totalTimeSeconds - session.timeRemainingSeconds;

        let performanceTag = "Good Performance";
        let performanceClass = "badge-good";

        if (percentage >= 85) {
            performanceTag = "Outstanding Performance! 🌟";
            performanceClass = "badge-excellent";
        } else if (percentage >= 65) {
            performanceTag = "Good Performance! 👏";
            performanceClass = "badge-good";
        } else if (percentage >= 40) {
            performanceTag = "Average Performance 📚";
            performanceClass = "badge-average";
        } else {
            performanceTag = "Needs Improvement 💪";
            performanceClass = "badge-poor";
        }

        return {
            subtopicId: session.subtopicId,
            score: correct,
            total: total,
            percentage,
            accuracy,
            correct,
            wrong,
            unattempted,
            attempted,
            timeTakenSeconds,
            performanceTag,
            performanceClass,
            itemizedResults,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
    },

    // Analyze Strong and Weak Subtopics across user history
    getTopicPerformanceSummary() {
        const stats = StorageManager.getSubtopicStats();
        const strong = [];
        const weak = [];

        for (const [stId, data] of Object.entries(stats)) {
            if (data && data.attempts > 0) {
                const meta = findSubtopicGlobal(stId);
                if (meta) {
                    const item = {
                        subtopicId: stId,
                        name: meta.subtopic.name,
                        subjectName: meta.subject.name,
                        topicName: meta.topic.name,
                        accuracy: data.lastAccuracy ?? data.avgAccuracy ?? 0,
                        attempts: data.attempts
                    };
                    if (item.accuracy >= 75) {
                        strong.push(item);
                    } else if (item.accuracy < 65) {
                        weak.push(item);
                    }
                }
            }
        }

        strong.sort((a, b) => b.accuracy - a.accuracy);
        weak.sort((a, b) => a.accuracy - b.accuracy);

        return { strong, weak };
    },

    // Render Doughnut Chart for Score Breakdown
    renderScoreDoughnutChart(canvasId, result) {
        this._destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        this._charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Incorrect', 'Unattempted'],
                datasets: [{
                    data: [result.correct, result.wrong, result.unattempted],
                    backgroundColor: ['#10b981', '#ef4444', '#94a3b8'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } }
                    }
                },
                cutout: '70%'
            }
        });
    },

    // Render Line Chart for Performance Trend across attempts
    renderPerformanceTrendChart(canvasId, subtopicId) {
        this._destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const allAttempts = StorageManager.getAttempts();
        const subtopicAttempts = allAttempts.filter(a => a.subtopicId === subtopicId).reverse();

        if (subtopicAttempts.length === 0) return;

        const labels = subtopicAttempts.map((a, i) => `Attempt ${i + 1}`);
        const data = subtopicAttempts.map(a => a.percentage);

        this._charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score (%)',
                    data: data,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: '#2563eb'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 0, max: 100, ticks: { callback: v => v + '%' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },

    // Destroy existing chart instance if present
    _destroyChart(canvasId) {
        if (this._charts[canvasId]) {
            this._charts[canvasId].destroy();
            delete this._charts[canvasId];
        }
    }
};
