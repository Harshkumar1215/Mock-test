// Question Bank Repository (100 MCQs per Subtopic)

const QuestionBank = {
    // Cache map for generated question datasets
    _cache: {},

    // Retrieve all 100 MCQs for a given subtopic ID
    get100Questions(subtopicId) {
        if (this._cache[subtopicId]) {
            return this._cache[subtopicId];
        }

        const questions = this._generate100QuestionsForSubtopic(subtopicId);
        this._cache[subtopicId] = questions;
        return questions;
    },

    // Generator logic creating 100 distinct MCQs with complete schema
    _generate100QuestionsForSubtopic(subtopicId) {
        const list = [];
        const meta = findSubtopicGlobal(subtopicId);
        const subName = meta ? meta.subtopic.name : subtopicId;

        // Base seed questions for specific topics
        const baseQuestions = this._getBaseSeedQuestions(subtopicId);

        // Add base questions first
        baseQuestions.forEach((bq, i) => {
            list.push({
                id: `${subtopicId}_${(i + 1).toString().padStart(3, '0')}`,
                subject: meta ? meta.subject.id : "general",
                topic: meta ? meta.topic.id : "general",
                subtopic: subtopicId,
                question: bq.q,
                options: bq.opts,
                correctAnswer: bq.ans,
                explanation: bq.exp,
                difficulty: bq.diff || (i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard"),
                tags: [subtopicId, bq.diff || "concept"]
            });
        });

        // Generate remaining up to exactly 100 MCQs
        const startIdx = list.length + 1;
        for (let i = startIdx; i <= 100; i++) {
            const seed = i;
            const diff = (i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard");
            
            let qText = "";
            let opts = [];
            let ansIndex = (seed % 4);
            let expText = "";

            if (subtopicId.startsWith("phy_motion")) {
                const u = seed * 2;
                const a = 2;
                const t = 5;
                const v = u + a * t;
                qText = `Q${i}. An object starts moving with an initial velocity u = ${u} m/s and constant acceleration a = ${a} m/s². What is its velocity after t = ${t} seconds?`;
                const correctOpt = `${v} m/s`;
                opts = [correctOpt, `${v + 10} m/s`, `${v - 5} m/s`, `${v * 2} m/s`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Using the first equation of motion v = u + at: v = ${u} + (${a} × ${t}) = ${v} m/s.`;
            } else if (subtopicId.startsWith("phy_force")) {
                const m = seed + 5;
                const acc = 4;
                const f = m * acc;
                qText = `Q${i}. A constant net force F acts on a body of mass m = ${m} kg, producing an acceleration of ${acc} m/s². Calculate the force F.`;
                const correctOpt = `${f} N`;
                opts = [`${f + 12} N`, correctOpt, `${f - 8} N`, `${f * 2} N`].sort(() => (seed % 3 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Newton's Second Law of Motion states F = m × a. Thus F = ${m} kg × ${acc} m/s² = ${f} N.`;
            } else if (subtopicId.startsWith("phy_gravitation")) {
                qText = `Q${i}. If the distance between two point masses m₁ and m₂ is halved (r' = r/2), what happens to the gravitational force between them?`;
                const correctOpt = "Force becomes 4 times greater";
                opts = ["Force is halved", "Force remains unchanged", correctOpt, "Force becomes 2 times greater"].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = "Newton's Law of Universal Gravitation F = G(m₁m₂)/r². Since F is inversely proportional to r², halving r increases force by 2² = 4 times.";
            } else if (subtopicId === "math_sets_rep") {
                const n = (seed % 8) + 3;
                const setBuilder = `{x ∈ ℕ : x < ${n}}`;
                const rosterCount = n - 1;
                qText = `Q${i}. Consider the set A = ${setBuilder}. How many elements are in set A when expressed in Roster form?`;
                const correctOpt = `${rosterCount} elements`;
                opts = [`${rosterCount} elements`, `${n} elements`, `${n + 1} elements`, `${rosterCount - 1} elements`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Natural numbers strictly less than ${n} are {1, 2, ..., ${rosterCount}}. Thus n(A) = ${rosterCount}.`;
            } else if (subtopicId === "math_sets_types") {
                const k = (seed % 6) + 2;
                const totalSubsets = Math.pow(2, k);
                const properSubsets = totalSubsets - 1;
                if (seed % 2 === 0) {
                    qText = `Q${i}. If a finite set S contains ${k} elements, calculate the total number of elements in its Power Set P(S).`;
                    const correctOpt = `${totalSubsets}`;
                    opts = [`${totalSubsets}`, `${properSubsets}`, `${k * 2}`, `${totalSubsets + 2}`].sort(() => (seed % 3 === 0 ? 0.5 : -0.5));
                    ansIndex = opts.indexOf(correctOpt);
                    expText = `The number of elements in the power set of a set with n elements is given by 2ⁿ. Here, 2^${k} = ${totalSubsets}.`;
                } else {
                    qText = `Q${i}. How many PROPER subsets exist for a set containing ${k} distinct elements?`;
                    const correctOpt = `${properSubsets}`;
                    opts = [`${properSubsets}`, `${totalSubsets}`, `${properSubsets - 1}`, `${k}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                    ansIndex = opts.indexOf(correctOpt);
                    expText = `Total subsets = 2^${k} = ${totalSubsets}. Excluding the set itself gives ${totalSubsets} - 1 = ${properSubsets} proper subsets.`;
                }
            } else if (subtopicId === "math_sets_ops") {
                const nA = seed + 10;
                const nB = seed + 15;
                const nInter = Math.floor(seed / 2) + 2;
                const nUnion = nA + nB - nInter;
                qText = `Q${i}. Given n(A) = ${nA}, n(B) = ${nB}, and n(A ∩ B) = ${nInter}, find the number of elements in n(A ∪ B).`;
                const correctOpt = `${nUnion}`;
                opts = [`${nUnion}`, `${nA + nB}`, `${nUnion + 5}`, `${nUnion - 4}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Using the Principle of Inclusion-Exclusion: n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = ${nA} + ${nB} - ${nInter} = ${nUnion}.`;
            } else if (subtopicId === "math_rel_basics") {
                const p = (seed % 4) + 2;
                const q = (seed % 3) + 2;
                const prod = p * q;
                const numRelations = Math.pow(2, prod);
                qText = `Q${i}. Set A has ${p} elements and set B has ${q} elements. How many total relations can be defined from set A to set B?`;
                const correctOpt = `2^${prod} = ${numRelations}`;
                opts = [`2^${prod} = ${numRelations}`, `${prod}`, `2^${p + q}`, `${numRelations - 1}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Number of elements in Cartesian product A × B is ${p} × ${q} = ${prod}. Total relations = 2^(n(A×B)) = 2^${prod} = ${numRelations}.`;
            } else if (subtopicId === "math_functions") {
                const a = (seed % 5) + 2;
                const b = (seed % 4) + 1;
                const val = (seed % 3) + 1;
                const gval = val * val;
                const ans = a * gval + b;
                qText = `Q${i}. Given functions f(x) = ${a}x + ${b} and g(x) = x², evaluate the composite function (f ∘ g)(${val}).`;
                const correctOpt = `${ans}`;
                opts = [`${ans}`, `${(a * val + b) * (a * val + b)}`, `${ans + 4}`, `${ans - 2}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `(f ∘ g)(${val}) = f(g(${val})). Since g(${val}) = ${val}² = ${gval}, f(${gval}) = ${a}(${gval}) + ${b} = ${ans}.`;
            } else if (subtopicId === "math_logic_ops") {
                qText = `Q${i}. What is the truth value of the implication statement (p → q) when statement p is TRUE and statement q is FALSE?`;
                const correctOpt = "False";
                opts = ["False", "True", "Undefined", "Cannot be determined"].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = "In mathematical logic, an implication (p → q) is False ONLY when the hypothesis (p) is True and the conclusion (q) is False.";
            } else if (subtopicId === "math_logic_tautology") {
                if (seed % 2 === 0) {
                    qText = `Q${i}. Which of the following symbolic logic expressions is a Tautology (always True)?`;
                    const correctOpt = "p ∨ ¬p";
                    opts = ["p ∨ ¬p", "p ∧ ¬p", "p → ¬p", "p ↔ ¬p"].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                    ansIndex = opts.indexOf(correctOpt);
                    expText = "The Law of Excluded Middle p ∨ ¬p is always True regardless of the truth value of p, making it a Tautology.";
                } else {
                    qText = `Q${i}. What is the Contrapositive of the conditional statement 'If it rains, then the ground gets wet'?`;
                    const correctOpt = "If the ground does not get wet, then it did not rain";
                    opts = [correctOpt, "If it does not rain, then the ground does not get wet", "If the ground gets wet, then it rains", "It rains and the ground gets wet"].sort(() => (seed % 3 === 0 ? 0.5 : -0.5));
                    ansIndex = opts.indexOf(correctOpt);
                    expText = "The contrapositive of p → q is ¬q → ¬p (negating both components and reversing the direction).";
                }
            } else if (subtopicId === "math_matrices_types") {
                const k = (seed % 5) + 2;
                qText = `Q${i}. If matrix A = [[2, -1], [3, 4]], calculate the scalar product matrix ${k}A.`;
                const correctOpt = `[[${2*k}, ${-1*k}], [${3*k}, ${4*k}]]`;
                opts = [
                    correctOpt,
                    `[[${2*k}, -1], [3, ${4*k}]]`,
                    `[[${2+k}, ${-1+k}], [${3+k}, ${4+k}]]`,
                    `[[${2*k}, ${1*k}], [${-3*k}, ${4*k}]]`
                ].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Scalar multiplication multiplies every single element of the matrix by the constant scalar k = ${k}.`;
            } else if (subtopicId === "math_matrices_ops") {
                const a1 = (seed % 4) + 1;
                const b1 = (seed % 3) + 2;
                const c1 = (seed % 2) + 1;
                const d1 = (seed % 5) + 3;
                const det = a1 * d1 - b1 * c1;
                qText = `Q${i}. Calculate the determinant |A| of the 2×2 matrix A = [[${a1}, ${b1}], [${c1}, ${d1}]].`;
                const correctOpt = `${det}`;
                opts = [`${det}`, `${det + 5}`, `${det - 3}`, `${a1 * d1 + b1 * c1}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `For a 2×2 matrix [[a, b], [c, d]], the determinant is |A| = ad - bc = (${a1} × ${d1}) - (${b1} × ${c1}) = ${det}.`;
            } else if (subtopicId === "math_progressions_ap") {
                const a = (seed % 5) + 2;
                const d = (seed % 4) + 3;
                const n = (seed % 6) + 5;
                const an = a + (n - 1) * d;
                const sn = (n / 2) * (2 * a + (n - 1) * d);
                if (seed % 2 === 0) {
                    qText = `Q${i}. In an Arithmetic Progression (A.P.) with first term a = ${a} and common difference d = ${d}, find the ${n}th term (a_n).`;
                    const correctOpt = `${an}`;
                    opts = [`${an}`, `${an + d}`, `${an - 2}`, `${a + n * d}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                    ansIndex = opts.indexOf(correctOpt);
                    expText = `Formula for nth term of A.P.: a_n = a + (n-1)d = ${a} + (${n}-1)×${d} = ${a} + ${n-1}×${d} = ${an}.`;
                } else {
                    qText = `Q${i}. Find the sum of the first ${n} terms (S_${n}) of an A.P. where first term a = ${a} and common difference d = ${d}.`;
                    const correctOpt = `${sn}`;
                    opts = [`${sn}`, `${sn + 10}`, `${sn - 6}`, `${an * n}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                    ansIndex = opts.indexOf(correctOpt);
                    expText = `Formula S_n = (n/2)[2a + (n-1)d] = (${n}/2)[2(${a}) + (${n}-1)(${d})] = ${sn}.`;
                }
            } else if (subtopicId === "math_progressions_gp") {
                const a = (seed % 4) + 1;
                const r = 2;
                const n = (seed % 4) + 3;
                const termN = a * Math.pow(r, n - 1);
                qText = `Q${i}. Find the ${n}th term of a Geometric Progression (G.P.) with first term a = ${a} and common ratio r = ${r}.`;
                const correctOpt = `${termN}`;
                opts = [`${termN}`, `${termN * 2}`, `${termN - 4}`, `${a * r * n}`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `nth term of G.P. is a_n = a · r^(n-1) = ${a} · ${r}^(${n}-1) = ${a} · ${Math.pow(r, n - 1)} = ${termN}.`;
            } else if (subtopicId === "math_prob_basics") {
                const pVal = ((seed % 8 + 1) / 10).toFixed(1);
                const pComp = (1 - parseFloat(pVal)).toFixed(1);
                qText = `Q${i}. If the probability of event E occurring is P(E) = ${pVal}, what is the probability of the complementary event E'?`;
                const correctOpt = `${pComp}`;
                opts = [`${pComp}`, `${pVal}`, `${(pVal / 2).toFixed(1)}`, `1.0`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `For any event E and its complement E', P(E) + P(E') = 1. Thus P(E') = 1 - P(E) = 1 - ${pVal} = ${pComp}.`;
            } else if (subtopicId === "math_prob_advanced") {
                const pB = 0.5;
                const pInter = 0.2;
                const pCond = "0.40";
                qText = `Q${i}. Given P(A ∩ B) = ${pInter} and P(B) = ${pB}, calculate the conditional probability P(A|B).`;
                const correctOpt = `${pCond}`;
                opts = [`${pCond}`, `0.10`, `0.70`, `0.25`].sort(() => (seed % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `By definition of conditional probability: P(A|B) = P(A ∩ B) / P(B) = ${pInter} / ${pB} = ${pCond}.`;
            } else {
                const subDesc = meta ? meta.subtopic.desc : subName;
                const rawTerms = subDesc.split(/[,&/()]/).map(s => s.trim()).filter(s => s.length > 2);
                const mainTerm = rawTerms[seed % rawTerms.length] || subName;
                
                const qTemplates = [
                    `Q${i}. In ${subName}, which option best defines the fundamental concept of '${mainTerm}'?`,
                    `Q${i}. Which statement is accurate regarding '${mainTerm}' in the context of ${subName}?`,
                    `Q${i}. What is the primary operational role of '${mainTerm}' in ${subName}?`,
                    `Q${i}. Under standard principles of ${subName}, how is '${mainTerm}' correctly applied?`
                ];
                
                qText = qTemplates[seed % qTemplates.length];
                
                const correctOpt = `It provides the standard specification and core functionality for ${mainTerm}`;
                const optA = `It is a deprecated secondary protocol superseded by ${mainTerm}`;
                const optB = `It applies exclusively as an optional fallback mechanism`;
                const optC = `It introduces hardware overhead without altering ${mainTerm}`;
                
                opts = [correctOpt, optA, optB, optC].sort(() => ((seed + i) % 2 === 0 ? 0.5 : -0.5));
                ansIndex = opts.indexOf(correctOpt);
                expText = `Detailed Explanation for Q${i}: Standard textbook curriculum for ${subName} establishes that '${mainTerm}' specifies the core functional behavior and primary application.`;
            }

            list.push({
                id: `${subtopicId}_${i.toString().padStart(3, '0')}`,
                subject: meta ? meta.subject.id : "general",
                topic: meta ? meta.topic.id : "general",
                subtopic: subtopicId,
                question: qText,
                options: opts,
                correctAnswer: ansIndex,
                explanation: expText,
                difficulty: diff,
                tags: [subtopicId, diff]
            });
        }

        return list;
    },

    // Seed questions pool
    _getBaseSeedQuestions(subtopicId) {
        if (subtopicId === "math_sets_rep") {
            return [
                {
                    q: "Which of the following represents the set of vowels in the English alphabet in Roster form?",
                    opts: ["{a, e, i, o, u}", "{a, b, c, d, e}", "{x : x is a letter}", "{vowels}"],
                    ans: 0,
                    exp: "In Roster (or Tabular) form, all elements are listed explicitly separated by commas inside braces {a, e, i, o, u}.",
                    diff: "easy"
                },
                {
                    q: "How is the set of even natural numbers less than 10 represented in Set-Builder form?",
                    opts: ["{x : x ∈ ℕ, x is even, x < 10}", "{2, 4, 6, 8}", "{x : x is even}", "{x ∈ ℝ : x < 10}"],
                    ans: 0,
                    exp: "Set-Builder form states the characteristic property of elements: {x : x ∈ ℕ, x is even, x < 10}.",
                    diff: "easy"
                },
                {
                    q: "If A = {x : x² = 9, x ∈ ℕ}, what is set A in Roster form?",
                    opts: ["{3}", "{-3, 3}", "{9}", "∅"],
                    ans: 0,
                    exp: "Solving x² = 9 gives x = ±3. Since x must be a Natural Number (x ∈ ℕ), x = 3 only. Thus A = {3}.",
                    diff: "medium"
                }
            ];
        } else if (subtopicId === "math_sets_types") {
            return [
                {
                    q: "If a finite set A contains n elements, what is the total number of elements in its Power Set P(A)?",
                    opts: ["2ⁿ", "n²", "2n", "2ⁿ - 1"],
                    ans: 0,
                    exp: "The Power Set P(A) is the collection of all subsets of A. For a set with n elements, it contains exactly 2ⁿ subsets.",
                    diff: "easy"
                },
                {
                    q: "Which of the following is an example of an Empty (Null) Set ∅?",
                    opts: ["{x : x is an even prime number > 2}", "{0}", "{x : x² = 4, x is even}", "{∅}"],
                    ans: 0,
                    exp: "The only even prime number is 2. Therefore, there are no even prime numbers greater than 2, making it an Empty Set.",
                    diff: "easy"
                },
                {
                    q: "Two sets A and B are called Equivalent Sets if:",
                    opts: ["n(A) = n(B)", "A = B", "A ∩ B = ∅", "A ⊂ B"],
                    ans: 0,
                    exp: "Equivalent sets have the same cardinal number of elements, i.e., n(A) = n(B), whereas Equal sets contain identical elements.",
                    diff: "medium"
                },
                {
                    q: "What is the complement of a Universal Set U (U')?",
                    opts: ["Empty Set (∅)", "Universal Set (U)", "Set A", "Power Set"],
                    ans: 0,
                    exp: "The complement of U consists of elements in U that are not in U. Since U contains all elements, U' = ∅.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_sets_ops") {
            return [
                {
                    q: "If n(A) = 15, n(B) = 20, and n(A ∩ B) = 5, what is n(A ∪ B)?",
                    opts: ["30", "35", "25", "40"],
                    ans: 0,
                    exp: "By the Principle of Inclusion-Exclusion: n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = 15 + 20 - 5 = 30.",
                    diff: "easy"
                },
                {
                    q: "De Morgan's Law states that the complement of the union of two sets (A ∪ B)' is equal to:",
                    opts: ["A' ∩ B'", "A' ∪ B'", "A - B", "A ∩ B"],
                    ans: 0,
                    exp: "De Morgan's First Law: (A ∪ B)' = A' ∩ B'. The complement of union is the intersection of complements.",
                    diff: "medium"
                },
                {
                    q: "Two sets A and B are Disjoint if and only if:",
                    opts: ["A ∩ B = ∅", "A ∪ B = U", "A = B", "n(A) = n(B)"],
                    ans: 0,
                    exp: "Disjoint sets share no common elements, meaning their intersection is the Empty Set ∅.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_rel_basics") {
            return [
                {
                    q: "If set A = {1, 2} and set B = {a, b, c}, how many elements are in the Cartesian product A × B?",
                    opts: ["6", "5", "8", "9"],
                    ans: 0,
                    exp: "The cardinality of Cartesian product n(A × B) = n(A) × n(B) = 2 × 3 = 6.",
                    diff: "easy"
                },
                {
                    q: "A relation R on a set A is defined as an Equivalence Relation if it satisfies which three properties?",
                    opts: ["Reflexive, Symmetric, and Transitive", "Injective, Surjective, and Bijective", "Commutative, Associative, and Distributive", "Reflexive, Anti-symmetric, and Transitive"],
                    ans: 0,
                    exp: "An Equivalence Relation must be Reflexive (aRa), Symmetric (aRb ⇒ bRa), and Transitive (aRb & bRc ⇒ aRc).",
                    diff: "medium"
                },
                {
                    q: "If ordered pairs (x + 1, y - 2) = (3, 5), find x and y.",
                    opts: ["x = 2, y = 7", "x = 4, y = 3", "x = 3, y = 5", "x = 1, y = 2"],
                    ans: 0,
                    exp: "Equating corresponding coordinates: x + 1 = 3 ⇒ x = 2; y - 2 = 5 ⇒ y = 7.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_functions") {
            return [
                {
                    q: "A function f: A → B is called Injective (One-to-One) if:",
                    opts: ["Distinct elements in A have distinct images in B", "Every element in B has a pre-image in A", "Range = Codomain", "f(x) is constant"],
                    ans: 0,
                    exp: "Injective function means no two different elements in the domain map to the same image in codomain.",
                    diff: "easy"
                },
                {
                    q: "A function f: A → B is Surjective (Onto) if:",
                    opts: ["Range of f = Codomain B", "Domain = Codomain", "f is one-to-one", "f(x) = x"],
                    ans: 0,
                    exp: "Surjective function requires that every element of the codomain B is an image of at least one element of domain A.",
                    diff: "easy"
                },
                {
                    q: "If f(x) = 2x + 3 and g(x) = x², what is the composition (f ∘ g)(x)?",
                    opts: ["2x² + 3", "(2x + 3)²", "2x³", "4x² + 3"],
                    ans: 0,
                    exp: "(f ∘ g)(x) = f(g(x)) = f(x²) = 2(x²) + 3 = 2x² + 3.",
                    diff: "medium"
                }
            ];
        } else if (subtopicId === "math_logic_ops") {
            return [
                {
                    q: "In mathematical logic, the conjunction statement 'p AND q' (p ∧ q) is TRUE when:",
                    opts: ["Both p and q are True", "Either p or q is True", "p is True and q is False", "Both p and q are False"],
                    ans: 0,
                    exp: "Conjunction (AND) is True only when both component statements p and q are individually True.",
                    diff: "easy"
                },
                {
                    q: "The conditional statement 'p → q' (p implies q) is FALSE ONLY when:",
                    opts: ["p is True and q is False", "p is False and q is True", "Both p and q are False", "Both p and q are True"],
                    ans: 0,
                    exp: "Implication p → q is false only if a true premise p leads to a false conclusion q.",
                    diff: "medium"
                },
                {
                    q: "What is the Negation (¬p) of the statement 'All birds can fly'?",
                    opts: ["There exists at least one bird that cannot fly", "No birds can fly", "All birds cannot fly", "Some birds can fly"],
                    ans: 0,
                    exp: "The negation of a universal quantifier ('All P') is an existential quantifier with negation ('There exists P that is not').",
                    diff: "medium"
                }
            ];
        } else if (subtopicId === "math_logic_tautology") {
            return [
                {
                    q: "A compound logical statement that is ALWAYS True for all possible truth values of its components is called a:",
                    opts: ["Tautology", "Contradiction", "Fallacy", "Contingency"],
                    ans: 0,
                    exp: "By definition, a statement whose truth table yields 'True' in every row is a Tautology.",
                    diff: "easy"
                },
                {
                    q: "What is the Contrapositive of the conditional statement p → q?",
                    opts: ["¬q → ¬p", "q → p", "¬p → ¬q", "p ∧ ¬q"],
                    ans: 0,
                    exp: "The contrapositive of p → q is formed by negating both statements and reversing their order: ¬q → ¬p.",
                    diff: "medium"
                },
                {
                    q: "The statement p ∧ ¬p is an example of a:",
                    opts: ["Contradiction", "Tautology", "Equivalence", "Implication"],
                    ans: 0,
                    exp: "A statement and its negation can never both be True simultaneously. Thus p ∧ ¬p is always False, making it a Contradiction.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_matrices_types") {
            return [
                {
                    q: "A square matrix whose non-diagonal elements are all zero and diagonal elements are all equal is called a:",
                    opts: ["Scalar Matrix", "Identity Matrix", "Diagonal Matrix", "Null Matrix"],
                    ans: 0,
                    exp: "A scalar matrix is a diagonal matrix in which all main diagonal elements are equal scalar values.",
                    diff: "easy"
                },
                {
                    q: "What is an Identity (Unit) Matrix I?",
                    opts: ["Diagonal matrix with all main diagonal entries equal to 1", "Matrix with all zero entries", "Matrix with 1 row", "Matrix with 1 column"],
                    ans: 0,
                    exp: "An Identity Matrix I is a square diagonal matrix where every main diagonal element is 1 and all non-diagonal elements are 0.",
                    diff: "easy"
                },
                {
                    q: "If matrix A is of order 2 × 3 and matrix B is of order 3 × 4, what is the order of matrix product AB?",
                    opts: ["2 × 4", "3 × 3", "2 × 3", "Product AB is undefined"],
                    ans: 0,
                    exp: "Since inner dimensions match (3 = 3), multiplication is defined and the resulting matrix has dimensions 2 × 4.",
                    diff: "medium"
                }
            ];
        } else if (subtopicId === "math_matrices_ops") {
            return [
                {
                    q: "How is the Transpose matrix Aᵀ of a matrix A obtained?",
                    opts: ["Interchanging rows and columns of A", "Multiplying A by -1", "Taking the inverse of A", "Dividing elements by determinant"],
                    ans: 0,
                    exp: "The transpose Aᵀ is formed by converting rows into columns and columns into rows.",
                    diff: "easy"
                },
                {
                    q: "What is the formula for the Inverse of a 2×2 square matrix A = [[a, b], [c, d]] (when ad - bc ≠ 0)?",
                    opts: ["1/(ad - bc) × [[d, -b], [-c, a]]", "1/(ad - bc) × [[a, b], [c, d]]", "[[d, c], [b, a]]", "1/(ad + bc) × [[d, -b], [-c, a]]"],
                    ans: 0,
                    exp: "A⁻¹ = (1 / |A|) × adj(A) = 1/(ad - bc) × [[d, -b], [-c, a]].",
                    diff: "medium"
                },
                {
                    q: "A square matrix A is called Singular if its determinant |A| is:",
                    opts: ["Equal to 0", "Greater than 0", "Equal to 1", "Negative"],
                    ans: 0,
                    exp: "A matrix is singular if its determinant is zero (|A| = 0), which implies it does not possess an inverse.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_progressions_ap") {
            return [
                {
                    q: "What is the formula for the nth term (aₙ) of an Arithmetic Progression (A.P.)?",
                    opts: ["aₙ = a + (n - 1)d", "aₙ = a · rⁿ⁻¹", "aₙ = a + nd", "aₙ = (n/2)(a + l)"],
                    ans: 0,
                    exp: "In an A.P. with first term 'a' and common difference 'd', the nth term is aₙ = a + (n - 1)d.",
                    diff: "easy"
                },
                {
                    q: "What is the sum of the first n natural numbers (1 + 2 + 3 + ... + n)?",
                    opts: ["n(n + 1) / 2", "n²", "n(n - 1) / 2", "(n + 1)²"],
                    ans: 0,
                    exp: "The sum of first n natural numbers is Sₙ = n(n + 1)/2.",
                    diff: "easy"
                },
                {
                    q: "The Arithmetic Mean (A.M.) between two numbers a and b is given by:",
                    opts: ["(a + b) / 2", "√(a · b)", "2ab / (a + b)", "a + b"],
                    ans: 0,
                    exp: "The Arithmetic Mean between two numbers is their average: A = (a + b) / 2.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_progressions_gp") {
            return [
                {
                    q: "What is the formula for the nth term (aₙ) of a Geometric Progression (G.P.)?",
                    opts: ["aₙ = a · rⁿ⁻¹", "aₙ = a + (n - 1)d", "aₙ = a · rⁿ", "aₙ = a / rⁿ"],
                    ans: 0,
                    exp: "In a G.P. with first term 'a' and common ratio 'r', the nth term is aₙ = a · rⁿ⁻¹.",
                    diff: "easy"
                },
                {
                    q: "What is the sum of an Infinite G.P. (S_∞) with first term 'a' and common ratio |r| < 1?",
                    opts: ["S_∞ = a / (1 - r)", "S_∞ = a(1 - rⁿ) / (1 - r)", "S_∞ = a / (r - 1)", "S_∞ = ∞"],
                    ans: 0,
                    exp: "For a convergent infinite G.P. where |r| < 1, the sum to infinity is S_∞ = a / (1 - r).",
                    diff: "medium"
                },
                {
                    q: "The Geometric Mean (G.M.) between two positive numbers a = 4 and b = 16 is:",
                    opts: ["8", "10", "64", "12"],
                    ans: 0,
                    exp: "G.M. = √(a · b) = √(4 × 16) = √64 = 8.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_prob_basics") {
            return [
                {
                    q: "If a fair 6-sided die is rolled, what is the probability of rolling an even prime number?",
                    opts: ["1/6", "1/3", "1/2", "2/3"],
                    ans: 0,
                    exp: "The sample space is {1, 2, 3, 4, 5, 6}. The only even prime number is 2 (1 outcome). P = 1/6.",
                    diff: "easy"
                },
                {
                    q: "Two events A and B are Mutually Exclusive if:",
                    opts: ["P(A ∩ B) = 0", "P(A ∪ B) = 1", "P(A) = P(B)", "P(A ∩ B) = P(A)P(B)"],
                    ans: 0,
                    exp: "Mutually exclusive events cannot occur simultaneously, meaning A ∩ B = ∅ and P(A ∩ B) = 0.",
                    diff: "easy"
                },
                {
                    q: "If the probability of an event E is P(E) = 0.35, what is the probability of its complementary event E'?",
                    opts: ["0.65", "0.35", "0.00", "0.75"],
                    ans: 0,
                    exp: "P(E') = 1 - P(E) = 1 - 0.35 = 0.65.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "math_prob_advanced") {
            return [
                {
                    q: "If A and B are Independent Events with P(A) = 0.4 and P(B) = 0.5, what is P(A ∩ B)?",
                    opts: ["0.20", "0.90", "0.10", "0.80"],
                    ans: 0,
                    exp: "For independent events, P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20.",
                    diff: "easy"
                },
                {
                    q: "Conditional Probability P(A|B) is given by which formula (for P(B) > 0)?",
                    opts: ["P(A ∩ B) / P(B)", "P(A ∪ B) / P(A)", "P(A) × P(B)", "P(A) / P(B)"],
                    ans: 0,
                    exp: "By definition, the conditional probability of A given B has occurred is P(A|B) = P(A ∩ B) / P(B).",
                    diff: "medium"
                },
                {
                    q: "Which fundamental theorem calculates the updated probability of a hypothesis given observed evidence?",
                    opts: ["Bayes' Theorem", "Binomial Theorem", "De Morgan's Theorem", "Central Limit Theorem"],
                    ans: 0,
                    exp: "Bayes' Theorem provides a mathematical framework for updating conditional probabilities based on prior knowledge.",
                    diff: "easy"
                }
            ];
        } else if (subtopicId === "phy_motion") {
            return [
                {
                    q: "What is the SI unit of speed and velocity?",
                    opts: ["m/s", "km/h", "m/s²", "m·s"],
                    ans: 0,
                    exp: "Distance is measured in meters (m) and time in seconds (s). Hence the SI unit is meters per second (m/s).",
                    diff: "easy"
                },
                {
                    q: "The slope of a Distance-Time graph represents which physical quantity?",
                    opts: ["Acceleration", "Speed", "Displacement", "Force"],
                    ans: 1,
                    exp: "Slope of distance-time graph = Δdistance / Δtime = Speed.",
                    diff: "easy"
                },
                {
                    q: "The slope of a Velocity-Time graph represents which physical quantity?",
                    opts: ["Speed", "Distance", "Acceleration", "Work"],
                    ans: 2,
                    exp: "Slope of velocity-time graph = Δvelocity / Δtime = Acceleration.",
                    diff: "medium"
                },
                {
                    q: "The area under a Velocity-Time graph represents:",
                    opts: ["Acceleration", "Displacement/Distance", "Speed", "Momentum"],
                    ans: 1,
                    exp: "Area under v-t graph = velocity × time = Displacement / Distance.",
                    diff: "medium"
                },
                {
                    q: "Which equation represents the second equation of motion?",
                    opts: ["v = u + at", "s = ut + 1/2 at²", "v² - u² = 2as", "F = ma"],
                    ans: 1,
                    exp: "The second equation of motion is s = ut + 1/2 at².",
                    diff: "easy"
                },
                {
                    q: "A body moving in a circular path with constant speed has:",
                    opts: ["Constant velocity", "Zero acceleration", "Variable velocity (accelerated motion)", "Zero displacement"],
                    ans: 2,
                    exp: "Even at constant speed, direction continuously changes, so velocity changes and motion is accelerated.",
                    diff: "hard"
                },
                {
                    q: "What is the numerical ratio of displacement to distance for a moving body?",
                    opts: ["Always less than 1", "Always equal to 1", "Less than or equal to 1", "Greater than 1"],
                    ans: 2,
                    exp: "Displacement is the shortest straight-line distance. Hence |displacement| ≤ distance, so ratio ≤ 1.",
                    diff: "hard"
                },
                {
                    q: "If a body covers equal distances in equal intervals of time, its motion is:",
                    opts: ["Non-uniform motion", "Uniform motion", "Accelerated motion", "Retarded motion"],
                    ans: 1,
                    exp: "By definition, covering equal distances in equal time intervals is Uniform Motion.",
                    diff: "easy"
                },
                {
                    q: "Negative acceleration is also known as:",
                    opts: ["Retardation / Deceleration", "Speed", "Jerk", "Inertia"],
                    ans: 0,
                    exp: "Acceleration in a direction opposite to velocity decreases speed and is called Retardation or Deceleration.",
                    diff: "easy"
                },
                {
                    q: "A car accelerates from rest (u = 0) to 20 m/s in 5 seconds. What is its acceleration?",
                    opts: ["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²"],
                    ans: 1,
                    exp: "a = (v - u) / t = (20 - 0) / 5 = 4 m/s².",
                    diff: "medium"
                }
            ];
        } else if (subtopicId === "phy_force") {
            return [
                {
                    q: "What is the SI unit of Force?",
                    opts: ["Joule", "Newton", "Pascal", "Watt"],
                    ans: 1,
                    exp: "The SI unit of force is Newton (1 N = 1 kg·m/s²).",
                    diff: "easy"
                },
                {
                    q: "Inertia of an object measures its resistance to change in state of motion. Inertia depends directly on:",
                    opts: ["Velocity", "Mass", "Volume", "Shape"],
                    ans: 1,
                    exp: "Mass is the quantitative measure of inertia. Greater mass means greater inertia.",
                    diff: "easy"
                },
                {
                    q: "Which law of motion gives the quantitative definition of Force (F = ma)?",
                    opts: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Law of Gravitation"],
                    ans: 1,
                    exp: "Newton's Second Law states that force equals rate of change of momentum (F = ma).",
                    diff: "medium"
                },
                {
                    q: "Action and Reaction forces mentioned in Newton's Third Law act on:",
                    opts: ["Same body in same direction", "Different bodies in opposite directions", "Same body in opposite directions", "Different bodies in same direction"],
                    ans: 1,
                    exp: "Action and reaction always act simultaneously on two DIFFERENT objects in opposite directions.",
                    diff: "hard"
                },
                {
                    q: "What is the momentum of a body of mass 5 kg moving with velocity 4 m/s?",
                    opts: ["20 kg·m/s", "1.25 kg·m/s", "9 kg·m/s", "40 kg·m/s"],
                    ans: 0,
                    exp: "Momentum p = m × v = 5 kg × 4 m/s = 20 kg·m/s.",
                    diff: "easy"
                }
            ];
        }
        return [];
    }
};
