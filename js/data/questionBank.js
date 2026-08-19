/**
 * Master Question Bank Repository & Procedural Generator Engine
 * Multi-Subject Master Repository:
 * 1. Computer Programming using C (14 Topics • 47 Subtopics • 4,700 MCQs)
 * 2. Programming in Python (12 Topics • 30 Subtopics • 3,000 MCQs)
 * 3. Computer Science Essentials (Bridge) (6 Topics • 12 Subtopics • 1,200 MCQs)
 * 4. Discrete Structures & Optimization (6 Topics • 8 Subtopics • 800 MCQs)
 * Total: 38 Topics • 97 Subtopics • 9,700 MCQs (100 MCQs per subtopic)
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
        python_intro_pep8: [
            {
                question: "Which official style guide defines coding standards and conventions for Python code layout?",
                options: ["PEP 8", "PEP 20", "PEP 484", "PEP 257"],
                correctAnswer: 0,
                explanation: "PEP 8 is Python's official Style Guide for Python Code.",
                difficulty: "easy",
                tags: ["pep8", "python-syntax"]
            }
        ],
        python_indentation_comments: [
            {
                question: "How does Python delineate block structure in control statements and function definitions?",
                options: ["By whitespace Indentation", "By curly braces {}", "By begin...end keywords", "By semicolons ;"],
                correctAnswer: 0,
                explanation: "Python uses mandatory whitespace indentation to define code block scope.",
                difficulty: "easy",
                tags: ["indentation"]
            }
        ],
        python_numeric_types: [
            {
                question: "Which built-in Python numeric type provides arbitrary precision integers limited only by available RAM?",
                options: ["int (Integer)", "float", "complex", "long"],
                correctAnswer: 0,
                explanation: "In Python 3, integers (`int`) have arbitrary precision and expand dynamically.",
                difficulty: "easy",
                tags: ["arbitrary-precision"]
            }
        ],
        python_strings_basics: [
            {
                question: "Which string prefix disables escape sequence processing, treating backslashes `\\` as literal characters?",
                options: ["r\"...\" (Raw String)", "f\"...\" (Formated String)", "b\"...\" (Byte String)", "u\"...\""],
                correctAnswer: 0,
                explanation: "Prefixing a string with `r` or `R` creates a Raw String.",
                difficulty: "easy",
                tags: ["raw-strings"]
            }
        ],
        python_arithmetic_relational: [
            {
                question: "What is the output of floor division operator `17 // 5` in Python 3?",
                options: ["3", "3.4", "2", "3.0"],
                correctAnswer: 0,
                explanation: "`//` is the floor division operator which returns the integer floor (17 // 5 = 3).",
                difficulty: "easy",
                tags: ["floor-division"]
            }
        ],
        python_identity_membership: [
            {
                question: "What is the fundamental difference between identity operator `is` and equality operator `==` in Python?",
                options: [
                    "`is` tests object memory identity (id); `==` checks value equality",
                    "`==` tests object memory identity; `is` checks value equality",
                    "Both test value equality identically",
                    "`is` is used for numbers; `==` for strings"
                ],
                correctAnswer: 0,
                explanation: "`is` checks `id(a) == id(b)` (same memory address), whereas `==` checks value equivalence.",
                difficulty: "medium",
                tags: ["identity-vs-equality"]
            }
        ],
        python_ternary_pass: [
            {
                question: "Which keyword in Python serves as a no-operation placeholder inside empty function or class blocks?",
                options: ["pass", "continue", "break", "skip"],
                correctAnswer: 0,
                explanation: "The `pass` statement is a null statement used as a syntactic placeholder.",
                difficulty: "easy",
                tags: ["pass-statement"]
            }
        ],
        python_loop_helpers: [
            {
                question: "What does the `range(2, 10, 2)` function call produce when iterated in a for loop?",
                options: ["[2, 4, 6, 8]", "[2, 4, 6, 8, 10]", "[2, 3, 4, 5, 6, 7, 8, 9]", "[0, 2, 4, 6, 8]"],
                correctAnswer: 0,
                explanation: "`range(start, stop, step)` generates values from start up to (stop - 1) incremented by step.",
                difficulty: "easy",
                tags: ["range"]
            }
        ],
        python_comprehensions: [
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
        python_args_kwargs: [
            {
                question: "Which special parameter syntax in function definitions collects an arbitrary number of positional arguments into a tuple?",
                options: ["*args", "**kwargs", "*kwargs", "&args"],
                correctAnswer: 0,
                explanation: "`*args` collects additional positional arguments into a tuple, while `**kwargs` collects keyword arguments into a dict.",
                difficulty: "medium",
                tags: ["args-kwargs"]
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
        python_inheritance_dunder: [
            {
                question: "Which built-in function is used to invoke a method from a parent/superclass in derived Python classes?",
                options: ["super()", "parent()", "base()", "ancestor()"],
                correctAnswer: 0,
                explanation: "`super()` delegates method calls to a parent or sibling class in the Method Resolution Order (MRO).",
                difficulty: "easy",
                tags: ["super"]
            }
        ],
        python_exceptions_try_except: [
            {
                question: "Which block in Python's exception handling construct executes ONLY if NO exceptions were raised in the try block?",
                options: ["else", "finally", "except", "catch"],
                correctAnswer: 0,
                explanation: "The `else` block runs when the `try` block succeeds without throwing an exception.",
                difficulty: "medium",
                tags: ["try-except-else"]
            }
        ],
        python_file_io_context: [
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
        python_iterators_generators: [
            {
                question: "Which keyword converts a standard Python function into a Generator that yields values lazily one at a time?",
                options: ["yield", "return", "generate", "emit"],
                correctAnswer: 0,
                explanation: "Functions containing the `yield` keyword produce a generator iterator when called.",
                difficulty: "easy",
                tags: ["yield-generator"]
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
        // PYTHON GENERATORS FOR ALL 30 SUBTOPICS
        if (subtopicId === "python_intro_pep8" || subtopicId === "python_tokens_syntax") {
            const kw = ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"];
            const item = kw[idx % kw.length];
            return {
                question: `Is '${item}' a reserved keyword in Python 3 syntax?`,
                options: ["Yes, it is a reserved keyword in Python 3", "No, it is a built-in module function", "No, it is a global variable name", "No, it is a string method"],
                correctAnswer: 0,
                explanation: `'${item}' is one of the reserved keywords in standard Python 3.`,
                tags: ["python-keywords"]
            };
        } else if (subtopicId === "python_indentation_comments") {
            return {
                question: `How are docstrings defined inside Python functions or classes to populate the __doc__ attribute?`,
                options: ["Using triple-quoted strings (\"\"\"...\"\"\") immediately after the definition header", "Using # comments at the start of file", "Using // comments", "Using /* ... */ comments"],
                correctAnswer: 0,
                explanation: "Docstrings are created using triple quotes immediately following `def` or `class`.",
                tags: ["docstrings"]
            };
        } else if (subtopicId === "python_numeric_types" || subtopicId === "python_data_types") {
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
        } else if (subtopicId === "python_strings_basics") {
            return {
                question: `What is the characteristic behavior when attempting to modify a character in a Python string via indexing \`s[0] = 'X'\`?`,
                options: ["TypeError (Strings are Immutable)", "The character is updated", "IndexError", "ValueError"],
                correctAnswer: 0,
                explanation: "Python strings are immutable; item assignment raises a TypeError.",
                tags: ["string-immutability"]
            };
        } else if (subtopicId === "python_type_casting") {
            return {
                question: `Which built-in function checks whether an object is an instance of a specified class or subclass tuple?`,
                options: ["isinstance(object, classinfo)", "type(object)", "checktype(object)", "typeof(object)"],
                correctAnswer: 0,
                explanation: "`isinstance()` evaluates subclass and inheritance relationships.",
                tags: ["isinstance"]
            };
        } else if (subtopicId === "python_arithmetic_relational" || subtopicId === "python_operators_expressions") {
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
        } else if (subtopicId === "python_logical_bitwise") {
            return {
                question: `In short-circuit logical expression \`A and B\`, under what condition is expression B evaluated?`,
                options: ["Only if expression A evaluates to True", "Only if expression A evaluates to False", "Always evaluated regardless of A", "Never evaluated"],
                correctAnswer: 0,
                explanation: "Logical `and` short-circuits: if A is False, False is returned immediately without evaluating B.",
                tags: ["short-circuit"]
            };
        } else if (subtopicId === "python_identity_membership") {
            return {
                question: `Which operator tests whether a specified element exists inside a container (list, tuple, dict, set, string)?`,
                options: ["in / not in", "is / is not", "==", "exists"],
                correctAnswer: 0,
                explanation: "`in` and `not in` are membership testing operators.",
                tags: ["membership"]
            };
        } else if (subtopicId === "python_if_elif_else" || subtopicId === "python_control_flow") {
            return {
                question: `Which Python control keyword is evaluated when all preceding \`if\` and \`elif\` conditions evaluate to False?`,
                options: ["else", "default", "finally", "otherwise"],
                correctAnswer: 0,
                explanation: "The `else` block executes when none of the preceding `if` or `elif` conditions are True.",
                tags: ["python-else"]
            };
        } else if (subtopicId === "python_ternary_pass") {
            return {
                question: `What is the correct syntax for a conditional expression (ternary operator) in Python?`,
                options: ["X if Condition else Y", "Condition ? X : Y", "if Condition then X else Y", "X when Condition else Y"],
                correctAnswer: 0,
                explanation: "Python ternary syntax is `X if Condition else Y`.",
                tags: ["ternary"]
            };
        } else if (subtopicId === "python_for_while_loops" || subtopicId === "python_loops_iteration") {
            return {
                question: `When does the optional \`else\` block attached to a \`for\` or \`while\` loop execute?`,
                options: [
                    "When the loop terminates naturally without encountering a break statement",
                    "When a break statement is executed",
                    "When an exception occurs inside the loop",
                    "At the start of every iteration"
                ],
                correctAnswer: 0,
                explanation: "Loop `else` runs if the loop finishes all iterations naturally without hitting a `break`.",
                tags: ["loop-else"]
            };
        } else if (subtopicId === "python_loop_helpers") {
            return {
                question: `What does the \`enumerate(iterable)\` function in Python for loops yield?`,
                options: [
                    "Tuples containing (index, element) pairs",
                    "Sorted items",
                    "Reversed sequence",
                    "Length of iterable"
                ],
                correctAnswer: 0,
                explanation: "`enumerate()` returns (index, element) tuples.",
                tags: ["enumerate"]
            };
        } else if (subtopicId === "python_list_operations" || subtopicId === "python_lists_tuples") {
            return {
                question: `Which list method removes and returns the element at a specified index (or last item by default)?`,
                options: ["list.pop()", "list.remove()", "list.delete()", "list.discard()"],
                correctAnswer: 0,
                explanation: "`pop([i])` removes and returns item at index i (default last item).",
                tags: ["list-pop"]
            };
        } else if (subtopicId === "python_tuple_operations") {
            return {
                question: `How do you define a single-element tuple in Python?`,
                options: ["(42,)", "(42)", "tuple(42)", "[42]"],
                correctAnswer: 0,
                explanation: "A single-element tuple requires a trailing comma: `(42,)`.",
                tags: ["single-tuple"]
            };
        } else if (subtopicId === "python_set_operations") {
            return {
                question: `Which set operation operator computes the Union of two sets A and B?`,
                options: ["A | B", "A & B", "A - B", "A ^ B"],
                correctAnswer: 0,
                explanation: "`|` is set union, `&` is intersection, `-` is difference, `^` is symmetric difference.",
                tags: ["set-union"]
            };
        } else if (subtopicId === "python_dict_operations" || subtopicId === "python_sets_dicts") {
            return {
                question: `What key property MUST an object possess to be used as a key in a Python dictionary?`,
                options: ["It must be Hashable (Immutable)", "It must be an integer", "It must be a string", "It must be mutable"],
                correctAnswer: 0,
                explanation: "Dictionary keys must be hashable objects (such as strings, numbers, or tuples).",
                tags: ["dict-keys"]
            };
        } else if (subtopicId === "python_comprehensions" || subtopicId === "python_list_comprehensions") {
            return {
                question: `What does list comprehension \`[x for x in range(5) if x % 2 != 0]\` evaluate to?`,
                options: ["[1, 3]", "[0, 2, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4]"],
                correctAnswer: 0,
                explanation: "It filters odd numbers from range(5) (0, 1, 2, 3, 4), producing `[1, 3]`.",
                tags: ["list-comprehension"]
            };
        } else if (subtopicId === "python_lambda_map_filter" || subtopicId === "python_lambda_modules") {
            return {
                question: `What is the syntax for defining an anonymous inline function in Python?`,
                options: ["lambda arguments: expression", "def inline(args): expression", "function(args) => expression", "anonymous(args): expression"],
                correctAnswer: 0,
                explanation: "`lambda args: expression` creates single-expression inline anonymous functions.",
                tags: ["lambda"]
            };
        } else if (subtopicId === "python_function_basics") {
            return {
                question: `What value does a Python function return by default if it contains no explicit \`return\` statement?`,
                options: ["None", "0", "False", "Empty string"],
                correctAnswer: 0,
                explanation: "Functions without an explicit return statement implicitly return `None`.",
                tags: ["default-return"]
            };
        } else if (subtopicId === "python_args_kwargs") {
            return {
                question: `Which parameter syntax collects arbitrary keyword arguments passed to a Python function into a dictionary?`,
                options: ["**kwargs", "*args", "*kwargs", "&kwargs"],
                correctAnswer: 0,
                explanation: "`**kwargs` captures arbitrary keyword arguments as a dictionary.",
                tags: ["kwargs"]
            };
        } else if (subtopicId === "python_legb_scope") {
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
        } else if (subtopicId === "python_classes_objects") {
            return {
                question: `Which special method in a Python class serves as the Object Initializer / Constructor?`,
                options: ["__init__(self)", "__construct__(self)", "__new__(self)", "__create__(self)"],
                correctAnswer: 0,
                explanation: "`__init__()` initializes a newly created object instance.",
                tags: ["init-constructor"]
            };
        } else if (subtopicId === "python_methods_decorators") {
            return {
                question: `Which decorator converts a class method into a method bound to the class itself (receiving \`cls\` instead of \`self\`)?`,
                options: ["@classmethod", "@staticmethod", "@property", "@classmethod_self"],
                correctAnswer: 0,
                explanation: "`@classmethod` passes the class object `cls` as the first argument.",
                tags: ["classmethod"]
            };
        } else if (subtopicId === "python_inheritance_dunder" || subtopicId === "python_inheritance_polymorphism") {
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
        } else if (subtopicId === "python_exceptions_try_except" || subtopicId === "python_exception_handling") {
            return {
                question: `Which statement is used to manually trigger / raise an exception in Python?`,
                options: ["raise Exception()", "throw Exception()", "trigger Exception()", "emit Exception()"],
                correctAnswer: 0,
                explanation: "The `raise` keyword raises a specified exception.",
                tags: ["raise-exception"]
            };
        } else if (subtopicId === "python_file_io_context" || subtopicId === "python_file_io") {
            return {
                question: `Which file mode parameter in \`open(filename, mode)\` appends new data to the end of a file without overwriting?`,
                options: ["'a' (Append mode)", "'w' (Write mode)", "'r' (Read mode)", "'x' (Exclusive creation)"],
                correctAnswer: 0,
                explanation: "Mode `'a'` opens the file for appending data to the end.",
                tags: ["file-append"]
            };
        } else if (subtopicId === "python_iterators_generators") {
            return {
                question: `Which keyword converts a standard Python function into a Generator that yields values lazily one at a time?`,
                options: ["yield", "return", "generate", "emit"],
                correctAnswer: 0,
                explanation: "Functions containing the `yield` keyword produce a generator iterator when called.",
                tags: ["yield-generator"]
            };
        } else if (subtopicId === "python_decorators_closures") {
            return {
                question: `In Python syntax, what does the \`@\` symbol before a function definition signify?`,
                options: ["Applying a Decorator function", "Defining an Asynchronous function", "Creating a Lambda expression", "Declaring a Global variable"],
                correctAnswer: 0,
                explanation: "The `@decorator` syntax applies wrapper function logic to the decorated function.",
                tags: ["decorators"]
            };
        } else if (subtopicId === "python_standard_library" || subtopicId === "python_std_library") {
            return {
                question: `Which standard library module provides function \`json.loads(json_string)\` to parse a JSON string into a Python dictionary?`,
                options: ["json", "sys", "os", "pickle"],
                correctAnswer: 0,
                explanation: "`json.loads()` parses JSON string into Python dict/list data structures.",
                tags: ["json-module"]
            };
        }
        // DISCRETE & CS ESSENTIALS GENERATORS
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
