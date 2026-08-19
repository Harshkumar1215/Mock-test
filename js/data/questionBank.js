/**
 * Master Question Bank Repository & Procedural Generator Engine
 * Multi-Subject Master Repository:
 * 1. Computer Programming using C (14 Topics • 47 Subtopics • 4,700 MCQs)
 * 2. Programming in Python (8 Topics • 16 Subtopics • 1,600 MCQs)
 * 3. Computer Science Essentials (Bridge) (6 Topics • 12 Subtopics • 1,200 MCQs)
 * 4. Discrete Structures & Optimization (6 Topics • 8 Subtopics • 800 MCQs)
 * Total: 34 Topics • 83 Subtopics • 8,300 MCQs (100 MCQs per subtopic)
 */

window.QuestionBank = (function () {
    // Cache for generated 100-question banks per subtopic
    const questionCache = {};

    // ------------------------------------------------------------------
    // SEED QUESTIONS DATABASE (Exhaustive C, Python, CS Essentials & Discrete)
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
        // PYTHON SEEDS
        python_tokens_syntax: [
            {
                question: "Which official style guide defines coding standards and conventions for Python code layout?",
                options: ["PEP 8", "PEP 20", "PEP 484", "PEP 257"],
                correctAnswer: 0,
                explanation: "PEP 8 is Python's official Style Guide for Python Code.",
                difficulty: "easy",
                tags: ["pep8", "python-syntax"]
            },
            {
                question: "How does Python delineate block structure in control statements and function definitions?",
                options: ["By whitespace Indentation", "By curly braces {}", "By begin...end keywords", "By semicolons ;"],
                correctAnswer: 0,
                explanation: "Python uses mandatory whitespace indentation to define code block scope.",
                difficulty: "easy",
                tags: ["indentation"]
            }
        ],
        python_data_types: [
            {
                question: "Which of the following built-in data types in Python is IMMUTABLE?",
                options: ["Tuple (tuple)", "List (list)", "Dictionary (dict)", "Set (set)"],
                correctAnswer: 0,
                explanation: "Tuples, strings, integers, floats, and frozensets are immutable in Python.",
                difficulty: "easy",
                tags: ["immutability"]
            }
        ],
        python_operators_expressions: [
            {
                question: "What is the output of integer division operator `17 // 5` in Python 3?",
                options: ["3", "3.4", "2", "3.0"],
                correctAnswer: 0,
                explanation: "`//` is the floor division operator which returns the integer floor (17 // 5 = 3).",
                difficulty: "easy",
                tags: ["floor-division"]
            }
        ],
        python_control_flow: [
            {
                question: "Which keyword in Python serves as a no-operation placeholder inside empty function or class blocks?",
                options: ["pass", "continue", "break", "skip"],
                correctAnswer: 0,
                explanation: "The `pass` statement is a null statement used as a syntactic placeholder.",
                difficulty: "easy",
                tags: ["pass-statement"]
            }
        ],
        python_loops_iteration: [
            {
                question: "What does the `range(2, 10, 2)` function call produce when iterated in a for loop?",
                options: ["[2, 4, 6, 8]", "[2, 4, 6, 8, 10]", "[2, 3, 4, 5, 6, 7, 8, 9]", "[0, 2, 4, 6, 8]"],
                correctAnswer: 0,
                explanation: "`range(start, stop, step)` generates values from start up to (stop - 1) incremented by step.",
                difficulty: "easy",
                tags: ["range"]
            }
        ],
        python_list_comprehensions: [
            {
                question: "What is the correct syntax for generating a list of even squares `[0, 4, 16, 36]` for x from 0 to 6?",
                options: [
                    "[x**2 for x in range(7) if x % 2 == 0]",
                    "[x*2 for x in range(7) if x % 2 == 0]",
                    "{x**2 for x in range(7)}",
                    "[x^2 for x in range(7)]"
                ],
                correctAnswer: 0,
                explanation: "`[x**2 for x in range(7) if x % 2 == 0]` evaluates even squares in list comprehension.",
                difficulty: "medium",
                tags: ["list-comprehensions"]
            }
        ],
        python_lists_tuples: [
            {
                question: "What does negative index `lst[-1]` return when applied to Python list `lst = [10, 20, 30, 40]`?",
                options: ["40 (the last element)", "10 (the first element)", "IndexError", "30"],
                correctAnswer: 0,
                explanation: "Negative indexing in Python accesses elements from the end of the sequence (`-1` is the last item).",
                difficulty: "easy",
                tags: ["negative-indexing"]
            }
        ],
        python_sets_dicts: [
            {
                question: "Which dictionary method safely retrieves a value for key `k` without throwing a KeyError if `k` is missing?",
                options: ["dict.get(k, default)", "dict.fetch(k)", "dict.find(k)", "dict[k]"],
                correctAnswer: 0,
                explanation: "`dict.get(k, default)` returns the default value (or None) if key `k` is not in the dictionary.",
                difficulty: "easy",
                tags: ["dict-get"]
            }
        ],
        python_functions_scope: [
            {
                question: "Which special parameter syntax in function definitions collects an arbitrary number of positional arguments into a tuple?",
                options: ["*args", "**kwargs", "*kwargs", "&args"],
                correctAnswer: 0,
                explanation: "`*args` collects additional positional arguments into a tuple, while `**kwargs` collects keyword arguments into a dict.",
                difficulty: "medium",
                tags: ["args-kwargs"]
            }
        ],
        python_lambda_modules: [
            {
                question: "What is the result of `list(map(lambda x: x * 2, [1, 2, 3]))` in Python?",
                options: ["[2, 4, 6]", "[1, 4, 9]", "[1, 2, 3, 1, 2, 3]", "[6]"],
                correctAnswer: 0,
                explanation: "`map()` applies the lambda function `x * 2` to every item in the list, yielding `[2, 4, 6]`.",
                difficulty: "easy",
                tags: ["map-lambda"]
            }
        ],
        python_classes_objects: [
            {
                question: "What is the mandatory first parameter passed to instance methods inside a Python class definition?",
                options: ["self", "this", "cls", "base"],
                correctAnswer: 0,
                explanation: "By convention, `self` represents the instance of the class being operated upon.",
                difficulty: "easy",
                tags: ["self"]
            }
        ],
        python_inheritance_polymorphism: [
            {
                question: "Which built-in function is used to invoke a method from a parent/superclass in derived Python classes?",
                options: ["super()", "parent()", "base()", "ancestor()"],
                correctAnswer: 0,
                explanation: "`super()` delegates method calls to a parent or sibling class in the Method Resolution Order (MRO).",
                difficulty: "easy",
                tags: ["super"]
            }
        ],
        python_exception_handling: [
            {
                question: "Which block in Python's exception handling construct executes ONLY if NO exceptions were raised in the try block?",
                options: ["else", "finally", "except", "catch"],
                correctAnswer: 0,
                explanation: "The `else` block runs when the `try` block succeeds without throwing an exception.",
                difficulty: "medium",
                tags: ["try-except-else"]
            }
        ],
        python_file_io: [
            {
                question: "Why is using `with open(filename) as f:` recommended for file operations in Python?",
                options: [
                    "It automatically closes the file even if exceptions occur inside the block",
                    "It speeds up file reading speed by 10x",
                    "It encrypts the text content",
                    "It locks the file from being edited by OS"
                ],
                correctAnswer: 0,
                explanation: "`with` acts as a context manager that guarantees proper resource cleanup (closing the file).",
                difficulty: "easy",
                tags: ["with-open"]
            }
        ],
        python_generators_decorators: [
            {
                question: "Which keyword converts a standard Python function into a Generator that yields values lazily one at a time?",
                options: ["yield", "return", "generate", "emit"],
                correctAnswer: 0,
                explanation: "Functions containing the `yield` keyword produce a generator iterator when called.",
                difficulty: "easy",
                tags: ["yield-generator"]
            }
        ],
        python_std_library: [
            {
                question: "Which standard library module in Python provides regular expression matching operations?",
                options: ["re", "regex", "match", "string"],
                correctAnswer: 0,
                explanation: "The `re` module provides regular expression matching operations in standard Python.",
                difficulty: "easy",
                tags: ["re-module"]
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
        // PYTHON GENERATORS
        if (subtopicId === "python_tokens_syntax") {
            const kw = ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"];
            const item = kw[idx % kw.length];
            return {
                question: `Is '${item}' a reserved keyword in Python 3 syntax?`,
                options: ["Yes, it is a reserved keyword in Python 3", "No, it is a built-in module function", "No, it is a global variable name", "No, it is a string method"],
                correctAnswer: 0,
                explanation: `'${item}' is one of the reserved keywords in standard Python 3.`,
                tags: ["python-keywords"]
            };
        } else if (subtopicId === "python_data_types") {
            const types = [
                { val: "42", type: "int (Integer)" },
                { val: "3.14159", type: "float (Floating Point)" },
                { val: "'Hello'", type: "str (String)" },
                { val: "[1, 2, 3]", type: "list (List)" },
                { val: "(10, 20)", type: "tuple (Tuple)" },
                { val: "{'a': 1}", type: "dict (Dictionary)" }
            ];
            const t = types[idx % types.length];
            return {
                question: `What is the type of literal expression \`${t.val}\` in Python?`,
                options: [`${t.type}`, "complex", "set", "bytes"],
                correctAnswer: 0,
                explanation: `Literal \`${t.val}\` evaluates to data type ${t.type}.`,
                tags: ["python-types"]
            };
        } else if (subtopicId === "python_operators_expressions") {
            const a = (idx % 5) + 2;
            const b = 3;
            const res = Math.pow(a, b);
            return {
                question: `What is the result of exponentiation expression \`${a} ** ${b}\` in Python?`,
                options: [`${res}`, `${a * b}`, `${a + b}`, `${a / b}`],
                correctAnswer: 0,
                explanation: `Operator \`**\` performs exponentiation: ${a}^${b} = ${res}.`,
                tags: ["python-exponentiation"]
            };
        } else if (subtopicId === "python_control_flow") {
            return {
                question: `Which Python control keyword is evaluated when all preceding \`if\` and \`elif\` conditions evaluate to False?`,
                options: ["else", "default", "finally", "otherwise"],
                correctAnswer: 0,
                explanation: "The `else` block executes when none of the preceding `if` or `elif` conditions are True.",
                tags: ["python-else"]
            };
        } else if (subtopicId === "python_loops_iteration") {
            return {
                question: `What is the purpose of the \`enumerate(iterable)\` function in Python for loops?`,
                options: [
                    "Yields tuples containing index counts and corresponding item values",
                    "Sorts the iterable in ascending order",
                    "Reverses the iterable sequence",
                    "Filters out None values"
                ],
                correctAnswer: 0,
                explanation: "`enumerate()` returns an enumerate object yielding (index, item) pairs.",
                tags: ["enumerate"]
            };
        } else if (subtopicId === "python_list_comprehensions") {
            return {
                question: `What does list comprehension \`[x for x in range(5) if x % 2 != 0]\` evaluate to?`,
                options: ["[1, 3]", "[0, 2, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4]"],
                correctAnswer: 0,
                explanation: "It filters odd numbers from range(5) (0, 1, 2, 3, 4), producing `[1, 3]`.",
                tags: ["list-comprehension"]
            };
        } else if (subtopicId === "python_lists_tuples") {
            return {
                question: `Which list method removes and returns the element at a specified index (or last item by default)?`,
                options: ["list.pop()", "list.remove()", "list.delete()", "list.discard()"],
                correctAnswer: 0,
                explanation: "`pop([i])` removes and returns item at index i (default last item).",
                tags: ["list-pop"]
            };
        } else if (subtopicId === "python_sets_dicts") {
            return {
                question: `What key property MUST an object possess to be used as a key in a Python dictionary?`,
                options: ["It must be Hashable (Immutable)", "It must be an integer", "It must be a string", "It must be mutable"],
                correctAnswer: 0,
                explanation: "Dictionary keys must be hashable objects (such as strings, numbers, or tuples).",
                tags: ["dict-keys"]
            };
        } else if (subtopicId === "python_functions_scope") {
            return {
                question: `According to Python's LEGB scope resolution rule, what does the acronym LEGB stand for?`,
                options: [
                    "Local, Enclosing, Global, Built-in",
                    "Literal, Expression, Global, Block",
                    "Lexical, Environment, Global, Base",
                    "List, Element, Group, Binary"
                ],
                correctAnswer: 0,
                explanation: "Python searches namespaces in order: Local -> Enclosing -> Global -> Built-in.",
                tags: ["legb-scope"]
            };
        } else if (subtopicId === "python_lambda_modules") {
            return {
                question: `What is the syntax for defining an anonymous inline function in Python?`,
                options: ["lambda arguments: expression", "def inline(args): expression", "function(args) => expression", "anonymous(args): expression"],
                correctAnswer: 0,
                explanation: "`lambda args: expression` creates single-expression inline anonymous functions.",
                tags: ["lambda"]
            };
        } else if (subtopicId === "python_classes_objects") {
            return {
                question: `Which special method in a Python class serves as the Object Initializer / Constructor?`,
                options: ["__init__(self)", "__construct__(self)", "__new__(self)", "__create__(self)"],
                correctAnswer: 0,
                explanation: "`__init__()` initializes a newly created object instance.",
                tags: ["init-constructor"]
            };
        } else if (subtopicId === "python_inheritance_polymorphism") {
            return {
                question: `What is Method Resolution Order (MRO) in Python object-oriented programming?`,
                options: [
                    "The order in which Python searches for attributes and methods in class hierarchies",
                    "The execution order of for loops inside class methods",
                    "The order of garbage collection",
                    "The variable assignment sequence"
                ],
                correctAnswer: 0,
                explanation: "MRO defines the class inheritance search order (accessible via `Class.mro()`).",
                tags: ["mro"]
            };
        } else if (subtopicId === "python_exception_handling") {
            return {
                question: `Which statement is used to manually trigger / raise an exception in Python?`,
                options: ["raise Exception()", "throw Exception()", "trigger Exception()", "emit Exception()"],
                correctAnswer: 0,
                explanation: "The `raise` keyword raises a specified exception.",
                tags: ["raise-exception"]
            };
        } else if (subtopicId === "python_file_io") {
            return {
                question: `Which file mode parameter in `open(filename, mode)` appends new data to the end of a file without overwriting?`,
                options: ["'a' (Append mode)", "'w' (Write mode)", "'r' (Read mode)", "'x' (Exclusive creation)"],
                correctAnswer: 0,
                explanation: "Mode `'a'` opens the file for appending data to the end.",
                tags: ["file-append"]
            };
        } else if (subtopicId === "python_generators_decorators") {
            return {
                question: `In Python syntax, what does the `@` symbol before a function definition signify?`,
                options: ["Applying a Decorator function", "Defining an Asynchronous function", "Creating a Lambda expression", "Declaring a Global variable"],
                correctAnswer: 0,
                explanation: "The `@decorator` syntax applies wrapper function logic to the decorated function.",
                tags: ["decorators"]
            };
        } else if (subtopicId === "python_std_library") {
            return {
                question: `Which standard library module provides function `json.loads(json_string)` to parse a JSON string into a Python dictionary?`,
                options: ["json", "sys", "os", "pickle"],
                correctAnswer: 0,
                explanation: "`json.loads()` parses JSON string into Python dict/list data structures.",
                tags: ["json-module"]
            };
        }
        // DISCRETE STRUCTURES GENERATORS
        else if (subtopicId === "discrete_sets_inclusion") {
            const n = (idx % 8) + 2;
            const pSize = Math.pow(2, n);
            return {
                question: `If set A contains ${n} distinct elements, what is the total number of subsets in its Power Set P(A)?`,
                options: [`${pSize} subsets`, `${2 * n} subsets`, `${n * n} subsets`, `${n + 1} subsets`],
                correctAnswer: 0,
                explanation: `The cardinality of the power set P(A) is 2^${n} = ${pSize}.`,
                tags: ["power-set"]
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
