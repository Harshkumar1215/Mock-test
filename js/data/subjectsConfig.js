const subjectsConfig = [
    {
        "id": "c_programming",
        "name": "Computer Programming using C",
        "icon": "fa-code",
        "badgeColor": "bg-teal",
        "description": "Complete C programming master syllabus covering 14 Topics & 47 Subtopics with 100 MCQs each (4,700 total MCQs).",
        "topics": [
            {
                "id": "topic_1_intro",
                "name": "Topic 1: Intro to C, Tokens & Program Structure",
                "icon": "fa-code",
                "subtopics": [
                    { "id": "c_tokens_keywords", "name": "1.1 C Tokens, Keywords, Identifiers & Literals", "count": 100, "desc": "32 standard ANSI keywords, valid identifiers, character/string/numeric literals" },
                    { "id": "c_comments_compilation", "name": "1.2 Comments, Preprocessing, Compilation & Linking", "count": 100, "desc": "Single/multi-line comments, preprocessor -> compiler -> assembler -> linker workflow" },
                    { "id": "c_main_structure", "name": "1.3 C Program Structure, Header Files & main()", "count": 100, "desc": "System includes (#include <stdio.h>), user headers (#include \"...\"), main() signature & return values" }
                ]
            },
            {
                "id": "topic_2_types",
                "name": "Topic 2: Data Types, Modifiers & Type System",
                "icon": "fa-layer-group",
                "subtopics": [
                    { "id": "c_primitive_types", "name": "2.1 Primitive Data Types (char, int, float, double)", "count": 100, "desc": "Character, integer, floating point, double precision data types & memory sizes" },
                    { "id": "c_type_modifiers", "name": "2.2 Type Modifiers (short, long, signed, unsigned)", "count": 100, "desc": "Sign bit representation, 2's complement, range of signed vs unsigned integers" },
                    { "id": "c_type_qualifiers", "name": "2.3 Type Qualifiers (const, volatile, restrict)", "count": 100, "desc": "Const immutability, volatile hardware registers, compiler optimization constraints" },
                    { "id": "c_type_casting", "name": "2.4 Type Conversion & Explicit Casting", "count": 100, "desc": "Implicit promotion rules, arithmetic conversion, explicit type casting (type)" }
                ]
            },
            {
                "id": "topic_3_io",
                "name": "Topic 3: Input / Output Operations & Formatting",
                "icon": "fa-terminal",
                "subtopics": [
                    { "id": "c_formatted_io", "name": "3.1 Formatted I/O (printf, scanf & Format Specifiers)", "count": 100, "desc": "%d, %f, %c, %s, %p, %x, %o, width/precision specifiers, scanf address & operator" },
                    { "id": "c_unformatted_io", "name": "3.2 Unformatted I/O (getchar, putchar, gets_s, puts)", "count": 100, "desc": "Character-by-character I/O, string I/O, buffer flushing (fflush)" },
                    { "id": "c_escape_sequences", "name": "3.3 Escape Sequences & Special Characters", "count": 100, "desc": "\\n, \\t, \\b, \\r, \\\\, \\\", \\0 character constants" }
                ]
            },
            {
                "id": "topic_4_operators",
                "name": "Topic 4: Operators & Expression Evaluation",
                "icon": "fa-calculator",
                "subtopics": [
                    { "id": "c_arithmetic_operators", "name": "4.1 Arithmetic Operators & Integer Truncation", "count": 100, "desc": "+, -, *, /, % operators, integer division truncation towards zero" },
                    { "id": "c_inc_dec_operators", "name": "4.2 Pre & Post Increment / Decrement (++ / --)", "count": 100, "desc": "Prefix ++x vs postfix x++ behavior, sequence points & side effects" },
                    { "id": "c_relational_logical", "name": "4.3 Relational & Logical Operators (Short-Circuiting)", "count": 100, "desc": "<, >, <=, >=, ==, !=, &&, ||, ! short-circuit boolean evaluation" },
                    { "id": "c_bitwise_operators", "name": "4.4 Bitwise Operators (&, |, ^, ~, <<, >>)", "count": 100, "desc": "Bitwise AND, OR, XOR, NOT, left shift, right shift, bit manipulation & masking" },
                    { "id": "c_assignment_ternary", "name": "4.5 Assignment, Ternary (?:) & Comma Operators", "count": 100, "desc": "Compound assignment (+=, -=), conditional operator (?:), comma expression evaluation" },
                    { "id": "c_precedence_associativity", "name": "4.6 Operator Precedence & Associativity Rules", "count": 100, "desc": "Operator hierarchy table, left-to-right vs right-to-left evaluation order" }
                ]
            },
            {
                "id": "topic_5_branching",
                "name": "Topic 5: Control Flow & Decision Making",
                "icon": "fa-code-branch",
                "subtopics": [
                    { "id": "c_if_else_branching", "name": "5.1 If, If-Else & Else-If Ladder", "count": 100, "desc": "Simple if, if-else, nested if condition testing, dangling else problem" },
                    { "id": "c_switch_case_branching", "name": "5.2 Switch-Case Statements & Fall-Through", "count": 100, "desc": "Switch expression rules, integral case constants, break statement, default case" }
                ]
            },
            {
                "id": "topic_6_loops",
                "name": "Topic 6: Loop Constructs & Iteration",
                "icon": "fa-arrows-rotate",
                "subtopics": [
                    { "id": "c_for_loop", "name": "6.1 For Loops & Multi-Variable Loops", "count": 100, "desc": "Initialization, test condition, update expression, infinite for(;;), nested loops" },
                    { "id": "c_while_dowhile_loops", "name": "6.2 While & Do-While Loops", "count": 100, "desc": "Entry-controlled while vs exit-controlled do-while loops" },
                    { "id": "c_loop_control_jumps", "name": "6.3 Break, Continue & Goto Jump Control", "count": 100, "desc": "Loop termination with break, skipping with continue, goto & labels" }
                ]
            },
            {
                "id": "topic_7_functions",
                "name": "Topic 7: Functions & Modular Programming",
                "icon": "fa-cubes",
                "subtopics": [
                    { "id": "c_function_declarations", "name": "7.1 Function Prototypes & Definitions", "count": 100, "desc": "Function declarations, signatures, return types, void functions" },
                    { "id": "c_call_by_value_ref", "name": "7.2 Call by Value vs Call by Reference", "count": 100, "desc": "Actual vs formal arguments, passing variable addresses via pointers" },
                    { "id": "c_recursion_stack", "name": "7.3 Recursion, Base Cases & Call Stack", "count": 100, "desc": "Direct/indirect recursion, base cases, call stack overhead, stack overflow" },
                    { "id": "c_storage_classes_scope", "name": "7.4 Storage Classes (auto, static, extern, register)", "count": 100, "desc": "Scope, linkage, lifetime, static local variables, register variables" }
                ]
            },
            {
                "id": "topic_8_arrays",
                "name": "Topic 8: Arrays & Matrix Operations",
                "icon": "fa-table-cells",
                "subtopics": [
                    { "id": "c_1d_arrays_indexing", "name": "8.1 Single-Dimensional Arrays (1D)", "count": 100, "desc": "0-based indexing, array initialization, memory layout, bounds" },
                    { "id": "c_2d_arrays_matrices", "name": "8.2 Multidimensional Arrays (2D Matrices)", "count": 100, "desc": "Row-major order, 2D array indexing, matrix addition/multiplication" },
                    { "id": "c_array_function_passing", "name": "8.3 Passing Arrays to Functions", "count": 100, "desc": "Array degradation to pointer, passing 1D and 2D arrays to functions" }
                ]
            },
            {
                "id": "topic_9_strings",
                "name": "Topic 9: Strings & Text Processing",
                "icon": "fa-font",
                "subtopics": [
                    { "id": "c_string_fundamentals", "name": "9.1 Character Arrays & Null Terminator \\0", "count": 100, "desc": "String representation, char arrays, string literals, puts & gets" },
                    { "id": "c_string_library_fns", "name": "9.2 Standard <string.h> Functions", "count": 100, "desc": "strlen, strcpy, strncpy, strcat, strcmp, strrev, strstr, chr" }
                ]
            },
            {
                "id": "topic_10_pointers",
                "name": "Topic 10: Pointers & Address Manipulation",
                "icon": "fa-arrow-pointer",
                "subtopics": [
                    { "id": "c_pointer_declarations", "name": "10.1 Pointer Declarations & Dereferencing (* & &)", "count": 100, "desc": "Address-of operator &, dereference operator *, NULL pointers" },
                    { "id": "c_pointer_arithmetic_ops", "name": "10.2 Pointer Arithmetic & Array-Pointer Equivalence", "count": 100, "desc": "Adding/subtracting offsets, pointer subtraction, *(arr + i)" },
                    { "id": "c_pointers_to_pointers", "name": "10.3 Double Pointers (**ptr) & Void Pointers", "count": 100, "desc": "Pointers to pointers, array of pointers, generic void* pointers" },
                    { "id": "c_function_pointers", "name": "10.4 Function Pointers & Callbacks", "count": 100, "desc": "Function pointer declaration syntax, invoking functions via pointers" }
                ]
            },
            {
                "id": "topic_11_heap",
                "name": "Topic 11: Dynamic Memory Management",
                "icon": "fa-memory",
                "subtopics": [
                    { "id": "c_heap_malloc_calloc", "name": "11.1 Dynamic Allocation (malloc & calloc)", "count": 100, "desc": "Heap memory allocation, malloc uninitialized vs calloc zero-initialized" },
                    { "id": "c_heap_realloc_free", "name": "11.2 Memory Resizing (realloc) & Deallocation (free)", "count": 100, "desc": "realloc block expansion/shrinking, free() deallocation" },
                    { "id": "c_memory_leaks_dangling", "name": "11.3 Memory Leaks & Dangling Pointers", "count": 100, "desc": "Unfreed heap memory leaks, dangling pointers after free(), wild pointers" }
                ]
            },
            {
                "id": "topic_12_structures",
                "name": "Topic 12: Structures, Unions & Enums",
                "icon": "fa-sitemap",
                "subtopics": [
                    { "id": "c_structures_padding", "name": "12.1 Structures & Member Access (. and ->)", "count": 100, "desc": "struct declaration, member access (. / ->), structure padding & alignment" },
                    { "id": "c_nested_struct_arrays", "name": "12.2 Nested Structures & Array of Structures", "count": 100, "desc": "Structures inside structures, array of struct elements" },
                    { "id": "c_unions_bitfields", "name": "12.3 Unions, Bit-fields & Enumerations (enum)", "count": 100, "desc": "Union memory sharing, bit-field width declarations, enum constants" },
                    { "id": "c_typedef_aliases", "name": "12.4 Type Aliasing with typedef", "count": 100, "desc": "typedef syntax, defining custom type aliases for structs and pointers" }
                ]
            },
            {
                "id": "topic_13_files",
                "name": "Topic 13: File Handling & I/O Streams",
                "icon": "fa-folder-open",
                "subtopics": [
                    { "id": "c_file_opening_modes", "name": "13.1 FILE Pointers & Opening Modes", "count": 100, "desc": "FILE pointer, fopen modes (\"r\", \"w\", \"a\", \"r+\", \"w+\", \"a+\", \"rb\", \"wb\"), fclose" },
                    { "id": "c_text_file_io", "name": "13.2 Text File Input / Output Operations", "count": 100, "desc": "fgetc, fputc, fgets, fputs, fprintf, fscanf" },
                    { "id": "c_binary_file_io_seeking", "name": "13.3 Binary File I/O & File Positioning", "count": 100, "desc": "fread, fwrite, random access with fseek, ftell, rewind" }
                ]
            },
            {
                "id": "topic_14_advanced",
                "name": "Topic 14: Preprocessor, Macros & Advanced C",
                "icon": "fa-sliders",
                "subtopics": [
                    { "id": "c_macros_define", "name": "14.1 Preprocessor Directives (#define & Macros)", "count": 100, "desc": "#define symbolic constants, macro functions, stringizing # and ## operators" },
                    { "id": "c_conditional_compilation", "name": "14.2 Conditional Compilation & Header Guards", "count": 100, "desc": "#ifdef, #ifndef, #if, #else, #endif, include guards against double inclusion" },
                    { "id": "c_command_line_args", "name": "14.3 Command Line Arguments (argc & argv[])", "count": 100, "desc": "Passing arguments to main(int argc, char *argv[]), argument parsing" }
                ]
            }
        ]
    },
    {
        "id": "python_programming",
        "name": "Programming in Python",
        "icon": "fa-brands fa-python",
        "badgeColor": "bg-amber",
        "description": "Exhaustive master Python syllabus covering 12 Topics & 30 Subtopics with 100 MCQs each (3,000 total MCQs).",
        "topics": [
            {
                "id": "python_topic_syntax",
                "name": "Topic 1: Intro to Python, PEP 8 & Program Execution",
                "icon": "fa-code",
                "subtopics": [
                    { "id": "python_intro_pep8", "name": "1.1 Python Overview, PEP 8, Identifiers & Design Philosophy", "count": 100, "desc": "Python design rules, PEP 8 guidelines, CPython interpreter, valid identifiers & keywords" },
                    { "id": "python_indentation_comments", "name": "1.2 Indentation, Comments & Docstrings (__doc__)", "count": 100, "desc": "Whitespace block indentation, single/multi-line comments, docstrings & __doc__ attribute" }
                ]
            },
            {
                "id": "python_topic_types",
                "name": "Topic 2: Variables, Primitive Types & Type Conversion",
                "icon": "fa-layer-group",
                "subtopics": [
                    { "id": "python_numeric_types", "name": "2.1 Numeric Types (int, float, complex) & Booleans", "count": 100, "desc": "Arbitrary precision integers, floating point representation, complex numbers, boolean truthiness" },
                    { "id": "python_strings_basics", "name": "2.2 Strings (str), Immutability & Escape Sequences", "count": 100, "desc": "String immutability, triple quotes, raw strings r\"\", escape sequences & unicode support" },
                    { "id": "python_type_casting", "name": "2.3 Type Conversion, Casting & Type Checking", "count": 100, "desc": "Implicit promotion, explicit type casting (int, float, str), type() and isinstance()" }
                ]
            },
            {
                "id": "python_topic_operators",
                "name": "Topic 3: Operators & Expression Evaluation",
                "icon": "fa-calculator",
                "subtopics": [
                    { "id": "python_arithmetic_relational", "name": "3.1 Arithmetic (+,-,*,/,//,%,**) & Relational Operators", "count": 100, "desc": "Floor division // vs float division /, exponentiation **, relational comparisons" },
                    { "id": "python_logical_bitwise", "name": "3.2 Logical (and, or, not) & Bitwise Operators", "count": 100, "desc": "Logical short-circuit evaluation (and, or, not), bitwise AND, OR, XOR, NOT, shifts" },
                    { "id": "python_identity_membership", "name": "3.3 Identity (is) & Membership (in) Operators", "count": 100, "desc": "Object identity operator (is / is not) vs equality (==), membership testing (in / not in)" }
                ]
            },
            {
                "id": "python_topic_control_flow",
                "name": "Topic 4: Conditional Control Flow & Decision Making",
                "icon": "fa-code-branch",
                "subtopics": [
                    { "id": "python_if_elif_else", "name": "4.1 Conditional Branching (if, elif, else)", "count": 100, "desc": "if-elif-else ladders, nested conditionals, boolean truth value testing" },
                    { "id": "python_ternary_pass", "name": "4.2 Conditional Expressions (Ternary) & pass Statement", "count": 100, "desc": "Ternary shorthand (X if Condition else Y), pass placeholder statement" }
                ]
            },
            {
                "id": "python_topic_loops",
                "name": "Topic 5: Loop Constructs & Iteration Helpers",
                "icon": "fa-arrows-rotate",
                "subtopics": [
                    { "id": "python_for_while_loops", "name": "5.1 For Loops, While Loops & Iteration", "count": 100, "desc": "for and while loops, infinite loop patterns, condition evaluation" },
                    { "id": "python_loop_helpers", "name": "5.2 Iteration Helpers (range, enumerate, zip, break, continue, loop else)", "count": 100, "desc": "range(start, stop, step), enumerate(), zip(), break, continue & loop else clause" }
                ]
            },
            {
                "id": "python_topic_sequences",
                "name": "Topic 6: Sequence Data Structures (Lists & Tuples)",
                "icon": "fa-list",
                "subtopics": [
                    { "id": "python_list_operations", "name": "6.1 Lists (Mutability, Indexing, Slicing & Methods)", "count": 100, "desc": "List mutability, negative indexing, slicing lst[start:stop:step], append, extend, pop, sort" },
                    { "id": "python_tuple_operations", "name": "6.2 Tuples (Immutability, Packing & Unpacking)", "count": 100, "desc": "Tuple immutability, single element tuples (x,), tuple packing and sequence unpacking" }
                ]
            },
            {
                "id": "python_topic_unordered",
                "name": "Topic 7: Unordered Data Structures (Sets & Dictionaries)",
                "icon": "fa-table",
                "subtopics": [
                    { "id": "python_set_operations", "name": "7.1 Sets (Uniqueness, Set Operations & Methods)", "count": 100, "desc": "Set uniqueness, union |, intersection &, difference -, symmetric difference ^" },
                    { "id": "python_dict_operations", "name": "7.2 Dictionaries (Key-Value Operations & Hashable Keys)", "count": 100, "desc": "Key-value mapping, dict.get(k, default), items(), keys(), values(), hashable key requirements" }
                ]
            },
            {
                "id": "python_topic_comprehensions",
                "name": "Topic 8: Comprehensions & Functional Tools",
                "icon": "fa-gears",
                "subtopics": [
                    { "id": "python_comprehensions", "name": "8.1 List, Set & Dictionary Comprehensions", "count": 100, "desc": "List comprehensions [x for x in ...], Set comprehensions {x...}, Dict comprehensions {k:v...}" },
                    { "id": "python_lambda_map_filter", "name": "8.2 Lambda Expressions, map(), filter() & reduce()", "count": 100, "desc": "Anonymous lambda functions, functional map(), filter(), functools.reduce()" }
                ]
            },
            {
                "id": "python_topic_functions",
                "name": "Topic 9: Functions, Parameters & LEGB Scope",
                "icon": "fa-cubes",
                "subtopics": [
                    { "id": "python_function_basics", "name": "9.1 Function Definitions (def), Return Values & Default Args", "count": 100, "desc": "def statements, return values, positional args, keyword args, default argument values" },
                    { "id": "python_args_kwargs", "name": "9.2 Arbitrary Arguments (*args, **kwargs) & Special Parameters", "count": 100, "desc": "*args tuple, **kwargs dict, positional-only / and keyword-only * parameter markers" },
                    { "id": "python_legb_scope", "name": "9.3 LEGB Scope Rules, global & nonlocal Keywords", "count": 100, "desc": "Local, Enclosing, Global, Built-in scope hierarchy, global and nonlocal modifications" }
                ]
            },
            {
                "id": "python_topic_oop",
                "name": "Topic 10: Object-Oriented Programming (OOP)",
                "icon": "fa-sitemap",
                "subtopics": [
                    { "id": "python_classes_objects", "name": "10.1 Classes, Objects, self & __init__ Constructor", "count": 100, "desc": "Class declaration, self reference, __init__ constructor, instance vs class variables" },
                    { "id": "python_methods_decorators", "name": "10.2 Class Methods (@classmethod) & Static Methods (@staticmethod)", "count": 100, "desc": "@classmethod (cls), @staticmethod, property decorators (@property, @setter)" },
                    { "id": "python_inheritance_dunder", "name": "10.3 Inheritance, super(), MRO & Dunder Methods", "count": 100, "desc": "Single/Multiple inheritance, super(), MRO algorithm, __str__, __repr__, __len__, __eq__" }
                ]
            },
            {
                "id": "python_topic_exceptions",
                "name": "Topic 11: Exception Handling & File I/O",
                "icon": "fa-triangle-exclamation",
                "subtopics": [
                    { "id": "python_exceptions_try_except", "name": "11.1 Try, Except, Else, Finally & Custom Exceptions", "count": 100, "desc": "try-except-else-finally blocks, raise statement, built-in exception types, custom exceptions" },
                    { "id": "python_file_io_context", "name": "11.2 File I/O Modes & with open() Context Managers", "count": 100, "desc": "Modes ('r', 'w', 'a', 'b'), with open() context manager, read(), readline(), csv module" }
                ]
            },
            {
                "id": "python_topic_advanced",
                "name": "Topic 12: Advanced Python (Generators, Decorators & Standard Library)",
                "icon": "fa-sliders",
                "subtopics": [
                    { "id": "python_iterators_generators", "name": "12.1 Iterators (__iter__, __next__) & Generator Functions (yield)", "count": 100, "desc": "Iterator protocol (__iter__, __next__), generator functions (yield), generator expressions" },
                    { "id": "python_decorators_closures", "name": "12.2 Closures & Decorator Functions (@decorator)", "count": 100, "desc": "Nested functions, closures, decorator wrapper functions (@decorator), functools.wraps" },
                    { "id": "python_standard_library", "name": "12.3 Standard Library Modules (math, os, sys, random, json, re)", "count": 100, "desc": "os.path, sys.argv, random choices, json.dumps/loads, re regex operations" }
                ]
            }
        ]
    },
    {
        "id": "cs_essentials",
        "name": "Computer Science Essentials (Bridge)",
        "icon": "fa-laptop-code",
        "badgeColor": "bg-indigo",
        "description": "Comprehensive foundation covering Hardware/Software, Memory Hierarchy, Number Systems, Office Automation, DBMS, OS & Computer Networks.",
        "topics": [
            {
                "id": "cs_topic_hardware_io",
                "name": "Topic 1: Hardware, Software & I/O Devices",
                "icon": "fa-desktop",
                "subtopics": [
                    { "id": "cs_hardware_software", "name": "1.1 Computer Architecture, Hardware & Software Basics", "count": 100, "desc": "System architecture, CPU components (ALU, CU, Registers), System vs Application software" },
                    { "id": "cs_io_devices", "name": "1.2 Input & Output Devices", "count": 100, "desc": "Keyboard, mouse, optical scanner, MICR, OCR, monitors, printers (impact vs non-impact), plotters" }
                ]
            },
            {
                "id": "cs_topic_memory",
                "name": "Topic 2: Memory Hierarchy & Storage Systems",
                "icon": "fa-microchip",
                "subtopics": [
                    { "id": "cs_primary_secondary_mem", "name": "2.1 Primary Memory (RAM, ROM) & Secondary Storage", "count": 100, "desc": "SRAM, DRAM, PROM, EPROM, EEPROM, Hard Drives, SSDs, Optical Disks (CD/DVD), Flash drives" },
                    { "id": "cs_cache_registers", "name": "2.2 Cache Memory & Processor Registers", "count": 100, "desc": "L1/L2/L3 cache memory, memory access speed hierarchy, registers (PC, MAR, MDR, IR)" }
                ]
            },
            {
                "id": "cs_topic_data_representation",
                "name": "Topic 3: Data Representation & Number Systems", "icon": "fa-binary",
                "subtopics": [
                    { "id": "cs_number_systems", "name": "3.1 Number Systems (Binary, Octal, Decimal, Hex)", "count": 100, "desc": "Base conversions: Binary to Decimal, Octal to Hexadecimal, positional notation" },
                    { "id": "cs_binary_arithmetic", "name": "3.2 Binary Arithmetic, Complements & Encodings", "count": 100, "desc": "Binary addition/subtraction, 1's & 2's complement, ASCII, EBCDIC, Unicode character encodings" }
                ]
            },
            {
                "id": "cs_topic_office_automation",
                "name": "Topic 4: Office Automation & Productivity Tools",
                "icon": "fa-file-lines",
                "subtopics": [
                    { "id": "cs_word_processing", "name": "4.1 Word Processing Concepts & Features", "count": 100, "desc": "Document formatting, paragraph styles, mail merge, headers/footers, spell check" },
                    { "id": "cs_spreadsheets", "name": "4.2 Spreadsheets (Formulas, Functions & Charts)", "count": 100, "desc": "Cells, rows, columns, relative/absolute referencing, SUM, AVERAGE, IF, VLOOKUP, charts" },
                    { "id": "cs_presentation_graphics", "name": "4.3 Presentation Graphics & Multimedia", "count": 100, "desc": "Slide masters, templates, slide transitions, custom animations, presenter view" }
                ]
            },
            {
                "id": "cs_topic_dbms_os",
                "name": "Topic 5: DBMS Basics & Operating System Fundamentals",
                "icon": "fa-database",
                "subtopics": [
                    { "id": "cs_dbms_basics", "name": "5.1 Database Management System (DBMS) Basics", "count": 100, "desc": "Data vs Information, relational tables, primary key, foreign key, SQL queries (SELECT, INSERT)" },
                    { "id": "cs_os_fundamentals", "name": "5.2 Operating System Fundamentals (Kernel & Shell)", "count": 100, "desc": "OS functions, Kernel vs Shell, process scheduling, memory allocation, file systems" }
                ]
            },
            {
                "id": "cs_topic_networks",
                "name": "Topic 6: Data Communications & Computer Networks",
                "icon": "fa-network-wired",
                "subtopics": [
                    { "id": "cs_data_communications", "name": "6.1 Data Communications & Transmission Modes", "count": 100, "desc": "Simplex, Half-Duplex, Full-Duplex, bandwidth, analog vs digital signals, transmission media" },
                    { "id": "cs_network_topologies", "name": "6.2 Computer Networks (LAN, MAN, WAN) & Topologies", "count": 100, "desc": "LAN, MAN, WAN, Bus, Star, Ring, Mesh, Tree topologies, OSI 7-layer model, TCP/IP" }
                ]
            }
        ]
    },
    {
        "id": "discrete_structures",
        "name": "Discrete Structures & Optimization",
        "icon": "fa-diagram-project",
        "badgeColor": "bg-emerald",
        "description": "Master syllabus covering Sets, Inclusion-Exclusion, Relations, Functions, Combinatorics, Algebraic Structures, Boolean Algebra & Graph Theory.",
        "topics": [
            {
                "id": "discrete_topic_sets",
                "name": "Topic 1: Sets, Inclusion-Exclusion & Relations",
                "icon": "fa-shapes",
                "subtopics": [
                    { "id": "discrete_sets_inclusion", "name": "1.1 Sets, Power Sets & Inclusion-Exclusion Principle", "count": 100, "desc": "Set operations (Union, Intersection, Difference), Power sets |P(S)|=2^n, Inclusion-Exclusion principle" },
                    { "id": "discrete_relations_functions", "name": "1.2 Relations (Posets, Equivalence) & Functions", "count": 100, "desc": "Reflexive, Symmetric, Transitive, Equivalence relations, Posets, Hasse diagrams, Injective/Surjective/Bijective functions" }
                ]
            },
            {
                "id": "discrete_topic_counting",
                "name": "Topic 2: Combinatorics, Recurrence & Generating Functions",
                "icon": "fa-calculator",
                "subtopics": [
                    { "id": "discrete_counting_permutations", "name": "2.1 Permutations, Combinations & Pigeonhole Principle", "count": 100, "desc": "nPr, nCr, Pascal's Identity, Pigeonhole Principle applications & Binomial expansion" },
                    { "id": "discrete_recurrence_generating", "name": "2.2 Recurrence Relations & Generating Functions", "count": 100, "desc": "Solving linear homogeneous/non-homogeneous recurrences, characteristic roots & ordinary generating functions" }
                ]
            },
            {
                "id": "discrete_topic_algebraic",
                "name": "Topic 3: Algebraic Structures & Group Theory",
                "icon": "fa-cubes-stacked",
                "subtopics": [
                    { "id": "discrete_algebraic_structures", "name": "3.1 Groups, Monoids, Semigroups, Rings & Fields", "count": 100, "desc": "Group axioms, Abelian groups, Subgroups, Monoids, Semigroups, Rings, Integral Domains & Fields" }
                ]
            },
            {
                "id": "discrete_topic_boolean",
                "name": "Topic 4: Boolean Algebra & Lattices",
                "icon": "fa-toggle-on",
                "subtopics": [
                    { "id": "discrete_boolean_algebra", "name": "4.1 Lattices & Boolean Algebra", "count": 100, "desc": "Lattices (Bounded, Complemented, Distributive), Boolean expressions, Duality, K-Map minimization & Sum-of-Products" }
                ]
            },
            {
                "id": "discrete_topic_graphs",
                "name": "Topic 5: Graph Theory (Paths, Circuits & Connectivity)",
                "icon": "fa-circle-nodes",
                "subtopics": [
                    { "id": "discrete_graph_fundamentals", "name": "5.1 Directed/Undirected Graphs & Connectivity", "count": 100, "desc": "Handshaking lemma, Adjacency/Incidence matrices, Isomorphism, Connected components & Bipartite graphs" },
                    { "id": "discrete_eulerian_hamiltonian", "name": "5.2 Eulerian & Hamiltonian Graphs", "count": 100, "desc": "Eulerian paths & circuits (Euler's theorem), Hamiltonian cycles (Dirac & Ore theorems), Traveling Salesperson" }
                ]
            },
            {
                "id": "discrete_topic_trees",
                "name": "Topic 6: Trees, Planarity & Graph Coloring",
                "icon": "fa-tree",
                "subtopics": [
                    { "id": "discrete_trees_coloring", "name": "6.1 Trees, Planar Graphs & Graph Coloring", "count": 100, "desc": "Tree properties (V - E = 1), Spanning trees (Kruskal/Prim), Euler's planar formula (V - E + F = 2), Chromatic number χ(G)" }
                ]
            }
        ]
    }
];

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
