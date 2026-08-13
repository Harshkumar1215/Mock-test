// Main Mobile Application Controller

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const App = {
    state: {
        activeScreen: "screen-home",
        activeNav: "nav-home",
        selectedSubject: null,
        selectedTopic: null,
        selectedSubtopic: null,
        testSession: null,
        lastResult: null,
        timerInterval: null,
        reviewFilter: "all"
    },

    init() {
        this.bindEvents();
        this.renderHome();
        this.checkAndRestoreDraft();
    },

    bindEvents() {
        // Bottom Navigation Bar Items
        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", (e) => {
                const targetScreen = item.dataset.target;
                const navId = item.id;
                this.setActiveNav(navId);
                this.showScreen(targetScreen);

                if (targetScreen === "screen-home") this.renderHome();
                if (targetScreen === "screen-subjects") this.renderSubjectsList();
                if (targetScreen === "screen-dashboard") this.renderDashboard();
            });
        });

        // Search bar on Home page
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
                                <p style="font-size:0.8rem; margin-top:4px;">Try searching for Mathematics, Python, Sets, Logic, DBMS, CPU, etc.</p>
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

        // Search bar on Subject page
        const searchInput = document.getElementById("search-input");
        const subjectsClearBtn = document.getElementById("subjects-search-clear");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.trim();
                if (subjectsClearBtn) {
                    subjectsClearBtn.style.display = query ? "flex" : "none";
                }
                this.renderSubjectsList(query);
            });

            subjectsClearBtn?.addEventListener("click", () => {
                searchInput.value = "";
                searchInput.dispatchEvent(new Event("input"));
                searchInput.focus();
            });
        }

        // Top Back Button
        document.getElementById("btn-top-back")?.addEventListener("click", () => this.handleBack());

        // Test Navigation buttons
        document.getElementById("btn-test-prev")?.addEventListener("click", () => this.navigateQuestion(-1));
        document.getElementById("btn-test-next")?.addEventListener("click", () => this.navigateQuestion(1));
        document.getElementById("btn-test-clear")?.addEventListener("click", () => this.clearCurrentChoice());
        document.getElementById("btn-test-mark")?.addEventListener("click", () => this.toggleMarkReview());
        document.getElementById("btn-test-submit")?.addEventListener("click", () => this.showSubmitModal());
        
        // Palette Modal
        document.getElementById("btn-open-palette")?.addEventListener("click", () => this.togglePaletteModal(true));
        document.getElementById("btn-close-palette")?.addEventListener("click", () => this.togglePaletteModal(false));
        
        // Submit Modal
        document.getElementById("btn-modal-confirm-submit")?.addEventListener("click", () => {
            this.toggleModal("modal-submit", false);
            this.finishTest();
        });
        document.getElementById("btn-modal-cancel-submit")?.addEventListener("click", () => {
            this.toggleModal("modal-submit", false);
        });

        // Instructions Screen Start Test button
        document.getElementById("btn-start-instruction-test")?.addEventListener("click", () => {
            if (this.state.selectedSubtopic) {
                this.launchTestEngine(this.state.selectedSubtopic.id);
            }
        });

        // Result Screen Buttons
        document.getElementById("btn-res-review")?.addEventListener("click", () => {
            this.showScreen("screen-review");
            this.renderReviewList();
        });
        document.getElementById("btn-res-retry")?.addEventListener("click", () => {
            if (this.state.selectedSubtopic) {
                this.launchTestEngine(this.state.selectedSubtopic.id);
            }
        });
        document.getElementById("btn-res-home")?.addEventListener("click", () => {
            this.showScreen("screen-home");
            this.renderHome();
        });

        // Review Filter Tabs
        document.querySelectorAll(".filter-tab").forEach(tab => {
            tab.addEventListener("click", (e) => {
                document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
                e.target.classList.add("active");
                this.state.reviewFilter = e.target.dataset.filter;
                this.renderReviewList();
            });
        });
    },

    // Global Search Engine Across All Subjects, Topics & Subtopics
    searchAll(rawQuery) {
        const query = rawQuery.trim().toLowerCase();
        if (!query) return { results: [], total: 0 };

        const subjectMatches = [];
        const topicMatches = [];
        const subtopicMatches = [];

        subjectsConfig.forEach(subject => {
            const sNameLower = subject.name.toLowerCase();
            const sDescLower = subject.description ? subject.description.toLowerCase() : "";

            if (sNameLower.includes(query) || sDescLower.includes(query)) {
                subjectMatches.push({
                    type: "subject",
                    subject: subject,
                    title: subject.name,
                    subtitle: subject.description,
                    icon: subject.icon,
                    badgeColor: subject.badgeColor
                });
            }

            subject.topics.forEach(topic => {
                const tNameLower = topic.name.toLowerCase();
                if (tNameLower.includes(query)) {
                    topicMatches.push({
                        type: "topic",
                        subject: subject,
                        topic: topic,
                        title: topic.name,
                        subtitle: `${subject.name} • ${topic.subtopics.length} Subtopics`,
                        icon: "fa-layer-group",
                        badgeColor: subject.badgeColor
                    });
                }

                topic.subtopics.forEach(subtopic => {
                    const stNameLower = subtopic.name.toLowerCase();
                    const stDescLower = subtopic.desc ? subtopic.desc.toLowerCase() : "";

                    if (stNameLower.includes(query) || stDescLower.includes(query)) {
                        subtopicMatches.push({
                            type: "subtopic",
                            subject: subject,
                            topic: topic,
                            subtopic: subtopic,
                            title: subtopic.name,
                            subtitle: `${subject.name} ➔ ${topic.name}`,
                            icon: "fa-file-lines",
                            badgeColor: subject.badgeColor
                        });
                    }
                });
            });
        });

        const combined = [...subjectMatches, ...topicMatches, ...subtopicMatches];
        return {
            results: combined.slice(0, 50),
            total: combined.length
        };
    },

    renderSearchResultItem(item) {
        if (item.type === "subject") {
            return `
                <div class="card-item" onclick="App.openSubject('${item.subject.id}')">
                    <div class="card-icon ${item.badgeColor}">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="card-content">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                            <span class="search-type-badge badge-search-subject"><i class="fa-solid fa-book"></i> Subject</span>
                        </div>
                        <div class="card-title">${this.escapeHTML(item.title)}</div>
                        <div class="card-subtitle">${this.escapeHTML(item.subtitle)}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);"></i>
                </div>
            `;
        } else if (item.type === "topic") {
            return `
                <div class="card-item" onclick="App.openTopicFromSearch('${item.subject.id}', '${item.topic.id}')">
                    <div class="card-icon ${item.badgeColor}">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="card-content">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                            <span class="search-type-badge badge-search-topic"><i class="fa-solid fa-layer-group"></i> Topic</span>
                        </div>
                        <div class="card-title">${this.escapeHTML(item.title)}</div>
                        <div class="card-subtitle">${this.escapeHTML(item.subtitle)}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);"></i>
                </div>
            `;
        } else {
            return `
                <div class="card-item" onclick="App.openSubtopicFromSuggestion('${item.subject.id}', '${item.topic.id}', '${item.subtopic.id}')">
                    <div class="card-icon ${item.badgeColor}">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="card-content">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                            <span class="search-type-badge badge-search-subtopic"><i class="fa-solid fa-file-lines"></i> Subtopic</span>
                        </div>
                        <div class="card-title">${this.escapeHTML(item.title)}</div>
                        <div class="card-subtitle">${this.escapeHTML(item.subtitle)}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);"></i>
                </div>
            `;
        }
    },

    openTopicFromSearch(subjectId, topicId) {
        const subject = getSubjectById(subjectId);
        const topic = getTopicById(subjectId, topicId);
        if (subject && topic) {
            this.state.selectedSubject = subject;
            this.state.selectedTopic = topic;
            this.renderSubtopicsList(topic);
            this.showScreen("screen-subtopics");
        }
    },

    escapeHTML(str) {
        if (!str) return "";
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    },

    // Set active bottom nav item
    setActiveNav(navId) {
        document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
        const targetNav = document.getElementById(navId);
        if (targetNav) targetNav.classList.add("active");
    },

    // Screen Router
    showScreen(screenId) {
        document.querySelectorAll(".view-screen").forEach(s => s.classList.remove("active"));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add("active");
            this.state.activeScreen = screenId;
        }

        // Hide back button on main landing screens
        const backBtn = document.getElementById("btn-top-back");
        if (backBtn) {
            backBtn.style.display = (screenId === "screen-home") ? "none" : "flex";
        }
    },

    // Handle back button
    handleBack() {
        const curr = this.state.activeScreen;
        if (curr === "screen-topics") {
            this.showScreen("screen-subjects");
        } else if (curr === "screen-subtopics") {
            this.showScreen("screen-topics");
        } else if (curr === "screen-instructions") {
            this.showScreen("screen-subtopics");
        } else if (curr === "screen-test") {
            if (confirm("Exit test? Your active progress will be saved in draft.")) {
                this.stopTimer();
                this.showScreen("screen-subtopics");
            }
        } else if (curr === "screen-result" || curr === "screen-review") {
            this.showScreen("screen-home");
        } else {
            this.showScreen("screen-home");
        }
    },

    // Check for unfinished active test draft on load
    checkAndRestoreDraft() {
        const draft = StorageManager.getActiveDraft();
        if (draft && !draft.isCompleted) {
            if (confirm("You have an unfinished test in progress. Would you like to resume?")) {
                this.state.testSession = draft;
                const meta = findSubtopicGlobal(draft.subtopicId);
                if (meta) {
                    this.state.selectedSubject = meta.subject;
                    this.state.selectedTopic = meta.topic;
                    this.state.selectedSubtopic = meta.subtopic;
                }
                this.renderTestQuestion();
                this.startTimer();
                this.showScreen("screen-test");
            } else {
                StorageManager.clearActiveDraft();
            }
        }
    },

    // =========================================================================
    // PAGE 1: HOME PAGE
    // =========================================================================
    renderHome() {
        const grid = document.getElementById("home-subject-grid");
        const suggestionsBox = document.getElementById("home-suggestions");
        const stats = StorageManager.getSubtopicStats();

        // Render Subject Cards
        if (grid) {
            grid.innerHTML = subjectsConfig.map(s => {
                let totalMCQs = 0;
                let totalTopics = s.topics.length;
                let attemptedSubtopics = 0;

                s.topics.forEach(t => {
                    t.subtopics.forEach(st => {
                        totalMCQs += st.count;
                        if (stats[st.id] && stats[st.id].attempts > 0) {
                            attemptedSubtopics++;
                        }
                    });
                });

                const totalSubtopics = s.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
                const progressPct = Math.round((attemptedSubtopics / totalSubtopics) * 100);

                return `
                    <div class="card-item" onclick="App.openSubject('${s.id}')">
                        <div class="card-icon ${s.badgeColor}">
                            <i class="fa-solid ${s.icon}"></i>
                        </div>
                        <div class="card-content">
                            <div class="card-title">${this.escapeHTML(s.name)}</div>
                            <div class="card-subtitle">${this.escapeHTML(s.description)}</div>
                            <div class="card-meta">
                                <span class="tag-badge">${totalTopics} Topics</span>
                                <span><i class="fa-regular fa-file-lines"></i> ${totalMCQs} MCQs</span>
                            </div>
                            <div class="progress-bar-sm">
                                <div class="progress-bar-sm-fill" style="width: ${progressPct}%"></div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);"></i>
                    </div>
                `;
            }).join("");
        }

        // Render Recommendations System ("Suggested Practice")
        const suggestionsSection = document.getElementById("home-suggestions-section");
        if (suggestionsBox) {
            const suggestions = RecommendationEngine.generateSuggestions();
            if (suggestions && suggestions.length > 0) {
                if (suggestionsSection) suggestionsSection.style.display = "block";
                suggestionsBox.innerHTML = suggestions.map(sug => {
                    return `
                        <div class="suggestion-card">
                            <div class="suggestion-header">
                                <span class="suggestion-badge ${sug.colorClass}">
                                    <i class="fa-solid ${sug.icon}"></i> ${sug.badge}
                                </span>
                            </div>
                            <h4>${this.escapeHTML(sug.title)}</h4>
                            <p>${this.escapeHTML(sug.description)}</p>
                            <button class="btn-cta" onclick="App.openSubtopicFromSuggestion('${sug.subjectId}', '${sug.topicId}', '${sug.subtopicId}')">
                                <span>${sug.ctaText}</span>
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    `;
                }).join("");
            } else {
                if (suggestionsSection) suggestionsSection.style.display = "none";
                suggestionsBox.innerHTML = "";
            }
        }
    },

    openSubtopicFromSuggestion(subjectId, topicId, subtopicId) {
        const meta = findSubtopicGlobal(subtopicId);
        if (meta) {
            this.state.selectedSubject = meta.subject;
            this.state.selectedTopic = meta.topic;
            this.state.selectedSubtopic = meta.subtopic;
            this.renderInstructionsPage(meta.subtopic);
            this.showScreen("screen-instructions");
        }
    },

    // =========================================================================
    // PAGE 2: SUBJECTS LIST & SEARCH
    // =========================================================================
    renderSubjectsList(query = "") {
        const list = document.getElementById("subjects-full-list");
        if (!list) return;

        if (query.trim()) {
            const { results, total } = this.searchAll(query);
            if (results.length > 0) {
                list.innerHTML = `
                    <div style="font-size:0.85rem; font-weight:700; color:var(--primary); margin-bottom:8px;">
                        <i class="fa-solid fa-magnifying-glass"></i> Found ${total} matching item${total === 1 ? '' : 's'}
                    </div>
                ` + results.map(item => this.renderSearchResultItem(item)).join("");
            } else {
                list.innerHTML = `
                    <div style="text-align:center; padding:30px 15px; color:var(--text-muted); background:var(--surface); border-radius:var(--radius-md);">
                        <i class="fa-solid fa-circle-exclamation" style="font-size:2rem; margin-bottom:10px; color:var(--primary);"></i>
                        <p style="font-weight:700; font-size:0.95rem;">No matches found for "${this.escapeHTML(query)}"</p>
                        <p style="font-size:0.8rem; margin-top:4px;">Try searching for Mathematics, Sets, Python, Logic Gates, Matrices, etc.</p>
                    </div>
                `;
            }
        } else {
            list.innerHTML = subjectsConfig.map(s => {
                return `
                    <div class="card-item" onclick="App.openSubject('${s.id}')">
                        <div class="card-icon ${s.badgeColor}">
                            <i class="fa-solid ${s.icon}"></i>
                        </div>
                        <div class="card-content">
                            <div class="card-title">${this.escapeHTML(s.name)}</div>
                            <div class="card-subtitle">${this.escapeHTML(s.description)}</div>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);"></i>
                    </div>
                `;
            }).join("");
        }
    },

    openSubject(subjectId) {
        const subject = getSubjectById(subjectId);
        if (!subject) return;

        this.state.selectedSubject = subject;
        this.renderTopicsList(subject);
        this.showScreen("screen-topics");
    },

    // =========================================================================
    // PAGE 3: TOPICS LIST
    // =========================================================================
    renderTopicsList(subject) {
        document.getElementById("topic-subject-title").innerText = subject.name;
        const list = document.getElementById("topics-list-container");

        list.innerHTML = subject.topics.map(t => {
            const totalMCQs = t.subtopics.reduce((acc, st) => acc + st.count, 0);

            return `
                <div class="card-item" onclick="App.openTopic('${t.id}')">
                    <div class="card-icon bg-primary-bg" style="color:var(--primary);">
                        <i class="fa-solid ${t.icon}"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-title">${t.name}</div>
                        <div class="card-meta">
                            <span class="tag-badge">${t.subtopics.length} Subtopics</span>
                            <span>${totalMCQs} MCQs</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);"></i>
                </div>
            `;
        }).join("");
    },

    openTopic(topicId) {
        const topic = getTopicById(this.state.selectedSubject.id, topicId);
        if (!topic) return;

        this.state.selectedTopic = topic;
        this.renderSubtopicsList(topic);
        this.showScreen("screen-subtopics");
    },

    // =========================================================================
    // PAGE 4: SUBTOPICS LIST
    // =========================================================================
    renderSubtopicsList(topic) {
        document.getElementById("subtopic-topic-title").innerText = topic.name;
        const list = document.getElementById("subtopics-list-container");
        const stats = StorageManager.getSubtopicStats();

        list.innerHTML = topic.subtopics.map(st => {
            const stStat = stats[st.id];
            const hasAttempts = stStat && stStat.attempts > 0;

            return `
                <div class="card-item" style="flex-direction:column; align-items:stretch;" onclick="App.openInstructions('${st.id}')">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <div class="card-title">${st.name}</div>
                        <span class="tag-badge">100 MCQs Pool</span>
                    </div>
                    <div class="card-subtitle" style="margin: 6px 0 10px 0;">${st.desc}</div>
                    <div style="display:flex; align-items:center; justify-content:space-between; padding-top:8px; border-top:1px dashed var(--border);">
                        <div class="card-meta">
                            ${hasAttempts 
                                ? `<span><i class="fa-solid fa-trophy" style="color:var(--success);"></i> Best: ${stStat.highScore}/25 (${stStat.attempts} attempts)</span>`
                                : `<span><i class="fa-regular fa-clock"></i> 25 MCQs · 20 Mins</span>`
                            }
                        </div>
                        <button class="btn-cta" style="width:auto; min-height:36px; padding:4px 12px; font-size:0.78rem;">
                            Start Test
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    },

    openInstructions(subtopicId) {
        const st = getSubtopicById(this.state.selectedSubject.id, this.state.selectedTopic.id, subtopicId);
        if (!st) return;

        this.state.selectedSubtopic = st;
        this.renderInstructionsPage(st);
        this.showScreen("screen-instructions");
    },

    // =========================================================================
    // PAGE 5: TEST INSTRUCTIONS
    // =========================================================================
    renderInstructionsPage(subtopic) {
        document.getElementById("ins-subtopic-title").innerText = subtopic.name;
        document.getElementById("ins-pool-count").innerText = `${subtopic.count} MCQs`;
    },

    // =========================================================================
    // PAGE 6: TEST ENGINE EXECUTION
    // =========================================================================
    launchTestEngine(subtopicId) {
        // Create fresh test session: 25 random questions from 100 pool
        this.state.testSession = TestEngine.createTestSession(subtopicId, 20);
        StorageManager.saveActiveDraft(this.state.testSession);

        this.renderTestQuestion();
        this.startTimer();
        this.showScreen("screen-test");
    },

    renderTestQuestion() {
        const session = this.state.testSession;
        if (!session) return;

        const idx = session.currentQuestionIndex;
        const total = session.questions.length; // 25
        const q = session.questions[idx];

        document.getElementById("test-question-counter").innerText = `Question ${idx + 1} / ${total}`;
        
        // Progress bar
        const fill = document.getElementById("test-progress-fill");
        if (fill) fill.style.width = `${Math.round(((idx + 1) / total) * 100)}%`;

        document.getElementById("test-q-text").innerText = q.question;

        // Options
        const container = document.getElementById("test-options-stack");
        const keys = ["A", "B", "C", "D"];
        const currentAns = session.userAnswers[idx];

        container.innerHTML = q.options.map((opt, i) => {
            const isSelected = (currentAns === i);
            return `
                <button class="opt-btn ${isSelected ? 'selected' : ''}" onclick="App.selectOption(${i})">
                    <span class="opt-key">${keys[i]}</span>
                    <span style="font-size:0.9rem; color:var(--text-primary); font-weight:500;">${opt}</span>
                </button>
            `;
        }).join("");

        // Update Mark button
        const markBtn = document.getElementById("btn-test-mark");
        if (markBtn) {
            const isMarked = !!session.markedReview[idx];
            if (isMarked) {
                markBtn.classList.add("marked");
                markBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i> Marked`;
            } else {
                markBtn.classList.remove("marked");
                markBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i> Mark`;
            }
        }

        // Disable Prev on 1st question
        const prevBtn = document.getElementById("btn-test-prev");
        if (prevBtn) {
            prevBtn.style.opacity = (idx === 0) ? "0.5" : "1";
            prevBtn.style.pointerEvents = (idx === 0) ? "none" : "auto";
        }
    },

    selectOption(optionIndex) {
        const session = this.state.testSession;
        const currIdx = session.currentQuestionIndex;
        session.userAnswers[currIdx] = optionIndex;

        StorageManager.saveActiveDraft(session);
        this.renderTestQuestion();
    },

    clearCurrentChoice() {
        const session = this.state.testSession;
        delete session.userAnswers[session.currentQuestionIndex];
        StorageManager.saveActiveDraft(session);
        this.renderTestQuestion();
    },

    toggleMarkReview() {
        const session = this.state.testSession;
        const currIdx = session.currentQuestionIndex;
        session.markedReview[currIdx] = !session.markedReview[currIdx];
        StorageManager.saveActiveDraft(session);
        this.renderTestQuestion();
    },

    navigateQuestion(dir) {
        const session = this.state.testSession;
        const newIdx = session.currentQuestionIndex + dir;
        if (newIdx >= 0 && newIdx < session.questions.length) {
            session.currentQuestionIndex = newIdx;
            this.renderTestQuestion();
        }
    },

    startTimer() {
        this.stopTimer();
        const display = document.getElementById("test-timer-val");

        this.state.timerInterval = setInterval(() => {
            const session = this.state.testSession;
            if (!session) return;

            session.timeRemainingSeconds -= 1;
            StorageManager.saveActiveDraft(session);

            if (display) {
                const m = Math.floor(session.timeRemainingSeconds / 60);
                const s = session.timeRemainingSeconds % 60;
                display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }

            if (session.timeRemainingSeconds <= 0) {
                this.stopTimer();
                alert("Time is up! Submitting your test automatically.");
                this.finishTest();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    togglePaletteModal(show) {
        const modal = document.getElementById("modal-palette");
        if (!modal) return;

        if (show) {
            const grid = document.getElementById("palette-grid");
            const session = this.state.testSession;

            grid.innerHTML = session.questions.map((q, i) => {
                const isAns = (session.userAnswers[i] !== undefined);
                const isMarked = !!session.markedReview[i];
                const isCurrent = (i === session.currentQuestionIndex);

                let cls = "";
                if (isCurrent) cls += " current";
                if (isMarked) cls += " marked";
                else if (isAns) cls += " answered";

                return `
                    <div class="p-item ${cls}" onclick="App.jumpToQuestion(${i})">
                        ${i + 1}
                    </div>
                `;
            }).join("");

            modal.classList.add("active");
        } else {
            modal.classList.remove("active");
        }
    },

    jumpToQuestion(index) {
        this.state.testSession.currentQuestionIndex = index;
        this.togglePaletteModal(false);
        this.renderTestQuestion();
    },

    showSubmitModal() {
        const session = this.state.testSession;
        const ansCount = Object.keys(session.userAnswers).length;
        const total = session.questions.length;
        const unansCount = total - ansCount;

        document.getElementById("modal-ans-num").innerText = `${ansCount} / ${total}`;
        document.getElementById("modal-unans-num").innerText = unansCount;

        this.toggleModal("modal-submit", true);
    },

    toggleModal(modalId, show) {
        const m = document.getElementById(modalId);
        if (m) {
            if (show) m.classList.add("active");
            else m.classList.remove("active");
        }
    },

    // Finish Test & Calculate Results
    finishTest() {
        this.stopTimer();

        const session = this.state.testSession;
        session.isCompleted = true;

        const result = AnalyticsEngine.evaluateTestSession(session);
        this.state.lastResult = result;

        // Save Attempt to Storage
        StorageManager.saveAttempt({
            id: Date.now(),
            subtopicId: result.subtopicId,
            score: result.score,
            total: result.total,
            percentage: result.percentage,
            accuracy: result.accuracy,
            correct: result.correct,
            wrong: result.wrong,
            unattempted: result.unattempted,
            timeTakenSeconds: result.timeTakenSeconds,
            date: result.date
        });

        // Render Result Screen
        this.renderResultScreen(result);
        this.showScreen("screen-result");
    },

    // =========================================================================
    // PAGE 7: RESULT DASHBOARD & CHARTS
    // =========================================================================
    renderResultScreen(res) {
        document.getElementById("res-score-val").innerText = `${res.score} / ${res.total}`;
        document.getElementById("res-pct-val").innerText = `${res.percentage}% Score`;
        
        const badge = document.getElementById("res-perf-badge");
        if (badge) {
            badge.innerText = res.performanceTag;
            badge.className = `performance-badge ${res.performanceClass}`;
        }

        document.getElementById("res-c-count").innerText = res.correct;
        document.getElementById("res-w-count").innerText = res.wrong;
        document.getElementById("res-u-count").innerText = res.unattempted;
        document.getElementById("res-acc-val").innerText = `${res.accuracy}%`;

        const m = Math.floor(res.timeTakenSeconds / 60);
        const s = res.timeTakenSeconds % 60;
        document.getElementById("res-time-val").innerText = `${m}m ${s}s`;

        // Render Chart.js Doughnut & Line Trend Charts
        AnalyticsEngine.renderScoreDoughnutChart("chart-score-doughnut", res);
        AnalyticsEngine.renderPerformanceTrendChart("chart-trend-line", res.subtopicId);

        // Render Review Mistakes section
        this.renderMistakesSection(res.itemizedResults.filter(r => !r.isCorrect && !r.isUnattempted));
    },

    renderMistakesSection(mistakesList) {
        const container = document.getElementById("res-mistakes-container");
        if (!container) return;

        if (mistakesList.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:15px; color:var(--success); font-weight:700;">🎉 Perfect! Zero incorrect answers.</div>`;
            return;
        }

        const keys = ["A", "B", "C", "D"];

        container.innerHTML = mistakesList.map((m, idx) => {
            const q = m.question;
            return `
                <div class="card-item" style="flex-direction:column; align-items:stretch; border-left:4px solid var(--danger);">
                    <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Mistake #${idx + 1}</div>
                    <div class="question-text-val" style="font-size:0.88rem; margin: 4px 0 8px 0;">${q.question}</div>
                    <div style="font-size:0.8rem; background:var(--danger-bg); color:var(--danger); padding:6px 10px; border-radius:6px; margin-bottom:4px;">
                        <strong>Your Answer:</strong> ${keys[m.userAnswer]}. ${q.options[m.userAnswer]}
                    </div>
                    <div style="font-size:0.8rem; background:var(--success-bg); color:var(--success); padding:6px 10px; border-radius:6px; margin-bottom:8px;">
                        <strong>Correct Answer:</strong> ${keys[q.correctAnswer]}. ${q.options[q.correctAnswer]}
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-secondary); background:#f8fafc; padding:8px; border-radius:6px; border-left:3px solid var(--primary);">
                        <strong>Explanation:</strong> ${q.explanation}
                    </div>
                </div>
            `;
        }).join("");
    },

    // =========================================================================
    // PAGE 8: FULL DETAILED ANSWER REVIEW
    // =========================================================================
    renderReviewList() {
        const res = this.state.lastResult;
        if (!res) return;

        const container = document.getElementById("review-full-list");
        const filter = this.state.reviewFilter;
        const keys = ["A", "B", "C", "D"];

        const filtered = res.itemizedResults.filter(item => {
            if (filter === "correct") return item.isCorrect;
            if (filter === "wrong") return !item.isCorrect && !item.isUnattempted;
            if (filter === "unattempted") return item.isUnattempted;
            return true;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No questions found under this filter</div>`;
            return;
        }

        container.innerHTML = filtered.map(item => {
            const q = item.question;
            let borderCls = item.isCorrect ? "var(--success)" : item.isUnattempted ? "var(--text-muted)" : "var(--danger)";

            return `
                <div class="card-item" style="flex-direction:column; align-items:stretch; border-left:4px solid ${borderCls};">
                    <div style="font-size:0.76rem; color:var(--text-muted); font-weight:700;">Question ${item.questionIndex + 1}</div>
                    <div class="question-text-val" style="font-size:0.9rem; margin: 4px 0 10px 0;">${q.question}</div>
                    
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        ${q.options.map((opt, i) => {
                            let optStyle = "background:#f8fafc; border:1px solid var(--border);";
                            let badge = "";

                            if (i === q.correctAnswer) {
                                optStyle = "background:var(--success-bg); border:1px solid var(--success); color:#047857; font-weight:700;";
                                badge = " (Correct)";
                            }
                            if (item.userAnswer === i && !item.isCorrect) {
                                optStyle = "background:var(--danger-bg); border:1px solid var(--danger); color:#b91c1c; font-weight:700;";
                                badge = " (Your Choice)";
                            }

                            return `
                                <div style="padding:8px 10px; border-radius:6px; font-size:0.82rem; ${optStyle}">
                                    <strong>${keys[i]}.</strong> ${opt} ${badge}
                                </div>
                            `;
                        }).join("")}
                    </div>

                    <div style="margin-top:10px; font-size:0.78rem; background:#f8fafc; padding:8px 10px; border-radius:6px; border-left:3px solid var(--primary);">
                        <strong>Explanation:</strong> ${q.explanation}
                    </div>
                </div>
            `;
        }).join("");
    },

    // =========================================================================
    // PAGE 9: DASHBOARD & HISTORY
    // =========================================================================
    renderDashboard() {
        const attempts = StorageManager.getAttempts();
        const stats = StorageManager.getSubtopicStats();

        const totalTests = attempts.length;
        const totalQuestions = attempts.reduce((acc, a) => acc + a.total, 0);
        const totalCorrect = attempts.reduce((acc, a) => acc + a.correct, 0);
        const avgAccuracy = totalTests > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;

        document.getElementById("dash-tests-count").innerText = totalTests;
        document.getElementById("dash-questions-count").innerText = totalQuestions;
        document.getElementById("dash-avg-acc").innerText = `${avgAccuracy}%`;
        document.getElementById("dash-best-score").innerText = `${bestScore}/25`;

        // Render Attempt History List
        const historyList = document.getElementById("dash-history-list");
        if (historyList) {
            if (attempts.length === 0) {
                historyList.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No attempts recorded yet</div>`;
                return;
            }

            historyList.innerHTML = attempts.map(a => {
                const meta = findSubtopicGlobal(a.subtopicId);
                const name = meta ? meta.subtopic.name : a.subtopicId;

                return `
                    <div class="card-item" style="flex-direction:column; align-items:stretch;">
                        <div style="display:flex; align-items:center; justify-content:space-between;">
                            <div class="card-title" style="font-size:0.92rem;">${name}</div>
                            <span class="tag-badge">${a.percentage}% Score</span>
                        </div>
                        <div class="card-meta" style="margin: 4px 0 8px 0;">
                            <span>Score: <strong>${a.score}/25</strong></span> · 
                            <span>Accuracy: ${a.accuracy}%</span> · 
                            <span>${a.date}</span>
                        </div>
                        <button class="btn-secondary" style="min-height:34px; font-size:0.78rem;" onclick="App.retryFromHistory('${a.subtopicId}')">
                            <i class="fa-solid fa-rotate-right"></i> Retry Test (New 25 MCQs)
                        </button>
                    </div>
                `;
            }).join("");
        }
    },

    retryFromHistory(subtopicId) {
        const meta = findSubtopicGlobal(subtopicId);
        if (meta) {
            this.state.selectedSubject = meta.subject;
            this.state.selectedTopic = meta.topic;
            this.state.selectedSubtopic = meta.subtopic;
            this.launchTestEngine(subtopicId);
        }
    }
};
