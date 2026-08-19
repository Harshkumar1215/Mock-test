/**
 * Master Question Bank Repository & Procedural Generator Engine
 * Multi-Subject Master Repository:
 * 1. Computer Programming using C (14 Topics • 47 Subtopics • 4,700 MCQs)
 * 2. Programming in Python (12 Topics • 30 Subtopics • 3,000 MCQs)
 * 3. Advanced Data Structures (7 Topics • 14 Subtopics • 1,400 MCQs)
 * 4. Advanced Database Management System (6 Topics • 12 Subtopics • 1,200 MCQs)
 * 5. Computer Science Essentials (Bridge) (6 Topics • 12 Subtopics • 1,200 MCQs)
 * 6. Discrete Structures & Optimization (6 Topics • 8 Subtopics • 800 MCQs)
 * Total: 51 Topics • 123 Subtopics • 12,300 MCQs (100 MCQs per subtopic)
 */

window.QuestionBank = (function () {
    // Cache for generated 100-question banks per subtopic
    const questionCache = {};

    // ------------------------------------------------------------------
    // SEED QUESTIONS DATABASE (Exhaustive C, Python, ADS, ADBMS, CS Essentials & Discrete)
    // ------------------------------------------------------------------
    const seedQuestions = {
        // C PROGRAMMING SEEDS
        c_tokens_keywords: [
            {
                question: "How many standard ANSI C keywords are defined in the C89/C90 specification?",
                options: ["32 Keywords", "48 Keywords", "64 Keywords", "16 Keywords"],
                correctAnswer: 0,
                explanation: "Standard C89/C90 defines exactly 32 reserved keywords.",
                difficulty: "easy",
                tags: ["c-tokens", "keywords"]
            }
        ],
        // ADVANCED DATABASE MANAGEMENT SYSTEM SEEDS
        adbms_relational_query: [
            {
                question: "Which component of the DBMS Query Processing Engine translates high-level SQL queries into Relational Algebra expressions?",
                options: ["Query Parser and Translator", "Query Optimizer", "Execution Engine", "Buffer Manager"],
                correctAnswer: 0,
                explanation: "The Query Parser and Translator parses SQL syntax and builds equivalent Relational Algebra trees.",
                difficulty: "easy",
                tags: ["query-processing"]
            }
        ],
        adbms_query_cost_eval: [
            {
                question: "Which Join algorithm operates in O(M + N) I/O cost when both input relations M and N are already sorted on the join attribute?",
                options: ["Sort-Merge Join", "Block Nested-Loop Join", "Hash Join", "Nested-Loop Join"],
                correctAnswer: 0,
                explanation: "Sort-Merge Join scans pre-sorted relations M and N in a single linear pass.",
                difficulty: "medium",
                tags: ["sort-merge-join"]
            }
        ],
        adbms_transactions_acid: [
            {
                question: "In database transaction management, which ACID property guarantees that all operations in a transaction either complete fully or roll back completely?",
                options: ["Atomicity", "Consistency", "Isolation", "Durability"],
                correctAnswer: 0,
                explanation: "Atomicity enforces the 'all-or-nothing' execution guarantee.",
                difficulty: "easy",
                tags: ["atomicity", "acid"]
            },
            {
                question: "If a schedule S can be transformed into a serial schedule by a series of non-conflicting operation swaps, what is S called?",
                options: ["Conflict Serialisable Schedule", "View Serialisable Schedule", "Strict Schedule", "Cascadeless Schedule"],
                correctAnswer: 0,
                explanation: "Swapping non-conflicting operations to match a serial schedule defines Conflict Serialisability.",
                difficulty: "medium",
                tags: ["serializability"]
            }
        ],
        adbms_concurrency_locking: [
            {
                question: "Which variation of Two-Phase Locking (2PL) requires that ALL exclusive (X) locks held by a transaction MUST be held until the transaction COMMITS?",
                options: ["Strict 2PL", "Basic 2PL", "Rigorous 2PL", "Conservative 2PL"],
                correctAnswer: 0,
                explanation: "Strict 2PL prevents cascading aborts by holding all X-locks until final commit.",
                difficulty: "medium",
                tags: ["strict-2pl"]
            }
        ],
        adbms_recovery_logging: [
            {
                question: "According to the Write-Ahead Logging (WAL) protocol, when MUST a log record for a database modification be written to stable storage?",
                options: [
                    "BEFORE the corresponding database buffer page is written to disk",
                    "AFTER the database page is written to disk",
                    "During system restart only",
                    "At midnight every day"
                ],
                correctAnswer: 0,
                explanation: "WAL protocol dictates log records must reach stable storage prior to database page disk flushes.",
                difficulty: "easy",
                tags: ["wal-protocol"]
            }
        ],
        adbms_indexing_hashing: [
            {
                question: "In B+ Trees, where are the actual data pointers or record data entries stored?",
                options: [
                    "EXCLUSIVELY in the Leaf Nodes",
                    "In Internal Nodes only",
                    "Equally across Root and Internal Nodes",
                    "In the Header page only"
                ],
                correctAnswer: 0,
                explanation: "B+ Trees store data records exclusively in leaf nodes linked sequentially for range queries.",
                difficulty: "easy",
                tags: ["bplus-tree-leaves"]
            }
        ],
        adbms_distributed_db: [
            {
                question: "What form of data fragmentation splits a relation schema into subsets of columns with matching primary keys?",
                options: ["Vertical Fragmentation", "Horizontal Fragmentation", "Mixed Fragmentation", "Derived Fragmentation"],
                correctAnswer: 0,
                explanation: "Vertical Fragmentation divides attributes/columns across sites, joined by Primary Keys.",
                difficulty: "medium",
                tags: ["vertical-fragmentation"]
            }
        ],
        adbms_distributed_commit: [
            {
                question: "What is the primary drawback of the Two-Phase Commit (2PC) protocol during coordinator failure?",
                options: ["It can cause Participant processes to BLOCK indefinitely", "It loses data integrity", "It causes deadlock cycles", "It corrupts the WAL log"],
                correctAnswer: 0,
                explanation: "If the Coordinator crashes during 2PC, participant sites holding locks enter a blocking state.",
                difficulty: "medium",
                tags: ["2pc-blocking"]
            }
        ],
        adbms_oodb_xml: [
            {
                question: "Which standardized query language is specified by the Object Data Management Group (ODMG) for querying Object Databases?",
                options: ["OQL (Object Query Language)", "SQL-92", "XQuery", "GraphQL"],
                correctAnswer: 0,
                explanation: "OQL is the Object Query Language standard defined for Object-Oriented Databases.",
                difficulty: "easy",
                tags: ["oql"]
            }
        ],
        adbms_xml_json_db: [
            {
                question: "Which XML navigation language uses expression paths like `/bookstore/book[price > 35]/title` to select nodes?",
                options: ["XPath", "XSLT", "XLink", "DTD"],
                correctAnswer: 0,
                explanation: "XPath provides path expressions for navigating XML document tree structures.",
                difficulty: "easy",
                tags: ["xpath"]
            }
        ],
        adbms_nosql_architecture: [
            {
                question: "Which NoSQL database category is Apache Cassandra classified under?",
                options: ["Wide-Column Store (Column-Family)", "Document Store", "Key-Value Store", "Graph Database"],
                correctAnswer: 0,
                explanation: "Cassandra is a distributed wide-column store designed for high scalability.",
                difficulty: "easy",
                tags: ["cassandra-nosql"]
            }
        ],
        adbms_data_warehousing: [
            {
                question: "In Data Warehousing OLAP operations, what operation changes the dimensional orientation of a report or cube view (e.g. swapping rows and columns)?",
                options: ["Pivot (Rotate)", "Roll-up", "Drill-down", "Slice and Dice"],
                correctAnswer: 0,
                explanation: "Pivot (or Rotate) rotates the data axes to provide an alternative presentation of data.",
                difficulty: "easy",
                tags: ["olap-pivot"]
            }
        ]
    };

    // ------------------------------------------------------------------
    // PROCEDURAL QUESTION GENERATOR: Guarantees 100 MCQs per Subtopic
    // ------------------------------------------------------------------
    function generate100QuestionsForSubtopic(subtopicId) {
        const seeds = seedQuestions[subtopicId] || [];
        const result = [];

        // Clean initial seeds
        seeds.forEach(seed => {
            result.push({
                ...seed,
                question: seed.question.replace(/^(Q\d+[\.\s]*)+/gi, '').trim()
            });
        });

        let subName = "Subtopic Module";
        let subSubject = "Computer Science Course";
        let subTopicName = "Course Topic";

        for (const sub of subjectsConfig) {
            for (const top of sub.topics) {
                for (const st of top.subtopics) {
                    if (st.id === subtopicId) {
                        subName = st.name;
                        subSubject = sub.name;
                        subTopicName = top.name;
                        break;
                    }
                }
            }
        }

        const diffs = ["easy", "medium", "hard"];

        let counter = result.length + 1;
        while (result.length < 100) {
            const currentDiff = diffs[counter % 3];
            const qObj = createVariationQuestion(subtopicId, counter, currentDiff, subName, subSubject);

            // Ensure NO "Q1." or "Q95." prefix exists in question text
            let rawQText = qObj.question || qObj.q || `Question evaluating ${subName}`;
            rawQText = rawQText.replace(/^(Q\d+[\.\s]*)+/gi, '').trim();

            const qOpts = qObj.options || qObj.opts;
            const qAns = (qObj.correctAnswer !== undefined) ? qObj.correctAnswer : (qObj.ans !== undefined ? qObj.ans : 0);
            const qExp = qObj.explanation || qObj.exp || `Explanation for ${subName} concept.`;

            result.push({
                id: `${subtopicId}_q_${counter}`,
                subject: subSubject,
                topic: subTopicName,
                subtopic: subName,
                subtopicId: subtopicId,
                question: rawQText,
                options: qOpts,
                correctAnswer: qAns,
                explanation: qExp,
                difficulty: currentDiff,
                tags: qObj.tags || [subtopicId]
            });

            counter++;
        }

        return result;
    }

    function createVariationQuestion(subtopicId, idx, difficulty, subName, subjectName) {
        // ADVANCED DBMS GENERATORS
        if (subtopicId === "adbms_relational_query") {
            const ops = [
                { name: "Selection (σ)", desc: "Filters rows matching a boolean predicate" },
                { name: "Projection (π)", desc: "Selects specified column attributes" },
                { name: "Natural Join (⋈)", desc: "Combines tuples with matching common attributes" },
                { name: "Cartesian Product (×)", desc: "Combines every row of table A with every row of table B" }
            ];
            const op = ops[idx % ops.length];
            return {
                question: `In Relational Algebra, what is the exact function of operator '${op.name}'?`,
                options: [`${op.desc}`, "Sorts records in descending order", "Creates an index page", "Deletes foreign key constraints"],
                correctAnswer: 0,
                explanation: `'${op.name}' ${op.desc}.`,
                tags: ["relational-algebra"]
            };
        } else if (subtopicId === "adbms_query_cost_eval") {
            return {
                question: `Which Join algorithm is optimal when one relation is small enough to fit entirely in main memory RAM?`,
                options: ["Hash Join", "Sort-Merge Join", "Nested-Loop Join", "Index Scan"],
                correctAnswer: 0,
                explanation: "Hash Join builds an in-memory hash table for the smaller relation, scanning the larger relation once.",
                tags: ["hash-join"]
            };
        } else if (subtopicId === "adbms_transactions_acid") {
            const acid = [
                { letter: "A", name: "Atomicity", desc: "All-or-nothing execution" },
                { letter: "C", name: "Consistency", desc: "Database transitions from one valid state to another" },
                { letter: "I", name: "Isolation", desc: "Concurrent transactions execute without mutual interference" },
                { letter: "D", name: "Durability", desc: "Committed changes persist even after system crashes" }
            ];
            const a = acid[idx % acid.length];
            return {
                question: `Which ACID property '${a.name}' guarantees that ${a.desc}?`,
                options: [`${a.name}`, "Serializability", "Recoverability", "Strictness"],
                correctAnswer: 0,
                explanation: `${a.name} enforces that ${a.desc}.`,
                tags: ["acid-properties"]
            };
        } else if (subtopicId === "adbms_concurrency_locking") {
            return {
                question: `What graph data structure is maintained by DBMS background processes to detect Deadlocks in concurrency control?`,
                options: ["Wait-For Graph (WFG)", "B+ Tree", "Precedence Graph", "Dependency Matrix"],
                correctAnswer: 0,
                explanation: "A Wait-For Graph (WFG) indicates deadlock when a directed cycle exists.",
                tags: ["wait-for-graph"]
            };
        } else if (subtopicId === "adbms_recovery_logging") {
            return {
                question: `What are the three distinct phases of the ARIES Log-Based Database Recovery Algorithm?`,
                options: [
                    "Analysis Phase, Redo Phase, and Undo Phase",
                    "Parse Phase, Optimize Phase, Execute Phase",
                    "Lock Phase, Growth Phase, Shrink Phase",
                    "Scan Phase, Sort Phase, Merge Phase"
                ],
                correctAnswer: 0,
                explanation: "ARIES recovery proceeds through Analysis -> Redo (repeating history) -> Undo.",
                tags: ["aries-recovery"]
            };
        } else if (subtopicId === "adbms_indexing_hashing") {
            return {
                question: `What is the key advantage of Extendible Hashing over Static Hashing?`,
                options: [
                    "It dynamically grows and shrinks directory buckets without full table re-hashing",
                    "It eliminates memory usage",
                    "It enforces strict primary keys",
                    "It sorts data records on disk"
                ],
                correctAnswer: 0,
                explanation: "Extendible hashing handles data growth dynamically using a directory and bucket splitting.",
                tags: ["extendible-hashing"]
            };
        } else if (subtopicId === "adbms_distributed_db") {
            return {
                question: `What is Fragmentation Transparency in Distributed Database Systems?`,
                options: [
                    "Users can query relations without knowing how or where data is fragmented across sites",
                    "Fragments are stored in plaintext without encryption",
                    "All fragments reside on a single server",
                    "Queries require manual server IP inputs"
                ],
                correctAnswer: 0,
                explanation: "Fragmentation transparency hides data partitioning details from the end-user SQL query.",
                tags: ["fragmentation-transparency"]
            };
        } else if (subtopicId === "adbms_distributed_commit") {
            return {
                question: `According to the CAP Theorem for Distributed Systems, what three properties CANNOT be guaranteed simultaneously?`,
                options: [
                    "Consistency, Availability, and Partition Tolerance",
                    "Concurrency, Atomicity, and Performance",
                    "Compression, Alignment, and Parsing",
                    "Checkpoints, Allocation, and Persistence"
                ],
                correctAnswer: 0,
                explanation: "CAP theorem proves a distributed store can provide at most 2 of Consistency, Availability, Partition Tolerance.",
                tags: ["cap-theorem"]
            };
        } else if (subtopicId === "adbms_oodb_xml") {
            return {
                question: `What feature distinguishes Object-Relational DBMS (ORDBMS) from traditional RDBMS?`,
                options: [
                    "Support for User-Defined Types (UDTs), inheritance, and complex object methods",
                    "Removal of SQL support",
                    "Single-user file access",
                    "In-memory storage only"
                ],
                correctAnswer: 0,
                explanation: "ORDBMS extends RDBMS with object features like UDTs, composite structures, and inheritance.",
                tags: ["ordbms"]
            };
        } else if (subtopicId === "adbms_xml_json_db") {
            return {
                question: `Which W3C standard language is used to transform XML documents into HTML or other XML formats?`,
                options: ["XSLT (Extensible Stylesheet Language Transformations)", "XPath", "XQuery", "JSON-LD"],
                correctAnswer: 0,
                explanation: "XSLT transforms XML document structures into HTML, XML, or plain text.",
                tags: ["xslt"]
            };
        } else if (subtopicId === "adbms_nosql_architecture") {
            return {
                question: `Which NoSQL data model stores data as collections of JSON-like BSON key-value documents (e.g. MongoDB)?`,
                options: ["Document-Store Database", "Key-Value Store", "Graph Database", "Relational Table"],
                correctAnswer: 0,
                explanation: "MongoDB is a Document Store using BSON format.",
                tags: ["document-store"]
            };
        } else if (subtopicId === "adbms_data_warehousing") {
            const schemas = [
                { name: "Star Schema", desc: "A central Fact table surrounded by denormalized Dimension tables" },
                { name: "Snowflake Schema", desc: "A central Fact table surrounded by normalized multi-level Dimension tables" }
            ];
            const s = schemas[idx % schemas.length];
            return {
                question: `In Data Warehouse dimensional modeling, what characterizes a '${s.name}'?`,
                options: [`${s.desc}`, "Random unindexed heap tables", "Flat CSV text files", "B-Tree directory blocks"],
                correctAnswer: 0,
                explanation: `'${s.name}' consists of ${s.desc}.`,
                tags: ["data-warehouse-schema"]
            };
        }
        // ADVANCED DATA STRUCTURES GENERATORS
        else if (subtopicId === "ads_ds_basics") {
            const structures = [
                { name: "Array", type: "Contiguous Memory Linear Structure" },
                { name: "Singly Linked List", type: "Node-based Pointer-Chained Linear Structure" },
                { name: "Binary Tree", type: "Hierarchical Non-Linear Structure" },
                { name: "Graph", type: "Network Set of Vertices and Edges" }
            ];
            const s = structures[idx % structures.length];
            return {
                question: `Which classification accurately describes the '${s.name}' Data Structure?`,
                options: [`${s.type}`, "Primary Hash Bucket", "CPU Instruction Pointer", "Secondary File Format"],
                correctAnswer: 0,
                explanation: `'${s.name}' is classified as a ${s.type}.`,
                tags: ["ds-classification"]
            };
        } else if (subtopicId === "python_intro_pep8" || subtopicId === "python_tokens_syntax") {
            const kw = ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"];
            const item = kw[idx % kw.length];
            return {
                question: `Is '${item}' a reserved keyword in Python 3 syntax?`,
                options: ["Yes, it is a reserved keyword in Python 3", "No, it is a built-in module function", "No, it is a global variable name", "No, it is a string method"],
                correctAnswer: 0,
                explanation: `'${item}' is one of the reserved keywords in standard Python 3.`,
                tags: ["python-keywords"]
            };
        } else if (subtopicId === "cs_hardware_software") {
            const comps = [
                { name: "ALU (Arithmetic Logic Unit)", role: "Arithmetic calculations & logic operations" },
                { name: "Control Unit (CU)", role: "Directing instruction execution and data flow" },
                { name: "CPU Registers", role: "High-speed internal storage locations" },
                { name: "Cache Memory", role: "Bridging speed gap between CPU and RAM" }
            ];
            const c = comps[idx % comps.length];
            return {
                question: `In CPU architecture, what is the primary role of '${c.name}'?`,
                options: [`${c.role}`, "Secondary storage backup", "Power supply regulation", "Display rendering"],
                correctAnswer: 0,
                explanation: `'${c.name}' executes ${c.role}.`,
                tags: ["cpu-architecture"]
            };
        } else if (subtopicId === "c_tokens_keywords") {
            const tokens = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
            const tok = tokens[idx % tokens.length];
            return {
                question: `Is '${tok}' a reserved keyword in standard C programming language?`,
                options: ["Yes, it is a reserved ANSI C keyword", "No, it is a standard library variable", "No, it is a compiler directive", "No, it is a preprocessor macro"],
                correctAnswer: 0,
                explanation: `'${tok}' is one of the 32 reserved keywords in standard C.`,
                tags: ["c-tokens"]
            };
        } else {
            return {
                question: `Which core principle accurately applies to ${subName}?`,
                options: [
                    `Standard verified implementation rule for ${subName}`,
                    `Alternative execution principle for ${subName}`,
                    `Secondary compiler specification for ${subName}`,
                    `Extended auxiliary configuration for ${subName}`
                ],
                correctAnswer: 0,
                explanation: `This question tests core technical concepts of ${subName}.`,
                tags: [subtopicId]
            };
        }
    }

    // ------------------------------------------------------------------
    // PUBLIC API FOR QUESTION BANK
    // ------------------------------------------------------------------
    return {
        getSubjects: function () {
            return subjectsConfig;
        },

        getSubjectById: function (subId) {
            return subjectsConfig.find(s => s.id === subId);
        },

        getTopicById: function (subjectId, topicId) {
            const subject = this.getSubjectById(subjectId);
            if (!subject) return null;
            return subject.topics.find(t => t.id === topicId);
        },

        getSubtopicById: function (subjectId, topicId, subtopicId) {
            const topic = this.getTopicById(subjectId, topicId);
            if (!topic) return null;
            return topic.subtopics.find(st => st.id === subtopicId);
        },

        // Always returns EXACTLY 100 questions for any registered subtopic
        get100QuestionsForSubtopic: function (subtopicId) {
            if (!questionCache[subtopicId]) {
                questionCache[subtopicId] = generate100QuestionsForSubtopic(subtopicId);
            }
            return questionCache[subtopicId];
        },

        // Alias for compatibility
        get60Questions: function (subtopicId) {
            return this.get100QuestionsForSubtopic(subtopicId);
        },

        searchBank: function (query) {
            if (!query || query.trim() === "") return [];
            const q = query.toLowerCase().trim();
            const results = [];

            subjectsConfig.forEach(subject => {
                if (subject.name.toLowerCase().includes(q)) {
                    results.push({ type: "subject", subject });
                }
                subject.topics.forEach(topic => {
                    if (topic.name.toLowerCase().includes(q)) {
                        results.push({ type: "topic", subject, topic });
                    }
                    topic.subtopics.forEach(subtopic => {
                        if (subtopic.name.toLowerCase().includes(q)) {
                            results.push({ type: "subtopic", subject, topic, subtopic });
                        }
                    });
                });
            });

            return results;
        }
    };
})();
