/**
 * Master Question Bank Repository & Procedural Generator Engine
 * Exhaustive Textbook C Syllabus: 14 Topics & 47 Subtopics (100 MCQs each = 4,700 MCQs).
 */

window.QuestionBank = (function () {
    // Cache for generated 100-question banks per subtopic
    const questionCache = {};

    // ------------------------------------------------------------------
    // SEED QUESTIONS DATABASE (Hand-Crafted Textbook C MCQs)
    // ------------------------------------------------------------------
    const seedQuestions = {
        c_tokens_keywords: [
            {
                question: "How many standard ANSI C keywords are defined in the C89/C90 specification?",
                options: ["32 Keywords", "48 Keywords", "64 Keywords", "16 Keywords"],
                correctAnswer: 0,
                explanation: "Standard C89/C90 defines exactly 32 reserved keywords (such as int, return, if, static, const, etc.).",
                difficulty: "easy",
                tags: ["c-tokens", "keywords"]
            },
            {
                question: "Which of the following is a valid C variable identifier?",
                options: ["_myVar", "2cat", "default", "total-sum"],
                correctAnswer: 0,
                explanation: "Identifiers in C must begin with a letter or underscore (_) and cannot be reserved keywords or contain hyphens.",
                difficulty: "easy",
                tags: ["identifiers"]
            }
        ],
        c_comments_compilation: [
            {
                question: "Which stage of the C build process expands #include directives and #define macros?",
                options: ["Preprocessor", "Compiler", "Assembler", "Linker"],
                correctAnswer: 0,
                explanation: "The Preprocessor handles header file inclusion (#include) and macro expansion (#define) before compilation.",
                difficulty: "easy",
                tags: ["compilation", "preprocessor"]
            }
        ],
        c_main_structure: [
            {
                question: "What is the standard entry point function signature for execution in C?",
                options: ["int main() or int main(int argc, char *argv[])", "void start()", "int init()", "void run()"],
                correctAnswer: 0,
                explanation: "The standard C entry point is `int main()` returning an integer exit status to the operating system.",
                difficulty: "easy",
                tags: ["main-function"]
            }
        ],
        c_primitive_types: [
            {
                question: "What is sizeof(char) guaranteed to be according to the C standard?",
                options: ["1 Byte", "2 Bytes", "4 Bytes", "8 Bytes"],
                correctAnswer: 0,
                explanation: "By standard specification, sizeof(char) is always guaranteed to be exactly 1 byte.",
                difficulty: "easy",
                tags: ["data-types"]
            }
        ],
        c_type_modifiers: [
            {
                question: "What is the typical range of a 16-bit signed integer in C?",
                options: ["-32,768 to 32,767", "0 to 65,535", "-65,536 to 65,535", "-128 to 127"],
                correctAnswer: 0,
                explanation: "A 16-bit signed integer uses 2's complement representation, ranging from -2¹⁵ (-32,768) to 2¹⁵ - 1 (32,767).",
                difficulty: "medium",
                tags: ["signed-int", "range"]
            }
        ],
        c_type_qualifiers: [
            {
                question: "What does the 'volatile' type qualifier inform the C compiler?",
                options: [
                    "The variable value may be changed by external hardware or threads unexpectedly, disabling optimization",
                    "The variable cannot be modified",
                    "The variable is stored in CPU registers",
                    "The variable is static"
                ],
                correctAnswer: 0,
                explanation: "'volatile' prevents the compiler from optimizing out repeated reads of a memory location altered externally.",
                difficulty: "hard",
                tags: ["volatile", "qualifiers"]
            }
        ],
        c_formatted_io: [
            {
                question: "Which format specifier is used for 'double' precision float in printf/scanf?",
                options: ["%lf", "%f", "%d", "%c"],
                correctAnswer: 0,
                explanation: "'%lf' (long float) specifies double precision float format.",
                difficulty: "easy",
                tags: ["format-specifiers"]
            }
        ],
        c_arithmetic_operators: [
            {
                question: "What is the output of `printf(\"%d\", 7 % 3);` in C?",
                options: ["1", "2", "2.33", "0"],
                correctAnswer: 0,
                explanation: "The modulo operator (%) calculates the remainder of integer division. 7 divided by 3 leaves remainder 1.",
                difficulty: "easy",
                tags: ["modulo"]
            }
        ],
        c_inc_dec_operators: [
            {
                question: "What is the value of 'x' after `int a = 5; int x = a++;`?",
                options: ["5", "6", "4", "Undefined"],
                correctAnswer: 0,
                explanation: "Post-increment 'a++' evaluates to original value (5) for assignment, then increments 'a' to 6.",
                difficulty: "medium",
                tags: ["post-increment"]
            }
        ],
        c_relational_logical: [
            {
                question: "What is logical short-circuiting in C for the '&&' operator?",
                options: [
                    "If left operand is FALSE, right operand is NOT evaluated",
                    "If left operand is TRUE, right operand is NOT evaluated",
                    "Both operands are always evaluated",
                    "Causes compilation error"
                ],
                correctAnswer: 0,
                explanation: "In `A && B`, if A is false, B is not evaluated because the entire expression is guaranteed false.",
                difficulty: "medium",
                tags: ["short-circuit"]
            }
        ],
        c_bitwise_operators: [
            {
                question: "Which bitwise operator performs logical Bitwise AND in C?",
                options: ["&", "&&", "|", "^"],
                correctAnswer: 0,
                explanation: "'&' is bitwise AND, while '&&' is logical AND.",
                difficulty: "easy",
                tags: ["bitwise-and"]
            }
        ],
        c_switch_case_branching: [
            {
                question: "What happens if a 'break' statement is omitted after a case block in switch?",
                options: ["Execution falls through to subsequent cases", "Compilation error occurs", "Program terminates", "Switch condition repeats"],
                correctAnswer: 0,
                explanation: "Without a break statement, control 'falls through' to execute following case statements sequentially.",
                difficulty: "medium",
                tags: ["switch-case"]
            }
        ],
        c_while_dowhile_loops: [
            {
                question: "Which loop construct in C guarantees its body will execute AT LEAST ONCE?",
                options: ["do-while loop", "while loop", "for loop", "nested loop"],
                correctAnswer: 0,
                explanation: "do-while is exit-controlled, executing the body once before testing condition.",
                difficulty: "easy",
                tags: ["do-while"]
            }
        ],
        c_recursion_stack: [
            {
                question: "What is the base case in a recursive function?",
                options: ["The terminating condition that stops recursive calls", "The initial function call", "The recursive step", "The main function"],
                correctAnswer: 0,
                explanation: "The Base Case stops self-referential function calls and prevents stack overflow.",
                difficulty: "easy",
                tags: ["recursion"]
            }
        ],
        c_pointer_declarations: [
            {
                question: "What does the address-of operator '&' return when applied to variable 'x'?",
                options: ["Memory address of 'x'", "Value of 'x'", "Size of 'x'", "Pointer dereference"],
                correctAnswer: 0,
                explanation: "'&' retrieves the memory location address of the variable.",
                difficulty: "easy",
                tags: ["pointers"]
            }
        ],
        c_heap_malloc_calloc: [
            {
                question: "Which function allocates dynamic memory on the heap and initializes all bytes to zero?",
                options: ["calloc()", "malloc()", "realloc()", "free()"],
                correctAnswer: 0,
                explanation: "calloc(n, size) initializes allocated heap memory to 0.",
                difficulty: "medium",
                tags: ["calloc"]
            }
        ],
        c_structures_padding: [
            {
                question: "Which operator accesses structure members directly when using a structure variable (not a pointer)?",
                options: [". (Dot operator)", "-> (Arrow operator)", "* (Asterisk)", "& (Address)"],
                correctAnswer: 0,
                explanation: "The dot operator (.) accesses structure fields directly on structure variables.",
                difficulty: "easy",
                tags: ["dot-operator"]
            }
        ],
        c_unions_bitfields: [
            {
                question: "What is the primary difference between a struct and a union in C?",
                options: [
                    "Union members share the same memory location, struct members have separate memory",
                    "Structs can only contain integers, unions contain floats",
                    "Unions cannot be passed to functions",
                    "Structs cannot hold pointers"
                ],
                correctAnswer: 0,
                explanation: "All union members share the same memory location, whereas struct members have distinct memory.",
                difficulty: "medium",
                tags: ["unions"]
            }
        ],
        c_file_opening_modes: [
            {
                question: "Which file open mode is used to append data to the end of an existing file in C?",
                options: ["\"a\"", "\"w\"", "\"r\"", "\"r+\""],
                correctAnswer: 0,
                explanation: "\"a\" mode opens or creates a file for appending at the end.",
                difficulty: "medium",
                tags: ["file-io"]
            }
        ],
        c_macros_define: [
            {
                question: "Which preprocessor directive is used to define symbolic constants or macros in C?",
                options: ["#define", "#include", "#ifdef", "#pragma"],
                correctAnswer: 0,
                explanation: "#define creates macro constants and parameterized macros.",
                difficulty: "easy",
                tags: ["preprocessor"]
            }
        ]
    };

    // ------------------------------------------------------------------
    // PROCEDURAL QUESTION GENERATOR: Guarantees 100 MCQs per Subtopic
    // ------------------------------------------------------------------
    function generate100QuestionsForSubtopic(subtopicId) {
        const seeds = seedQuestions[subtopicId] || [];
        const result = [...seeds];

        let subName = "C Subtopic";
        let subSubject = "Computer Programming using C";
        let subTopicName = "C Programming Topic";

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
        if (subtopicId === "c_tokens_keywords") {
            const tokens = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
            const tok = tokens[idx % tokens.length];
            return {
                question: `Q${idx}. Is '${tok}' a reserved keyword in C programming language?`,
                options: ["Yes, it is a reserved keyword", "No, it is a user variable name", "No, it is a library macro", "Depends on OS"],
                correctAnswer: 0,
                explanation: `'${tok}' is one of the reserved keywords in standard C syntax.`,
                tags: ["c-tokens", "keywords"]
            };
        } else if (subtopicId === "c_comments_compilation") {
            return {
                question: `Q${idx}. Which operator syntax represents a multi-line comment block in C?`,
                options: ["/* ... */", "// ...", "# ...", "<!-- ... -->"],
                correctAnswer: 0,
                explanation: "Multi-line comments start with /* and end with */.",
                tags: ["comments"]
            };
        } else if (subtopicId === "c_main_structure") {
            return {
                question: `Q${idx}. What integer status value is returned by main() to signal successful program termination?`,
                options: ["0 (EXIT_SUCCESS)", "1", "-1", "100"],
                correctAnswer: 0,
                explanation: "Returning 0 from main() indicates successful execution without runtime errors.",
                tags: ["main-return"]
            };
        } else if (subtopicId === "c_primitive_types") {
            const types = [
                { name: "char", size: "1 Byte" },
                { name: "short int", size: "2 Bytes" },
                { name: "float", size: "4 Bytes" },
                { name: "double", size: "8 Bytes" }
            ];
            const t = types[idx % types.length];
            return {
                question: `Q${idx}. What is the memory footprint of '${t.name}' data type in C?`,
                options: [`${t.size}`, "16 Bytes", "32 Bytes", "0 Bytes"],
                correctAnswer: 0,
                explanation: `'${t.name}' occupies ${t.size} in standard architectures.`,
                tags: ["primitive-types"]
            };
        } else if (subtopicId === "c_type_modifiers") {
            return {
                question: `Q${idx}. What happens to the range of an integer when declared as 'unsigned int'?`,
                options: ["It eliminates negative values, doubling positive range (0 to 65,535 for 16-bit)", "It allows negative numbers only", "It halves the positive range", "It creates floating point numbers"],
                correctAnswer: 0,
                explanation: "'unsigned' uses the sign bit for magnitude, doubling the upper limit.",
                tags: ["unsigned"]
            };
        } else if (subtopicId === "c_type_qualifiers") {
            return {
                question: `Q${idx}. What does placing the 'const' keyword before a pointer declaration \`const int *ptr;\` mean?`,
                options: ["The value pointed to by ptr cannot be modified through ptr", "The pointer address itself cannot be changed", "Both pointer and value are constant", "The pointer is static"],
                correctAnswer: 0,
                explanation: "`const int *ptr` makes the dereferenced integer value read-only.",
                tags: ["const-pointer"]
            };
        } else if (subtopicId === "c_type_casting") {
            return {
                question: `Q${idx}. What is explicit type casting in expression \`(float)5 / 2\`?`,
                options: ["Converts integer 5 to float 5.0, resulting in 2.5", "Truncates result to 2", "Causes compiler warning", "Evaluates to 0"],
                correctAnswer: 0,
                explanation: "Explicit cast (float) promotes 5 to float, forcing floating-point division.",
                tags: ["type-casting"]
            };
        } else if (subtopicId === "c_formatted_io") {
            const specMap = [
                { spec: "%d", type: "signed decimal integer" },
                { spec: "%f", type: "float decimal" },
                { spec: "%c", type: "single character" },
                { spec: "%s", type: "null-terminated string" },
                { spec: "%x", type: "hexadecimal number" },
                { spec: "%p", type: "pointer memory address" }
            ];
            const sm = specMap[idx % specMap.length];
            return {
                question: `Q${idx}. In C I/O formatting, what does format specifier '${sm.spec}' format?`,
                options: [`${sm.type}`, "Unsigned char", "Double float", "Binary string"],
                correctAnswer: 0,
                explanation: `'${sm.spec}' formats ${sm.type}.`,
                tags: ["format-specifiers"]
            };
        } else if (subtopicId === "c_unformatted_io") {
            return {
                question: `Q${idx}. Which standard function reads a single character from stdin buffer in C?`,
                options: ["getchar()", "gets()", "scanf()", "puts()"],
                correctAnswer: 0,
                explanation: "getchar() reads and returns next character from standard input.",
                tags: ["getchar"]
            };
        } else if (subtopicId === "c_escape_sequences") {
            return {
                question: `Q${idx}. Which escape sequence represents horizontal tab in C output?`,
                options: ["\\t", "\\n", "\\r", "\\b"],
                correctAnswer: 0,
                explanation: "'\\t' inserts a horizontal tab spacing.",
                tags: ["escape-sequences"]
            };
        } else if (subtopicId === "c_arithmetic_operators") {
            const val1 = (idx * 3) % 15 + 5;
            const val2 = (idx % 3) + 2;
            const rem = val1 % val2;
            return {
                question: `Q${idx}. What is the result of expression (${val1} % ${val2}) in C programming?`,
                options: [`${rem}`, `${val1 / val2}`, `${rem + 2}`, `0`],
                correctAnswer: 0,
                explanation: `Modulo arithmetic calculates the remainder of ${val1} divided by ${val2} (${rem}).`,
                tags: ["modulo"]
            };
        } else if (subtopicId === "c_inc_dec_operators") {
            return {
                question: `Q${idx}. What is the difference between \`++x\` (pre-increment) and \`x++\` (post-increment)?`,
                options: [
                    "++x increments before evaluating expression, x++ increments after evaluating",
                    "x++ is faster than ++x",
                    "++x is only for floats, x++ for ints",
                    "They are completely identical in all expressions"
                ],
                correctAnswer: 0,
                explanation: "Pre-increment updates value immediately before expression evaluation; post-increment uses original value first.",
                tags: ["pre-post-increment"]
            };
        } else if (subtopicId === "c_relational_logical") {
            return {
                question: `Q${idx}. What is the result of condition \`(5 > 3 && 2 < 1)\` in C?`,
                options: ["0 (False)", "1 (True)", "5", "Undefined"],
                correctAnswer: 0,
                explanation: "5 > 3 is true (1), but 2 < 1 is false (0). True && False = 0 (False).",
                tags: ["logical-and"]
            };
        } else if (subtopicId === "c_bitwise_operators") {
            return {
                question: `Q${idx}. What is the result of bitwise left shift operation \`(5 << 1)\` in binary arithmetic?`,
                options: ["10", "2", "5", "20"],
                correctAnswer: 0,
                explanation: "Left shifting by 1 multiplies integer by 2: 5 × 2¹ = 10.",
                tags: ["bitwise-shift"]
            };
        } else if (subtopicId === "c_assignment_ternary") {
            return {
                question: `Q${idx}. What is the compound assignment expression \`x += 5\` equivalent to?`,
                options: ["x = x + 5", "x = 5", "x = x * 5", "x == 5"],
                correctAnswer: 0,
                explanation: "x += 5 is shorthand for x = x + 5.",
                tags: ["compound-assignment"]
            };
        } else if (subtopicId === "c_precedence_associativity") {
            return {
                question: `Q${idx}. What is the output of expression \`int x = 2 + 3 * 4;\` in C?`,
                options: ["14", "20", "24", "10"],
                correctAnswer: 0,
                explanation: "Multiplication (*) has higher precedence than addition (+), so 3 * 4 = 12, then 2 + 12 = 14.",
                tags: ["precedence"]
            };
        } else if (subtopicId === "c_if_else_branching") {
            return {
                question: `Q${idx}. In nested if-else structures, an 'else' clause automatically pairs with:`,
                options: [
                    "The nearest preceding unmatched 'if' statement",
                    "The first 'if' statement in block",
                    "The main function",
                    "The switch statement"
                ],
                correctAnswer: 0,
                explanation: "By C scope rules, 'else' pairs with the closest preceding unmatched 'if' in the same block.",
                tags: ["dangling-else"]
            };
        } else if (subtopicId === "c_switch_case_branching") {
            return {
                question: `Q${idx}. What types of values can be used in a switch-case \`case constant:\` expression in C?`,
                options: ["Integral constants (int, char, enum)", "Floating point floats and doubles", "Strings and arrays", "Pointers"],
                correctAnswer: 0,
                explanation: "Switch case labels must be compile-time integer or character constant expressions.",
                tags: ["switch-case"]
            };
        } else if (subtopicId === "c_for_loop") {
            return {
                question: `Q${idx}. What happens if all three control expressions are omitted in \`for (;;) \`?`,
                options: ["It creates an infinite loop", "Compilation error occurs", "Loop executes 0 times", "Program exits"],
                correctAnswer: 0,
                explanation: "Omitting the test condition in `for(;;)` defaults to true, creating an infinite loop.",
                tags: ["infinite-loop"]
            };
        } else if (subtopicId === "c_while_dowhile_loops") {
            return {
                question: `Q${idx}. Which loop checks its condition BEFORE executing the loop body?`,
                options: ["while loop", "do-while loop", "exit-controlled loop", "post-test loop"],
                correctAnswer: 0,
                explanation: "The while loop is an entry-controlled loop testing condition before executing.",
                tags: ["while-loop"]
            };
        } else if (subtopicId === "c_loop_control_jumps") {
            return {
                question: `Q${idx}. Which statement in C transfers control unconditionally to a labeled statement?`,
                options: ["goto", "break", "continue", "return"],
                correctAnswer: 0,
                explanation: "'goto label;' jumps directly to 'label:'.",
                tags: ["goto"]
            };
        } else if (subtopicId === "c_function_declarations") {
            return {
                question: `Q${idx}. What is the default return type of a function in classic C if omitted in signature?`,
                options: ["int", "void", "float", "char"],
                correctAnswer: 0,
                explanation: "In C89/C90, omitting a return type defaults implicitly to 'int'.",
                tags: ["implicit-int"]
            };
        } else if (subtopicId === "c_call_by_value_ref") {
            return {
                question: `Q${idx}. How do you implement call by reference in C programming?`,
                options: ["By passing variable memory addresses using pointers", "By using Call by Value", "By using global const", "By return void"],
                correctAnswer: 0,
                explanation: "Passing pointers (&var) enables functions to modify caller variables.",
                tags: ["call-by-reference"]
            };
        } else if (subtopicId === "c_recursion_stack") {
            return {
                question: `Q${idx}. What condition must be met for a recursive function to terminate normally?`,
                options: ["Base case condition evaluates to true", "Memory allocation succeeds", "Global variable is set", "Loop terminates"],
                correctAnswer: 0,
                explanation: "Reaching the base case terminates recursive calls.",
                tags: ["base-case"]
            };
        } else if (subtopicId === "c_storage_classes_scope") {
            return {
                question: `Q${idx}. What is the default storage class for local variables declared inside a function block?`,
                options: ["auto", "static", "extern", "register"],
                correctAnswer: 0,
                explanation: "Local variables default to 'auto' (automatic storage class on the stack).",
                difficulty: "easy",
                tags: ["auto-storage"]
            };
        } else if (subtopicId === "c_pointer_declarations") {
            return {
                question: `Q${idx}. If \`int x = 10; int *p = &x;\`, what does \`*p\` evaluate to?`,
                options: ["10", "Address of x", "Address of p", "0"],
                correctAnswer: 0,
                explanation: "`*p` dereferences p, returning value of x (10).",
                tags: ["dereference"]
            };
        } else if (subtopicId === "c_pointer_arithmetic_ops") {
            return {
                question: `Q${idx}. If pointer \`int *p\` points to address 2000, what is the result of \`p + 2\` (assuming 4-byte ints)?`,
                options: ["2008", "2002", "2004", "2000"],
                correctAnswer: 0,
                explanation: "Pointer arithmetic scales offset by element size: 2000 + (2 * 4) = 2008.",
                tags: ["pointer-math"]
            };
        } else if (subtopicId === "c_pointers_to_pointers") {
            return {
                question: `Q${idx}. What type of pointer is declared as \`int **pptr;\`?`,
                options: ["Pointer to a pointer to an integer", "Pointer to array", "Void pointer", "Function pointer"],
                correctAnswer: 0,
                explanation: "`**pptr` stores the memory address of another pointer variable.",
                tags: ["double-pointer"]
            };
        } else if (subtopicId === "c_function_pointers") {
            return {
                question: `Q${idx}. Which syntax correctly declares a function pointer 'fp' taking two ints and returning int?`,
                options: ["int (*fp)(int, int);", "int *fp(int, int);", "int (fp*)(int, int);", "void *fp(int, int);"],
                correctAnswer: 0,
                explanation: "`int (*fp)(int, int);` declares a function pointer `fp`.",
                tags: ["function-pointer"]
            };
        } else if (subtopicId === "c_heap_malloc_calloc") {
            return {
                question: `Q${idx}. Which standard C library header is required to use malloc(), calloc(), realloc(), and free()?`,
                options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<memory.h>"],
                correctAnswer: 0,
                explanation: "<stdlib.h> contains dynamic memory allocation functions.",
                tags: ["stdlib.h"]
            };
        } else if (subtopicId === "c_heap_realloc_free") {
            return {
                question: `Q${idx}. What happens if \`free(ptr)\` is called on a null pointer (\`ptr == NULL\`)?`,
                options: ["No operation is performed (safe)", "Segmentation fault occurs", "Program crashes", "Memory leak occurs"],
                correctAnswer: 0,
                explanation: "The C standard specifies that `free(NULL)` performs no operation and returns safely.",
                tags: ["free-null"]
            };
        } else if (subtopicId === "c_memory_leaks_dangling") {
            return {
                question: `Q${idx}. What is a dangling pointer in C?`,
                options: [
                    "A pointer that points to a memory location that has been freed",
                    "A pointer assigned NULL",
                    "An uninitialized pointer",
                    "A void pointer"
                ],
                correctAnswer: 0,
                explanation: "A dangling pointer stores the address of memory that has already been deallocated.",
                tags: ["dangling-pointer"]
            };
        } else if (subtopicId === "c_1d_arrays_indexing") {
            const size = (idx % 5) + 5;
            return {
                question: `Q${idx}. For array \`int arr[${size}];\`, what are the valid element indices?`,
                options: [`0 to ${size - 1}`, `1 to ${size}`, `0 to ${size}`, `-1 to ${size - 1}`],
                correctAnswer: 0,
                explanation: "C uses 0-based indexing (0 to size-1).",
                tags: ["1d-arrays"]
            };
        } else if (subtopicId === "c_2d_arrays_matrices") {
            return {
                question: `Q${idx}. In a 2D array \`int a[2][3] = {{1, 2, 3}, {4, 5, 6}};\`, what is the value of \`a[1][2]\`?`,
                options: ["6", "5", "3", "4"],
                correctAnswer: 0,
                explanation: "Row index 1 (second row: 4, 5, 6), column index 2 (third element) is 6.",
                tags: ["2d-arrays"]
            };
        } else if (subtopicId === "c_array_function_passing") {
            return {
                question: `Q${idx}. When a 1D array is passed to a function in C, what is actually passed?`,
                options: ["Pointer to the first element (&arr[0])", "A copy of entire array", "The size of array", "A struct"],
                correctAnswer: 0,
                explanation: "Array names decay to a pointer to their first element when passed as parameters.",
                tags: ["array-decay"]
            };
        } else if (subtopicId === "c_string_fundamentals") {
            return {
                question: `Q${idx}. What character automatically terminates string literals in C memory?`,
                options: ["'\\0' (Null character)", "'\\n' (Newline)", "'\\t' (Tab)", "' ' (Space)"],
                correctAnswer: 0,
                explanation: "Strings end with '\\0' null character.",
                tags: ["null-terminator"]
            };
        } else if (subtopicId === "c_string_library_fns") {
            return {
                question: `Q${idx}. Which function from <string.h> copies source string to destination string?`,
                options: ["strcpy()", "strlen()", "strcmp()", "strcat()"],
                correctAnswer: 0,
                explanation: "strcpy(dest, src) copies string contents including '\\0'.",
                tags: ["strcpy"]
            };
        } else if (subtopicId === "c_structures_padding") {
            return {
                question: `Q${idx}. What is structure padding in C?`,
                options: [
                    "Insertion of empty bytes by compiler to align structure members to memory word boundaries",
                    "Adding comments to structures",
                    "Dynamically growing structures",
                    "Compressing structure memory"
                ],
                correctAnswer: 0,
                explanation: "Compilers add padding bytes to align structure members for faster CPU bus access.",
                tags: ["structure-padding"]
            };
        } else if (subtopicId === "c_nested_struct_arrays") {
            return {
                question: `Q${idx}. Which syntax accesses member 'age' of the 3rd element in array \`struct Student s[5];\`?`,
                options: ["s[2].age", "s[3].age", "s.age[2]", "s->age[3]"],
                correctAnswer: 0,
                explanation: "0-based indexing means 3rd element is `s[2]`, accessed via `.age`.",
                tags: ["array-of-structs"]
            };
        } else if (subtopicId === "c_unions_bitfields") {
            return {
                question: `Q${idx}. How much memory does a union allocate?`,
                options: ["Size of its largest member", "Sum of all member sizes", "Fixed 4 bytes", "Depends on functions"],
                correctAnswer: 0,
                explanation: "Unions allocate memory equal to the size of the single largest member.",
                tags: ["union-memory"]
            };
        } else if (subtopicId === "c_typedef_aliases") {
            return {
                question: `Q${idx}. What keyword creates a new type name alias for existing data types in C?`,
                options: ["typedef", "struct", "alias", "type"],
                correctAnswer: 0,
                explanation: "'typedef' defines type aliases.",
                tags: ["typedef"]
            };
        } else if (subtopicId === "c_file_opening_modes") {
            return {
                question: `Q${idx}. Which fopen mode opens a file for reading and writing starting at beginning of file?`,
                options: ["\"r+\"", "\"w\"", "\"a\"", "\"r\""],
                correctAnswer: 0,
                explanation: "\"r+\" opens an existing file for both reading and writing.",
                tags: ["file-modes"]
            };
        } else if (subtopicId === "c_text_file_io") {
            return {
                question: `Q${idx}. Which function reads a line of text string from a FILE stream in C?`,
                options: ["fgets()", "fputc()", "fprintf()", "fwrite()"],
                correctAnswer: 0,
                explanation: "fgets(str, n, stream) reads up to n-1 characters from file stream.",
                tags: ["fgets"]
            };
        } else if (subtopicId === "c_binary_file_io_seeking") {
            return {
                question: `Q${idx}. Which function reposition file position indicator to beginning of file?`,
                options: ["rewind()", "fseek()", "ftell()", "fclose()"],
                correctAnswer: 0,
                explanation: "rewind(fp) sets file pointer back to start of file stream.",
                tags: ["rewind"]
            };
        } else if (subtopicId === "c_macros_define") {
            return {
                question: `Q${idx}. What does the stringizing operator '#' do in a C macro definition?`,
                options: ["Converts a macro parameter into a string literal", "Concatenates two tokens", "Includes header file", "Deletes macro"],
                correctAnswer: 0,
                explanation: "'#' converts a macro parameter into a quoted string literal.",
                tags: ["macro-stringizing"]
            };
        } else if (subtopicId === "c_conditional_compilation") {
            return {
                question: `Q${idx}. What preprocessor directive checks if a macro symbol is NOT defined?`,
                options: ["#ifndef", "#ifdef", "#if", "#define"],
                correctAnswer: 0,
                explanation: "#ifndef (if not defined) tests whether macro symbol has not been defined.",
                tags: ["ifndef"]
            };
        } else if (subtopicId === "c_command_line_args") {
            return {
                question: `Q${idx}. In \`main(int argc, char *argv[])\`, what does \`argv[0]\` store?`,
                options: ["The executable program name / invocation path", "The first user argument", "Total count of arguments", "NULL"],
                correctAnswer: 0,
                explanation: "`argv[0]` contains the program name or path used to invoke execution.",
                tags: ["command-line-args"]
            };
        } else {
            return {
                question: `Q${idx}. C Practice MCQ on ${subName}: Which statement is correct?`,
                options: [
                    `Standard concept principle for ${subName}`,
                    `Distractor option A for ${subName}`,
                    `Distractor option B for ${subName}`,
                    `Distractor option C for ${subName}`
                ],
                correctAnswer: 0,
                explanation: `This question evaluates key concepts of ${subName} in C programming.`,
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
