// Main Mobile Application Controller with Complete Flexibility & Responsive Features

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const App = {
    state: {
        activeScreen: "screen-home",
        selectedSubject: null,
        selectedTopic: null,
        selectedSubtopic: null,
        testSession: null,
        lastResult: null,
        timerInterval: null,
        reviewFilter: "all",
        screenHistory: ["screen-home"],
        theme: localStorage.getItem("app_theme") || "light"
    },

    init() {
        this.applyTheme(this.state.theme);
        this.bindEvents();
        this.renderHome();
        this.checkAndRestoreDraft();
    },

    applyTheme(theme) {
        this.state.theme = theme;
        localStorage.setItem("app_theme", theme);
        document.documentElement.setAttribute("data-theme", theme);

        const btnTheme = document.getElementById("btn-top-theme");
        if (btnTheme) {
            btnTheme.innerHTML = theme === "dark" ? `<i class="fa-solid fa-sun"></i>` : `<i class="fa-solid fa-moon"></i>`;
        }
    },

    toggleTheme() {
        const nextTheme = this.state.theme === "dark" ? "light" : "dark";
        this.applyTheme(nextTheme);
    },

    bindEvents() {
        // Theme Toggle Button
        document.getElementById("btn-top-theme")?.addEventListener("click", () => this.toggleTheme());

        // Bottom Navigation Bar Items
        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", () => {
                const targetScreen = item.dataset.target;
                const navId = item.id;
                this.setActiveNav(navId);
                this.navigateToScreen(targetScreen);

                if (targetScreen === "screen-home") this.renderHome();
                if (targetScreen === "screen-subjects") this.renderSubjectsList();
                if (targetScreen === "screen-dashboard") this.renderDashboard();
            });
        });

        // Top Header Back Button
        const btnBack = document.getElementById("btn-top-back");
        if (btnBack) {
            btnBack.addEventListener("click", () => {
                this.handleBackNavigation();
            });
        }

        // Top Header Refresh Button
        const btnRefresh = document.getElementById("btn-top-refresh");
        if (btnRefresh) {
            btnRefresh.addEventListener("click", () => {
                if (this.state.activeScreen === "screen-test") {
                    if (confirm("Are you sure you want to restart this test attempt?")) {
                        const subId = this.state.selectedSubtopic?.id || "c_tokens_keywords";
                        this.startTest(subId);
                    }
                } else {
                    location.reload();
                }
            });
        }

        // Home Page Search Input
        const homeSearchInput = document.getElementById("home-search-input");
        const homeClearBtn = document.getElementById("home-search-clear");
        const homeResultsContainer = document.getElementById("home-search-results-container");
        const homeMainContent = document.getElementById("home-main-content");
        const homeSearchMeta = document.getElementById("home-search-meta");
        const homeSearchResults = document.getElementById("home-search-results");

        if (homeSearchInput) {
            homeSearchInput.addEventListener("input", (e) => {
                const query = e.target.value;
                if (query.trim().length > 0) {
                    if (homeClearBtn) homeClearBtn.style.display = "flex";
                    if (homeMainContent) homeMainContent.style.display = "none";
                    if (homeResultsContainer) homeResultsContainer.style.display = "block";

                    const { results, total } = this.searchAll(query);
                    if (homeSearchMeta) {
                        homeSearchMeta.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Found ${total} matching item${total === 1 ? '' : 's'} for "${this.escapeHTML(query.trim())}"`;
                    }
                    if (results.length > 0) {
                        homeSearchResults.innerHTML = results.map(item => this.renderSearchResultItem(item)).join("");
                    } else {
                        homeSearchResults.innerHTML = `
                            <div style="text-align:center; padding:30px 15px; color:var(--text-muted); background:var(--surface); border-radius:var(--radius-md);">
                                <i class="fa-solid fa-circle-exclamation" style="font-size:2rem; margin-bottom:10px; color:var(--primary);"></i>
                                <p style="font-weight:700; font-size:0.95rem;">No matches found for "${this.escapeHTML(query.trim())}"</p>
                                <p style="font-size:0.8rem; margin-top:4px;">Try searching for Tokens, Keywords, Pointers, Arrays, Structs, Memory, Files, etc.</p>
                            </div>
                        `;
                    }
                } else {
                    if (homeClearBtn) homeClearBtn.style.display = "none";
                    if (homeMainContent) homeMainContent.style.display = "block";
                    if (homeResultsContainer) homeResultsContainer.style.display = "none";
                }
            });

            homeClearBtn?.addEventListener("click", () => {
                homeSearchInput.value = "";
                homeSearchInput.dispatchEvent(new Event("input"));
                homeSearchInput.focus();
            });
        }

        // Subjects Page Search
        const searchInput = document.getElementById("search-input");
        const subjectsClearBtn = document.getElementById("subjects-search-clear");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.trim();
                if (subjectsClearBtn) subjectsClearBtn.style.display = query ? "flex" : "none";
                this.renderSubjectsList(query);
            });
            subjectsClearBtn?.addEventListener("click", () => {
                searchInput.value = "";
                searchInput.dispatchEvent(new Event("input"));
                searchInput.focus();
            });
        }

        // Start Test Button from Instructions Screen
        const btnStartInstruction = document.getElementById("btn-start-instruction-test");
        if (btnStartInstruction) {
            btnStartInstruction.addEventListener("click", () => {
                const subId = this.state.selectedSubtopic?.id || "c_tokens_keywords";
                const modeSelect = document.getElementById("practice-mode-select");
                const timeSelect = document.getElementById("practice-time-select");
                const countSelect = document.getElementById("practice-count-select");

                const modeFilter = modeSelect ? modeSelect.value : "random";
                const timeLimitMinutes = timeSelect ? parseInt(timeSelect.value) : 20;
                const questionCount = countSelect ? parseInt(countSelect.value) : 25;

                this.startTest(subId, modeFilter, timeLimitMinutes, questionCount);
            });
        }

        // Test Controls (Prev, Next, Clear, Mark, Submit, Palette)
        document.getElementById("btn-test-prev")?.addEventListener("click", () => this.navigateQuestion(-1));
        document.getElementById("btn-test-next")?.addEventListener("click", () => this.navigateQuestion(1));
        document.getElementById("btn-test-clear")?.addEventListener("click", () => this.clearActiveOption());
        document.getElementById("btn-test-mark")?.addEventListener("click", () => this.toggleMarkForReview());
        document.getElementById("btn-test-submit")?.addEventListener("click", () => this.openSubmitModal());
        document.getElementById("btn-open-palette")?.addEventListener("click", () => this.openPaletteModal());
        document.getElementById("btn-close-palette")?.addEventListener("click", () => this.closePaletteModal());

        // Submit Confirmation Modal Actions
        document.getElementById("btn-modal-cancel-submit")?.addEventListener("click", () => this.closeSubmitModal());
        document.getElementById("btn-modal-confirm-submit")?.addEventListener("click", () => {
            this.closeSubmitModal();
            this.finishTest();
        });

        // Result Screen Buttons
        document.getElementById("btn-res-review")?.addEventListener("click", () => {
            this.navigateToScreen("screen-review");
            this.renderDetailedReview("all");
        });
        document.getElementById("btn-res-retry")?.addEventListener("click", () => {
            const subId = this.state.lastResult?.subtopicId || this.state.selectedSubtopic?.id || "c_tokens_keywords";
            this.startTest(subId);
        });
        document.getElementById("btn-res-home")?.addEventListener("click", () => {
            this.navigateToScreen("screen-home");
            this.setActiveNav("nav-home");
            this.renderHome();
        });

        // Review Filter Tabs
        document.querySelectorAll(".filter-tab").forEach(tab => {
            tab.addEventListener("click", (e) => {
                document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const filter = tab.dataset.filter;
                this.renderDetailedReview(filter);
            });
        });
    },

    // Navigation Helper with Screen History Stack
    navigateToScreen(screenId) {
        if (this.state.activeScreen !== screenId) {
            this.state.screenHistory.push(screenId);
        }
        this.showScreen(screenId);
    },

    showScreen(screenId) {
        document.querySelectorAll(".view-screen").forEach(s => s.classList.remove("active"));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add("active");
            this.state.activeScreen = screenId;
        }

        // Toggle Top Header Back Button Visibility
        const btnBack = document.getElementById("btn-top-back");
        if (btnBack) {
            btnBack.style.display = (screenId === "screen-home") ? "none" : "flex";
        }

        // Auto Scroll to top
        document.querySelector(".content-body")?.scrollTo({ top: 0, behavior: 'smooth' });
    },

    handleBackNavigation() {
        if (this.state.activeScreen === "screen-test") {
            if (confirm("Quit test attempt? Your progress is saved as a draft.")) {
                this.stopTimer();
                this.navigateToScreen("screen-home");
                this.setActiveNav("nav-home");
                this.renderHome();
            }
            return;
        }

        if (this.state.screenHistory.length > 1) {
            this.state.screenHistory.pop(); // Remove current
            const prevScreen = this.state.screenHistory[this.state.screenHistory.length - 1];
            this.showScreen(prevScreen);
        } else {
            this.navigateToScreen("screen-home");
            this.setActiveNav("nav-home");
            this.renderHome();
        }
    },

    setActiveNav(navId) {
        document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
        document.getElementById(navId)?.classList.add("active");
    },

    // Clean Question Text Helper (Strips any legacy Q1., Q95., Q10. prefixes)
    cleanQuestionText(text) {
        if (!text) return "";
        return String(text).replace(/^(Q\d+[\.\s]*)+/gi, "").trim();
    },

    // ------------------------------------------------------------------
    // PAGE 1: HOME SCREEN RENDERER
    // ------------------------------------------------------------------
    renderHome() {
        const grid = document.getElementById("home-subject-grid");
        if (!grid) return;

        const subjects = QuestionBank.getSubjects();
        const stats = StorageManager.getSubtopicStats();

        grid.innerHTML = subjects.map(sub => {
            let totalSubtopics = 0;
            let totalQuestionsCount = 0;
            let totalAttempted = 0;
            let totalCorrect = 0;

            sub.topics.forEach(t => {
                t.subtopics.forEach(st => {
                    totalSubtopics++;
                    totalQuestionsCount += (st.count || 100);
                    const stStat = stats[st.id];
                    if (stStat) {
                        totalAttempted += stStat.totalQuestions || 0;
                        totalCorrect += stStat.totalCorrect || 0;
                    }
                });
            });

            const overallPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

            return `
                <div class="card-item" onclick="App.openSubject('${sub.id}')" style="cursor:pointer;">
                    <div class="card-icon ${sub.badgeColor || 'bg-teal'}">
                        <i class="fa-solid ${sub.icon || 'fa-code'}"></i>
                    </div>
                    <div class="card-info">
                        <div class="card-title">${this.escapeHTML(sub.name)}</div>
                        <div class="card-subtitle">${sub.topics.length} Topics • ${totalSubtopics} Subtopics • ${totalQuestionsCount} MCQs</div>
                        <div class="progress-bar-sm" style="margin-top:6px;">
                            <div class="progress-bar-sm-fill" style="width: ${overallPct}%;"></div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <span class="badge ${overallPct >= 75 ? 'badge-excellent' : 'badge-good'}" style="font-size:0.7rem;">${overallPct}%</span>
                        <div style="font-size:0.75rem; font-weight:700; color:var(--primary); margin-top:4px;">
                            Practice <i class="fa-solid fa-chevron-right" style="font-size:0.65rem;"></i>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Render Home Recommendations
        this.renderHomeSuggestions();
    },

    renderHomeSuggestions() {
        const suggestionsSection = document.getElementById("home-suggestions-section");
        const suggestionsContainer = document.getElementById("home-suggestions");
        if (!suggestionsSection || !suggestionsContainer) return;

        const suggestions = RecommendationEngine.generateSuggestions();
        if (suggestions.length === 0) {
            suggestionsSection.style.display = "none";
            return;
        }

        suggestionsSection.style.display = "block";
        suggestionsContainer.innerHTML = suggestions.map(s => `
            <div class="suggestion-card" onclick="App.openInstructions('${s.subtopicId}')">
                <div class="suggestion-header">
                    <span class="badge ${s.colorClass || 'bg-warning'}"><i class="fa-solid ${s.icon}"></i> ${s.badge}</span>
                </div>
                <div class="suggestion-title">${this.escapeHTML(s.title)}</div>
                <div class="suggestion-desc">${this.escapeHTML(s.description)}</div>
                <button class="btn-cta" style="margin-top:10px; font-size:0.8rem; padding:8px 12px; min-height:36px;">
                    <span>${this.escapeHTML(s.ctaText)}</span>
                    <i class="fa-solid fa-circle-play"></i>
                </button>
            </div>
        `).join("");
    },

    openSubject(subjectId) {
        const subject = QuestionBank.getSubjectById(subjectId);
        if (!subject) return;
        this.state.selectedSubject = subject;
        this.navigateToScreen("screen-topics");
        this.renderTopics(subject);
    },

    // ------------------------------------------------------------------
    // PAGE 2: SUBJECTS LIST & GLOBAL SEARCH RENDERER
    // ------------------------------------------------------------------
    renderSubjectsList(filterQuery = "") {
        const list = document.getElementById("subjects-full-list");
        if (!list) return;

        let subjects = QuestionBank.getSubjects();
        if (filterQuery) {
            const q = filterQuery.toLowerCase();
            subjects = subjects.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        }

        if (subjects.length === 0) {
            list.innerHTML = `
                <div style="text-align:center; padding:40px 15px; color:var(--text-muted);">
                    <i class="fa-solid fa-folder-open" style="font-size:2.5rem; margin-bottom:10px;"></i>
                    <p style="font-weight:700;">No matching topics found.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = subjects.map(sub => {
            let totalSubtopics = 0;
            sub.topics.forEach(t => totalSubtopics += t.subtopics.length);

            return `
                <div class="card-item" onclick="App.openSubject('${sub.id}')" style="cursor:pointer;">
                    <div class="card-icon ${sub.badgeColor || 'bg-teal'}">
                        <i class="fa-solid ${sub.icon || 'fa-code'}"></i>
                    </div>
                    <div class="card-info">
                        <div class="card-title">${this.escapeHTML(sub.name)}</div>
                        <div class="card-subtitle">${sub.description}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                            ${sub.topics.length} Topics • ${totalSubtopics} Subtopics (100 MCQs each)
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    },

    searchAll(query) {
        const matches = QuestionBank.searchBank(query);
        return { results: matches, total: matches.length };
    },

    renderSearchResultItem(item) {
        if (item.type === "subject") {
            return `
                <div class="card-item" onclick="App.openSubject('${item.subject.id}')" style="cursor:pointer;">
                    <div class="card-icon ${item.subject.badgeColor || 'bg-teal'}"><i class="fa-solid ${item.subject.icon}"></i></div>
                    <div class="card-info">
                        <div class="card-title">${this.escapeHTML(item.subject.name)}</div>
                        <div class="card-subtitle">Subject • ${item.subject.topics.length} Topics</div>
                    </div>
                </div>
            `;
        } else if (item.type === "topic") {
            return `
                <div class="card-item" onclick="App.openTopicFromSearch('${item.subject.id}', '${item.topic.id}')" style="cursor:pointer;">
                    <div class="card-icon bg-indigo"><i class="fa-solid fa-layer-group"></i></div>
                    <div class="card-info">
                        <div class="card-title">${this.escapeHTML(item.topic.name)}</div>
                        <div class="card-subtitle">Topic inside ${this.escapeHTML(item.subject.name)}</div>
                    </div>
                </div>
            `;
        } else if (item.type === "subtopic") {
            return `
                <div class="card-item" onclick="App.openSubtopicFromSearch('${item.subject.id}', '${item.topic.id}', '${item.subtopic.id}')" style="cursor:pointer;">
                    <div class="card-icon bg-emerald"><i class="fa-solid fa-circle-question"></i></div>
                    <div class="card-info">
                        <div class="card-title">${this.escapeHTML(item.subtopic.name)}</div>
                        <div class="card-subtitle">100 MCQs • ${this.escapeHTML(item.subject.name)} / ${this.escapeHTML(item.topic.name)}</div>
                    </div>
                    <span class="badge bg-primary">Start Test</span>
                </div>
            `;
        }
    },

    openTopicFromSearch(subjectId, topicId) {
        const subject = QuestionBank.getSubjectById(subjectId);
        const topic = QuestionBank.getTopicById(subjectId, topicId);
        if (subject && topic) {
            this.state.selectedSubject = subject;
            this.state.selectedTopic = topic;
            this.navigateToScreen("screen-subtopics");
            this.renderSubtopics(subject, topic);
        }
    },

    openSubtopicFromSearch(subjectId, topicId, subtopicId) {
        const subject = QuestionBank.getSubjectById(subjectId);
        const topic = QuestionBank.getTopicById(subjectId, topicId);
        const subtopic = QuestionBank.getSubtopicById(subjectId, topicId, subtopicId);
        if (subject && topic && subtopic) {
            this.state.selectedSubject = subject;
            this.state.selectedTopic = topic;
            this.state.selectedSubtopic = subtopic;
            this.navigateToScreen("screen-instructions");
            this.renderTestInstructions(subtopic);
        }
    },

    // ------------------------------------------------------------------
    // PAGE 3: TOPICS SCREEN RENDERER
    // ------------------------------------------------------------------
    renderTopics(subject) {
        const title = document.getElementById("topic-subject-title");
        if (title) title.innerText = subject.name;

        const container = document.getElementById("topics-list-container");
        if (!container) return;

        const stats = StorageManager.getSubtopicStats();

        container.innerHTML = subject.topics.map((topic, idx) => {
            let totalSub = topic.subtopics.length;
            let totalMcqs = totalSub * 100;
            let attemptedSub = 0;

            topic.subtopics.forEach(st => {
                if (stats[st.id] && stats[st.id].attempts > 0) attemptedSub++;
            });

            return `
                <div class="card-item" onclick="App.openTopic('${topic.id}')" style="cursor:pointer;">
                    <div class="card-icon bg-indigo">
                        <i class="fa-solid ${topic.icon || 'fa-layer-group'}"></i>
                    </div>
                    <div class="card-info">
                        <div class="card-title">${this.escapeHTML(topic.name)}</div>
                        <div class="card-subtitle">${totalSub} Subtopics • ${totalMcqs} Total MCQs</div>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                            Practiced: ${attemptedSub} of ${totalSub} subtopics
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:0.85rem;"></i>
                </div>
            `;
        }).join("");
    },

    openTopic(topicId) {
        if (!this.state.selectedSubject) {
            this.state.selectedSubject = QuestionBank.getSubjects()[0];
        }
        const topic = QuestionBank.getTopicById(this.state.selectedSubject.id, topicId);
        if (!topic) return;
        this.state.selectedTopic = topic;
        this.navigateToScreen("screen-subtopics");
        this.renderSubtopics(this.state.selectedSubject, topic);
    },

    // ------------------------------------------------------------------
    // PAGE 4: SUBTOPICS SCREEN RENDERER
    // ------------------------------------------------------------------
    renderSubtopics(subject, topic) {
        const title = document.getElementById("subtopic-topic-title");
        if (title) title.innerText = topic.name;

        const container = document.getElementById("subtopics-list-container");
        if (!container) return;

        const stats = StorageManager.getSubtopicStats();

        container.innerHTML = topic.subtopics.map(st => {
            const stStat = stats[st.id] || { attempts: 0, highScore: 0, avgAccuracy: 0 };

            return `
                <div class="card-item" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <div style="font-weight:700; font-size:0.92rem; color:var(--text-primary);">
                            <i class="fa-regular fa-file-lines" style="color:var(--primary); margin-right:6px;"></i> ${this.escapeHTML(st.name)}
                        </div>
                        <span class="badge bg-blue" style="font-size:0.7rem;">100 MCQs</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; background:var(--bg-main); padding:8px 12px; border-radius:var(--radius-sm); font-size:0.78rem; color:var(--text-secondary); margin-bottom:10px;">
                        <div>Attempts: <strong>${stStat.attempts}</strong></div>
                        <div>Best Score: <strong>${stStat.highScore}/25</strong></div>
                        <div>Accuracy: <strong>${stStat.avgAccuracy}%</strong></div>
                    </div>

                    <button class="btn-cta" onclick="App.openInstructions('${st.id}')" style="min-height:38px; font-size:0.82rem; padding:8px 12px;">
                        <span>Start Practice Test</span>
                        <i class="fa-solid fa-circle-play"></i>
                    </button>
                </div>
            `;
        }).join("");
    },

    openInstructions(subtopicId) {
        let foundSubtopic = null;
        if (this.state.selectedSubject && this.state.selectedTopic) {
            foundSubtopic = QuestionBank.getSubtopicById(this.state.selectedSubject.id, this.state.selectedTopic.id, subtopicId);
        }

        if (!foundSubtopic) {
            const meta = findSubtopicGlobal(subtopicId);
            if (meta) {
                this.state.selectedSubject = meta.subject;
                this.state.selectedTopic = meta.topic;
                foundSubtopic = meta.subtopic;
            }
        }

        if (foundSubtopic) {
            this.state.selectedSubtopic = foundSubtopic;
            this.navigateToScreen("screen-instructions");
            this.renderTestInstructions(foundSubtopic);
        }
    },

    // ------------------------------------------------------------------
    // PAGE 5: TEST INSTRUCTIONS RENDERER
    // ------------------------------------------------------------------
    renderTestInstructions(subtopic) {
        const titleEl = document.getElementById("ins-subtopic-title");
        if (titleEl) titleEl.innerText = subtopic.name;

        const poolCountEl = document.getElementById("ins-pool-count");
        if (poolCountEl) poolCountEl.innerText = `${subtopic.count || 100} MCQs`;
    },

    // ------------------------------------------------------------------
    // PAGE 6: TEST ENGINE & TIMERS
    // ------------------------------------------------------------------
    startTest(subtopicId, modeFilter = "random", timeLimitMinutes = 20, questionCount = 25) {
        this.stopTimer();

        if (!subtopicId) {
            subtopicId = this.state.selectedSubtopic?.id || "c_tokens_keywords";
        }

        let sub = this.state.selectedSubtopic;
        if (!sub || sub.id !== subtopicId) {
            const meta = findSubtopicGlobal(subtopicId);
            if (meta) {
                this.state.selectedSubject = meta.subject;
                this.state.selectedTopic = meta.topic;
                this.state.selectedSubtopic = meta.subtopic;
                sub = meta.subtopic;
            }
        }

        const session = TestEngine.createTestSession(subtopicId, timeLimitMinutes, modeFilter, questionCount);
        
        // Sanitize stored questions inside session
        if (session && session.questions) {
            session.questions.forEach(q => {
                q.question = this.cleanQuestionText(q.question);
            });
        }

        this.state.testSession = session;
        StorageManager.saveActiveDraft(session);

        this.navigateToScreen("screen-test");
        this.renderActiveQuestion();
        this.startTimer();
    },

    checkAndRestoreDraft() {
        const draft = StorageManager.getActiveDraft();
        if (draft && !draft.isCompleted && draft.questions && draft.questions.length > 0) {
            const meta = findSubtopicGlobal(draft.subtopicId);
            if (!meta) {
                StorageManager.clearActiveDraft();
                return;
            }

            const elapsed = Math.floor((Date.now() - draft.startTime) / 1000);
            const remaining = draft.totalTimeSeconds - elapsed;

            if (remaining > 5 || draft.totalTimeSeconds > 50000) {
                // Sanitize draft questions on restore
                draft.questions.forEach(q => {
                    q.question = this.cleanQuestionText(q.question);
                });

                if (confirm("You have an unfinished test attempt. Would you like to resume?")) {
                    draft.timeRemainingSeconds = remaining;
                    this.state.testSession = draft;

                    this.state.selectedSubject = meta.subject;
                    this.state.selectedTopic = meta.topic;
                    this.state.selectedSubtopic = meta.subtopic;

                    this.navigateToScreen("screen-test");
                    this.renderActiveQuestion();
                    this.startTimer();
                    return;
                }
            }
            StorageManager.clearActiveDraft();
        }
    },

    renderActiveQuestion() {
        const session = this.state.testSession;
        if (!session || !session.questions || session.questions.length === 0) return;

        const idx = session.currentQuestionIndex;
        const q = session.questions[idx];

        // Question Counter & Progress
        const counterEl = document.getElementById("test-question-counter");
        if (counterEl) counterEl.innerText = `Question ${idx + 1} / ${session.questions.length}`;

        const progressFill = document.getElementById("test-progress-fill");
        if (progressFill) progressFill.style.width = `${((idx + 1) / session.questions.length) * 100}%`;

        // Clean Question Text (strip any legacy Q1., Q95. prefixes)
        const cleanText = this.cleanQuestionText(q.question);
        const qTextEl = document.getElementById("test-q-text");
        if (qTextEl) qTextEl.innerHTML = `<strong>Q${idx + 1}.</strong> ${this.escapeHTML(cleanText)}`;

        // Options Stack
        const optionsStack = document.getElementById("test-options-stack");
        if (optionsStack) {
            const optionLabels = ["A", "B", "C", "D"];
            const currentSelected = session.userAnswers[idx];

            optionsStack.innerHTML = q.options.map((opt, optIdx) => {
                const isSelected = (currentSelected === optIdx);
                return `
                    <div class="option-card ${isSelected ? 'selected' : ''}" onclick="App.selectOption(${optIdx})">
                        <div class="option-badge">${optionLabels[optIdx]}</div>
                        <div class="option-text">${this.escapeHTML(opt)}</div>
                    </div>
                `;
            }).join("");
        }

        // Mark for Review button state
        const btnMark = document.getElementById("btn-test-mark");
        if (btnMark) {
            const isMarked = !!session.markedReview[idx];
            if (isMarked) {
                btnMark.classList.add("active");
                btnMark.innerHTML = `<i class="fa-solid fa-bookmark"></i> Marked`;
            } else {
                btnMark.classList.remove("active");
                btnMark.innerHTML = `<i class="fa-regular fa-bookmark"></i> Mark`;
            }
        }

        // Synchronize Palette Grids (Modal + Desktop Side Panel)
        this.renderPaletteGrids();
    },

    renderPaletteGrids() {
        const session = this.state.testSession;
        if (!session || !session.questions) return;

        const html = session.questions.map((_, i) => {
            const isAns = (session.userAnswers[i] !== undefined && session.userAnswers[i] !== null);
            const isMarked = !!session.markedReview[i];
            const isCurrent = (i === session.currentQuestionIndex);

            let statusClass = "unanswered";
            if (isMarked) statusClass = "marked";
            else if (isAns) statusClass = "answered";

            return `
                <div class="palette-btn ${statusClass} ${isCurrent ? 'current' : ''}" onclick="App.jumpToQuestion(${i})">
                    ${i + 1}
                </div>
            `;
        }).join("");

        const modalGrid = document.getElementById("palette-grid");
        if (modalGrid) modalGrid.innerHTML = html;

        const desktopGrid = document.getElementById("desktop-palette-grid");
        if (desktopGrid) desktopGrid.innerHTML = html;
    },

    selectOption(optIdx) {
        if (!this.state.testSession) return;
        const idx = this.state.testSession.currentQuestionIndex;
        this.state.testSession.userAnswers[idx] = optIdx;

        StorageManager.saveActiveDraft(this.state.testSession);
        this.renderActiveQuestion();
    },

    clearActiveOption() {
        if (!this.state.testSession) return;
        const idx = this.state.testSession.currentQuestionIndex;
        delete this.state.testSession.userAnswers[idx];

        StorageManager.saveActiveDraft(this.state.testSession);
        this.renderActiveQuestion();
    },

    toggleMarkForReview() {
        if (!this.state.testSession) return;
        const idx = this.state.testSession.currentQuestionIndex;
        this.state.testSession.markedReview[idx] = !this.state.testSession.markedReview[idx];

        StorageManager.saveActiveDraft(this.state.testSession);
        this.renderActiveQuestion();
    },

    navigateQuestion(direction) {
        if (!this.state.testSession) return;
        const max = this.state.testSession.questions.length;
        let newIdx = this.state.testSession.currentQuestionIndex + direction;

        if (newIdx >= 0 && newIdx < max) {
            this.state.testSession.currentQuestionIndex = newIdx;
            this.renderActiveQuestion();
        }
    },

    // Question Palette Modal
    openPaletteModal() {
        const modal = document.getElementById("modal-palette");
        if (!modal || !this.state.testSession) return;

        this.renderPaletteGrids();
        modal.classList.add("active");
    },

    closePaletteModal() {
        document.getElementById("modal-palette")?.classList.remove("active");
    },

    jumpToQuestion(idx) {
        if (this.state.testSession) {
            this.state.testSession.currentQuestionIndex = idx;
            this.renderActiveQuestion();
            this.closePaletteModal();
        }
    },

    // Submit Confirmation Modal
    openSubmitModal() {
        if (!this.state.testSession) return;

        const session = this.state.testSession;
        const total = session.questions.length;
        const answeredCount = Object.keys(session.userAnswers).length;
        const unansweredCount = total - answeredCount;

        const modalAns = document.getElementById("modal-ans-num");
        const modalUnans = document.getElementById("modal-unans-num");

        if (modalAns) modalAns.innerText = `${answeredCount} / ${total}`;
        if (modalUnans) modalUnans.innerText = `${unansweredCount}`;

        document.getElementById("modal-submit")?.classList.add("active");
    },

    closeSubmitModal() {
        document.getElementById("modal-submit")?.classList.remove("active");
    },

    // Timer Implementation
    startTimer() {
        this.stopTimer();
        const timerValEl = document.getElementById("test-timer-val");

        // Check if unlimited timer mode
        if (this.state.testSession && this.state.testSession.totalTimeSeconds > 50000) {
            if (timerValEl) timerValEl.innerText = "No Limit";
            return;
        }

        this.state.timerInterval = setInterval(() => {
            if (!this.state.testSession) return;

            this.state.testSession.timeRemainingSeconds -= 1;
            const sec = this.state.testSession.timeRemainingSeconds;

            if (sec <= 0) {
                this.stopTimer();
                alert("Time is up! Submitting your test automatically.");
                this.finishTest();
                return;
            }

            const mins = Math.floor(sec / 60);
            const remainderSec = sec % 60;
            if (timerValEl) {
                timerValEl.innerText = `${String(mins).padStart(2, '0')}:${String(remainderSec).padStart(2, '0')}`;
            }

            // Auto-save draft every 10s
            if (sec % 10 === 0) {
                StorageManager.saveActiveDraft(this.state.testSession);
            }
        }, 1000);
    },

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    // Finish & Evaluate Test
    finishTest() {
        this.stopTimer();
        if (!this.state.testSession) return;

        this.state.testSession.isCompleted = true;
        const result = AnalyticsEngine.evaluateTestSession(this.state.testSession);
        this.state.lastResult = result;

        StorageManager.saveAttempt(result);

        this.navigateToScreen("screen-result");
        this.renderResultScreen(result);
    },

    // ------------------------------------------------------------------
    // PAGE 7: RESULT DASHBOARD & ANALYTICS RENDERER
    // ------------------------------------------------------------------
    renderResultScreen(result) {
        document.getElementById("res-score-val").innerText = `${result.score} / ${result.total}`;
        document.getElementById("res-pct-val").innerText = `${result.percentage}%`;

        const badgeEl = document.getElementById("res-perf-badge");
        if (badgeEl) {
            badgeEl.className = `performance-badge ${result.performanceClass}`;
            badgeEl.innerText = result.performanceTag;
        }

        document.getElementById("res-c-count").innerText = `${result.correct}`;
        document.getElementById("res-w-count").innerText = `${result.wrong}`;
        document.getElementById("res-u-count").innerText = `${result.unattempted}`;
        document.getElementById("res-acc-val").innerText = `${result.accuracy}%`;

        const min = Math.floor(result.timeTakenSeconds / 60);
        const sec = result.timeTakenSeconds % 60;
        document.getElementById("res-time-val").innerText = `${min}m ${sec}s`;

        // Render Charts
        setTimeout(() => {
            AnalyticsEngine.renderScoreDoughnutChart("chart-score-doughnut", result);
            AnalyticsEngine.renderPerformanceTrendChart("chart-trend-line", result.subtopicId);
        }, 100);

        // Render Strong vs Weak Areas
        this.renderStrongWeakSummary();

        // Render Review Mistakes
        this.renderMistakesReview(result);

        // Render Recommendations
        this.renderResultSuggestions();
    },

    renderStrongWeakSummary() {
        const container = document.getElementById("res-strong-weak-container");
        if (!container) return;

        const { strong, weak } = AnalyticsEngine.getTopicPerformanceSummary();

        if (strong.length === 0 && weak.length === 0) {
            container.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted);">Attempt more subtopics to see your strong & weak areas breakdown.</p>`;
            return;
        }

        let html = "";
        if (strong.length > 0) {
            html += `<div style="font-size:0.8rem; font-weight:700; color:var(--success); margin-bottom:4px;">🟢 Strong Areas (≥75% Accuracy):</div>`;
            html += `<ul style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px; padding-left:18px;">`;
            strong.forEach(s => html += `<li>${s.name} (${s.accuracy}%)</li>`);
            html += `</ul>`;
        }

        if (weak.length > 0) {
            html += `<div style="font-size:0.8rem; font-weight:700; color:var(--danger); margin-bottom:4px;">🔴 Weak Areas (<65% Accuracy):</div>`;
            html += `<ul style="font-size:0.8rem; color:var(--text-secondary); padding-left:18px;">`;
            weak.forEach(w => html += `<li>${w.name} (${w.accuracy}%)</li>`);
            html += `</ul>`;
        }

        container.innerHTML = html;
    },

    renderMistakesReview(result) {
        const container = document.getElementById("res-mistakes-container");
        if (!container) return;

        const mistakes = result.itemizedResults.filter(item => !item.isCorrect && !item.isUnattempted);

        if (mistakes.length === 0) {
            container.innerHTML = `
                <div style="background:var(--success-bg); padding:14px; border-radius:var(--radius-md); text-align:center; color:var(--success);">
                    <i class="fa-solid fa-circle-check" style="font-size:1.5rem; margin-bottom:6px;"></i>
                    <p style="font-weight:700; font-size:0.9rem;">No Mistakes! Perfect Score!</p>
                </div>
            `;
            return;
        }

        const optionLabels = ["A", "B", "C", "D"];

        container.innerHTML = mistakes.map((item, idx) => {
            const cleanQ = this.cleanQuestionText(item.question.question);
            return `
                <div class="mistake-card">
                    <div class="mistake-header">
                        <span style="font-weight:800; font-size:0.82rem; color:var(--danger);">
                            <i class="fa-solid fa-xmark"></i> Mistake #${idx + 1} (Q${item.questionIndex + 1})
                        </span>
                        <span class="badge bg-danger">Incorrect</span>
                    </div>
                    <div class="mistake-q-text">${this.escapeHTML(cleanQ)}</div>
                    
                    <div style="display:flex; flex-direction:column; gap:6px; margin:10px 0; font-size:0.8rem;">
                        <div style="color:var(--danger);">
                            <strong>Your Answer:</strong> ${optionLabels[item.userAnswer]} - ${this.escapeHTML(item.question.options[item.userAnswer])}
                        </div>
                        <div style="color:var(--success);">
                            <strong>Correct Answer:</strong> ${optionLabels[item.correctAnswer]} - ${this.escapeHTML(item.question.options[item.correctAnswer])}
                        </div>
                    </div>

                    <div class="explanation-box">
                        <div class="explanation-title"><i class="fa-solid fa-lightbulb"></i> Explanation:</div>
                        <div>${this.escapeHTML(item.question.explanation)}</div>
                    </div>
                </div>
            `;
        }).join("");
    },

    renderResultSuggestions() {
        const container = document.getElementById("res-suggestions-container");
        if (!container) return;

        const suggestions = RecommendationEngine.generateSuggestions();
        if (suggestions.length === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = `
            <div style="font-size:0.92rem; font-weight:800; color:var(--text-primary); margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-wand-magic-sparkles" style="color:var(--primary);"></i> Suggested Practice
            </div>
            ${suggestions.map(s => `
                <div class="suggestion-card" onclick="App.openInstructions('${s.subtopicId}')">
                    <div class="suggestion-title">${this.escapeHTML(s.title)}</div>
                    <div class="suggestion-desc">${this.escapeHTML(s.description)}</div>
                </div>
            `).join("")}
        `;
    },

    // ------------------------------------------------------------------
    // PAGE 8: DETAILED ANSWER REVIEW RENDERER
    // ------------------------------------------------------------------
    renderDetailedReview(filter = "all") {
        this.state.reviewFilter = filter;
        const container = document.getElementById("review-full-list");
        if (!container || !this.state.lastResult) return;

        const items = this.state.lastResult.itemizedResults;
        let filtered = items;

        if (filter === "correct") filtered = items.filter(i => i.isCorrect);
        if (filter === "wrong") filtered = items.filter(i => !i.isCorrect && !i.isUnattempted);
        if (filter === "unattempted") filtered = items.filter(i => i.isUnattempted);

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:30px 15px; color:var(--text-muted);">
                    <p style="font-weight:700;">No questions in this filter tab.</p>
                </div>
            `;
            return;
        }

        const optionLabels = ["A", "B", "C", "D"];

        container.innerHTML = filtered.map(item => {
            let statusBadge = `<span class="badge bg-success">Correct</span>`;
            if (item.isUnattempted) statusBadge = `<span class="badge bg-secondary">Skipped</span>`;
            else if (!item.isCorrect) statusBadge = `<span class="badge bg-danger">Incorrect</span>`;

            const cleanQ = this.cleanQuestionText(item.question.question);

            return `
                <div class="card-item" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:800; font-size:0.85rem; color:var(--primary);">Question ${item.questionIndex + 1} of ${items.length}</span>
                        ${statusBadge}
                    </div>

                    <div style="font-weight:700; font-size:0.9rem; margin-bottom:12px;">${this.escapeHTML(cleanQ)}</div>

                    <div class="options-stack" style="margin-bottom:10px;">
                        ${item.question.options.map((opt, optIdx) => {
                            let optClass = "";
                            if (optIdx === item.correctAnswer) optClass = "correct";
                            else if (optIdx === item.userAnswer && !item.isCorrect) optClass = "wrong";

                            return `
                                <div class="option-card ${optClass}" style="cursor:default; min-height:40px;">
                                    <div class="option-badge">${optionLabels[optIdx]}</div>
                                    <div class="option-text" style="font-size:0.84rem;">${this.escapeHTML(opt)}</div>
                                </div>
                            `;
                        }).join("")}
                    </div>

                    <div class="explanation-box">
                        <div class="explanation-title"><i class="fa-solid fa-lightbulb"></i> Solution & Explanation:</div>
                        <div>${this.escapeHTML(item.question.explanation)}</div>
                    </div>
                </div>
            `;
        }).join("");
    },

    // ------------------------------------------------------------------
    // PAGE 9: DASHBOARD & HISTORY RENDERER
    // ------------------------------------------------------------------
    renderDashboard() {
        const attempts = StorageManager.getAttempts();

        let totalQuestionsAttempted = 0;
        let totalCorrect = 0;
        let bestScore = 0;

        attempts.forEach(a => {
            totalQuestionsAttempted += (a.attempted || 25);
            totalCorrect += a.correct;
            if (a.score > bestScore) bestScore = a.score;
        });

        const avgAcc = totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;

        document.getElementById("dash-tests-count").innerText = `${attempts.length}`;
        document.getElementById("dash-questions-count").innerText = `${totalQuestionsAttempted}`;
        document.getElementById("dash-avg-acc").innerText = `${avgAcc}%`;
        document.getElementById("dash-best-score").innerText = `${bestScore}`;

        // Render Subject Level Progress
        this.renderDashboardSubjectProgress();

        // Render History List
        const historyContainer = document.getElementById("dash-history-list");
        if (!historyContainer) return;

        if (attempts.length === 0) {
            historyContainer.innerHTML = `
                <div style="text-align:center; padding:30px 15px; color:var(--text-muted); background:var(--surface); border-radius:var(--radius-md);">
                    <i class="fa-solid fa-history" style="font-size:2rem; margin-bottom:8px;"></i>
                    <p style="font-weight:700;">No test attempts yet.</p>
                    <p style="font-size:0.8rem; margin-top:4px;">Select a topic and start your first practice test!</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = attempts.map((a, idx) => {
            const meta = findSubtopicGlobal(a.subtopicId);
            const title = meta ? meta.subtopic.name : a.subtopicId;
            const subTitle = meta ? `${meta.subject.name} • ${meta.topic.name}` : "Practice Test Attempt";

            return `
                <div class="card-item" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                        <div style="font-weight:800; font-size:0.9rem; color:var(--text-primary);">${this.escapeHTML(title)}</div>
                        <span class="badge ${a.percentage >= 70 ? 'badge-good' : 'badge-poor'}">${a.percentage}% Score</span>
                    </div>

                    <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:8px;">
                        ${subTitle} • ${a.date}
                    </div>

                    <div style="display:flex; justify-content:space-between; background:var(--bg-main); padding:6px 10px; border-radius:6px; font-size:0.78rem; color:var(--text-secondary); margin-bottom:10px;">
                        <div>Score: <strong>${a.score}/${a.total}</strong></div>
                        <div>Accuracy: <strong>${a.accuracy}%</strong></div>
                        <div>Time: <strong>${Math.floor(a.timeTakenSeconds / 60)}m ${a.timeTakenSeconds % 60}s</strong></div>
                    </div>

                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="App.viewHistoricalResult(${idx})" style="flex:1; min-height:34px; font-size:0.78rem;">
                            View Result
                        </button>
                        <button class="btn-cta" onclick="App.startTest('${a.subtopicId}')" style="flex:1; min-height:34px; font-size:0.78rem; padding:4px 8px;">
                            <span>Retry Test</span>
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    },

    renderDashboardSubjectProgress() {
        const container = document.getElementById("dash-subject-progress-container");
        if (!container) return;

        const subjects = QuestionBank.getSubjects();
        const stats = StorageManager.getSubtopicStats();

        container.innerHTML = subjects.map(sub => {
            let totalQuestions = 0;
            let totalCorrect = 0;

            sub.topics.forEach(t => {
                t.subtopics.forEach(st => {
                    const stStat = stats[st.id];
                    if (stStat) {
                        totalQuestions += stStat.totalQuestions || 0;
                        totalCorrect += stStat.totalCorrect || 0;
                    }
                });
            });

            const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

            return `
                <div class="card-item" onclick="App.openSubject('${sub.id}')" style="cursor:pointer; padding:12px;">
                    <div class="card-icon ${sub.badgeColor || 'bg-teal'}" style="width:36px; height:36px; font-size:0.95rem;">
                        <i class="fa-solid ${sub.icon}"></i>
                    </div>
                    <div class="card-info">
                        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.85rem; margin-bottom:4px;">
                            <span>${this.escapeHTML(sub.name)}</span>
                            <span style="color:var(--primary);">${pct}%</span>
                        </div>
                        <div class="progress-bar-sm">
                            <div class="progress-bar-sm-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    },

    viewHistoricalResult(attemptIdx) {
        const attempts = StorageManager.getAttempts();
        const result = attempts[attemptIdx];
        if (result) {
            this.state.lastResult = result;
            this.navigateToScreen("screen-result");
            this.renderResultScreen(result);
        }
    },

    // HTML Escaper to prevent XSS
    escapeHTML(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
