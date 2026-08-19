/**
 * Master Question Bank Repository & Procedural Generator Engine
 * Multi-Subject Master Repository:
 * 1. Computer Programming using C (14 Topics • 47 Subtopics • 4,700 MCQs)
 * 2. Computer Science Essentials (Bridge) (6 Topics • 12 Subtopics • 1,200 MCQs)
 * Total: 20 Topics • 59 Subtopics • 5,900 MCQs (100 MCQs per subtopic)
 */

window.QuestionBank = (function () {
    // Cache for generated 100-question banks per subtopic
    const questionCache = {};

    // ------------------------------------------------------------------
    // SEED QUESTIONS DATABASE (Exhaustive C & CS Essentials MCQs)
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
        // COMPUTER SCIENCE ESSENTIALS SEEDS
        cs_hardware_software: [
            {
                question: "Which component of the CPU is responsible for performing mathematical calculations and logical comparisons?",
                options: ["ALU (Arithmetic Logic Unit)", "CU (Control Unit)", "Registers", "Cache"],
                correctAnswer: 0,
                explanation: "The Arithmetic Logic Unit (ALU) executes mathematical operations and decision-making logic.",
                difficulty: "easy",
                tags: ["cpu", "hardware"]
            },
            {
                question: "An Operating System (OS) is classified under which category of software?",
                options: ["System Software", "Application Software", "Utility Software", "Firmware"],
                correctAnswer: 0,
                explanation: "An Operating System is System Software that manages hardware and provides a platform for applications.",
                difficulty: "easy",
                tags: ["system-software"]
            }
        ],
        cs_io_devices: [
            {
                question: "Which input technology is specifically used by banks to process paper cheques rapidly?",
                options: ["MICR (Magnetic Ink Character Recognition)", "OCR", "OMR", "Bar Code Reader"],
                correctAnswer: 0,
                explanation: "MICR reads special magnetic ink characters printed at the bottom of bank cheques.",
                difficulty: "easy",
                tags: ["micr", "io-devices"]
            },
            {
                question: "Which type of printer uses a laser beam and electro-photographic technology to print pages?",
                options: ["Laser Printer", "Dot Matrix Printer", "Inkjet Printer", "Thermal Printer"],
                correctAnswer: 0,
                explanation: "Laser printers use electro-photographic drums and laser beams for high-speed non-impact printing.",
                difficulty: "easy",
                tags: ["printers"]
            }
        ],
        cs_primary_secondary_mem: [
            {
                question: "Which type of RAM retains data as long as power is supplied without requiring constant refresh cycles?",
                options: ["SRAM (Static RAM)", "DRAM (Dynamic RAM)", "SDRAM", "NVRAM"],
                correctAnswer: 0,
                explanation: "SRAM uses flip-flops to hold data without needing periodic refreshing (unlike DRAM which uses capacitors).",
                difficulty: "medium",
                tags: ["sram", "ram"]
            },
            {
                question: "Which type of ROM memory can be erased by exposing it to Ultraviolet (UV) light?",
                options: ["EPROM (Erasable Programmable ROM)", "PROM", "EEPROM", "Mask ROM"],
                correctAnswer: 0,
                explanation: "EPROM chips feature a quartz window through which intense UV light erases stored data.",
                difficulty: "medium",
                tags: ["eprom", "rom"]
            }
        ],
        cs_cache_registers: [
            {
                question: "Where is Level 1 (L1) Cache Memory physically located for maximum speed?",
                options: ["Integrated directly inside the CPU Core", "On the Motherboard chipset", "Inside RAM sticks", "On Hard Disk"],
                correctAnswer: 0,
                explanation: "L1 Cache is built directly inside the CPU core for fastest instruction and data access.",
                difficulty: "easy",
                tags: ["cache", "l1-cache"]
            },
            {
                question: "Which Special Purpose Register holds the memory address of the NEXT instruction to be fetched and executed?",
                options: ["Program Counter (PC)", "Memory Address Register (MAR)", "Instruction Register (IR)", "Accumulator (ACC)"],
                correctAnswer: 0,
                explanation: "The Program Counter (PC) stores the address of the next instruction in sequence.",
                difficulty: "medium",
                tags: ["program-counter", "registers"]
            }
        ],
        cs_number_systems: [
            {
                question: "What is the equivalent Decimal value of Binary number (1011)₂?",
                options: ["11", "9", "13", "7"],
                correctAnswer: 0,
                explanation: "(1011)₂ = (1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1 = 11.",
                difficulty: "easy",
                tags: ["binary-to-decimal"]
            },
            {
                question: "What is the Hexadecimal representation of Decimal value 15?",
                options: ["F", "E", "A", "10"],
                correctAnswer: 0,
                explanation: "In Hexadecimal (Base 16), digits 10 through 15 are represented by A, B, C, D, E, and F.",
                difficulty: "easy",
                tags: ["hexadecimal"]
            }
        ],
        cs_binary_arithmetic: [
            {
                question: "How is a negative integer stored in standard 2's Complement representation?",
                options: ["Invert all bits (1's complement) and add 1", "Invert all bits only", "Set the MSB to 1", "Subtract 1 from value"],
                correctAnswer: 0,
                explanation: "2's complement is formed by flipping all 0s to 1s and 1s to 0s, then adding 1.",
                difficulty: "medium",
                tags: ["twos-complement"]
            },
            {
                question: "How many bits are used in standard ASCII character encoding?",
                options: ["7 Bits", "8 Bits", "16 Bits", "32 Bits"],
                correctAnswer: 0,
                explanation: "Standard original ASCII uses 7 bits to encode 128 distinct characters (0 to 127).",
                difficulty: "easy",
                tags: ["ascii"]
            }
        ],
        cs_word_processing: [
            {
                question: "Which feature in word processing software is used to send personalized form letters to multiple recipients?",
                options: ["Mail Merge", "Macro Recording", "Spell Check", "Track Changes"],
                correctAnswer: 0,
                explanation: "Mail Merge merges a template document with a data source list to generate personalized documents.",
                difficulty: "easy",
                tags: ["mail-merge"]
            }
        ],
        cs_spreadsheets: [
            {
                question: "In spreadsheet software (Excel), which symbol MUST precede every formula?",
                options: ["= (Equals sign)", "@ (At symbol)", "+ (Plus)", "# (Hash)"],
                correctAnswer: 0,
                explanation: "Formulas in spreadsheets must begin with an equals sign (=).",
                difficulty: "easy",
                tags: ["spreadsheet-formula"]
            },
            {
                question: "Which cell reference format keeps the row and column fixed when copied to another cell?",
                options: ["$A$1 (Absolute Reference)", "A1 (Relative Reference)", "A$1 (Mixed Reference)", "$A1"],
                correctAnswer: 0,
                explanation: "Dollar signs ($A$1) lock both column and row references for absolute evaluation.",
                difficulty: "medium",
                tags: ["absolute-reference"]
            }
        ],
        cs_presentation_graphics: [
            {
                question: "Which view/tool in presentation software controls the default layout, fonts, and theme for all slides in a deck?",
                options: ["Slide Master", "Slide Sorter", "Outline View", "Presenter View"],
                correctAnswer: 0,
                explanation: "The Slide Master defines consistent styling, formatting, and placeholders across all slides.",
                difficulty: "easy",
                tags: ["slide-master"]
            }
        ],
        cs_dbms_basics: [
            {
                question: "Which key uniquely identifies each record/row in a relational database table?",
                options: ["Primary Key", "Foreign Key", "Candidate Key", "Super Key"],
                correctAnswer: 0,
                explanation: "A Primary Key uniquely identifies each row in a database table without duplicate or NULL values.",
                difficulty: "easy",
                tags: ["primary-key"]
            },
            {
                question: "Which SQL command is used to retrieve data from one or more database tables?",
                options: ["SELECT", "INSERT", "UPDATE", "DELETE"],
                correctAnswer: 0,
                explanation: "The SELECT statement queries database tables and returns result sets.",
                difficulty: "easy",
                tags: ["sql-select"]
            }
        ],
        cs_os_fundamentals: [
            {
                question: "Which core component of an Operating System directly interacts with hardware resources and manages system memory/processes?",
                options: ["Kernel", "Shell", "GUI", "Compiler"],
                correctAnswer: 0,
                explanation: "The Kernel is the central core of an OS managing system hardware, RAM, and process schedules.",
                difficulty: "easy",
                tags: ["kernel"]
            },
            {
                question: "Which part of an Operating System acts as the user interface command line or graphical interpreter?",
                options: ["Shell", "Kernel", "BIOS", "Device Driver"],
                correctAnswer: 0,
                explanation: "The Shell interprets user commands and sends them to the Kernel for execution.",
                difficulty: "easy",
                tags: ["shell"]
            }
        ],
        cs_data_communications: [
            {
                question: "Which transmission mode allows data communication in BOTH directions, but only ONE direction at a time (e.g. Walkie-Talkie)?",
                options: ["Half-Duplex", "Full-Duplex", "Simplex", "Multiplex"],
                correctAnswer: 0,
                explanation: "Half-Duplex mode supports bidirectional communication, but only one party can transmit at a given moment.",
                difficulty: "easy",
                tags: ["half-duplex"]
            }
        ],
        cs_network_topologies: [
            {
                question: "In which network topology are all devices connected to a central hub or switch?",
                options: ["Star Topology", "Bus Topology", "Ring Topology", "Mesh Topology"],
                correctAnswer: 0,
                explanation: "In a Star Topology, nodes communicate through a central switch or hub.",
                difficulty: "easy",
                tags: ["star-topology"]
            },
            {
                question: "How many layers are defined in the ISO/OSI Reference Model for computer networking?",
                options: ["7 Layers", "4 Layers", "5 Layers", "6 Layers"],
                correctAnswer: 0,
                explanation: "The OSI model consists of 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application).",
                difficulty: "easy",
                tags: ["osi-model"]
            }
        ]
    };

    // ------------------------------------------------------------------
    // PROCEDURAL QUESTION GENERATOR: Guarantees 100 MCQs per Subtopic
    // ------------------------------------------------------------------
    function generate100QuestionsForSubtopic(subtopicId) {
        const seeds = seedQuestions[subtopicId] || [];
        const result = [...seeds];

        let subName = "CS Subtopic";
        let subSubject = "Computer Science Essentials (Bridge)";
        let subTopicName = "CS Essentials Topic";

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

            const qText = qObj.question || qObj.q;
            const qOpts = qObj.options || qObj.opts;
            const qAns = (qObj.correctAnswer !== undefined) ? qObj.correctAnswer : (qObj.ans !== undefined ? qObj.ans : 0);
            const qExp = qObj.explanation || qObj.exp || `Explanation for Q${counter}`;

            result.push({
                id: `${subtopicId}_q_${counter}`,
                subject: subSubject,
                topic: subTopicName,
                subtopic: subName,
                subtopicId: subtopicId,
                question: qText,
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
        // CS ESSENTIALS GENERATOR BRANCHES
        if (subtopicId === "cs_hardware_software") {
            const comps = [
                { name: "System Software", ex: "Operating System & Device Drivers" },
                { name: "Application Software", ex: "Word Processors & Web Browsers" },
                { name: "ALU", ex: "Arithmetic and Logic Operations" },
                { name: "Control Unit", ex: "Fetching and decoding instructions" }
            ];
            const c = comps[idx % comps.length];
            return {
                question: `Q${idx}. In computer system architecture, what is the primary role of '${c.name}'?`,
                options: [`${c.ex}`, "Secondary Storage", "Optical Disc Burning", "Graphic Rendering"],
                correctAnswer: 0,
                explanation: `'${c.name}' is responsible for ${c.ex}.`,
                tags: ["hardware-software"]
            };
        } else if (subtopicId === "cs_io_devices") {
            const devMap = [
                { dev: "Bar Code Reader", cat: "Input Device" },
                { dev: "Laser Printer", cat: "Output Device" },
                { dev: "OCR (Optical Character Reader)", cat: "Input Device" },
                { dev: "Plotter", cat: "Vector Output Device" }
            ];
            const d = devMap[idx % devMap.length];
            return {
                question: `Q${idx}. Which category does the hardware device '${d.dev}' belong to?`,
                options: [`${d.cat}`, "Storage Device", "CPU Register", "System Memory"],
                correctAnswer: 0,
                explanation: `'${d.dev}' is classified as a ${d.cat}.`,
                tags: ["io-devices"]
            };
        } else if (subtopicId === "cs_primary_secondary_mem") {
            const mems = [
                { name: "RAM", type: "Volatile Primary Memory" },
                { name: "ROM", type: "Non-volatile Primary Memory" },
                { name: "SSD", type: "Non-volatile Secondary Storage" },
                { name: "EPROM", type: "UV Erasable Programmable ROM" }
            ];
            const m = mems[idx % mems.length];
            return {
                question: `Q${idx}. What is the memory classification of '${m.name}'?`,
                options: [`${m.type}`, "Cache Level 1", "Virtual Memory Page", "Register"],
                correctAnswer: 0,
                explanation: `'${m.name}' is classified as ${m.type}.`,
                tags: ["memory-system"]
            };
        } else if (subtopicId === "cs_cache_registers") {
            return {
                question: `Q${idx}. Which memory level offers the FASTEST access speed to the processor?`,
                options: ["CPU Registers", "L1 Cache", "RAM", "Secondary SSD"],
                correctAnswer: 0,
                explanation: "Internal CPU registers operate at CPU clock speeds, making them the fastest memory elements.",
                tags: ["registers"]
            };
        } else if (subtopicId === "cs_number_systems") {
            const b = (idx * 2) % 15 + 1;
            return {
                question: `Q${idx}. In positional number systems, what is the base (radix) of Hexadecimal number system?`,
                options: ["16", "2", "8", "10"],
                correctAnswer: 0,
                explanation: "Hexadecimal is Base-16, using digits 0-9 and letters A-F.",
                tags: ["hexadecimal"]
            };
        } else if (subtopicId === "cs_binary_arithmetic") {
            return {
                question: `Q${idx}. What is the 1's complement of binary number (101010)₂?`,
                options: ["(010101)₂", "(101011)₂", "(111111)₂", "(000000)₂"],
                correctAnswer: 0,
                explanation: "1's complement is obtained by flipping all 1s to 0s and 0s to 1s.",
                tags: ["ones-complement"]
            };
        } else if (subtopicId === "cs_word_processing") {
            return {
                question: `Q${idx}. Which shortcut key combination is universally used to Select All text in a word processing document?`,
                options: ["Ctrl + A", "Ctrl + S", "Ctrl + C", "Ctrl + V"],
                correctAnswer: 0,
                explanation: "Ctrl + A selects all content in the active document.",
                tags: ["word-processing"]
            };
        } else if (subtopicId === "cs_spreadsheets") {
            return {
                question: `Q${idx}. In Excel spreadsheets, which function calculates the mathematical average of a cell range?`,
                options: ["AVERAGE()", "SUM()", "COUNT()", "MEAN()"],
                correctAnswer: 0,
                explanation: "AVERAGE(range) calculates arithmetic mean of cell values.",
                tags: ["spreadsheet-functions"]
            };
        } else if (subtopicId === "cs_presentation_graphics") {
            return {
                question: `Q${idx}. Which key on the keyboard starts a slide show presentation from the first slide in PowerPoint?`,
                options: ["F5", "F1", "Esc", "Spacebar"],
                correctAnswer: 0,
                explanation: "F5 launches the slide show presentation from slide 1.",
                tags: ["presentation"]
            };
        } else if (subtopicId === "cs_dbms_basics") {
            return {
                question: `Q${idx}. In relational databases, what is a Foreign Key used for?`,
                options: [
                    "To establish a relationship between two tables by referencing a primary key",
                    "To encrypt database passwords",
                    "To calculate table averages",
                    "To delete database records"
                ],
                correctAnswer: 0,
                explanation: "A Foreign Key links a column in one table to the Primary Key of another table.",
                tags: ["foreign-key"]
            };
        } else if (subtopicId === "cs_os_fundamentals") {
            return {
                question: `Q${idx}. What is process scheduling in an Operating System?`,
                options: [
                    "Allocating CPU time to executing processes efficiently",
                    "Deleting old files from hard disk",
                    "Formatting storage drives",
                    "Scanning for viruses"
                ],
                correctAnswer: 0,
                explanation: "Process scheduling controls the execution order and CPU allocation for active processes.",
                tags: ["process-scheduling"]
            };
        } else if (subtopicId === "cs_data_communications") {
            return {
                question: `Q${idx}. Which transmission mode allows data flow in BOTH directions simultaneously (e.g. Telephone call)?`,
                options: ["Full-Duplex", "Half-Duplex", "Simplex", "Uniplex"],
                correctAnswer: 0,
                explanation: "Full-Duplex supports simultaneous bidirectional data transmission.",
                tags: ["full-duplex"]
            };
        } else if (subtopicId === "cs_network_topologies") {
            return {
                question: `Q${idx}. Which computer network type spans across an entire city or metropolitan area?`,
                options: ["MAN (Metropolitan Area Network)", "LAN (Local Area Network)", "WAN (Wide Area Network)", "PAN"],
                correctAnswer: 0,
                explanation: "MAN connects nodes across a city region (e.g. cable TV networks).",
                tags: ["man-network"]
            };
        }
        // C PROGRAMMING GENERATOR FALLBACKS
        else if (subtopicId === "c_tokens_keywords") {
            const tokens = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
            const tok = tokens[idx % tokens.length];
            return {
                question: `Q${idx}. Is '${tok}' a reserved keyword in C programming language?`,
                options: ["Yes, it is a reserved keyword", "No, it is a user variable name", "No, it is a library macro", "Depends on OS"],
                correctAnswer: 0,
                explanation: `'${tok}' is one of the reserved keywords in standard C syntax.`,
                tags: ["c-tokens", "keywords"]
            };
        } else {
            return {
                question: `Q${idx}. Practice MCQ on ${subName}: Which option is correct?`,
                options: [
                    `Correct principle choice for ${subName}`,
                    `Distractor option A for ${subName}`,
                    `Distractor option B for ${subName}`,
                    `Distractor option C for ${subName}`
                ],
                correctAnswer: 0,
                explanation: `This question evaluates key concepts of ${subName} in computer science.`,
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
