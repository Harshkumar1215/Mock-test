// Analytics Engine: Score Math, Chart.js Visualizations & Performance Analysis

const AnalyticsEngine = {
    // Chart instances cache to prevent canvas reuse errors
    _charts: {},

    // Safely destroy existing chart instances across cache & Chart.js global state
    _destroyChart(canvasId) {
        if (this._charts[canvasId]) {
            try { this._charts[canvasId].destroy(); } catch (e) { }
            delete this._charts[canvasId];
        }
        if (typeof Chart !== "undefined" && Chart.getChart) {
            const existingChart = Chart.getChart(canvasId);
            if (existingChart) {
                try { existingChart.destroy(); } catch (e) { }
            }
        }
    },

    // Calculate test result metrics
    evaluateTestSession(session) {
        let correct = 0;
        let wrong = 0;
        let unattempted = 0;

        const total = session.questions ? session.questions.length : 25;

        const itemizedResults = (session.questions || []).map((q, idx) => {
            const userAns = session.userAnswers ? session.userAnswers[idx] : undefined;
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
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        const accuracy = attempted > 0 ? parseFloat(((correct / attempted) * 100).toFixed(2)) : 0;
        const timeTakenSeconds = (session.totalTimeSeconds && session.timeRemainingSeconds) 
            ? Math.max(0, session.totalTimeSeconds - session.timeRemainingSeconds) 
            : 0;

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
                const meta = typeof findSubtopicGlobal === "function" ? findSubtopicGlobal(stId) : null;
                if (meta) {
                    const item = {
                        subtopicId: stId,
                        name: meta.subtopic.name,
                        subjectName: meta.subject.name,
                        topicName: meta.topic.name,
                        accuracy: data.lastAccuracy ?? data.avgAccuracy ?? 0,
                        attempts: data.attempts,
                        highScore: data.highScore || 0
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

    // Render Doughnut Chart for Single Test Result Score Breakdown
    renderScoreDoughnutChart(canvasId, result) {
        if (typeof Chart === "undefined") return;
        this._destroyChart(canvasId);
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            this._charts[canvasId] = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Correct', 'Incorrect', 'Skipped'],
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
        } catch (e) {
            console.warn("Chart rendering error:", e);
        }
    },

    // Render Line Chart for Performance Trend across subtopic attempts
    renderPerformanceTrendChart(canvasId, subtopicId) {
        if (typeof Chart === "undefined") return;
        this._destroyChart(canvasId);

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const allAttempts = StorageManager.getAttempts();
        const subtopicAttempts = allAttempts.filter(a => a.subtopicId === subtopicId).reverse();

        if (subtopicAttempts.length === 0) return;

        const labels = subtopicAttempts.map((a, i) => `Attempt ${i + 1}`);
        const data = subtopicAttempts.map(a => a.percentage);

        try {
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
        } catch (e) {
            console.warn("Trend Chart rendering error:", e);
        }
    },

    // Render Dashboard Overview Chart: Total Correct vs Incorrect vs Skipped across all tests
    renderDashboardOverviewChart(canvasId) {
        if (typeof Chart === "undefined") return;
        this._destroyChart(canvasId);

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const attempts = StorageManager.getAttempts();
        let totalCorrect = 0;
        let totalWrong = 0;
        let totalUnattempted = 0;

        attempts.forEach(a => {
            totalCorrect += (a.correct || 0);
            totalWrong += (a.wrong || 0);
            totalUnattempted += (a.unattempted || 0);
        });

        if (totalCorrect === 0 && totalWrong === 0 && totalUnattempted === 0) {
            totalUnattempted = 1; // Placeholder for empty chart
        }

        try {
            this._charts[canvasId] = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Correct', 'Wrong', 'Skipped'],
                    datasets: [{
                        data: [totalCorrect, totalWrong, totalUnattempted],
                        backgroundColor: ['#10b981', '#ef4444', '#64748b'],
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
                    cutout: '68%'
                }
            });
        } catch (e) {
            console.warn("Dashboard Overview Chart error:", e);
        }
    },

    // Render Dashboard Bar Chart: Subject Level Accuracy Comparison
    renderDashboardSubjectBarChart(canvasId) {
        if (typeof Chart === "undefined") return;
        this._destroyChart(canvasId);

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (typeof subjectsConfig === "undefined") return;
        const stats = StorageManager.getSubtopicStats();

        const labels = [];
        const accuracies = [];

        subjectsConfig.forEach(sub => {
            labels.push(sub.name.length > 18 ? sub.name.substring(0, 16) + '...' : sub.name);
            let totalQ = 0;
            let totalC = 0;

            sub.topics.forEach(t => {
                t.subtopics.forEach(st => {
                    const stStat = stats[st.id];
                    if (stStat) {
                        totalQ += (stStat.totalQuestions || 0);
                        totalC += (stStat.totalCorrect || 0);
                    }
                });
            });

            const acc = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
            accuracies.push(acc);
        });

        try {
            this._charts[canvasId] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Accuracy (%)',
                        data: accuracies,
                        backgroundColor: ['#0d9488', '#f59e0b', '#4f46e5', '#10b981'],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { min: 0, max: 100, ticks: { callback: v => v + '%' } },
                        x: { ticks: { font: { size: 10 } } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        } catch (e) {
            console.warn("Subject Bar Chart error:", e);
        }
    }
};
