# SYSTEM PROMPT FOR LLMS USING THIS GUIDE

You are an expert AI assistant specialized in the ErgoAI logic programming language and its ecosystem. Your primary role is to assist users with understanding, writing, debugging, optimizing, and explaining ErgoAI code and concepts.

**Sources of Truth & Prioritization:**

1.  **Primary Source:** Unless otherwise instructed by the user, your knowledge and responses MUST be based **PRIMARILY** on the information contained within this document ("ErgoAI Guide for LLMs", or "the Guide" for short). This is your main reference.
2.  **Secondary Sources:** If the primary "ErgoAI Guide for LLMs" seems insufficient, lacks necessary detail for the current task, or requires information clearly outside its scope (e.g., deep underlying Prolog details), you may consult additional references provided by the user. If you think a secondary source should be consulted but that source has not been provided by the user, you may ask the user to upload that reference so that you can access it. Secondary sources typically include:
    *   Official ErgoAI Manuals (Installation, User, Packages, etc.)
    *   Official XSB Prolog Manuals (as ErgoAI runs on XSB)
    *   Other specific source files or documentation provided by the user.
3.  **External Knowledge:** Unless otherwise instructed by the user, do **NOT** rely on general external knowledge, web searches, or information recalled from training data unless it is explicitly corroborated by one of the provided documents (Primary or Secondary). If you think such external knowledge, web searches, or information recalled from training data are important for the current task, ask the user for permission to use those sources before using them.

The primary "ErgoAI Guide for LLMs" contains two distinct parts:
*   **Part I: ErgoAI Syntax Guide for LLMs:** Covers the detailed grammar, syntax elements, operators, and structure of the ErgoAI language.
*   **Part II: ErgoAI Usage Guide for LLMs:** Covers practical aspects like installation, running ErgoAI, using the Studio IDE, integrations, advanced semantics, debugging, performance, style, and system module APIs.

**Your Core Capabilities:**

1.  **Syntax Explanation:** Understand and explain ErgoAI syntax based on **Part I** of the primary guide, potentially clarifying with secondary sources if needed.
2.  **Code Generation:** Generate accurate and idiomatic ErgoAI code adhering to **Part I** syntax and utilizing features described in **Part II** or secondary sources where appropriate.
3.  **Usage Guidance:** Provide instructions and explanations for tasks covered in **Part II** or official manuals (if provided).
4.  **Debugging Assistance:** Help interpret debugger output, understand errors, and suggest strategies based on **Part II, Section 5** or relevant sections in provided manuals.
5.  **Performance & Style Advice:** Offer advice based on guidelines presented in **Part II, Section 6** or relevant sections in provided manuals.
6.  **Semantic Explanation:** Explain complex ErgoAI/Prolog concepts based on **Part II, Section 4** or relevant sections in provided manuals.
7.  **API Reference:** Explain system modules and predicates based on **Part II, Section 7** or relevant sections in provided manuals.

**Interaction Guidelines:**

*   **Prioritize the Custom Guide:** Always attempt to answer using this "ErgoAI Guide for LLMs" first.
*   **Use Secondary Sources Appropriately:** Only consult user-provided secondary sources (ErgoAI/Prolog manuals) when the primary guide is insufficient. State clearly when you are doing so.
*   **Cite Your Source:** When responding, **clearly cite the specific document and section(s)** you are referencing (e.g., "According to the 'ErgoAI Guide for LLMs', Part I, Section 3.3...", "Based on the provided 'ErgoAI User Manual', Section X...", "As detailed in the 'XSB Manual', Volume Y, Chapter Z...").
*   **Request Missing Sources:** If you believe necessary information is likely in official ErgoAI or XSB manuals but they haven't been provided, state this limitation and **recommend the user upload the relevant documents**.
*   **Critique the Primary Guide:** While using the "ErgoAI Guide for LLMs" as your primary reference, critically evaluate it. If you suspect it contains **inaccuracies, significant omissions relative to standard practices (if known from provided secondary sources), or internal contradictions**, politely point this out to the user. Explain your reasoning, referencing specific parts of the guide or conflicting information from other provided sources.
*   **Cross-Reference:** Actively cross-reference information between different parts of the primary guide and between the primary and secondary sources as needed.
*   **Code Formatting:** Format **all** ErgoAI code snippets correctly using fenced code blocks with the `ergo` language identifier:
    ```ergo
    // ErgoAI code goes here
    example_rule(?X) :- condition(?X).
    ```
*   **Handle Ambiguity:** If the user's request is ambiguous, ask for clarification.
*   **Acknowledge Limitations:** If the user asks about something **not covered in ANY provided document**, explicitly state that the information is not available in the provided materials. Do not invent information.

**Tone:** Maintain a helpful, accurate, precise, and expert tone.

Your ultimate goal is to be a reliable and knowledgeable assistant for users working with ErgoAI, leveraging the provided comprehensive guide as your primary reference but intelligently incorporating other user-provided documentation when necessary and critically evaluating the information available.

**Common Mistakes to look out for:** Always make sure to get these right!
*   **Comment syntax:** ErgoAI uses `//` to denote inline comments and `/*...*/` to denote multiline comments. `%` does NOT denote a comment in ErgoAI syntax!
*   **String concatenation:** ErgoAI uses the `||` operator for string concatenation.

---

# PART I: ErgoAI Syntax Guide for LLMs

---

## 1. Introduction

This section provides a high-level overview of the ErgoAI language syntax, its fundamental components, and basic conventions like comments.

### 1.1. Overview of ErgoAI Syntax

ErgoAI is a sophisticated object-based knowledge representation and reasoning platform. Its syntax is influenced by several logic programming paradigms, providing a unified language based on:

*   **F-logic:** For object-oriented knowledge representation (frames, classes, inheritance).
*   **HiLog:** Allowing higher-order syntax where variables can range over predicates and function symbols.
*   **Transaction Logic:** For updates and actions within a logical framework (though syntax details differ).
*   **Defeasible Reasoning:** For handling contradictions and exceptions in rules.

ErgoAI possesses a rich syntax designed to be expressive and facilitate complex knowledge modeling and reasoning tasks. It does not employ alphanumeric reserved keywords, except for symbols starting with a backslash (`\`).

**(Background from Prolog)**

It is useful to understand that ErgoAI, while distinct, originates from the logic programming paradigm pioneered by Prolog. Standard ISO Prolog [ISO95] (Prolog Tutorial Slides, Slide 3) is a *relational* language based on first-order logic, evaluated using SLD resolution with backtracking (Prolog Tutorial Slides, Slides 9, 18). This means:
*   Queries can have multiple solutions.
*   Evaluation typically proceeds top-down (rule selection) and left-to-right (literal selection) (Prolog Tutorial Slides, Slide 22).
*   Backtracking is the core mechanism for exploring alternative solutions upon failure (Prolog Tutorial Slides, Slide 19).
*   Unification is used to match goals with rule heads and bind variables (Prolog Tutorial Slides, Slide 9, 28).

ErgoAI differs significantly:
*   It uses an object-oriented syntax (F-logic) and higher-order syntax (HiLog).
*   Its evaluation often relies on *tabling* (memoization) and the Well-Founded Semantics for negation, rather than pure SLD resolution (see Part II, Section 4.5).
*   While rooted in logic, its specific features and focus on knowledge representation lead to different syntax and semantics compared to core Prolog.

### 1.2. Basic Syntactic Elements

ErgoAI programs are composed of several fundamental statement types:

*   **Rules:** Define logical implications and constitute the core knowledge. They generally have the form `Head :- Body.` where `Head` is derived if `Body` is true. Rules can optionally start with descriptors like `@!{...}` or `@{...}`.
*   **Facts:** Represent unconditionally true statements. Syntactically, they are rules without a body, having the form `Head.`. Facts can also have optional descriptors.
*   **Queries:** Requests for information from the knowledge base. In files, they take the form `?- Body.`. In the interactive ERGO shell, the `?-` prefix is omitted.
*   **Directives:** Instructions that control the compiler or the runtime environment. Compiler directives start with `:-` (e.g., `:- op{...}`) and affect compilation. Runtime directives start with `?-` (e.g., `?- setsemantics{...}`) and modify the runtime state.
*   **Latent Queries:** Queries stored for later execution, identified by descriptors. They have the form `descriptor !- Body.`.

Rule heads, bodies, queries, and facts are constructed from base formulas (frames, predicates) using logical connectives and quantifiers.

### 1.3. Comments

ErgoAI supports two styles of comments for annotating code:

*   **Single-line comments:** Start with `//` and extend to the end of the line.
    ```ergo
    // This is a single-line comment.
    p(a). // This comment follows a statement.
    ```
*   **Multi-line comments:** Enclosed between `/*` and `*/`. These can span multiple lines.
    ```ergo
    /* This is a
       multi-line comment.
       It can span several lines. */
    q(b) /* This is an inline multi-line comment */ :- r(b).
    ```

Comments are treated as whitespace by the compiler and can be used to delimit tokens.

## 2. Core Syntax: Rules, Facts, Queries

This section details the fundamental syntactic structures used to define knowledge and ask questions in ErgoAI: Rules, Facts, and Queries, along with associated elements like descriptors.

### 2.1. Rule Structure

Rules form the core of an ErgoAI knowledge base, defining logical implications and relationships. The basic structure of a rule is:

```ergo
Head :- Body.
```

*   **`Head`**: Represents the conclusion(s) of the rule. It consists of one or more atomic formulas (frame or HiLog literals), potentially combined with logical connectives like conjunction (`,`, `\and`) or disjunction (`;`, `\or`), explicit negation (`\neg`), or quantifiers (in omniform rules).
*   **`:-`**: The implication operator, read as "if". It separates the head from the body.
*   **`Body`**: Represents the premise(s) or condition(s) of the rule. It consists of a logical formula which can include atomic formulas, conjunctions, disjunctions, negations (`\naf`, `\+`, `\neg`), quantifiers (`forall`, `exists`), and other control flow constructs.
*   **`.`**: The period terminates every ErgoAI statement, including rules.

A rule states that if the `Body` evaluates to true, then the `Head` can be derived as true.

```ergo
// Example Rule: Someone is mortal if they are a man.
mortal(?X) :- man(?X).
```
**(Comparison with Prolog)**

The fundamental `Head :- Body.` structure mirrors standard Prolog rules (Prolog Tutorial Slides, Slide 13). The `:-` operator signifies implication, and the period `.` terminates clauses in both languages. Prolog rules also implicitly quantify variables: variables appearing only in the body are existentially quantified within the body, while other variables are universally quantified over the entire rule (Prolog Tutorial Slides, Slides 14-15). ErgoAI supports this but also adds explicit quantifiers (`forall`/`exists`).

### 2.2. Fact Structure

Facts represent statements that are unconditionally true within the knowledge base. Syntactically, a fact is a rule without a body:

```ergo
Head.
```

*   **`Head`**: An atomic formula (frame or HiLog literal) representing the fact. Explicit negation (`\neg`) is permitted.
*   **`.`**: The period terminates the fact statement.

Facts are essentially rules with an implicitly true body.

```ergo
// Example Fact: Socrates is a man.
man(socrates).

// Example Fact using frame syntax
socrates[age -> 56].
```

**Important Note on Module Context in Definitions:** When defining facts (or rule heads) within an `.ergo` file that will be loaded into a specific module, these definitions become part of that module. If a fact needs to refer to an entity (e.g., a class name, another instance) defined in a *different* module, you **must** use a `:- importmodule{...}` directive at the top of the file to make that external name known. **Do not** use explicit module qualifiers like `module:` or `@module` directly within the fact definition itself (e.g., `my_instance : other_module:my_class.` is incorrect; use `:- importmodule{other_module}.` and then `my_instance : my_class.`).

### 2.3. Query Structure

Queries are used to request information from the knowledge base. Their syntax depends on the context (in a file vs. interactive shell):

*   **In Files:** Queries embedded within `.ergo` files are prefixed with `?-`.
    ```ergo
    ?- mortal(?X).
    ```
    These queries are typically executed automatically when the file is loaded or added. The `.` terminator is required.

*   **In Interactive Shell:** When interacting directly with the ErgoAI shell (e.g., in the Ergo Listener or ErgoAI Terminal), the `?-` prefix **must be omitted**. The shell expects queries directly.
    ```ergo
    mortal(?X).
    ```
    Typing `?- mortal(?X).` in the shell will result in a syntax error.

Syntactically, the `Body` of a query is identical in structure to the `Body` of a rule.

### 2.4. Rule Descriptors

Rules and facts can be annotated with descriptors that provide meta-information, such as rule identifiers (Ids), tags, or defeasibility status. Descriptors precede the rule/fact head.

*   **Rule Id Descriptor:** `@!{id[frame]}` or `@!{id}`. Specifies a local identifier (`id`) for the rule. Optional frame properties can provide further meta-data. If omitted, a unique Id is generated by the system.
*   **Tag Descriptor:** `@{tag1, tag2, ...}`. Assigns one or more tags (terms) to the rule, often used in defeasible reasoning.
*   **Defeasibility Descriptor:** `@@{defeasible}` or `@@{strict}`. Explicitly sets the rule's defeasibility status (see Section 41).

```ergo
// Example: Rule with an Id, a tag, and defeasibility status
@!{mortal_rule} @{human_rules} @@{strict} mortal(?X) :- man(?X).

// Example: Fact with just a tag
@{basic_fact} man(socrates).
```

Multiple descriptors can be used, but only one `@!{...}` and one `@@{...}` descriptor are allowed per rule/fact.

**Reserved Properties in Rule Descriptors:**
When defining rule descriptors using the frame syntax `@!{id[...]}`, the following property names have special meaning and are reserved for system use within this context:

*   `tag`: Specifies rule tags used for defeasible reasoning and grouping. Value can be a single term or a set `{tag1, tag2, ...}`. Shortcut: `@{tag1, tag2}`.
*   `defeasible`: Boolean property (value `\true` or `\false`). If true, marks the rule as defeasible. Shortcut: `@@{defeasible}`.
*   `strict`: Boolean property. If true, marks the rule as strict (cannot be defeated). Shortcut: `@@{strict}`.
*   `module`: Reserved for system use; stores the module the rule belongs to. Cannot be set explicitly by the user in the descriptor.
*   `file`: Reserved for system use; stores the file the rule originates from. Cannot be set explicitly by the user in the descriptor.
*   `type`: Reserved for system use; indicates if the statement is a `rule` or a `query` (for latent queries). Cannot be set explicitly by the user in the descriptor.

Other property names (like `author`, `creationDate`, `comment`, etc.) can be freely defined and used by the knowledge engineer for storing arbitrary meta-data associated with the rule. These user-defined properties can be queried using `clause{@!{idpattern}...}` or `@!{idpattern}`.

### 2.5. Latent Queries

Latent queries are similar to regular queries but are not executed immediately when a file is loaded. They are stored and must be invoked explicitly later using their Id. They require a descriptor.

```ergo
descriptor !- query-body.
```

*   **`descriptor`**: A mandatory rule descriptor (typically `@!{id}` or `@{tag}`) used to identify and invoke the query.
*   **`!-`**: The operator indicating a latent query.
*   **`query-body`**: The body of the query, identical in structure to a rule body or a regular query.
*   **`.`**: The period terminates the statement.

```ergo
// Example Latent Query: Check for negative balances (to be invoked later)
@!{check_balance} !- account[balance -> ?Bal], ?Bal < 0.
```

Latent queries are an older mechanism; integrity constraints and alerts offer more powerful alternatives for similar use cases (see Sections 39, 40).

#### 2.5.1 Invoking Latent Queries

Latent queries defined using the `descriptor !- body.` syntax are not executed automatically. They must be invoked explicitly using the `query{...}` primitive.

*   **Syntax:** `query{ QueryId }`
    *   `QueryId`: The local Id term specified in the rule descriptor (`@!{id[frame]}` or `@{tag}`) of the latent query definition. This Id typically contains variables that get bound when the query executes.
*   **Semantics:** Finds the latent query matching `QueryId` (using the full rule Id: `(LocalId, FileName, Module)`). Executes the `query-body` of that latent query. Backtracks through all solutions of the body, binding variables in `QueryId` accordingly.

```ergo
// Definition in file mylatent.ergo, loaded into module 'lat'
@!{check(?Item)} !- item(?Item), price(?Item, ?P), ?P < 0.

// Invocation from the shell or another rule
?- query{check(MyItem)@'mylatent.ergo'@lat}.
// Binds MyItem to items with negative prices defined in module lat
```
**Note:** You need to provide the full rule Id (local Id, file name, module) to `query{}` unless invoking from the same file/module context where `@\@F`, `@\@` provide the defaults. If the latent query was inserted dynamically, the file name component is `dynrule(...)` (see Section 37).

## 3. Terms and Data Representation

ErgoAI employs a rich system for representing data and knowledge, combining elements of F-logic and HiLog. This section details the fundamental building blocks: terms, symbols, variables, frames, and various data types.

### 3.1. F-logic Vocabulary & Symbols

The core vocabulary consists of constants and variables, forming the basis for more complex terms and formulas.

#### 3.1.1. Constants

Constants represent fixed values or entities in the knowledge base.

*   **General Constant Symbols (Atoms):**
    *   Start with a lowercase letter, followed by zero or more letters, digits, or underscores (e.g., `john`, `apple_pie`, `v_10`).
    *   Can be any sequence of characters enclosed in single quotes (e.g., `'John Smith'`, `'AB@*c'`, `'default.ergo'`). Backslashes and single quotes within quoted atoms must be escaped (e.g., `'isn\'t'`, `'a\\b'`). Special escape sequences like `\n`, `\t` are recognized (see Section 7.2 of ergo-manual.pdf).
    *   These are also referred to as Prolog atoms and belong to the class `\symbol`.
    ```ergo
    constant1.
    'Another constant'.
    'It\'s escaped'.
    ```

*   **Numeric Constants:**
    *   Integers: Sequences of digits (e.g., `123`, `5063`). Integers in bases 2 through 36 can be represented using `base'digits` (e.g., `2'1111111111`, `16'3FF`). Underscores (`_`) can be used as delimiters (e.g., `2'11_1111_1111`). Belong to class `\long`.
    *   Floating Point / Decimals: Use standard decimal notation (e.g., `24.38`, `0.3`). An optional exponent (`e` or `E`) can be included (e.g., `12.345e12`, `2.43e-2`). Belong to class `\double`.
    ```ergo
    age(john, 30).       // Integer
    price(apple, 1.25). // Float/Decimal
    speedOfLight(299’792’458). // Integer with underscores
    binaryRepresentation(2'101010). // Integer in base 2
    ```

*   **Typed Literals:** Represent data conforming to specific primitive types (see Section 3.8). They have the syntax `"lexical_form"^^datatype`.
    ```ergo
    "2023-10-27"^^ \date .
    "10.5"^^xsd:decimal. // Example using a predefined IRI prefix
    "true"^^ \boolean .
    ```

**Escape Sequences in Symbols:**
Within single-quoted symbols (atoms), special characters can be represented using escape sequences starting with a backslash (`\`):

| Sequence     | ASCII (Dec) | Meaning         |
| :----------- | :---------- | :-------------- |
| `\\`         | 92          | Backslash (`\`) |
| `\n` or `\N` | 10          | NewLine (LF)    |
| `\t` or `\T` | 9           | Tab (HT)        |
| `\r` or `\R` | 13          | Return (CR)     |
| `\v` or `\V` | 11          | Vertical Tab    |
| `\b` or `\B` | 8           | Backspace       |
| `\f` or `\F` | 12          | Form Feed       |
| `\e` or `\E` | 27          | Escape          |
| `\d` or `\D` | 127         | Delete          |
| `\s` or `\S` | 32          | Whitespace      |
| `\'`         | 39          | Single Quote    |
| `\`'`        | 96          | Back Quote      |
| `\xHH...H\|` | -           | Unicode (Hex)   |
| `\uDD...D\|` | -           | Unicode (Dec)   |

*   For Unicode escapes (`\x...|`, `\u...|`), use 1-6 hex digits or 1-7 decimal digits followed by `|`. The value must be a valid Unicode code point (<= 1,114,112).
*   A literal single quote within a single-quoted atom can also be represented by doubling it (e.g., `'isn''t'`).

**(Comparison with Prolog)**
In standard Prolog (Prolog Tutorial Slides, Slide 11), constants are typically *atoms* (starting with a lowercase letter or enclosed in single quotes) or *numbers*. ErgoAI's `\symbol` corresponds roughly to Prolog atoms not used for representing strings or IRIs. Note the syntactic difference: Prolog atoms usually start lowercase, while ErgoAI symbols can start with uppercase or lowercase but must not start with `?` or `\`. Single quotes in Prolog denote atoms, while double quotes usually denote lists of character codes ("strings") - this differs from ErgoAI's use of `""^^datatype`.

#### 3.1.2. Variables

Variables are placeholders that can be bound to terms or constants during query evaluation.

*   **Standard Variables:** Start with `?` followed by a letter or underscore, then zero or more letters, digits, or underscores (e.g., `?X`, `?Name`, `?_v_5`). Multiple occurrences of the same standard variable within a rule refer to the same entity.
*   **Anonymous Variables:** Represented by `?_` or `?`. Each occurrence is treated as a distinct, unique variable, even within the same rule. Used when the specific binding is not needed.
*   **Don't Care Variables (Silent Variables):** Start with `?_` followed by a name (e.g., `?_abc`). Multiple occurrences within the same rule refer to the *same* variable, but its bindings are not reported in query answers. Used to avoid singleton variable warnings when a variable appears only once but its identity across occurrences might matter (though its final binding isn't needed).

```ergo
// ?Person is a standard variable
mortal(?Person) :- human(?Person).

// ? is an anonymous variable, ?_age is a don't care variable
?- person[age -> ?_age, name -> ?].
```
Variable scope is typically the rule or fact in which they appear. Variables appearing only in the body are existentially quantified; variables appearing in the head are universally quantified over the whole rule.

**(Comparison with Prolog)**

Standard Prolog typically uses variables starting with an uppercase letter or an underscore (e.g., `X`, `Name`, `_Var`, `_`) (Prolog Tutorial Slides, Slide 11). The single underscore `_` is the anonymous variable, similar to ErgoAI's `?` or `?_`. Prolog's named "don't care" variables (`_Name`) function similarly to ErgoAI's `?_Name`. ErgoAI's use of the `?` prefix for all variables is a key syntactic distinction.

#### 3.1.3. Quasi-constants

Quasi-constants are special symbols substituted with context-dependent values at compile or load time.

*   `\@F`: Replaced by the local name of the file where it occurs. In the shell, it's `'(runtime)'`.
*   `\@L`: Replaced by the line number in the source file where it occurs.
*   `\@`: Replaced by the name of the module the file is being loaded into (default `main`).
*   `\@!`: Replaced by the local Id of the rule/fact where it occurs. Used within rule descriptors.
*   `\@?`: Represents the null value. `\@? = \@?` and `\@? :=: \@?` are true, but `\@? == \@?` is false.
*   **Skolem Constants/Functions:** Used for generating unique identifiers.
    *   Local Skolems (`\#`, `\#N`, `\#name`): Scope is typically a single Ergo sentence (terminated by `.`). `\#` generates a unique constant per occurrence. `\#N` and `\#name` generate a constant unique to that number/name within the scope, allowing co-reference.
    *   Global Skolems (`\##N`, `\##name`): Scope persists until changed by `:- new_global_oid_scope.`. Allows co-reference across rules/facts within the same scope.

```ergo
ruleId(\@!) :- body. // \@! refers to the Id of this rule

dataOrigin(\@F, \@L). // \@F and \@L refer to file and line

\#1[type -> book, title -> 'Ergo Intro']. // \#1 is a local Skolem constant
\##book1[type -> book, title -> 'Ergo Intro']. // \##book1 is a global Skolem constant
```

#### 3.1.4. Quasi-variables

Quasi-variables are instantiated by the system at runtime with meta-information.

*   `\?C`: Bound to the name of the module from which the current rule was called.
*   `\?F`: Bound to the file name from which a sensor was called (used only within sensor definitions).
*   `\?L`: Bound to the line number from which a sensor was called (used only within sensor definitions).

```ergo
p(?X) :- caller_module(\?C), writeln('Called from module: '\\?C)@\io.
```

### 3.2. HiLog Terms

ErgoAI utilizes HiLog syntax, which generalizes standard first-order terms. Key features:

*   Variables can appear in the position of function symbols or predicates.
*   Terms can serve as functors.

This allows for higher-order logic programming constructs while retaining first-order semantics.

```ergo
// ?X is a variable in predicate position
?- p(?X), ?X(a).

// f(?Y) is a term used as a functor
termAsFunctor( f(?Y)(arg1, arg2) ).

// HiLog term p(a)(?X(f,b))
complexHiLog( p(a)(?X(f,b)) ).
```

**(Background)**

Standard Prolog terms consist of constants, variables, and structures `functor(arg1, ..., argN)` where the functor must be an atom (Prolog Tutorial Slides, Slide 25). HiLog generalizes this by allowing variables and other terms to appear in the functor position.

### 3.3. Frame Syntax (F-logic molecules)

Frames provide an object-oriented syntax for representing properties and methods of objects and classes.

#### 3.3.1. Object-centric frames

Describe properties of individual objects. Syntax: `object[propertySpecs]`.

```ergo
john[age -> 30,
     address -> addr1,
     children -> {mary, peter}
].
```

#### 3.3.2. Class-centric frames

Define default properties or signatures for all members/subclasses of a class. Syntax: `ClassName[|propertyOrSignatureSpecs|]`.

```ergo
Person[| name => \string,
         age => \integer,
         likes -> music // Default value
      |].
```

#### 3.3.3. Method Types

Frames distinguish between specifying data/values and specifying type signatures.

*   **Data Methods (`->`)**: Associates an object/class with specific values for a property/method.
    ```ergo
    john[age -> 30].             // Object-level data
    Person[|likes -> music|].    // Class-level default data
    ```
*   **Signature Methods (`=>`)**: Specifies the expected type (range) for the results of a property/method.
    ```ergo
    john[age => \integer].       // Object-level signature
    Person[|age => \integer|].   // Class-level signature
    ```
    Cardinality constraints can be added to signatures: `Meth{Lower..Upper}=>Type`.
    ```ergo
    employee[|salary{1..1}=>\integer|]. // Salary is mandatory, single-valued integer
    ```

#### 3.3.4. Boolean Methods

Represent properties that are either true or false for an object/class, without returning a value.

```ergo
john[is_tall].             // Object-level boolean property is true
Person[|is_vegetarian|].   // Class-level default boolean property is true
```
Signatures use `=>`: `Person[|is_vegetarian => \boolean|]`.

#### 3.3.5. Composite Frames

Multiple properties/methods/signatures for the same subject (object or class) can be grouped within a single frame using commas (`,`).

```ergo
// Object frame with multiple properties
john[age -> 30, name -> 'John Doe', address -> addr1].

// Class frame with multiple signatures and defaults
Person[| name => \string, age => \integer, likes -> music |].
```

#### 3.3.6. Empty Frames

An empty frame asserts the existence of the object or class.

*   Object: `object[]` (e.g., `mary[]`)
*   Class: `Class[||]` (e.g., `Person[||]`)

These assert that `mary` exists or that `Person` is a class, implying statements about them can be derived.

### 3.4. ISA Literals

ISA literals define class membership and subclass relationships.

*   **Instance-of (`:`)**: `object : Class`. States that `object` is an instance of `Class`.
    ```ergo
    john : Person.
    ```
*   **Subclass-of (`::`)**: `SubClass :: SuperClass`. States that `SubClass` is a subclass of `SuperClass`.
    ```ergo
    Student :: Person.
    ```

    **Note on Querying ISA Across Modules:** When querying an ISA relationship (e.g., `Instance : Class`) where the instance and class might be defined in different modules and the ISA assertion fact resides in a specific `target_module`, the correct query form is `Instance : Class @ target_module`. Do not qualify `Instance` or `Class` with their defining modules within the literal part of the query; rely on the `@target_module` context for resolution. See Section 7.3 for more details and examples.

### 3.5. Path Expressions

Path expressions provide a concise way to navigate through object properties. The dot (`.`) operator is used.

*   `object.method`: Accesses the value(s) of `method` for `object`. Equivalent to `object[method -> ?Value]`.
*   Nested Paths: `object.method1.method2`. Equivalent to `object[method1 -> ?X], ?X[method2 -> ?Value]`. Path expressions associate to the left: `a.b.c` is `(a.b).c`.

```ergo
?- john.children.name. // Find the names of John's children

?- john.address.street. // Find the street of John's address
```
Path expressions represent object Ids and cannot appear as truth-valued literals on their own; they must typically be part of a frame or used where an Id-term is expected. To use a path expression as a query condition, attach empty brackets: `john.children[]`.

### 3.6. Set Notation

Curly braces `{...}` are used within frames or terms to denote sets of objects, simplifying conjunctions.

*   `object[method -> {val1, val2}]` is shorthand for `object[method -> val1], object[method -> val2]`.
*   `{obj1, obj2}: Class` is shorthand for `obj1:Class, obj2:Class`.
*   `{Class1, Class2}:: SuperClass` is shorthand for `Class1::SuperClass, Class2::SuperClass`.
*   `{term1, term2}(arg)` is shorthand for `term1(arg), term2(arg)`.

```ergo
john[children -> {mary, peter}]. // John has children Mary and Peter
{mary, peter} : Person.          // Mary and Peter are Persons
```

### 3.7. Lists

ErgoAI supports standard Prolog-style lists.

*   **Empty List:** `[]`
*   **List with Elements:** `[element1, element2, ..., elementN]` (e.g., `[a, b, c]`, `[1, 2, 3]`)
*   **Head/Tail Notation:** `[Head | Tail]` (e.g., `[a | ?Rest]`)

Lists belong to the primitive type `\list`.

```ergo
courses([cs101, cs202, cs305]).
processList([H|T]) :- processHead(H), processList(T).
processList([]).
```

**(Prolog Background)**

Prolog lists are fundamental data structures (Prolog Tutorial Slides, Slide 26, 30). The syntax `[a,b,c]` is syntactic sugar for the term `.(a, .(b, .(c, [])))`. The `[Head|Tail]` notation directly accesses the head element and the rest of the list (tail). Recursion using this structure is common for list processing, as seen in standard definitions like `member/2` and `append/3` (Prolog Tutorial Slides, Slides 30, 31). Because predicates are relational, `append/3` can be used not only to join lists but also to split them or check membership (Prolog Tutorial Slides, Slide 32).

### 3.8. Primitive Data Types

*Note: This section provides an overview of primitive data types and their associated methods based on the information in this Guide. For the definitive list of all types, synonyms, methods, exact signatures, parameter details, return values, and specific behaviors, always consult the official **ErgoAI Reasoner User's Manual, Section 42**.*

ErgoAI provides a range of built-in primitive data types, largely aligned with XML Schema types, facilitating data representation and interoperability. Each primitive type `\typeName` has a corresponding built-in class also named `\typeName`. Constants belonging to these types are often represented using typed literals (`"lexicalForm"^^typeName`), though shorter forms exist for many.

Methods associated with these types are accessed via the system module `@\basetype` (or its synonym `@\btp`). We categorize methods as:
*   **Class Methods:** Called on the type name itself (e.g., `\integer[isTypeOf(5)]@\basetype`).
*   **Instance Methods:** Called on an instance of the type (e.g., `"..."^^type[method(args)]@\basetype`). These include:
    *   **Component Methods:** Accessing specific parts of the data type's structure (e.g., year, month, day for dates). Usually defined within `[|...|]` in the signatures below, indicating they apply to the class structure.
    *   **Other Instance Methods:** General operations like comparisons, conversions.

#### 3.8.1 General Methods Overview

Most primitive types support variants of the following common methods via `@\basetype`:

*   `\TypeName[=> isTypeOf(\object)]`: Checks if the object belongs to the primitive type `\TypeName`.
*   `\TypeName[toType(Args...) => \TypeName]`: Constructs a value of `\TypeName` from components or lexical form. (Specific Args depend on the type).
*   `?Instance[=> equals(\object)]`: Checks if the instance is equal to another object (type-specific comparison).
*   `?Instance[=> lessThan(\object)]`: Checks if the instance is less than another object (type-specific order).
*   `?Instance[=> lessEq(\object)]`: Checks if the instance is less than or equal to another object.
*   `?Instance[typeName => \symbol]`: Returns the type name (e.g., `\integer`, `\dateTime`).
*   `?Instance[toSymbol => \symbol]`: Returns the standard printable string/atom representation of the instance.
*   `?Instance[rawValue => \any]`: Returns the underlying raw representation (often internal, use with caution).

The following subsections detail the specifics for each type.

#### 3.8.2 Type: `\symbol` (Abstract Symbols)

*   **Description:** Represents abstract symbols, corresponding to Prolog atoms that are not used internally for strings or IRIs. Used for names, identifiers, etc. Internally, ErgoAI may distinguish abstract symbols from the representations used for strings and IRIs using special character encodings to ensure efficiency and correctness, even though all might appear as standard Prolog atoms if inspected directly. *(Ref: Manual Section 42.1)*.
*   **Lexical Form:** Standard Prolog atoms (e.g., `abc`, `state_5`, `'Hello World'`). Typed literal form `"..."^^ \symbol` is possible but uncommon.
*   **Class:** `\symbol`
*   **Class Methods (@\basetype):**
    *   `\symbol[=> isTypeOf(\object)]`: Checks if object is of type `\symbol`.
    *   `\symbol[toType(\number) => \symbol]`: Converts a number to its symbolic representation.
    *   `\symbol[concat(List) => \symbol]`: Concatenates list elements (symbols, numbers, strings) into a single symbol atom.
*   **Instance Methods (@\basetype):**
    *   `?Instance[|toNumber => \number|]`: Converts symbol to number if it represents one, else returns original symbol. Issues warning on failure.
    *   `?Instance[|contains(\symbol or \string)|]`: Boolean check for substring presence.
    *   `?Instance[|contains(\symbol or \string) => \list|]`: Returns `[StartIndex, EndIndex]` of first substring match (1-based), or fails.
    *   `?Instance[|length => \integer|]`: Returns character length.
    *   `?Instance[|subsymbol(\integer, \integer) => \symbol|]`: Extracts substring `subsymbol(Start, Length)`.
    *   `?Instance[|toUpper => \symbol|]`, `?Instance[|toLower => \symbol|]`: Case conversion.
    *   `?Instance[|toList => \charlist|]`: Converts symbol into a character list.
    *   `?Instance[|startsWith(\symbol or \string)|]`, `?Instance[|endsWith(\symbol or \string)|]`: Prefix/suffix check.
    *   `?Instance[|reverse => \symbol|]`: Reverses characters.
    *   `?Instance[=> equals(\object)]`: Checks for symbol equality (same as Prolog atom equality `==`).
    *   `?Instance[=> lessThan(\object)]`: Checks standard Prolog term order (`@<`).
    *   `?Instance[=> lessEq(\object)]`: Checks standard Prolog term order (`@=<`).
    *   `?Instance[toSymbol => \symbol]`: Returns the symbol itself.
    *   `?Instance[typeName => \symbol]`: Returns `\symbol`.
    *   `?Instance[rawValue => \symbol]`: Returns the symbol itself.

#### 3.8.3 Type: `\iri` (Internationalized Resource Identifiers)

*   **Description:** Represents IRIs (generalization of URLs), used for identifying resources on the web or within knowledge bases.
*   **Lexical Form:**
    *   Full Typed: `"http://example.org/res"^^ \iri`
    *   Abbreviated: `\"http://example.org/res"`
    *   Compact (CURIE): `prefix#localName`. To use this form, the `prefix` must be defined within the current module scope using the `:- iriprefix` compiler directive:
    ```ergo
    :- iriprefix{ex = "http://example.org/resource#"}.
    // Now you can use ex#someResource
    ```
    *(See Manual Section 42.2.1 for details on IRI prefix scopes).*
*   **Class:** `\iri`
*   **Class Methods (@\basetype):**
    *   `\iri[=> isTypeOf(\object)]`: Checks if object is of type `\iri`.
    *   `\iri[toType(\symbol) => \iri]`: Constructs an IRI from its lexical string/symbol representation.
*   **Instance Component Methods (@\basetype):** (Availability depends on IRI scheme)
    *   `?Instance[|scheme => \symbol|]`
    *   `?Instance[|user => \symbol|]`
    *   `?Instance[|host => \symbol|]`
    *   `?Instance[|port => \symbol|]`
    *   `?Instance[|path => \symbol|]`
    *   `?Instance[|query => \symbol|]`
    *   `?Instance[|fragment => \symbol|]`
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|toSymbol => \symbol|]`: Returns the full IRI string as a symbol atom.
    *   `?Instance[=> equals(\object)]`: Checks for IRI equality.
    *   `?Instance[=> lessThan(\object)]`: Compares IRIs lexicographically.
    *   `?Instance[=> lessEq(\object)]`: Compares IRIs lexicographically.
    *   `?Instance[typeName => \symbol]`: Returns `\iri`.
    *   `?Instance[rawValue => \symbol]`: Returns the full IRI string as a symbol atom.

#### 3.8.4 Type: `\dateTime` (Date and Time)

*   **Description:** Represents specific points in time with date, time, and optional timezone (XML Schema `dateTime`).
*   **Lexical Form:** `"ZYYYY-MM-DDTHH:MM:SS.sZHH:MM"^^ \dateTime`. (Z=optional sign '-', T=separator, .s=optional fractional seconds, ZHH:MM=optional timezone).
*   **Class:** `\dateTime` (Synonyms: `\dt`, `xsd:dateTime`)
*   **Class Methods (@\basetype):**
    *   `\dateTime[=> isTypeOf(\object)]`: Checks if object is of type `\dateTime`.
    *   `\dateTime[now => \dateTime]`: Current local dateTime.
    *   `\dateTime[now(utc) => \dateTime]`: Current UTC dateTime.
    *   `\dateTime[now(\decimal) => \dateTime]`: Current UTC dateTime adjusted by timezone offset (e.g., `-5.0`).
    *   `\dateTime[toType(Sign,Y,M,D,H,Mn,S,Zs,Zh,Zm) => \dateTime]`: Constructs from numeric components. `Sign`, `Zs` are 1 or -1.
    *   `\dateTime[toType(\symbol) => \dateTime]`: Constructs from lexical string representation.
*   **Instance Component Methods (@\basetype):**
    *   `?Instance[|dateSign => \integer|]` (-1 for BCE, 1 for CE)
    *   `?Instance[|year => \integer|]`
    *   `?Instance[|month => \integer|]`
    *   `?Instance[|day => \integer|]`
    *   `?Instance[|hour => \integer|]`
    *   `?Instance[|minute => \integer|]`
    *   `?Instance[|second => \integer|]` (Can be decimal)
    *   `?Instance[|zoneSign => \integer|]`
    *   `?Instance[|zoneHour => \integer|]`
    *   `?Instance[|zoneMinute => \integer|]`
    *   `?Instance[|date => \date]`: Extracts the date part.
    *   `?Instance[|time => \time]`: Extracts the time part.
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|add(\duration) => \dateTime]`: Adds duration. Also performs subtraction if arguments appropriately bound.
    *   `?Instance[|minus(\dateTime) => \duration]`: Calculates duration between two dateTimes.
    *   `?Instance[|toSymbol => \symbol|]`: Returns the standard lexical representation as a symbol.
    *   `?Instance[=> equals(\object)]`: Checks chronological equality (accounts for timezones).
    *   `?Instance[=> lessThan(\object)]`: Checks chronological order.
    *   `?Instance[=> lessEq(\object)]`: Checks chronological order.
    *   `?Instance[typeName => \symbol]`: Returns `\dateTime`.
    *   `?Instance[rawValue => \any]`: Returns underlying internal representation.

#### 3.8.5 Type: `\date` (Date)

*   **Description:** Represents a specific day (XML Schema `date`). Represents the duration of a day.
*   **Lexical Form:** `"ZYYYY-MM-DDZHH:MM"^^ \date`. (Z = optional sign '-', ZHH:MM = optional timezone).
*   **Class:** `\date` (Synonyms: `\d`, `xsd:date`)
*   **Class Methods (@\basetype):**
    *   `\date[=> isTypeOf(\object)]`: Checks if object is of type `\date`.
    *   `\date[now => \date]`: Current local date.
    *   `\date[now(utc) => \date]`: Current UTC date.
    *   `\date[now(\decimal) => \date]`: Current UTC date adjusted by timezone offset.
    *   `\date[toType(Sign,Y,M,D,Zs,Zh,Zm) => \date]`: Constructs from numeric components.
    *   `\date[toType(\symbol) => \date]`: Constructs from lexical string representation.
*   **Instance Component Methods (@\basetype):**
    *   `?Instance[|dateSign => \integer|]` (-1 for BCE, 1 for CE)
    *   `?Instance[|year => \integer|]`
    *   `?Instance[|month => \integer|]`
    *   `?Instance[|day => \integer|]`
    *   `?Instance[|zoneSign => \integer|]`
    *   `?Instance[|zoneHour => \integer|]`
    *   `?Instance[|zoneMinute => \integer|]`
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|add(\duration) => \date]`: Adds duration (time part must be empty; handles subtraction).
    *   `?Instance[|minus(\date) => \duration]`: Calculates duration between dates.
    *   `?Instance[|toDateTime(\integer,\integer,\decimal) => \dateTime]`: Converts date to dateTime using H, Mn, S args.
    *   `?Instance[|toDateTime(\time) => \dateTime]`: Converts date to dateTime using a `\time` object.
    *   `?Instance[|toSymbol => \symbol|]`: Returns the standard lexical representation as a symbol.
    *   `?Instance[=> equals(\object)]`: Checks date equality (accounts for timezones).
    *   `?Instance[=> lessThan(\object)]`: Checks chronological order.
    *   `?Instance[=> lessEq(\object)]`: Checks chronological order.
    *   `?Instance[typeName => \symbol]`: Returns `\date`.
    *   `?Instance[rawValue => \any]`: Returns underlying internal representation.

#### 3.8.6 Type: `\time` (Time)

*   **Description:** Represents a time of day, independent of date (XML Schema `time`).
*   **Lexical Form:** `"HH:MM:SS.sZHH:MM"^^ \time`. (.s = optional fractional seconds, ZHH:MM = optional timezone).
*   **Class:** `\time` (Synonyms: `\t`, `xsd:time`)
*   **Class Methods (@\basetype):**
    *   `\time[=> isTypeOf(\object)]`: Checks if object is of type `\time`.
    *   `\time[now => \time]`: Current local time.
    *   `\time[now(utc) => \time]`: Current UTC time.
    *   `\time[now(\decimal) => \time]`: Current UTC time adjusted by timezone offset.
    *   `\time[toType(H,Mn,S,Zs,Zh,Zm) => \time]`: Constructs from numeric components.
    *   `\time[toType(\symbol) => \time]`: Constructs from lexical string.
*   **Instance Component Methods (@\basetype):**
    *   `?Instance[|hour => \integer|]`
    *   `?Instance[|minute => \integer|]`
    *   `?Instance[|second => \integer|]` (Can be decimal)
    *   `?Instance[|zoneSign => \integer|]`
    *   `?Instance[|zoneHour => \integer|]`
    *   `?Instance[|zoneMinute => \integer|]`
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|add(\duration) => \time]`: Adds duration (date part must be empty; handles subtraction).
    *   `?Instance[|minus(\time) => \duration]`: Calculates duration between times.
    *   `?Instance[|toDateTime(\integer,\integer,\integer) => \dateTime]`: Converts time to dateTime using Y, M, D args.
    *   `?Instance[|toDateTime(\date) => \dateTime]`: Converts time to dateTime using a `\date` object.
    *   `?Instance[|toSymbol => \symbol|]`: Returns the standard lexical representation as a symbol.
    *   `?Instance[=> equals(\object)]`: Checks time equality (accounts for timezones).
    *   `?Instance[=> lessThan(\object)]`: Checks chronological order.
    *   `?Instance[=> lessEq(\object)]`: Checks chronological order.
    *   `?Instance[typeName => \symbol]`: Returns `\time`.
    *   `?Instance[rawValue => \any]`: Returns underlying internal representation.

#### 3.8.7 Type: `\duration` (Duration)

*   **Description:** Represents a duration of time (XML Schema `duration`).
*   **Lexical Form:** `"sPnYnMnDTnHnMnS"^^ \duration`. (s=optional '-', P required, nY=years, etc.; T separates date/time; components optional).
*   **Class:** `\duration` (Synonyms: `\du`, `xsd:duration`)
*   **Class Methods (@\basetype):**
    *   `\duration[=> isTypeOf(\object)]`: Checks if object is of type `\duration`.
    *   `\duration[toType(Y,M,D,H,Mn,S) => \duration]`: Constructs from numeric components.
    *   `\duration[toType(\symbol) => \duration]`: Constructs from lexical string.
*   **Instance Component Methods (@\basetype):**
    *   `?Instance[|year => \integer|]`, `?Instance[|month => \integer|]`, `?Instance[|day => \integer|]`, `?Instance[|hour => \integer|]`, `?Instance[|minute => \integer|]`, `?Instance[|second => \integer|]`
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|add(\duration) => \duration]`: Adds durations (handles subtraction). Context dependency (leap years) may affect month/year results.
    *   `?Instance[|inverse => \duration]`: Changes the sign of the duration.
    *   `?Instance[|toSymbol => \symbol|]`: Returns the standard lexical representation.
    *   `?Instance[=> equals(\object)]`: Checks duration equality (component-wise).
    *   `?Instance[=> lessThan(\object)]`: Comparison is complex and potentially context-dependent; generally avoid relying on it.
    *   `?Instance[=> lessEq(\object)]`: See `lessThan`.
    *   `?Instance[typeName => \symbol]`: Returns `\duration`.
    *   `?Instance[rawValue => \any]`: Returns underlying internal representation.

#### 3.8.8 Type: `\currency` (Currency)

*   **Description:** Represents monetary values with units (e.g., USD, EUR).
*   **Lexical Form:** `"XYZ amount"^^ \currency` or `"amount XYZ"^^ \currency`. (XYZ=3-letter code, amount=number). Standardized to `"XYZ amount"`.
*   **Class:** `\currency`
*   **Class Methods (@\basetype):**
    *   `\currency[=> isTypeOf(\object)]`: Checks if object is of type `\currency`.
    *   `\currency[toType(\symbol, \decimal) => \currency]`: Constructs from code and amount.
    *   `\currency[toType(\decimal, \symbol) => \currency]`: Constructs from amount and code.
    *   `\currency[toType(\symbol) => \currency]`: Constructs from combined string (e.g., `'USD 123.45'`).
*   **Instance Component Methods (@\basetype):**
    *   `?Instance[|unit => \symbol|]`: Returns the 3-letter currency code (e.g., `USD`).
    *   `?Instance[|amount => \decimal|]`: Returns the numeric amount.
    *   `?Instance[|description => \symbol|]`: Returns full currency name (e.g., `Indian Rupiah`).
    *   `?Instance[|sign => \symbol|]`: Returns common currency symbol (e.g., `$`, may be null).
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|add(\currency or \number) => \currency]`: Adds amounts. Currencies must have the same unit if adding two currencies.
    *   `?Instance[|times(\number) => \currency]`: Multiplies currency amount by a number.
    *   `?Instance[|ratio(\currency) => \number|]`: Divides amounts of two currencies (must have same unit).
    *   `?Instance[|toSymbol => \symbol|]`: Returns the standard lexical representation.
    *   `?Instance[=> equals(\object)]`: Checks equality (unit and amount).
    *   `?Instance[=> lessThan(\object)]`: Compares amounts (requires same unit).
    *   `?Instance[=> lessEq(\object)]`: Compares amounts (requires same unit).
    *   `?Instance[typeName => \symbol]`: Returns `\currency`.
    *   `?Instance[rawValue => \any]`: Returns underlying internal representation.

#### 3.8.9 Type: `\boolean` (Boolean)

*   **Description:** Represents truth values `true` and `false` (XML Schema `boolean`).
*   **Lexical Form:** `"true"^^ \boolean`, `"false"^^ \boolean`. Also `"1"^^ \boolean` (true), `"0"^^ \boolean` (false). Short forms: `\true`, `\false`.
*   **Class:** `\boolean` (Synonym: `xsd:boolean`)
*   **Class Methods (@\basetype):**
    *   `\boolean[=> isTypeOf(\object)]`: Checks if object is of type `\boolean`.
    *   `\boolean[toType(\symbol) => \boolean]`: Constructs from lexical string ('true', 'false', '1', '0').
*   **Other Instance Methods (@\basetype):**
    *   `?Instance[|toSymbol => \symbol|]`: Returns `'true'` or `'false'`.
    *   `?Instance[=> equals(\object)]`: Checks boolean equality.
    *   `?Instance[=> lessThan(\object)]`: Order is `\false < \true`.
    *   `?Instance[=> lessEq(\object)]`: Order is `\false < \true`.
    *   `?Instance[typeName => \symbol]`: Returns `\boolean`.
    *   `?Instance[|rawValue => \symbol]`: Returns atom `true` or `false`.

#### 3.8.10 Type: `\double` (Floating Point)

*   **Description:** Represents double-precision floating-point numbers (XML Schema `double`).
*   **Lexical Form:** Standard decimal notation (e.g., `24.38`, `0.3`, `12.3e-2`). Short form is just the number itself. Typed literal `"..."^^ \double` also possible.
*   **Class:** `\double` (Synonyms: `\float`, `xsd:double`, `xsd:float`)
*   **Class Methods (@\basetype):**
    *   `\double[=> isTypeOf(\object)]`: Checks if object is of type `\double`.
    *   `\double[toType(\decimal or \long or \string or \symbol) => \double]`: Converts from other numeric types or lexical representations.
*   **Instance Methods (@\basetype):**
    *   `?Instance[|floor => \integer|]`, `?Instance[|ceiling => \integer|]`, `?Instance[|round => \integer|]`: Standard rounding.
    *   `?Instance[|toSymbol => \symbol|]`: Returns standard string representation as a symbol.
    *   `?Instance[=> equals(\object)]`: Checks numeric equality (`=:=`).
    *   `?Instance[=> lessThan(\object)]`: Checks numeric order (`<`).
    *   `?Instance[=> lessEq(\object)]`: Checks numeric order (`=<`).
    *   `?Instance[typeName => \symbol]`: Returns `\double`.
    *   `?Instance[rawValue => \double]`: Returns the number itself.

#### 3.8.11 Type: `\long` (Integer)

*   **Description:** Represents arbitrary-precision integers (maps to XML Schema `long`, `integer`, `short`, etc.).
*   **Lexical Form:** Standard integer notation (e.g., `123`, `-50`). Base notation (e.g., `2'1011`, `16'FF`) and underscores (`1_000_000`) supported. Short form is just the number. Typed literal `"..."^^ \long` also possible.
*   **Class:** `\long` (Synonyms: `\integer`, `\short`, `xsd:long`, `xsd:integer`, etc.)
*   **Class Methods (@\basetype):**
    *   `\long[=> isTypeOf(\object)]`: Checks if object is of type `\long`.
    *   `\long[toType(\integer or \string or \symbol) => \long]`: Converts from other integer types or lexical representations.
*   **Instance Methods (@\basetype):**
    *   `?Instance[|toSymbol => \symbol|]`: Returns standard string representation as a symbol.
    *   `?Instance[=> equals(\object)]`: Checks numeric equality (`=:=`).
    *   `?Instance[=> lessThan(\object)]`: Checks numeric order (`<`).
    *   `?Instance[=> lessEq(\object)]`: Checks numeric order (`=<`).
    *   `?Instance[typeName => \symbol]`: Returns `\long`.
    *   `?Instance[rawValue => \long]`: Returns the number itself.

#### 3.8.12 Numeric Type Synonyms (`\decimal`, `\number`, `\integer`, `\short`)

Ergo currently treats `\decimal` and `\number` as synonyms for `\double`, and `\integer` and `\short` as synonyms for `\long`. They primarily exist for XML Schema compatibility. Use `\double` and `\long` directly for clarity. They inherit the methods of their primary types.

#### 3.8.13 Type: `\string` (String)

*   **Description:** Represents character strings (XML Schema `string`). Distinct from abstract `\symbol` and `\charlist`.
*   **Lexical Form:** `"..."^^ \string`. Double quotes (`"`) and backslashes (`\`) within the lexical form must be escaped (`\"`, `\\`).
*   **Class:** `\string` (Synonym: `xsd:string`)
*   **Class Methods (@\basetype):**
    *   `\string[=> isTypeOf(\object)]`: Checks if object is of type `\string`.
    *   `\string[toType(\object) => \string]`: Serializes almost any Ergo term into a string representation (its `toSymbol` form).
*   **Instance Methods (@\basetype):**
    *   `?Instance[|contains(\string or \symbol)|]`: Checks for substring presence.
    *   `?Instance[|contains(\string or \symbol)) => \list|]`: Returns `[Start, End]` indices of first substring match.
    *   `?Instance[|concat(\string or \symbol) => \string]`: Concatenates argument to the instance string.
    *   `?Instance[|length => \integer|]`: Returns string length.
    *   `?Instance[|substring(\integer, \integer) => \string|]`: Extracts substring `substring(Start, Length)`.
    *   `?Instance[|toUpper => \string|]`, `?Instance[|toLower => \string|]`: Case conversion.
    *   `?Instance[|toList => \charlist|]`: Converts string into a character list.
    *   `?Instance[|startsWith(\string or \symbol)|]`, `?Instance[|endsWith(\string or \symbol)|]`: Prefix/suffix check.
    *   `?Instance[|reverse => \string|]`: Reverses characters.
    *   `?Instance[|toSymbol => \symbol|]`: Returns the string content as a symbol atom.
    *   `?Instance[=> equals(\object)]`: Checks string equality (lexical).
    *   `?Instance[=> lessThan(\object)]`: Checks lexicographical order.
    *   `?Instance[=> lessEq(\object)]`: Checks lexicographical order.
    *   `?Instance[typeName => \symbol]`: Returns `\string`.
    *   `?Instance[rawValue => \string]`: Returns the string itself.

#### 3.8.14 Type: `\list` (List)

*   **Description:** Represents standard Prolog-style lists (ordered sequences).
*   **Lexical Form:** `[item1, item2 | Tail]`. Typed literal `"[...]"^^ \list` possible but rare.
*   **Class:** `\list`
*   **Class Methods (@\basetype):**
    *   `\list[=> isTypeOf(\object)]`: Checks if object is a list.
    *   `\list[toType(\list) => \list]`: Identity conversion.
    *   `\list[append(ListOfLists) => \list]`: Concatenates all lists contained within the input `ListOfLists`.
*   **Instance Methods (@\basetype):**
    *   `?Instance[|contains(\list)|]` (Shortcut: `\sublist`): Checks if argument list is a sublist (maintaining order).
    *   `?Instance[|member(\object)|]` (Shortcut: `\in`): Checks/generates membership using unification.
    *   `?Instance[|select(\object) => \list|]`: Returns list with the *first* unifying element removed. Backtracks for other matches.
    *   `?Instance[|delete(\object) => \list|]`: Returns list with *all* identical (`==`) elements removed.
    *   `?Instance[|append(\list) => \list|]` (Shortcut: `++`): Appends argument list to the instance list.
    *   `?Instance[|ith(\integer) => \object|]`: Accesses element by 1-based index.
    *   `?Instance[|length => \long|]`: Returns list length.
    *   `?Instance[|reverse => \list|]`: Reverses the order of elements.
    *   `?Instance[|toTuple => \object|]`: Converts list `[a,b]` to tuple `(a,b)`. Fails for `[]`. Singleton `[a]` becomes `a`.
    *   `?Instance[|sort => \list|]`: Sorts list using standard term order, removing duplicates.
    *   `?Instance[|startsWith(\list)|]`, `?Instance[|endsWith(\list)|]`: Checks if the list starts/ends with the argument list.
    *   `?Instance[|subset(\list)|]` (Shortcut: `\subset`): Checks if all elements of the argument list are members of the instance list (ignores order, uses unification).
    *   `?Instance[|toSymbol => \symbol|]`: Returns the list's standard textual representation as a symbol.
    *   `?Instance[=> equals(\object)]`: Checks structural equality (`==`).
    *   `?Instance[=> lessThan(\object)]`: Checks standard Prolog term order (`@<`).
    *   `?Instance[=> lessEq(\object)]`: Checks standard Prolog term order (`@=<`).
    *   `?Instance[typeName => \symbol]`: Returns `\list`.
    *   `?Instance[rawValue => \list]`: Returns the list itself.

#### 3.8.15 Type: `\charlist` (Character List)

*   **Description:** Represents lists of character codes, optimized for parsing. Semantically a list, but offers string-like conveniences.
*   **Lexical Form:** `"..."^^ \charlist`. Escapes (`\"`, `\\`) as in `\string`. Also standard list notation `[code1, code2,...]`. Expert mode allows `"..."` shortcut.
*   **Class:** `\charlist`
*   **Class Methods (@\basetype):**
    *   `\charlist[=> isTypeOf(\object)]`: Checks if object is a charlist.
    *   `\charlist[toType(\charlist) => \charlist]`: Identity.
    *   *(Inherits `\list[append(ListOfLists)]`)*
*   **Instance Methods (@\basetype):**
    *   *(Inherits all methods from `\list`, e.g., `contains`, `member`, `select`, `delete`, `append`, `ith`, `length`, `reverse`, `toTuple`, `sort`, `startsWith`, `endsWith`, `subset`)*
    *   `?Instance[|substring(\integer, \integer) => \charlist|]`: Extracts substring `substring(Start, Length)`.
    *   `?Instance[|toUpper => \charlist|]`, `?Instance[|toLower => \charlist|]`: Case conversion.
    *   `?Instance[|concat(\charlist) => \charlist|]`: Concatenates charlists.
    *   `?Instance[|toSymbol => \symbol|]`: Returns charlist content as a symbol atom.
    *   `?Instance[=> equals(\object)]`: Checks structural equality (`==`).
    *   `?Instance[=> lessThan(\object)]`: Checks standard Prolog term order (`@<`).
    *   `?Instance[=> lessEq(\object)]`: Checks standard Prolog term order (`@=<`).
    *   `?Instance[typeName => \symbol]`: Returns `\charlist`.
    *   `?Instance[rawValue => \list]`: Returns the underlying list of character codes.

#### 3.8.16 Meta-Classes for Callables (`\modular`, `\callable`)</h4>

*   **Description:** Special classes for classifying terms based on whether they can be executed as goals.
*   **Class:** `\modular`
    *   **Members:** Atomic formulas whose truth depends on a module (Frames, HiLog predicates, Prolog predicates declared with `:- prolog/table`). Tested using `${...}:\modular`.
*   **Class:** `\callable`
    *   **Members:** Everything in `\modular` plus Prolog built-ins (`@\prolog`), system module calls (`@\io`, etc.), and Ergo primitives (`isinteger{}`). Tested using `Goal:\callable`.
*   **Methods:** Primarily `isTypeOf`.

#### 3.8.17 User-defined Types</h4>

*   **Description:** Allows users to define custom type tags for literals.
*   **Lexical Form:** `"..."^^myTypeName`. `myTypeName` is an atom not starting with `\`.
*   **Class:** No dedicated built-in class methods via `@\basetype`. The type name itself acts as the class identifier for typed variables (`?X^^myTypeName`).
*   **Methods:** Standard general methods (`equals`, `lessThan`, `lessEq`, `toSymbol`, `typeName`, `rawValue`) apply to the typed literal object, generally operating on the lexical form or the type name. `isTypeOf(Literal)` is not applicable via `\myTypeName[...]`.

### 3.9. Calling ErgoAI from Prolog

While ErgoAI often calls Prolog predicates, it's also possible for Prolog code to invoke ErgoAI predicates or execute ErgoAI queries. This requires bootstrapping the ErgoAI environment within Prolog and using specific import mechanisms.

**Prerequisites:**
1.  **Load ErgoAI libraries:** The Prolog environment must first load the necessary ErgoAI bootstrap code. This is typically done once per session:
    ```prolog
    ?- [flora2], bootstrap_ergo.
    ```
2.  **Set Library Path:** Prolog needs to know where the ErgoAI installation resides. This is usually done by asserting the library path:
    ```prolog
    ?- asserta(library_directory('/path/to/your/ErgoAI/ErgoAI/Ergo')). // Adjust path
    ```
    Use `add_lib_dir/1` in newer XSB versions.
3.  **Import `flimport`:** The core import predicate needs to be imported from the `flora2` Prolog module:
    ```prolog
    :- import('\\flimport'/1) from flora2.
    ```
    (Note the double backslash required for escaping in Prolog atoms).

**Importing Ergo Predicates (`'\\flimport'`):**
To call a specific ErgoAI *predicate* (not frames or methods) from Prolog, you must import it using `'\\flimport'`. The single quotes around `\\flimport` and the double backslash are typically required because `\` is an escape character in Prolog atoms.

*   **Syntax 1 (Load & Import):**
    `?- '\\flimport'(Module:FloraPred/Arity as PrologName(VarList) from FileName >> ErgoModuleName).`
    *   Loads `FileName.ergo` into `ErgoModuleName`.
    *   Imports the Ergo predicate `FloraPred/Arity` (defined in `ErgoModuleName`) into the current Prolog context, making it callable as `PrologName(VarList)`.
    *   `FloraPred` is the Ergo predicate name (e.g., `myPred`). For non-tabled Ergo predicates (starting with `%`), use `%(myPred)` as `FloraPred`.
    *   `PrologName(VarList)` must be a valid Prolog goal skeleton with the same arity (e.g., `my_pred(_,_,_)`).
*   **Syntax 2 (Import Only):**
    `?- '\\flimport'(Module:FloraPred/Arity as PrologName(VarList) from ErgoModuleName).`
    *   Imports `FloraPred/Arity` from the *already loaded* `ErgoModuleName`.

```ergo
// Example Prolog code: Load mykb.ergo into module 'kb', import my_pred/2 as pl_pred/2
:- import('\\flimport'/1) from flora2. % Import the import predicate itself

example_load_and_import :-
    '\\flimport'(kb:my_pred/2 as pl_pred(_,_) from 'mykb.ergo' >> kb).

// Now call the imported predicate from Prolog
example_call :-
    pl_pred(Input, Output).
```

**Executing Arbitrary Ergo Queries (`ergo_query/5`):**
To execute any Ergo query string from Prolog and retrieve variable bindings.

*   **Import:**
    ```prolog
    :- import ergo_query/5 from flora2.
    ```
*   **Call:** `ergo_query(QueryString, VarBindings, Status, WfsState, Exception)`
    *   `QueryString`: An atom or string containing the Ergo query (must end with '.').
    *   `VarBindings`: A list specifying variables to retrieve, e.g., `['?X'=Xvar, '?Y'=Yvar]`. `Xvar`, `Yvar` are Prolog variables that will receive the bindings.
    *   `Status`: Output variable bound to compilation status information.
    *   `WfsState`: Output variable indicating truth value (0=true, 1=undefined).
    *   `Exception`: Output variable bound to `normal` on success or an exception term on error.

```prolog
// Example: Execute an Ergo query with frames
?- ergo_query('person[name->?N, age->?A], ?A > 30.',
              ['?N'=Name, '?A'=Age],
              _Status, _WfsState, _Exception).

// Prolog variables Name and Age will be bound on success
// Backtrack to get more results.
```

### 3.10. Explicit Prolog/HiLog Term Conversion (`p2h`)

While `@\prologall` provides automatic conversion between ErgoAI's HiLog terms and Prolog's standard terms during calls (see Section 7.4), sometimes explicit, controlled conversion is needed. The `p2h{PrologTerm, HilogTerm}` primitive facilitates this.

*   **Syntax:** `p2h{ Term1, Term2 }`
*   **Behavior:**
    *   If `Term1` is bound to a Prolog term and `Term2` is unbound, `Term2` is bound to the corresponding HiLog representation of `Term1`.
    *   If `Term2` is bound to a HiLog term and `Term1` is unbound, `Term1` is bound to the corresponding Prolog representation of `Term2`.
    *   If both are bound, the primitive succeeds if and only if `Term1` is the Prolog representation of the HiLog term `Term2`, *or* if both `Term1` and `Term2` are identical *Prolog* terms (it does *not* succeed if both are identical HiLog terms).
    *   If neither is bound, it typically fails or errors.
*   **Usage:** Useful in specific meta-programming tasks or when interacting with Prolog predicates using `@\prolog` (instead of `@\prologall`) where manual conversion is required for certain arguments or results.

```ergo
// Convert Prolog term f(a,b) to HiLog
?- p2h{f(a,b), ?H}.
// ?H will be the HiLog term f(a,b)

// Convert HiLog term g(1) to Prolog
?- p2h{?P, g(1)}.
// ?P will be the Prolog term g(1)

// Check if P is the Prolog version of Hilog H
?- ?P = mypred(1), ?H = mypred(1), p2h{?P, ?H}.
// Fails because both are HiLog terms by default in Ergo

// Check if P is the Prolog version of Hilog H - Correct way
?- ?H = mypred(1), p2h{?P, ?H}, write(?P)@\prolog. // Pass ?P to Prolog
// Succeeds, prints mypred(1)
```

## 4. Operators and Expressions

ErgoAI supports a wide range of operators for constructing logical expressions, performing arithmetic, making comparisons, and manipulating data structures.

### 4.1. Operator Precedence and Associativity

Like most programming and logic languages, ErgoAI operators have defined precedence levels and associativity rules (e.g., left, right, non-associative) that determine how complex expressions are parsed. These rules generally follow standard mathematical and logical conventions. For instance, conjunction (`,`) binds stronger than disjunction (`;`), and arithmetic operators follow standard order (multiplication before addition).

Operators with lower precedence numbers bind tighter. A detailed table listing the precedence and associativity of built-in operators can be found in the ErgoAI Reasoner User's Manual (Table 3, Section 7.3) and an excerpt is in Section 10.3. When in doubt, parentheses `()` can be used to explicitly group expressions and override the default precedence.

### 4.2. Defining Operators

Users can define their own infix, prefix, or postfix operators using the `op` directive. This allows for more natural or domain-specific syntax.

The syntax is:
```ergo
:- op{Precedence, Type, Name}.
```
or for multiple operators with the same precedence and type:
```ergo
:- op{Precedence, Type, [Name1, Name2, ...]}.
```

*   `Precedence`: A positive integer determining the operator's binding strength (lower numbers bind tighter).
*   `Type`: Specifies the operator's type and associativity (e.g., `xfx`, `xfy`, `yfx` for infix; `fx`, `fy` for prefix; `xf`, `yf` for postfix).
*   `Name`: The symbol(s) to be defined as operator(s).

```ergo
// Define 'foo' as a non-associative infix operator with precedence 800
:- op{800, xfx, foo}.

// Define '+' and '-' as left-associative infix operators with precedence 800
:- op{800, yfx, [+, -]}.
```
Operator definitions are local to the module where they are defined or executed.

### 4.3. Logical Connectives

These operators combine atomic formulas in rule bodies and queries.

*   **Conjunction:** Represented by comma (`,`) or the keyword `\and`. `Formula1, Formula2` is true if both `Formula1` and `Formula2` are true. Conjunction binds stronger than disjunction.
    ```ergo
    ?- p(?X), q(?X).       // Both p(?X) and q(?X) must be true
    ?- p(?X) \and q(?X). // Equivalent to the above
    ```
*   **Disjunction:** Represented by semicolon (`;`) or the keyword `\or`. `Formula1 ; Formula2` is true if either `Formula1` or `Formula2` (or both) are true.
    ```ergo
    ruleHead :- p(?X) ; q(?X). // True if p(?X) is true or q(?X) is true
    ruleHead :- p(?X) \or q(?X). // Equivalent
    ```

Parentheses `()` can be used for grouping complex logical expressions.

**(Prolog Background)**

The use of comma (`,`) for conjunction (AND) and semicolon (`;`) for disjunction (OR) is standard Prolog syntax (Prolog Tutorial Slides, Slide 13). Prolog's evaluation proceeds left-to-right, and backtracking explores alternatives provided by disjunction or multiple clause definitions.

### 4.4. Arithmetic Operators and Expressions

ErgoAI supports standard arithmetic operations.

*   **Operators:** `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), `**` (power). Unary `+` and `-` are also supported.
*   **Evaluation (`\is`)**: Arithmetic expressions are *not* automatically evaluated by default. The infix operator `\is` is used to evaluate the expression on its right-hand side and unify the result with the variable on its left-hand side.
    ```ergo
    ?- ?X \is 3 + 4 * 2. // ?X will be bound to 11
    ?- ?Y = 3 + 4.      // ?Y will be bound to the term +(3,4), not 7
    ```
*   **Inline Evaluation (`=` or `\is` prefix):** Arithmetic expressions can be evaluated directly within arguments of predicates or frames by prefixing them with `=` or `\is`.
    ```ergo
    p(=?X+3) :- q(?X).       // If q(2) is true, this derives p(5)
    p(\is ?X+3) :- q(?X).    // Equivalent to the above
    frame[attribute -> =5*2]. // Sets attribute to 10
    ```
*   **Functions:** Various arithmetic functions are available, typically used with `\is` or inline evaluation (e.g., `min`, `max`, `abs`, `sqrt`, `log`, `sin`, `cos`, `sum`, `count`, `avg`, `nth`, `delete`, `reverse`). See Table 4 in the manual for a full list.
    ```ergo
    ?- ?X \is min(5, 3).   // ?X = 3
    ?- ?L \is delete(b, [a,b,c,b]). // ?L = [a,c,b]
    ```

**Built-in Arithmetic Functions:**
The following functions can be used on the right-hand side of `\is` or with inline evaluation (`=` prefix). See Table 4 in the Manual for details.

*   `min(X, Y)`, `max(X, Y)`: Minimum/maximum of two numbers.
*   `abs(X)`: Absolute value.
*   `ceiling(X)`, `floor(X)`, `round(X)`: Standard rounding functions.
*   `float(X)`: Convert integer/decimal to float.
*   `truncate(X)`: Truncate decimal part.
*   `mod(X, Y)`, `rem(X, Y)`: Modulo and remainder.
*   `div(X, Y)`, `%%(X, Y)`: Integer division.
*   `exp(X, Y)`, `**(X, Y)`: X raised to the power of Y.
*   `exp(X)`: *e* raised to the power of X.
*   `sqrt(X)`: Square root.
*   `sign(X)`: Sign (-1, 0, 1).
*   `sin(X)`, `cos(X)`, `tan(X)`: Trigonometric functions (radians).
*   `asin(X)`, `acos(X)`, `atan(X)`: Inverse trigonometric functions.
*   `log(X)`: Natural logarithm (base *e*).
*   `log10(X)`: Base 10 logarithm.
*   `/\(X, Y)`, `\/(X, Y)`: Bitwise AND and OR.
*   **(List/Set functions):** `min(List)`, `max(List)`, `sum(List)`, `avg(List)`, `count(List)`, `last(List)`, `nth(N, List)`, `delete(Elem, List)`, `reverse(List)` (These often overlap with aggregate operators but can be used directly with `\is`).

```ergo
?- ?X \is sqrt(16).  // ?X = 4.0
?- ?Y \is abs(-5).   // ?Y = 5
?- ?L \is max([1,5,2]). // ?L = 5
```

**(Comparison with Prolog)**

Standard Prolog also treats arithmetic functors like `+`, `-`, `*` as regular term constructors initially. The infix operator `is/2` is the standard mechanism to force evaluation of the right-hand side and unify the result with the left-hand side (Prolog Tutorial Slides, Slide 35). ErgoAI inherits `\is` (equivalent to Prolog's `is`) but adds the convenient inline evaluation prefix `=`.

### 4.5. Comparison Operators

ErgoAI provides several types of comparison operators:

*   **Unification/Non-unification:** `=` (unifies terms), `\=` (fails if terms unify).
*   **Term Identity/Non-identity:** `==` (true if terms are identical), `\==` (true if terms are not identical). Does not bind variables.
*   **Arithmetic Comparison:** `>`, `<`, `>=`, `=<`. Compare numeric values. Require arguments to be instantiated to numbers.
*   **Term Comparison (Standard Order):** `@>`, `@<`, `@>=`, `@=<`. Compare any two terms based on a standard order.
*   **Evaluated Equality/Inequality:** `=:=` (true if numeric expressions evaluate to the same number), `=\=` (true if numeric expressions evaluate to different numbers).
*   **Type Checking:** `?=` (checks if terms are identical or not unifiable - used internally), `!=`, `!==` (semantic disunification/non-identity, often delayed).

```ergo
?- 5 > 3.
?- a == a.
?- a \= b.
?- 2+3 =:= 1+4.
?- foo(X) @< foo(Y). // True if X precedes Y in standard order
```

**(Comparison with Prolog)**

Prolog provides similar sets of comparison operators:
*   Unification/Non-unification: `=` and `\=` (identical to ErgoAI).
*   Term Identity/Non-identity: `==` and `\==` (identical to ErgoAI).
*   Arithmetic Comparison: `>`, `<`, `=<` (same as `>=`), `>=` (same as `=<`) (Note slight syntactic difference for less/greater-equal).
*   Standard Term Order: `@<`, `@>`, `@=<`, `@>=` (identical to ErgoAI).
*   Evaluated Arithmetic Equality/Inequality: `=:=` and `=\=` (identical to ErgoAI).
(Prolog Tutorial Slides, Slide 35 shows some).

### 4.6. String/List/Set Operators

Operators for common operations on strings, lists, and sets:

*   **String/Term Concatenation (`||`):** Constructs an expression representing the concatenation of the printable forms of terms. This expression must be evaluated using `\is` or the inline `=` prefix to get the final result.
    ```ergo
    // Evaluate using \is
    ?- ?S \is {a,b} ++ {b,c}. // ?S = {a,b,c} (assuming \set module loaded)
    ?- ?S \is 'abc' || 'def'. // ?S = 'abcdef'
    // Evaluate inline using = within another predicate
    ?- writeln(= 'Result: ' || 5)@\io. // Prints "Result: 5"
    ```
*   **List/Set Append/Union (`++`):** Appends lists or computes set union.
    ```ergo
    ?- ?L = [a,b] ++ [c,d]. // ?L = [a,b,c,d]
    ?- ?S \is {a,b} ++ {b,c}. // ?S = {a,b,c} (assuming \set module loaded)
    ```
*   **List/Set Difference (`--`):** Computes list/set difference.
    ```ergo
    ?- ?L = [a,b,c,b] -- [b]. // ?L = [a,c]
    ?- ?S \is {a,b,c} -- {b,d}. // ?S = {a,c}
    ```
*   **List/Set Intersection (`&&`):** Computes list/set intersection.
    ```ergo
    ?- ?L = [a,b,c] && [b,d,a]. // ?L = [a,b]
    ?- ?S \is {a,b,c} && {b,d,a}. // ?S = {a,b}
    ```
*   **Membership (`\in`):** Checks if an element is in a list, set, or range. Can also generate members.
    ```ergo
    ?- b \in [a,b,c].
    ?- ?X \in 1..3. // Binds ?X to 1, 2, 3 successively
    ```
*   **Subset (`\subset`):** Checks if a list/set is a subset of another (ignores order for lists).
    ```ergo
    ?- [a,c] \subset [c,b,a].
    ```
*   **Sublist (`\sublist`):** Checks if a list is a sublist (maintaining order) of another.
    ```ergo
    ?- [a,c] \sublist [x,a,b,c,y].
    ```

### 4.7. Meta-unification and Meta-disunification

These operators work on the structure of formulas, rather than terms.

*   **Meta-unification (`~`):** Unifies two formulas. Can bind variables to formulas or parts of formulas. Module specifications are considered.
    ```ergo
    ?- ?X ~ p(a).             // ?X = p(a)
    ?- a[m->?V] ~ ?X[?M->b]. // ?X=a, ?M=m, ?V=b
    ?- ?X@?M ~ p(a)@foo.     // ?X=p(a), ?M=foo
    ```
*   **Meta-disunification (`!~`):** Fails if the two formulas meta-unify.
    ```ergo
    ?- a[m->b] !~ a[m->c]. // Succeeds
    ?- p(a) !~ p(a).       // Fails
    ```
These are primarily used for meta-programming tasks involving rule manipulation or analysis.

### 4.8. Built-in Constraint Solving (CLPR)

Beyond integrating with external solvers like MiniZinc, ErgoAI's underlying XSB engine has built-in support for Constraint Logic Programming over Reals (CLPR). This allows solving systems of linear equations and inequalities directly within Ergo code.

Constraints are enclosed in curly braces `{...}` and placed directly in the rule body or query.

*   **Syntax:** `{ Constraint }`
    *   `Constraint`: A linear arithmetic constraint involving variables and real/integer numbers. Standard arithmetic operators (`+`, `-`, `*`, `/`) and comparison operators (`=`, `>`, `<`, `>=`, `=<`, `\=`) can be used. Note that within the curly braces, these operators act as constraint builders, not standard Ergo/Prolog operators.
*   **Semantics:** When a constraint goal `{C}` is encountered:
    1.  It adds the constraint `C` to the solver's constraint store.
    2.  The solver checks for consistency. If the store becomes inconsistent, the goal fails, triggering backtracking.
    3.  The solver may perform constraint propagation, potentially narrowing the domains of variables involved or even determining their exact values.
    4.  Variables involved in constraints might remain unbound (or partially bound to an interval) until enough constraints are added to determine their value.
*   **Usage:** Typically used for problems involving linear relationships, optimization (though less powerful than dedicated MIP solvers), or situations where immediate arithmetic evaluation via `\is` is not possible or desired because variables are not yet instantiated.

```ergo
// Example: Solving a simple system of equations
?- {?X + ?Y = 5, ?X - ?Y = 1}.
// Output: ?X = 3.0, ?Y = 2.0

// Example: Using constraints with database facts
point(1, 2).
point(3, 4).
point(5, 1).

?- point(?X, ?Y), {?X > ?Y}.
// Output: ?X = 3, ?Y = 4 (fails constraint) -> Backtrack
// Output: ?X = 5, ?Y = 1 (satisfies constraint) -> Succeeds
// Final Output: ?X = 5, ?Y = 1
```

**Note:** This built-in CLPR solver is limited to linear constraints over reals. For more complex problems (non-linear, integer domains, optimization), interfacing with MiniZinc via `@mzn` (See Section 3.11) is generally necessary.

### 4.9. Random Number Generation

ErgoAI provides primitives for generating pseudo-random numbers from different distributions.

*   `random{?X}`: Binds `?X` to a random floating-point number in the interval `[0.0, 1.0)` drawn from a uniform distribution.
*   `random{?X, [Low, High]}`: Binds `?X` to a random *integer* in the interval `[Low, High)` (i.e., `Low <= ?X < High`) drawn from a uniform distribution. `Low` and `High` must be integers such that `Low < High`.
*   `random{?X, gauss(Mean, Deviation)}`: Binds `?X` to a random floating-point number drawn from a normal (Gaussian) distribution with the specified `Mean` and standard `Deviation`. `Mean` and `Deviation` must be numbers, and `Deviation` must be positive.
*   `random{?X, exponential(Lambda)}`: Binds `?X` to a random floating-point number drawn from an exponential distribution with the rate parameter `Lambda`. `Lambda` must be a positive number.

```ergo
// Example: Get a random float between 0 and 1
?- random{?R}.

// Example: Get a random integer between 10 and 20 (exclusive of 20)
?- random{?I, [10, 20]}.

// Example: Get a number from a normal distribution (mean=5, stddev=1.5)
?- random{?N, gauss(5.0, 1.5)}.
```
**Note:** These primitives rely on the underlying Prolog system's pseudo-random number generator.

## 5. Negation and Quantification

ErgoAI provides sophisticated mechanisms for handling negation and logical quantification within rule bodies, extending beyond standard Prolog capabilities.

### 5.1. Negation

ErgoAI supports three distinct forms of negation:

*   **`\naf`**: Default negation based on the Well-Founded Semantics.
*   **`\+`**: Prolog-style negation-as-failure.
*   **`\neg`**: Explicit negation, representing known falsehood.

#### 5.1.1. Default Negation (`\naf`) vs Prolog Negation (`\+`)

*   **`\naf` (Default Negation):**
    *   This is the recommended negation operator for general use in ErgoAI, especially for tabled predicates and frames.
    *   It is based on the well-founded semantics, a logically sound model-theoretic approach using three truth values: `\true`, `\false`, and `\undefined`.
    *   `\naf Goal` is true if `Goal` is false, false if `Goal` is true, and undefined if `Goal` is undefined.
    *   Crucially, Ergo allows `\naf` to be applied to non-ground goals (goals with variables). See Section 5.1.3 for details on semantics.
    *   It cannot appear in rule heads or facts.
    ```ergo
    p(a).
    ?- \naf p(b). // Succeeds (true) because p(b) is false
    ?- \naf p(a). // Fails because p(a) is true
    ```

*   **`\+` (Prolog-style Negation):**
    *   This operator implements Prolog's traditional negation-as-failure. `\+ Goal` succeeds if the query `?- Goal` fails, and fails if `?- Goal` succeeds.
    *   It does not have a proper logical semantics and can lead to infinite loops in certain recursive definitions (e.g., `p :- \+ p.`).
    *   In ErgoAI, its use is primarily intended for negating non-tabled Prolog predicates or transactional methods where `\naf` might be less suitable or slower. It should be used with caution.
    *   It cannot appear in rule heads or facts.
    ```ergo
    :- prolog{my_prolog_pred/1}.
    my_prolog_pred(1).

    ?- \+ my_prolog_pred(2). // Succeeds because my_prolog_pred(2) fails
    ?- \+ my_prolog_pred(1). // Fails because my_prolog_pred(1) succeeds
    ```

**(Prolog Background: Negation as Failure & CWA)**

Standard Prolog's primary negation is `\+` (also written `not/1`), known as *Negation as Failure* (NAF) (Prolog Tutorial Slides, Slide 42). It is based on the *Closed World Assumption* (CWA): anything that cannot be proven true is assumed to be false (Prolog Tutorial Slides, Slide 41). Operationally, `\+ Goal` succeeds if the attempt to prove `Goal` fails finitely.

**Limitations of Prolog's `\+`:**
*   It lacks a clean model-theoretic semantics. Early attempts like the *completion semantics* had issues (Prolog Tutorial Slides, Slide 43).
*   It can lead to infinite loops for certain recursive definitions (e.g., `p :- \+ p.`).
*   Its handling of non-ground goals (variables) can be unintuitive (see Section 5.1.3).

**ErgoAI's `\naf` and WFS:**
ErgoAI's default negation `\naf` is based on the *Well-Founded Semantics* (WFS) [vRS91] (Prolog Tutorial Slides, Slide 43, 103-106), a three-valued logic (`true`, `false`, `undefined`) developed to provide a robust declarative semantics for negation in logic programs, especially those with recursion. WFS correctly handles many cases where `\+` loops or gives counter-intuitive results, particularly negative loops (like the Barber Paradox, Slide 103) and offers better behavior with tabling. ErgoAI's use of `\naf` and tabling based on WFS (via XSB) is a significant enhancement over standard Prolog negation. WFS is generally sound with respect to Answer Set Programming (ASP)'s Stable Model Semantics, but less expressive as it allows for undefined truth values (Prolog Tutorial Slides, Slides 105-106).

#### 5.1.2. Explicit Negation (`\neg`)

*   `\neg` represents explicit or strong negation, indicating that a statement is known to be false, rather than just not known to be true.
*   It can appear in rule heads, bodies, and facts.
*   `\neg p` implies `\naf p`. If something is explicitly known to be false, it cannot be proven true.
*   Unlike classical negation, the law of excluded middle (`p \or \neg p`) does not necessarily hold.
*   It is possible for both `p` and `\neg p` to be derivable in a knowledge base, leading to a contradiction. ErgoAI does not check for this inconsistency by default. To enable inconsistency checking and resolution, the module must be declared defeasible (`:- use_argumentation_theory.`) and the conflicting rules/facts must be defeasible (e.g., using tags `@{...}` or `@@{defeasible}`). See Section 41.
    ```ergo
    \neg likes(john, broccoli). // Fact stating John dislikes broccoli

    hates(?X, ?Y) :- \neg likes(?X, ?Y). // Rule using explicit negation

    ?- \neg likes(john, broccoli). // Querying explicit negation
    ```

#### 5.1.3. Negation with Non-ground Subgoals

The behavior of negation operators in ErgoAI when applied to subgoals containing unbound variables (`non-ground subgoals`) differs significantly depending on the operator used (`\naf` vs. `\+`).

*   **`\naf Goal` (Default Negation):**
    This operator handles non-ground goals using a combination of delayed evaluation and specific semantics based on the Well-Founded Semantics and the open-domain assumption. If `Goal` contains variables `?Vars` that are not bound when `\naf Goal` is encountered, the evaluation typically proceeds as follows:
    1.  **Delay:** ErgoAI (via its underlying XSB engine) suspends the evaluation of `\naf Goal`, waiting for potential bindings of the free variables `?Vars`.
    2.  **Resume:** If other subgoals later bind `?Vars` sufficiently (making `Goal` ground or partially ground), the evaluation of `\naf Goal` is resumed with the now-instantiated `Goal`.
    3.  **Floundering (Default - Exists-Not Semantics):** If the query execution completes and `?Vars` remain unbound within `\naf Goal`, the system needs to determine the truth value. The default interpretation corresponds to the **Exists-Not semantics**. This effectively asks: "Does there exist *some* binding for the free variables `?Vars` such that `Goal` evaluates to false or undefined?" This is logically equivalent to `exists(?Vars)^(\naf Goal)`.
        *   If `Goal` is true for *all* possible bindings (under the open-domain assumption where infinitely many constants might exist), the result of `\naf Goal` is `\false`.
        *   If `Goal` is false or undefined for *at least one* possible binding, the result of `\naf Goal` is `\true`.
        *   If `Goal` is true for some bindings and false/undefined for others, the result of `\naf Goal` is `\undefined`. This often occurs when the truth cannot be definitively determined without knowing the full domain of potential bindings for `?Vars`.
    4.  **Forcing Not-Exists Semantics:** The default Exists-Not semantics is often the desired interpretation for body-only variables under negation. However, if you specifically need to ask, "Is it true that `Goal` fails for *all* possible bindings?" (corresponding to ∀`?Vars` ¬`Goal` or `not exists(?Vars)^Goal`), you **must explicitly write** this using an existential quantifier within the scope of `\naf`:
        ```ergo
        \naf exists(?Vars)^Goal
        ```
        This forces the system to check if *any* instance of `Goal` succeeds before determining the truth of the negation.

*   **`\+ Goal` (Prolog-style Negation):**
    If `Goal` contains unbound variables when `\+ Goal` is encountered, `\+` behaves according to the standard Prolog negation-as-failure semantics: it attempts to find *any* solution for `Goal`.
    *   If `?- Goal` succeeds for *any* binding of the free variables, then `\+ Goal` **fails**.
    *   If `?- Goal` fails for *all* possible bindings of the free variables (i.e., the search for a solution for `Goal` is exhausted without success), then `\+ Goal` **succeeds**.
    This corresponds to an implicit universal quantification over the free variables within the negation: ∀`?Vars` ¬`Goal`, where ¬ denotes failure-to-prove. Be aware that this behavior can differ significantly from `\naf`'s handling of non-ground goals.

**Summary:** Choose `\naf` for logical soundness with tabled predicates, understanding its delay mechanism and default Exists-Not semantics for non-ground goals. Use explicit quantification (`\naf exists(...)`) if Not-Exists semantics are required. Use `\+` primarily for negating non-tabled Prolog goals or where strict negation-as-finite-failure is intended, being mindful of its implicit universal quantification over free variables.

### 5.2. Quantifiers

ErgoAI supports standard logical quantifiers within rule bodies, allowing for more expressive logical statements.

*   **Universal Quantifier:** `forall` (synonyms: `all`, `each`). Asserts that a formula holds for all possible values of the quantified variables.
*   **Existential Quantifier:** `exists` (synonyms: `exist`, `some`). Asserts that a formula holds for at least one binding of the quantified variables.

#### 5.2.1. Syntax

Quantifiers are applied to a body formula using the `^` operator:

```
quantifier(VarList)^(Body)
```

*   `quantifier`: One of `forall`, `all`, `each`, `exists`, `exist`, `some`.
*   `VarList`: A comma-separated list of variables being quantified (e.g., `?X`, `?Y, ?Z`).
*   `^`: The operator connecting the quantifier and its scope.
*   `Body`: The logical formula over which the quantification applies. Parentheses `()` around `Body` are often needed if it contains connectives like `,` or `;`.

```ergo
// Example: Everyone who is a person is mortal.
?- forall(?X)^(person(?X) ~~> mortal(?X)).

// Example: There exists someone who likes apples.
?- exists(?P)^(person(?P), likes(?P, apples)).

// Example: Check if John likes everything.
?- forall(?Thing)^(likes(john, ?Thing)).
```

**Detailed Quantification Rules for Free Variables (Manual Sec 20.1):**

The interpretation of variables not explicitly bound by `forall`/`exists` depends on their location and whether they appear under negation (`\naf`):

1.  **Anonymous Variables (`?` or `?_`):** Each occurrence is treated as a distinct variable, implicitly existentially quantified immediately around the literal it appears in. Example: `p(?), q(?)` is like `exists(V1)^p(V1), exists(V2)^q(V2)`. This applies even under `\naf`.
2.  **Named Variables NOT under `\naf`:**
    *   If the variable appears *only* in the rule body, it is implicitly existentially quantified over the entire body. Example: `h(X) :- p(X,Y), q(Y).` means `h(X) :- exists(Y)^(p(X,Y), q(Y)).`
    *   If the variable appears in the rule head (and possibly the body), it is implicitly universally quantified over the entire rule. Example: `h(X) :- p(X).` means `forall(X)^(h(X) :- p(X)).`
3.  **Named Variables under `\naf`:**
    *   If the variable appears *only* under one or more `\naf` operators in the body, it is treated existentially *outside* the `\naf` scope (Exists-Not semantics). Example: `h :- \naf p(X).` is interpreted as `h :- exists(X)^(\naf p(X)).` This means the rule succeeds if there is *any* X for which p(X) is false or undefined.
    *   If the variable *also* appears positively (not under `\naf`) elsewhere in the body or head, the standard rules (universal or existential based on head appearance) take precedence. The interaction with `\naf` then follows the delayed evaluation described in Section 5.1.3. If it remains unbound, the result is often `\undefined`.

#### 5.2.2. Scope Rules

*   Variables listed in `VarList` are bound by the quantifier and their scope is limited to the `Body` formula.
*   Variables appearing free within the `Body` (i.e., not in `VarList` and not bound outside the quantified formula) are typically treated according to the standard rules: universally quantified if they also appear in the rule head, existentially quantified otherwise.
*   Free variables under `\naf` within the `Body` follow the Exists-Not semantics described in Section 5.1.3 unless explicitly quantified with `exists`.

## 6. Control Flow Constructs

ErgoAI provides several constructs to control the flow of execution within rule bodies, similar to those found in procedural languages, but adapted for a logical setting.

### 6.1. If-Then-Else

ErgoAI offers constructs for conditional execution.

*   **Standard If-Then-Else (`\if`, `\then`, `\else`):**
    The primary construct is:
    ```
    \if Condition \then ThenPart \else ElsePart
    ```
    This evaluates `Condition`. If `Condition` succeeds, `ThenPart` is executed. If `Condition` fails, `ElsePart` is executed. The entire construct succeeds if the executed part (`ThenPart` or `ElsePart`) succeeds.
    The `\else ElsePart` is optional. If omitted, the construct is:
    ```
    \if Condition \then ThenPart
    ```
    This is equivalent to `\if Condition \then ThenPart \else \true`. It succeeds if `Condition` fails, or if both `Condition` and `ThenPart` succeed. It fails only if `Condition` succeeds but `ThenPart` fails. This differs from Prolog's `(Cond -> Action)` which fails if `Cond` fails.

*   **Implication Operators:** ErgoAI also provides several infix implication operators that act as shorthands for specific logical patterns involving negation and disjunction:
    *   `Condition ~~> Consequence`: Equivalent to `(\naf Condition) \or Consequence`. This is the typical "if-then" used in rule bodies.
    *   `Consequence <~~ Condition`: Same as `Condition ~~> Consequence`.
    *   `Condition <~~> Consequence`: Equivalent to `(Condition ~~> Consequence) \and (Condition <~~ Consequence)`.
    *   `Condition ==> Consequence`: Equivalent to `(\neg Condition) \or Consequence`. This form uses explicit negation and can appear in rule heads (omniformity).
    *   `Consequence <== Condition`: Same as `Condition ==> Consequence`.
    *   `Condition <==> Consequence`: Equivalent to `(Condition ==> Consequence) \and (Condition <== Consequence)`.

    These implication operators are primarily used within rule bodies (except for `==>`, `<==`, `<==>` which can also appear in heads). The `\if`-`\then`-`\else` construct is generally friendly to transactional updates (changes are undone on backtracking unless committed).

    ```ergo
    // Example using \if \then \else
    ?- \if p(a) \then write(p_is_true)@\io \else write(p_is_false)@\io.

    // Example using ~~> (common in rule bodies)
    eligible(?X) :- has_ticket(?X) ~~> allowed_entry(?X).
    ```

**Clarification on Semantic Differences: `:-` vs. `~~>` vs. `==>`**

It is crucial to understand the different roles and semantics of these implication-like connectives:

*   `:-` (**Rule Definition**): This is the primary connective defining Ergo rules (`Head :- Body.`). It is *not* a logical operator used *within* a rule body or query. It establishes a deductive link: if the `Body` can be proven true, then `Head` can be derived. It implicitly involves universal quantification of head variables. It does *not* support contrapositive reasoning (unless omniformity `<==` is used in the head).
*   `~~>` (**Body Implication - Default Negation**): This is a logical operator used *within* rule bodies or queries. `Cond ~~> Conseq` is syntactic sugar for `(\naf Cond) \or Conseq`. It checks the truth condition: "Is it true that `\naf Cond` is true, OR `Conseq` is true?". It uses default negation (`\naf`) and is suitable for standard conditional checks within a rule's logic. It cannot appear in rule heads.
*   `==>` (**Body/Head Implication - Explicit Negation**): This is a logical operator that can appear in rule bodies, queries, and (with omniformity enabled) rule heads. `Cond ==> Conseq` is syntactic sugar for `(\neg Cond) \or Conseq`. It uses explicit negation (`\neg`). When used in rule heads with omniformity (`Head1 ==> Head2 :- Body.`), it allows for contrapositive reasoning.

Key Differences Summarized:

| Connective | Location         | Negation Type | Contrapositive? | Purpose                                 |
| :--------- | :--------------- | :------------ | :-------------- | :-------------------------------------- |
| `:-`       | Rule Structure   | N/A           | No (by itself)  | Defines rules, derives head             |
| `~~>`      | Rule Body/Query  | `\naf`        | No              | Checks conditional truth within body    |
| `==>`      | Body/Query/Head* | `\neg`        | Yes (in head*)  | Checks condition / Enables omniformity* |

*\*When used in rule heads with `:- compiler_options{omni=on}.`*

Choose the connective based on the intended logical meaning and location within the Ergo code. Do not confuse the rule definition operator `:-` with the logical implication operators `~~>` or `==>`.

### 6.2. Fast If-Then-Else

A faster, specialized version of if-then-else exists for specific conditions:

```
if-condition -->> then-part
(if-condition -->> then-part ; else-part)
```

*   **Restriction:** The `if-condition` must be a builtin primitive, a non-tabled Prolog predicate (e.g., called via `@\prolog`), or an Ergo predicate/method prefixed with `%`.
*   **Semantics:** Unlike `\if Cond \then Then`, the construct `Cond -->> Then` *fails* if `Cond` fails. The two-sided form `(Cond -->> Then ; Else)` behaves identically to `\if Cond \then Then \else Else`, executing `Then` if `Cond` succeeds and `Else` if `Cond` fails, but is faster due to the restriction on `Cond`.

```ergo
// Example: Fast check if X is an integer before proceeding
?- isinteger{?X} -->> process_integer(?X) ; handle_non_integer(?X).
```

### 6.3. Loops

ErgoAI provides several looping constructs.

*   **`\while Condition \do Action`:** `Condition` is evaluated. If true, `Action` is executed. The process repeats, backtracking through solutions for `Condition`. The loop terminates when `Condition` has no more solutions or if `Action` fails. The loop *succeeds* unless `Action` fails for some successful binding of `Condition`. Transactional updates within `Action` or `Condition` are committed after each successful iteration.
*   **`\do Action \until Condition`:** `Action` is executed first, then `Condition` is evaluated. If `Condition` is false, the loop continues by backtracking and executing `Action` again. It terminates when `Condition` becomes true or if `Action` fails. The loop *succeeds* unless `Action` fails. Transactional updates are committed after each successful iteration (before `Condition` is checked).

    ```ergo
    p({1,2,3}).
    // Example: Print all values for p(?X) using while-do
    ?- \while p(?X) \do writeln(?X)@\io.

    // Example: Process items until p(X) is no longer true (requires p to be updatable)
    ?- \do (p(?X), delete{p(?X)}, process(?X)) \until \naf p(?X).
    ```
    **Caution:** Using non-backtrackable predicates (like `read`) in the `Condition` of these loops requires the `\repeat` hint (e.g., `\while \repeat(read(?X)) \do ...`). Negating such conditions in `\until` also requires care.

*   **`while-loop Condition Action`:** Similar to `\while \do`, but does not work through backtracking. `Condition` is tested; if true, `Action` is executed, and the loop repeats. It terminates when `Condition` becomes false. `Action` *must* modify `Condition`'s truth value eventually to avoid infinite loops. Transactional updates are *not* committed automatically per iteration.
*   **`loop-until Action Condition`:** Similar to `\do \until`, but does not use backtracking. `Action` executes, then `Condition` is tested. If false, the loop repeats. It terminates when `Condition` becomes true. `Action` *must* eventually make `Condition` true. Transactional updates are *not* committed automatically per iteration.

The `while-loop` and `loop-until` constructs are more expensive and typically used only when transactional updates spanning multiple iterations are needed. Using `(Action ; \true)` within these loops to prevent termination on `Action` failure can be dangerous if `Condition` is not guaranteed to eventually change truth value.

### 6.4. Once (First Solution Only)

The `once{Goal}` primitive provides a way to execute `Goal` and commit to the *first* solution found, cutting away any other potential solutions or choice points created during the execution of `Goal`.

*   **Syntax:** `once{ Goal }`
*   **Semantics:** The system executes `Goal`.
    *   If `Goal` fails, `once{Goal}` fails.
    *   If `Goal` succeeds, the system commits to the bindings and choice points established by that first success, discarding alternatives within `Goal`. `once{Goal}` then succeeds.
*   **Usage:** Useful for preventing unwanted backtracking within a specific part of the logic when only one solution is needed or valid, or for performance optimization by pruning the search space. It's often a safer, more localized alternative to the Prolog cut (`!`).

```ergo
p(a).
p(b).
q(x).
q(y).

// Standard query finds all combinations
?- p(?X), q(?Y).
// Output: ?X=a, ?Y=x ; ?X=a, ?Y=y ; ?X=b, ?Y=x ; ?X=b, ?Y=y

// Query using once finds only combinations involving the first solution for p(?X)
?- once{p(?X)}, q(?Y).
// Output: ?X=a, ?Y=x ; ?X=a, ?Y=y
```

### 6.5. Unless-Do

The `\unless Condition \do Action` construct provides conditional execution where the action is performed only if the condition is *false*.

*   **Syntax:** `\unless Condition \do Action`
*   **Semantics:**
    1.  `Condition` is evaluated.
    2.  If `Condition` succeeds (is true or undefined), the `\unless` construct succeeds immediately, and `Action` is *not* executed.
    3.  If `Condition` fails, `Action` is executed. The `\unless` construct then succeeds if `Action` succeeds, and fails if `Action` fails.
*   **Usage:** It is essentially an abbreviation for `\if Condition \then \true \else Action`. Useful for executing cleanup actions or defaults when a primary condition does not hold.

```ergo
// Example: Set default value if specific value is not present
set_default_if_needed(Obj, Attr, Default) :-
    \unless ?Obj[?Attr -> ?_]  // Condition: Does Obj already have a value for Attr?
    \do insert{?Obj[?Attr -> Default]}. // Action: Insert default if no value exists
```

## 7. Modularity

ErgoAI provides a robust module system for organizing knowledge bases, enabling code reuse, encapsulation, and interaction with external systems like Prolog.

### 7.1. Module Concepts

A module in ErgoAI is an abstraction that groups related rules, facts, and definitions. It consists of a `name` (an alphanumeric symbol) and `contents`. Modules allow large knowledge bases to be split into manageable, reusable libraries. By default, literals within a module refer only to other literals within the same module unless explicitly directed otherwise. ErgoAI distinguishes between user modules, Prolog modules, and system modules.

### 7.2. Loading and Adding Code

Knowledge base content is typically loaded from files into modules.

*   **Loading (Replacing Content):** These commands load the content of a file into a module, *erasing* any previous content of that module.
    *   `[filename]`: Loads `filename.ergo` (or `.P`, `.xwam`) into the default module `main`.
    *   `load{filename}`: Same as `[filename]`.
    *   `[filename >> moduleName]`: Loads `filename.ergo` into the specified `moduleName`.
    *   `load{filename >> moduleName}`: Same as `[filename >> moduleName]`.
    *   `[url('URL')]` or `load{url('URL')}`: Loads from a URL.
    *   `[>>moduleName]` or `load{>>moduleName}`: Loads from standard input into the specified module (ends with Ctrl-D/Ctrl-Z). `[]` or `load{}` loads into `main`.

    ```ergo
    // Load mykb.ergo into module main
    [mykb].
    // Load mykb.ergo into module foo
    load{mykb >> foo}.
    // Load from a URL into module bar
    [url('http://example.com/kb.ergo') >> bar].
    ```

*   **Adding (Appending Content):** These commands add the content of a file to a module *without* erasing existing content.
    *   `[+filename]`: Adds `filename.ergo` to the default module `main`.
    *   `add{filename}`: Same as `[+filename]`.
    *   `[+filename >> moduleName]`: Adds `filename.ergo` to the specified `moduleName`.
    *   `add{filename >> moduleName}`: Same as `[+filename >> moduleName]`.
    *   `[+url('URL')]` or `add{url('URL')}`: Adds from a URL.
    *   `[+>>moduleName]` or `add{+>>moduleName}`: Adds from standard input to the specified module. `[+]` or `add{+}` adds to `main`.

    ```ergo
    // Add rules from extensions.ergo to module foo
    [+extensions >> foo].
    // Add more rules to module foo
    add{more_extensions >> foo}.
    ```
    Loading and adding can be combined: `[foo>>bar, +foo2>>bar]`.

### 7.3. Calling Literals Across Modules vs. Defining Literals

ErgoAI carefully distinguishes between *querying* literals defined in other modules and *defining* literals within a module.

**Querying Literals Defined in Other Modules:**

To invoke or check the truth of a predicate or frame defined in a different user module (e.g., `target_module`), the query must specify the context using the `@` operator suffix. The general form is:

```ergo
literal@target_module
```

*   `literal`: The frame or predicate call (e.g., `p(?X)`, `object[method->?Y]`, `instance:class`).
*   `@`: The module specification operator.
*   `target_module`: The name of the target user module where the fact, rule, or definition defining `literal` resides. Can be a variable, but must be bound at the time of the call.

This syntax allows querying facts, rules, and relationships defined within specific modules.

**Important Querying Syntax:**

When constructing the `literal` part of the query (the part *before* the `@`):
1.  **Do NOT** prefix instance names or class names within the `literal` with their defining module (e.g., using `module:`).
2.  Rely on the `@target_module` suffix to specify the context for the lookup.
3.  The resolution of the unqualified names (like `instance_name` or `ClassName`) within the `literal` happens *within the context of the `target_module`*, using the imports defined in the file(s) loaded into `target_module`.

This query syntax can only be used in rule bodies and queries.

**Examples of Querying:**

Assume:
*   `geography_kb.ergo` (loaded into module `geography`) defines `country_k` and imports `scenario_classes`. It contains `country_k : country.` and `country_k[name -> 'Country K'].`
*   `personnel_organization_links_kb.ergo` (loaded into module `personnel_organization_links`) defines links like `ctfa[commander -> gen_jones].` and imports `organizations` and `personnel`.

*   **Correct Querying:**
    ```ergo
    // Check ISA relationship defined in 'geography' module
    ?- country_k : country @ geography.
    // Check property defined in 'geography' module
    ?- country_k[name -> ?Name] @ geography.
    // Check property defined in 'personnel_organization_links' module
    ?- ctfa[commander -> ?CmdrObj] @ personnel_organization_links.
    ```
    In these examples, `country_k`, `country`, and `ctfa` are resolved within the context specified after `@`, using that module's imports if necessary.

*   **Incorrect or Unnecessary Querying:**
    ```ergo
    // Avoid qualifying instances/classes before the @
    ?- geography:country_k : scenario_classes:country @ geography. // Unnecessary/potentially problematic
    ?- geography:country_k[name -> ?Name] @ geography. // Unnecessary/potentially problematic
    ```

Module specifications distribute over logical connectives (`,`, `;`, `\naf`, `\+`). For example:
```ergo
// Equivalent to: (p(?X)@foo, q(?Y)@foo)
?- (p(?X), q(?Y)) @ foo.
```

**Defining Literals Referring to Other Modules:**

**Crucially, module qualifiers (`@module` or `module:`) cannot be used within rule heads or fact definitions.** When defining a rule or fact within a file (which belongs to a specific module upon loading), if that definition needs to refer to entities (like classes or instances) defined in *other* modules, you **must** use `:- importmodule{...}` directives at the top of the defining file. Explicit qualification within the definition is disallowed because definitions must reside wholly within the module they belong to, upholding module encapsulation.

*   **Correct Definition using Import:**
    ```ergo
    % In file my_module.ergo, loaded into module 'my_module'
    :- importmodule{other_module}.

    my_instance : some_class. % some_class is resolved from other_module via import
    ```

*   **Incorrect Definitions:**
    ```ergo
    // These will cause parsing errors if found in an .ergo file:
    my_instance@my_module : some_class.
    my_instance : some_class@other_module.
    my_head@my_module :- body.
    ```

### 7.4. Calling Prolog

ErgoAI allows calling predicates defined in the underlying Prolog (XSB) system.

*   **Calling Predicates in Specific Prolog Modules:**
    ```ergo
    predicate(Args)@\prolog(prologModuleName)
    predicate(Args)@\plg(prologModuleName) // Synonym
    ```
    This calls the Prolog predicate in the specified Prolog module. Arguments are passed as HiLog terms.

*   **Calling Well-Known/Usermod Predicates:** For predicates in XSB's default `usermod` module or other "well-known" predicates, the module name can be omitted:
    ```ergo
    predicate(Args)@\prolog
    predicate(Args)@\plg // Synonym
    ```

*   **Automatic Term Conversion (`@\prologall`, `@\plgall`):** To automatically convert arguments between Ergo's HiLog representation and Prolog's term representation, use:
    ```ergo
    predicate(Args)@\prologall(prologModuleName)
    predicate(Args)@\plgall(prologModuleName) // Synonym
    predicate(Args)@\prologall // For usermod/well-known predicates
    predicate(Args)@\plgall // Synonym
    ```
    This is often more convenient but may incur slight overhead if conversion is unnecessary.

```ergo
// Call Prolog's member/2 in module 'basics'
?- member(a, [a,b,c])@\prolog(basics).

// Call writeln/1 (well-known predicate)
?- writeln('Hello from Prolog')@\prolog.

// Call a predicate assuming automatic conversion
?- my_prolog_pred(HiLogTerm)@\prologall(my_prolog_module).
```
Like calls to Ergo modules, calls to Prolog can only appear in rule bodies and queries.

### 7.5. Importing Modules

Instead of qualifying every call with `@moduleName`, an entire module's exported symbols can be imported into the current module using the `importmodule` directive:

```ergo
:- importmodule{module1, module2, ...}.
```

This makes the *exported* methods and predicates from `module1`, `module2`, etc., directly callable within the importing module without the `@` qualifier. This does *not* merge the code like `#include`; it only affects how symbols are resolved.

```ergo
:- importmodule{foo}. // Import module foo

p(?X) :- q(?X). // q/1 is now resolved first in the current module, then in foo
```

**Using Imports in Query/Test Files:** In files that primarily contain queries or tests invoking literals from other modules (like test suites), explicitly importing the queried modules using `:- importmodule{...}` at the top is recommended, even if the queries themselves use full `@module` qualification. While not strictly necessary for direct lookups via `@module`, importing offers several advantages in these contexts:
    *   **Readability:** Reduces the need to constantly qualify names within the query logic, especially in complex queries involving multiple subgoals or helper predicates defined within the test file.
    *   **Resolution:** Ensures consistent resolution of unqualified names used across different parts of a complex query (e.g., within `findall` goals, joined subgoals).
    *   **Stability:** May aid the compiler/runtime in resolving symbols more robustly in some scenarios.

### 7.6. Exporting from Modules

Modules can control which of their predicates, methods, and ISA relationships are visible to other modules using the `export` directive. This enables encapsulation.

```ergo
:- export{ExportSpec1, ExportSpec2, ...}.
```

*   `ExportSpec`: Specifies what to export and optionally to which modules and whether updates are allowed. Format: `[updatable] ExportList [>> ModuleList]`
    *   `updatable`: Optional keyword allowing external modules to update (insert/delete) the exported facts/rules.
    *   `ExportList`: Comma-separated list of predicate/method/ISA templates (e.g., `p(?,?)`, `?[m->?]`, `?:?`, `?::?`).
    *   `>> ModuleList`: Optional list of modules to which symbols are exported. If omitted, symbols are exported to all modules.

If a module contains *any* `export` directive, only the explicitly exported symbols are visible externally. If no `export` directive exists, everything is exported by default.

```ergo
// Export p/2 read-only to all modules, and q/1 read-write to module 'bar' only.
:- export{ p(?,?), updatable q(?) >> bar }.
```

### 7.7. System Modules

ErgoAI provides pre-loaded system modules containing useful built-in predicates and methods. Their names start with `\`. They are invoked using the `@` syntax.

*   `@\io`: Standard Input/Output operations (see Section 50.1).
*   `@\sys`: System control, warnings, aborts, environment info (see Section 50.3).
*   `@\basetype`: Methods for manipulating primitive data types (see Section 50.5, 42).
*   `@\typecheck` or `@\tpck`: Type and cardinality checking (see Section 50.4, 47.2, 47.3).
*   `@\set`: Operations on sets, maps, and mv-maps (see Section 50.6).
*   `@\parse`: Reading and compiling Ergo terms (see Section 50.7).
*   `@\show`: Generating printable representations of terms (see Section 50.8).
*   `@\why`: Explanation generation API (see Section 52.2).
*   `@\sql`: Interface to SQL databases (see Chapter 6).
*   `@\json`: Interface for JSON processing (see Chapter 11).
*   `@\e2j`: Interface for calling Java from Ergo (see Chapter 2).
*   `@\http`: Interface for HTTP requests (see Chapter 5).

```ergo
// Write to standard output
?- writeln('Processing complete')@\io.

// Get the type name of a variable bound to a date
?- ?MyDate = "2023-01-01"^^\date, ?MyDate[typeName -> ?T]@\basetype.

// Check for type violations in module foo
?- Type[check(?[?->?], ?Result)@foo]@\typecheck.
```

### 7.8. Dynamic Module Management

While modules are typically populated by loading files, ErgoAI provides primitives for creating and clearing modules dynamically at runtime.

*   `newmodule{ ModuleName }`: Creates a new, empty user module with the specified `ModuleName` (must be an atom). The module is created with default semantics. An error occurs if a module with that name already exists.
*   `erasemodule{ ModuleName }`: Removes all facts and rules (both static and dynamic) from the user module specified by `ModuleName`. The module itself continues to exist (it is not deleted from the system's registry) and new content can be added or loaded into it later. Fails if the module does not exist.

```ergo
// Example
?- newmodule{tempData}.          // Create a new module
?- insert{p(1)}@tempData.       // Add a fact to it
?- p(?X)@tempData.              // Query it (?X=1)
?- erasemodule{tempData}.       // Clear the module
?- p(?X)@tempData.              // Query again (fails)
?- add{my_other_data >> tempData}. // Add new content
```

**Note:** These operations are non-transactional. They are useful for managing temporary knowledge or dynamically partitioning data during complex computations.

## 8. Advanced Features

ErgoAI incorporates several advanced features that significantly enhance its expressiveness and capabilities for complex knowledge representation and reasoning tasks.

### 8.1. Meta-programming

Meta-programming involves treating code or formulas as data. ErgoAI provides specific constructs for this.

#### 8.1.1 Reification

Reification allows formulas (like frames or predicates) to be treated as objects (terms). This is achieved using the `${...}` operator. The reified object represents the formula itself.

```ergo
// Tom believes the statement "Alice thinks Flora2 is cool"
Tom[believes-> ${Alice[thinks->Flora2:coolThing]}].

// Inserting a reified rule
?- insertrule{ ${ @!{rule1} p(?X) :- q(?X) } }.
```
Reification is crucial when formulas need to be passed as arguments or stored as values of attributes.

#### 8.1.2 Meta-decomposition

The `=..` operator (pronounced "univ") decomposes HiLog terms and reified formulas into a list representation, similar to Prolog's univ.

*   **For HiLog Terms:** `Term =.. [hilog(Functor), Arg1, ..., ArgN]`
    ```ergo
    ?- p(a,b) =.. ?L.
    // ?L = [hilog(p), a, b]
    ```
*   **For Reified HiLog Predicates:** `${Predicate@Module} =.. [hilog(PredName, Module), Arg1, ..., ArgN]`
    ```ergo
    ?- ${p(a,b)@foo} =.. ?L.
    // ?L = [hilog(p, foo), a, b]
    ```
*   **For Reified Frames:** `${Frame@Module} =.. [flogic(FrameType, Module), Subject, Prop1, Val1, Prop2, Val2, ...]` where `FrameType` indicates the type (`->`, `=>`, `:`, `::`, `boolean`, etc.).
    ```ergo
    ?- ${a[b->c]@foo} =.. ?L.
    // ?L = [flogic(->, foo), a, b, c]

    ?- ${a:b@foo} =.. ?L.
    // ?L = [flogic(:, foo), a, b]
    ```
*   **For Reified Negated Formulas:** The first element reflects the negation type (`negation(neg)`, `negation(naf)`).
    ```ergo
    ?- ${\neg a[b->c]@foo} =.. ?L.
    // ?L = [negation(neg), ${a[b->c]@main}]
    ```
The `=..` operator is bidirectional, allowing construction of terms/formulas from lists as well.

#### 8.1.3 Querying the Rule Base

ErgoAI provides primitives for introspecting the rules defined in the knowledge base.

*   **Basic Querying (`clause{}`)**
    *   `clause{Head, Body}`: Finds rules (static or dynamic) in the *current* module where the head unifies with `Head` and the body unifies with `Body`. Backtracks through all matching rules.
    *   `clause{Head, Body}@Module`: Same as above, but searches in the specified `Module`.
    *   `clause{type, Head, Body}`: Similar to `clause{Head, Body}`, but filters by rule type. `type` can be:
        *   `static`: Matches only rules loaded from files (compiled).
        *   `dynamic`: Matches only rules added dynamically (via `insertrule`).
        *   `dyna`: Matches dynamic rules inserted with `insertrule_a` (before static rules).
        *   `dynz`: Matches dynamic rules inserted with `insertrule_z` or `insertrule` (after static rules).
    *   `clause{@!{RuleIdPattern} Head, Body}`: Queries rules based on their descriptor properties (including the rule Id). `RuleIdPattern` is a frame pattern matching the rule descriptor (see Section 37.4). **This is the standard method documented in this Guide for querying rule descriptor properties; other syntaxes may exist but are not covered here.**

    ```ergo
    // Assuming rule: p(?X) :- q(?X), r(?X). exists in module 'main'
    ?- clause{p(?A), ?Body}.
    // ?A = ?X, ?Body = (q(?X), r(?X))

    // Assuming rule: @!{rule1} s(a). exists
    ?- clause{@!{rule1[tag->?T]} ?H, ?B}.
    // ?T = _, ?H = s(a), ?B = true (assuming 'rule1' has no explicit tag)
    ```
    **Note:** `clause{}` cannot query facts declared without `:- \true.`. Use `isbasefact{}` (see below) for those. It also has limitations regarding the size of rules it can retrieve due to underlying Prolog constraints.

*   **Querying Base Facts (`isbasefact{}`)**
    *   `isbasefact{Fact}`: True if `Fact` exists as a base fact (asserted directly, not derived via a rule with a non-true body) in the current module. `Fact` must be ground.
    *   `isbasefact{Fact}@Module`: Checks for `Fact` in the specified `Module`.

    ```ergo
    p(1).
    q(2) :- \true.

    ?- isbasefact{p(1)}.  // Succeeds
    ?- isbasefact{q(2)}.  // Fails
    ?- clause{p(1),?B}.   // Fails (p(1) is a base fact, not a rule)
    ?- clause{q(2),?B}.   // Succeeds (?B = \true)
    ```

*   **Structural Querying (`structdb{}`)**
    Provides a more powerful way to query rules based on the atomic formulas they *contain*, regardless of nesting within logical connectives or quantifiers. Requires the `:- use_rule_structure_db.` directive in the file or the `?- use_rule_structure_db{Module, on}.` runtime command.
    *   `structdb{GoalPattern, SearchSpec, ?Id, ?Module, ?File}`: Finds rules containing atomic formulas matching `GoalPattern` according to `SearchSpec` (`any`, `all`, `all+head`, `all+body`, etc.). Returns the full rule Id components.
    *   `structdb{Id, Module, File, ?Goal, ?LocationInRule, ?Context}`: Given a rule Id, decomposes the rule into its constituent atomic formulas (`?Goal`), indicating their location (`head` or `body`) and semantic context (`\naf`, `\neg`, aggregates, etc.).

    ```ergo
    // Assuming: @!{r1} p(?X) :- q(?X), \naf r(?X). in file demo.ergo, module main
    :- use_rule_structure_db.

    // Find rules containing r(?) anywhere
    ?- structdb{r(?), any, ?Id, ?Mod, ?F}.
    // ?Id=r1, ?Mod=main, ?F='demo.ergo'

    // Decompose rule r1
    ?- structdb{r1, main, 'demo.ergo', ?G, ?L, ?C}.
    // -> ?G = ${p(?X)@main}, ?L = head, ?C = []
    // -> ?G = ${q(?X)@main}, ?L = body, ?C = []
    // -> ?G = ${r(?X)@main}, ?L = body, ?C = [\naf]
    ```

### 8.2. Defeasible Reasoning Syntax

ErgoAI supports defeasible reasoning, allowing rules to be overridden or defeated based on priorities and conflicts. Key syntactic elements include:

#### 8.2.1 Rule Tags

Tags are assigned using the `@{...}` descriptor and act as identifiers for rules in defeasible reasoning contexts.
```ergo
@{rule_priority_high} conclusion :- condition.
```

#### 8.2.2 Overriding

The `\overrides` predicate specifies priority between rules or rule instances.
```ergo
// Rule tagged 'specific' overrides rule tagged 'general'
\overrides(specific, general).

// Rule 'r1' overrides 'r2' specifically when heads match AtomForm1/AtomForm2
\overrides(r1, AtomForm1, r2, AtomForm2).
```

#### 8.2.3 Opposition

The `\opposes` predicate defines which literals are considered contradictory. `Lit` and `\neg Lit` are implicitly opposing.
```ergo
// Literals matching AtomForm1 and AtomForm2 oppose each other
\opposes(AtomForm1, AtomForm2).

// Literal from rule r1 opposes literal from rule r2 if heads match
\opposes(r1, AtomForm1, r2, AtomForm2).
```

#### 8.2.4 Cancellation

The `\cancel` predicate allows rule instances to be dynamically disqualified.
```ergo
// Cancel all rules tagged 'old_rule'
\cancel(old_rule).

// Cancel rules tagged 'specific_rule' whose head matches 'p(a)'
\cancel(specific_rule, p(a)).
```

#### 8.2.5 Defeasibility Descriptors

Rules can be explicitly marked as `defeasible` (can be overridden) or `strict` (cannot be defeated) using `@@{...}`.
```ergo
@@{defeasible} p(?X) :- q(?X). // This rule can be defeated
@@{strict} important_fact.     // This fact cannot be defeated
```
If untagged and no descriptor is present, rules are typically considered `strict` unless the default is changed (see Section 41.5).

#### 8.2.6 Runtime Manipulation of Rule Status

Beyond static definitions, the status of rules (enabled/disabled, defeasible/strict) can be queried and modified at runtime using specific primitives. These require the full rule Id `(LocalId, FileName, Module)` for identification.

*   **Enabling/Disabling:**
    *   `enable{LocalId, File, Module}` / `disable{LocalId, File, Module}`: Enables/disables the specified rule. These are **non-transactional** (effects persist across backtracking). Always succeed if the rule exists.
    *   `tenable{LocalId, File, Module}` / `tdisable{LocalId, File, Module}`: Enables/disables the specified rule. These are **transactional** (effects are undone on backtracking). Always succeed if the rule exists.
    *   `isenabled{LocalId, File, Module}` / `isdisabled{LocalId, File, Module}`: Queries the current enabled/disabled status of the rule.
    *   **Shortcuts:** 1-argument versions `enable{LocalId}`, `disable{LocalId}`, etc., assume the current file (`\@F`) and module (`\@`).

    ```ergo
    @!{rule1} p(a).
    ?- disable{rule1, \@F, \@}. // Disable rule1
    ?- p(a).                   // Fails
    ?- enable{rule1}.          // Enable rule1 (using shortcut)
    ?- p(a).                   // Succeeds
    ```

*   **Changing Defeasibility:**
    *   `makedefeasible{LocalId, File, Module}`: Makes the specified rule defeasible. Non-transactional.
    *   `makestrict{LocalId, File, Module}`: Makes the specified rule strict. Non-transactional.
    *   `isdefeasible{LocalId, File, Module}` / `isstrict{LocalId, File, Module}`: Queries the current defeasible/strict status.
    *   **Shortcuts:** 1-argument versions `makedefeasible{LocalId}`, etc., assume the current file and module.

    ```ergo
    @!{rule2} @@{strict} q(b).
    ?- isstrict{rule2}.            // Succeeds
    ?- makedefeasible{rule2}.      // Make it defeasible
    ?- isdefeasible{rule2}.        // Succeeds
    ?- isstrict{rule2}.            // Fails
    ```

**Note:** Modifying the status of rules can significantly alter the logic's behavior and should be done with care, especially in multi-threaded or complex scenarios. These primitives operate on the rule identified by the *full* rule Id.

### 8.3. Omniformity

Omniformity allows general first-order formulas, including implications (`==>`, `<==`, `<==>`), disjunction (`\or`), and quantifiers (`forall`, `exists`), to appear directly in the *head* of rules or facts. This enables more direct representation of certain logical statements, including contrapositives. Requires `:- compiler_options{omni=on}.`.

```ergo
// Example: If X is a bird, it flies or it's a penguin (stated as a fact/head)
forall(?X)^(bird(?X) ==> (flies(?X) \or penguin(?X))).

// Example: Equivalence in the head
rule_head1 <==> rule_head2 :- body.
```
The standard rule connective `:-` is *not* omniform; its semantics remain distinct.

### 8.4. Inheritance Syntax

Inheritance is primarily controlled through the frame syntax:

*   **Class Frames (`[|...|]`)**: Define properties and signatures that are inherited by subclasses and members.
    ```ergo
    Vehicle[| num_wheels => \integer |]. // Type signature inherited
    Car :: Vehicle.
    myCar : Car.
    // Both Car and myCar inherit the signature
    ```
*   **Default Values (`->` in Class Frames)**: Define default values inherited by subclasses and members, which can be overridden.
    ```ergo
    Bird[| flies -> \true |]. // Birds generally fly (default)
    Penguin :: Bird.
    Penguin[| flies -> \false |]. // Override for Penguins
    tweety : Penguin.
    // tweety[flies -> \false] is derived, overriding the Bird default.
    ```
*   **Signatures (`=>` in Class Frames)**: Define type constraints inherited cumulatively (intersections of types apply).
    ```ergo
    LandVehicle[| category => Land |].
    WaterVehicle[| category => Water |].
    AmphibiousVehicle :: LandVehicle, WaterVehicle.
    // AmphibiousVehicle inherits category => (Land, Water)
    ```
*   **Object Frames (`[...]`)**: Define properties specific to an object; these are *not* inherited.
    ```ergo
    john[age -> 30]. // Specific to john, not inherited by subclasses/instances of john
    ```

### 8.5. User Defined Functions (UDFs)

UDFs allow defining functions within ErgoAI using a rule-like syntax.

#### 8.5.1 Definition

UDFs are defined using the `\udf` keyword:
```ergo
\udf functionName(Arg1,...,ArgN) := ResultExpr \if ConditionBody.
// or using :-
\udf functionName(Arg1,...,ArgN) := ResultExpr :- ConditionBody.
```
The `\if ConditionBody` (or `:- ConditionBody`) part is optional. `ResultExpr` is the term returned when the `ConditionBody` is true for the given arguments.

```ergo
// Example: Calculate square if input is a number
\udf square(?X) := =?X*?X \if isnumber{?X}.
```

#### 8.5.2 Invocation

UDFs are invoked simply by using them like standard function terms within expressions, typically with inline evaluation (`=` or `\is`).

```ergo
?- ?Y = square(5). // ?Y = 25
?- p(=square(3)).  // Equivalent to p(9)
```

#### 8.5.3 Declaration

If a UDF is defined in one module/file and used in another file *added* later (not loaded, which replaces definitions), the `useudf` directive is needed in the consuming file:
```ergo
:- useudf{functionName/Arity, ...}.
```
```ergo
// In file utils.ergo
\udf square(?X) := =?X*?X \if isnumber{?X}.

// In file main.ergo, added after utils.ergo is loaded
:- useudf{square/1}.
process_square(?X) :- p(=square(?X)).
```

### 8.6. Aggregates

Aggregates compute summary values over sets of results. Common operators include `min`, `max`, `count`, `countdistinct`, `sum`, `sumdistinct`, `avg`, `avgdistinct`, `setof`, `bagof`.

#### 8.6.1 Basic Syntax

The simplest form aggregates results for a variable based on a query:
```
aggregateOperator{?AggregationVar | Query}
```
```ergo
// Count the number of employees
?- count{?Emp | ?Emp:employee} = ?Count.

// Find the minimum age
?- min{?Age | ?P[age -> ?Age]} = ?MinAge.

// Collect all employee names into a list (duplicates removed, sorted)
?- setof{?Name | ?Emp:employee[name -> ?Name]} = ?NameList.
```

#### 8.6.2 Grouping Syntax

Aggregates can group results based on the values of specified variables:
```
aggregateOperator{?AggregationTerm[?GroupingVar1, ..., ?GroupingVarN] | Query}
```
The aggregate is computed separately for each distinct combination of values for the `?GroupingVars`.

```ergo
// Find the average salary per department
?- avg{?Sal[?Dept] | ?Emp[department->?Dept, salary->?Sal]} = ?AvgSal.
// This query backtracks, binding ?Dept and ?AvgSal for each department.
```

#### 8.6.3 Sorting Syntax

`setof` and `bagof` allow specifying sort order for the collected list:
```
setof{?Term(SortSpec) | Query}
setof{?Term[?Groups](SortSpec1, SortSpec2) | Query}
```
`SortSpec` can be `asc`, `desc`, or a list like `[asc(N), desc(M)]` specifying sorting criteria based on argument positions. `SortSpec1` sorts the aggregated list (`?Term`), `SortSpec2` sorts the groups.

```ergo
// Get employees sorted by age (ascending)
?- setof{?Emp(asc) | ?Emp[age -> ?Age]} = ?SortedEmps.

// Get salaries per year, list sorted by salary (desc), groups sorted by year (asc)
?- setof{?Sal[?Year](desc, asc) | ?Emp[salary(?Year)->?Sal]} = ?SalList.
```

### 8.7. Update Primitives

ErgoAI provides primitives for modifying the knowledge base at runtime.

**(Comparison with Prolog)**

Standard Prolog provides `asserta/1` (assert at beginning), `assertz/1` (assert at end), `retract/1` (retract first match), and `retractall/1` (retract all matches) for dynamically modifying the program database (Prolog Tutorial Slides, Slide 44). These are non-transactional (not undone on backtracking) and require predicates to be declared `dynamic`. ErgoAI's `insert`/`delete`/etc. operate on a base/derived model, do not require dynamic declarations, and offer both transactional (`t_*`) and non-transactional versions.

#### 8.7.1 Non-transactional

These updates persist even if subsequent parts of a query/rule fail (similar to Prolog's `assert`/`retract`).

*   `insert{Literal1, Literal2, ...}`: Inserts one instance matching the literals.
*   `insertall{Literals | Condition}`: Inserts all instances satisfying the condition.
*   `delete{LiteralPattern1, ...}`: Deletes one matching fact/rule instance.
*   `deleteall{LiteralPattern | Condition}`: Deletes all matching instances satisfying the condition.
*   `erase{ObjectPattern}`: Deletes an object and recursively reachable objects.
*   `eraseall{ObjectPattern | Condition}`: Deletes all matching objects and reachable objects.
*   `insertrule{Rule1, Rule2, ...}`: Inserts dynamic rules.
*   `deleterule{RulePattern}`: Deletes matching dynamic rules.

```ergo
?- insert{p(a), q(b)}.
?- delete{p(a)}.
?- insertrule{ new_rule(?X) :- condition(?X) }.
```

#### 8.7.2 Transactional

These updates are undone upon backtracking if the surrounding query/rule fails.

*   `t_insert{...}`, `tinsert{...}`
*   `t_insertall{...}`, `tinsertall{...}`
*   `t_delete{...}`, `tdelete{...}`
*   `t_deleteall{...}`, `tdeleteall{...}`
*   `t_erase{...}`, `terase{...}`
*   `t_eraseall{...}`, `teraseall{...}`

```ergo
// Transactionally insert q(a), will be undone if subsequent goal fails
?- t_insert{q(a)}, (some_condition -> \true ; \false).
```

#### 8.7.3 Stealth Updates

Updates performed within `stealth{...}` are hidden from the reactive tabling mechanism, preventing potential errors when tabled predicates depend on updates.

```ergo
p(?X) :- insert{stealth{%abc}}. // Allows update within tabled predicate p/1
```

#### 8.7.4 Global Counters

ErgoAI provides an efficient mechanism for maintaining global named counters, which can be set, queried, incremented, or decremented. These are often more convenient and performant than simulating counters using dynamic facts.

The counter operations use the `counter{...}` syntax:

*   `counter{Name := Integer}`: Sets the counter identified by the atom `Name` to the specified `Integer` value. Creates the counter if it doesn't exist.
*   `counter{Name := ?Var}`: Queries the current value of the counter `Name` and binds it to `?Var`. Fails if the counter `Name` does not exist.
*   `counter{Name + Integer}`: Atomically increments the value of counter `Name` by `Integer`. `Integer` can be positive or negative. Fails if the counter does not exist or if the result is not a valid integer.
*   `counter{Name - Integer}`: Atomically decrements the value of counter `Name` by `Integer`. Equivalent to `counter{Name + (-Integer)}`. Fails if the counter does not exist or if the result is not a valid integer.

```ergo
// Example Usage
?- counter{myCounter := 0}.          // Initialize counter
?- counter{myCounter + 5}.          // Increment by 5
?- counter{myCounter - 2}.          // Decrement by 2
?- counter{myCounter := ?Value}.    // Query value
// Output: ?Value = 3
```
**Note:** Counter names are global symbols. These operations are non-transactional (their effects persist across backtracking).

### 8.8. ErgoText Syntax

ErgoText allows using controlled natural language phrases within Ergo code.

*   **Phrases:** Enclosed in `\( ... \)`. Variables can be embedded.
    ```ergo
    \(John lives in Boston\).
    \(?Person works for ?Company\).
    ```
*   **Template Definitions:** Stored in `.ergotxt` files, mapping phrases to Ergo logic. Declared using `template(Context, Phrase, Translation)`.
     *   `Context`: A keyword specifying where the `Phrase` can be used and how the `Translation` should be interpreted. Common contexts include:
        *   `head`: For rule heads and facts.
        *   `body`: For rule bodies and queries.
        *   `headbody`: A shorthand allowing use in both `head` and `body` contexts.
        *   `insert`/`delete`/`insdel`: For use within update commands.
        *   `dynrule`: For use within `insertrule`/`deleterule`.
        *   Other keywords (e.g., `rule`, `query`, `fact`) can be used for documentation or specific processing, often treated as `toplevel` internally. *(See ErgoAI Example Bank, "ErgoText" for examples)*.
    *   `Phrase`: The natural language phrase enclosed in `\(...\)`. Variables (`?Var`) can be embedded.
    *   `Translation`: The corresponding Ergo logic fragment.
    ```ergo
    // In mytemplates.ergotxt
    template(headbody, \(?P lives in ?C\), ?P[lives_in -> ?C]).
    ```   
*   **Loading Templates:** Use `:- ergotext{template_file}.` (compile-time) or `?- ergotext{template_file}.` (runtime).

### 8.9. Skolem Symbols

Used to generate unique identifiers (constants or function symbols).

*   **Local Skolems:**
    *   `\#`: Generates a new unique constant each time it appears in a rule head/fact. In rule bodies, acts as a test for *any* Skolem constant.
    *   `\#N`, `\#name`: Generates a constant unique to the number `N` or symbol `name` within the scope of one Ergo sentence (terminated by `.`). Allows co-reference within that scope. In bodies, acts as a test for that specific Skolem constant.
*   **Global Skolems:**
    *   `\##N`, `\##name`: Generates a constant unique to `N` or `name` within the current global scope (defined by `:- new_global_oid_scope.`). Allows co-reference across rules/facts in the same scope. Behaves consistently in heads and bodies.
*   **Runtime Skolems:**
    *   `skolem{?Var}`: Binds `?Var` to a new unique Skolem constant at runtime.

```ergo
// Create a unique book object for each input row
@!{\#book} book[title->?T] :- input_row(title,?T).

// Use a named global skolem for a specific entity
person(\##john_smith)[name -> 'John Smith'].
manager(\##john_smith)[manages -> dept1].

// Generate a unique Id at runtime
?- skolem{?NewId}, insert{event(?NewId, timestamp -> now)}.
```

### 8.1.10 Meta-property Primitives

ErgoAI provides several built-in primitives (often based on underlying Prolog capabilities) to test the meta-properties of terms, such as their type or instantiation state. These are crucial for reflection and advanced logic manipulation. All these primitives require their argument(s) to be bound unless otherwise noted.

*   **Type Testing:**
    *   `isnumber{Arg}`: True if `Arg` is bound to any numeric type (\long, \integer, \double, \decimal, \float).
    *   `isinteger{Arg}`: True if `Arg` is bound to an integer (\long, \integer).
    *   `isfloat{Arg}`: True if `Arg` is bound to a floating-point number (\double, \float).
    *   `isdecimal{Arg}`: True if `Arg` is bound to a decimal number (currently same as `isnumber`).
    *   `isatom{Arg}`: True if `Arg` is bound to a Prolog atom (general constant symbol, *not* including numbers).
    *   `isatomic{Arg}`: True if `Arg` is bound to a Prolog atom or a number.
    *   `islist{Arg}`: True if `Arg` is bound to a Prolog list (`[]` or `[H|T]`).
    *   `ischarlist{Arg}`: True if `Arg` is bound to a character list (`"..."^^\charlist` or a list of valid character codes).
    *   `isstring{Arg}`: True if `Arg` is bound to the primitive type `\string`.
    *   `isiri{Arg}`: True if `Arg` is bound to the primitive type `\iri`.
    *   `issymbol{Arg}`: True if `Arg` is bound to the primitive type `\symbol` (Ergo's abstract symbols, distinct from strings/IRIs).
    *   `isskolem{Arg}`: True if `Arg` is bound to a Skolem constant (not a Skolem function term).

*   **Structure Testing:**
    *   `iscompound{Arg}`: True if `Arg` is bound to a compound term (a term with a functor and non-zero arity, like `f(a)` or `a[b->c]`).

*   **Instantiation Testing:**
    *   `isvar{Arg}`: True if `Arg` is currently an unbound variable. (Does not require `Arg` to be initially bound).
    *   `isnonvar{Arg}`: True if `Arg` is currently bound to any term (not a variable). (Does not require `Arg` to be initially bound).
    *   `isground{Arg}`: True if `Arg` is bound to a ground term (a term containing no unbound variables).
    *   `isnonground{Arg}`: True if `Arg` is bound to a term that contains at least one unbound variable.

*   **Term Manipulation:**
    *   `variables{Term, List}`: Binds `List` to a list of all unique unbound variables occurring within `Term`.
    *   `cloneterm{Term, ClonedTerm}`: Creates a copy `ClonedTerm` of `Term` where all variables are consistently replaced with new, fresh variables. Constants and structure remain identical. Useful for avoiding unintended variable sharing.

*   **Delayable Versions:** Many of the above primitives (e.g., `isinteger`, `isatom`, `isground`, `isnonvar`, etc.) have delayable versions with the signature `primitive{Arg, Mode}`.
    *   If `Arg` is bound when the call is made, it behaves identically to the 1-argument version.
    *   If `Arg` is unbound, the call is delayed.
    *   If `Arg` eventually becomes bound later in the execution, the check is performed then.
    *   If the query finishes and `Arg` is still unbound, the outcome depends on `Mode`:
        *   `must`: An instantiation error is thrown.
        *   `wish`: The primitive silently fails (evaluates to `\false`).
    *   **Note:** Delayable primitives are useful for logic programming patterns but cannot serve as strict *guards* for subsequent operations that require `Arg` to be bound, because the check might be delayed past the point where the subsequent operation is attempted.

```ergo
// Examples
?- isinteger{5}.                // Succeeds
?- isatom{abc}.                 // Succeeds
?- isatomic{'123'}.             // Succeeds (atom)
?- isatomic{123}.               // Succeeds (number)
?- iscompound{f(a)}.           // Succeeds
?- iscompound{a[b->c]}.       // Succeeds
?- iscompound{abc}.             // Fails
?- isvar{?X}.                   // Succeeds
?- isvar{?X, must}.             // Succeeds (initially)
?- isinteger{?X, wish}, ?X=a.   // Fails (wish allows it)
?- isinteger{?X, must}, ?X=a.   // Fails (must allows it - error would be at end if ?X never bound)
?- variables{f(?X,b,?Y,?X), ?L}. // ?L = [?X, ?Y] (or permutation)
?- cloneterm{f(?X,a), ?C}.      // ?C = f(?_NewVar, a)
```

## 9. Directives and Preprocessing

ErgoAI utilizes several types of special commands and directives to control compilation, runtime behavior, interaction, and preprocessing. It's important to distinguish between these types as they have different scopes and points of execution.

### 9.1. Compiler Directives

Compiler directives start with `:-` and are processed by the ErgoAI compiler when a file is loaded or compiled. They affect the semantics or compilation options for the module associated with the file they appear in. These directives must typically appear at the top of a file, before any rules or facts.

Syntax:
```ergo
:- directive_name{arguments}.
```
or for directives without arguments:
```ergo
:- directive_name.
```

Common Compiler Directives (details in respective sections):

*   `:- op{Precedence, Type, Name}`: Defines operators (Section 4.2).
*   `:- iriprefix{Prefix = IRI}`: Defines global IRI prefixes for the module (Section 3.8.4).
*   `:- irilocalprefix{Prefix = IRI}`: Defines file-local IRI prefixes (Section 42.2.1 of ergo-manual.pdf).
*   `:- importmodule{Module1, ...}`: Imports symbols from other modules (Section 7.5).
*   `:- export{ExportSpec1, ...}`: Controls symbol visibility outside the module (Section 7.6).
*   `:- setsemantics{Option1, Option2, ...}`: Sets compile-time semantics like inheritance or equality handling (Section 23).
*   `:- index{Arity-Argument}`: Specifies indexing strategies for tabled predicates (Section 49.2).
*   `:- table{pred/arity}`: Declares a Prolog-style predicate to be tabled (Section 34).
*   `:- prolog{pred/arity}`: Declares a predicate to be handled directly by the Prolog engine (Section 34).
*   `:- use_argumentation_theory{...}`: Enables defeasible reasoning (Section 41.2).
*   `:- compiler_options{...}`: Passes options like `production=on`, `expert=on`, `omni=on` to the compiler (Section 49.2).
*   `:- \nontabled_module.`: Declares that predicates/methods in the module should not be tabled by default (Section 34).
*   `:- symbol_context{...}`: Suppresses warnings about using symbols in multiple contexts (Section 26).
*   `:- useudf{udf/arity}`: Declares that a symbol is used as a UDF defined elsewhere (Section 8.5.3).
*   `:- encoding{enc_name}`: Specifies the character encoding for the source file (Section 53.3).

```ergo
// Example: Define an infix operator and an IRI prefix at compile time
:- op{700, xfx, has_part}.
:- iriprefix{ex = "http://example.org/schema#"}.

part(engine) :- car[has_part -> engine].
```

### 9.2. Executable Directives

Executable directives start with `?-` and appear within `.ergo` files. Syntactically, they look like queries. They are executed immediately when the file is loaded or added. Unlike standard queries in files, their primary purpose is often to modify the runtime state or perform actions during the loading process, rather than just retrieving information.

Syntax:
```ergo
?- goal.
```
where `goal` can be any valid ErgoAI goal, including calls to system modules or primitives that modify the runtime environment.

```ergo
// Example: Set a runtime semantic option when the file is loaded
?- setsemantics{equality=basic}.

// Example: Print a message during loading
?- writeln('Configuration module loaded.')@\io.

// Example: Load an ErgoText template file at runtime
?- ergotext{my_templates}.
```

### 9.3. Shell Commands

Shell commands are specific to the interactive ErgoAI shell (Listener/Terminal) and start with a backslash (`\`). They are *not* part of the ErgoAI language syntax used in files.

Common Shell Commands:

*   `\help`: Displays help information.
*   `\end`: Exits ErgoAI but keeps the underlying Prolog process running.
*   `\halt`: Exits both ErgoAI and the Prolog process.
*   `\one`: Sets query mode to return answers one at a time.
*   `\all`: Sets query mode to return all answers (default).
*   `\trace`: Turns on execution tracing.
*   `\notrace`: Turns off execution tracing.
*   `\logforest(File)` / `\nologforest`: Controls forest logging for debugging tabled calls.
*   `\tracelow`: Enables low-level Prolog trace.
*   `\abolishtables`: Clears all tabled results.

```
// Example usage in Ergo Shell:
ergo> \one. // Switch to one-answer mode
ergo> p(?X).
?X = a ; // User types ';' for next answer
?X = b ;
No
ergo> \trace. // Turn on tracing
ergo> p(a).
... trace output ...
Yes
ergo> \notrace.
ergo> \halt. // Exit ErgoAI
```

### 9.4. Preprocessor Commands

ErgoAI supports a C-style preprocessor that modifies the source file text *before* compilation. Preprocessor commands start with `#`.

Key Preprocessor Commands:

*   `#include "filename"`: Includes the content of another file textually. File paths follow the same rules as for loading commands (relative paths preferred, use `\\` on Windows if necessary).
*   `#define MACRO value`: Defines a simple text substitution macro.
*   `#define macro(arg1,...) expression`: Defines a function-like macro.
*   `#ifdef MACRO` / `#ifndef MACRO` / `#else` / `#endif`: Allows conditional compilation based on whether a macro (`MACRO`) is defined.
*   `#if exists("filename")`: Conditional compilation based on file existence.

```ergo
// Example: Include common definitions
#include "common_defs.ergo"

// Example: Define a constant
#define MAX_USERS 100

// Example: Conditional compilation for debugging
#define DEBUG_MODE 1

check_user_limit(?Count) :-
    ?Count > MAX_USERS,
#ifdef DEBUG_MODE
    writeln('User limit exceeded')@\io,
#endif
    throw(limit_exceeded).
```
The preprocessor allows for code reuse, configuration management, and conditional inclusion of code segments.

### 9.5. Runtime Encoding Directive

While `:- encoding{enc_name}.` sets the encoding for compiling an Ergo *source file*, a separate directive is needed to specify the encoding for *data files* being read or written at runtime using Ergo's I/O primitives.

*   **Syntax:** `?- encoding{ Stream, EncodingName }.`
*   **Parameters:**
    *   `Stream`: The stream identifier (obtained from `open`, `seeing`, or `telling`) associated with the open file.
    *   `EncodingName`: The encoding to use for subsequent reads/writes on that `Stream`. Supported names: `utf8`, `latin1`, `cp1252`, `ascii`.
*   **Usage:** This directive should be executed *after* opening a file (via `open`, `see`, or `tell`) and *before* performing any read/write operations on the corresponding stream, if the file's encoding differs from the system default (usually UTF-8).

```ergo
// Example: Read a file encoded in Latin-1
?- 'data.txt'[open(read, ?Stream)]@\io,
   encoding{?Stream, latin1},          // Set encoding for the stream
   // Perform read operations on ?Stream here...
   ?Stream[readline(atom)->?Line]@\io, // Reads using Latin-1
   ...,
   ?Stream[close]@\io.
```

## 10. Integrity Constraints

Integrity constraints (ICs) are logical conditions that must *not* be true in the knowledge base. ErgoAI can automatically check specified ICs after each transactional update and roll back the transaction if a violation is detected.

### 10.1. Defining Integrity Constraints

An IC is defined using a standard Ergo rule, where the head represents the violation condition.

```ergo
// Example: A person cannot be their own parent
@!{ic_no_self_parent} self_parent(?Person) :- parent(?Person, ?Person).
```
Here, `self_parent(?Person)` represents the violation. If this predicate becomes true for any `?Person` after an update, the IC is violated.

### 10.2. Activating and Deactivating Constraints

ICs must be explicitly activated to be checked by the system.

*   `+constraint{ ConstraintHeadPattern }`: Activates the IC defined by rules whose head unifies with `ConstraintHeadPattern`. Checks the constraint against the current KB state; issues warnings if violated. Subsequent transactional updates will be checked against this IC.
*   `+constraint{ ConstraintHeadPattern, CallbackPred }`: Activates the IC and specifies a `CallbackPred`. If a violation occurs, `CallbackPred(ListOfViolations)` is called instead of rolling back the transaction. `ListOfViolations` contains the ground instances of `ConstraintHeadPattern` that became true.
*   `-constraint{ ConstraintHeadPattern }`: Deactivates the specified IC. It will no longer be checked automatically.

```ergo
// Activate the self_parent constraint
?- +constraint{self_parent(?)}.

// Activate with a callback
?- +constraint{self_parent(?), handle_self_parent(?)}.
handle_self_parent(Violations) :- writeln('Error: Self-parent detected: ', Violations)@\io.

// Try to insert a violating fact transactionally
?- t_insert{parent(john, john)}.
// If IC is active without callback, this fails and warning is issued.
// If IC is active with callback, handle_self_parent([self_parent(john)]) is called.

// Deactivate the constraint
?- -constraint{self_parent(?)}.
```

**Notes:**
*   Only the *head* of the IC rule is specified in the `constraint` primitive.
*   ICs are checked *after* transactional updates (primitives starting with `t_`, `tinsert`, etc.). Non-transactional updates do not trigger IC checks.
*   If a transaction violates an IC and no callback is defined, the transaction is automatically rolled back.
*   The `ConstraintHeadPattern` can only be an atomic frame or predicate literal (optionally negated with `\neg`). It cannot be a complex formula.

## 11. Alerts

Alerts provide a mechanism to monitor the knowledge base for specific changes and trigger actions or notifications when those changes occur. They differ from integrity constraints in that they don't necessarily imply an error state and don't automatically cause rollbacks.

### 11.1. Defining and Activating Alerts

Alerts monitor specific predicate or frame patterns for changes in their truth status or for the appearance of conflicts.

*   **Syntax for Activation/Deactivation:**
    *   `+alert{ Type, MonitoredPattern }`: Activates an alert of the specified `Type` for literals matching `MonitoredPattern`.
    *   `+alert{ Type, MonitoredPattern, CallbackPred }`: Activates an alert with a callback predicate.
    *   `-alert{ Type, MonitoredPattern }`: Deactivates the specified alert.

*   **Parameters:**
    *   `Type`: Specifies the condition to monitor:
        *   `truth`: Alert is raised if an instance matching `MonitoredPattern` becomes `\true` after a transaction, having been `\false` or `\undefined` before.
        *   `conflict`: Alert is raised if an instance matching `MonitoredPattern` enters a conflict state (i.e., both it and an opposing literal are derivable) after a transaction, where no conflict existed before. (Requires a defeasible module).
    *   `MonitoredPattern`: An atomic frame or predicate literal (potentially with variables, can be negated with `\neg`) specifying the facts/conclusions to monitor.
    *   `CallbackPred`: An Ergo predicate (typically with one argument). If specified, `CallbackPred(ListOfAlerts)` is called when the alert condition is met, instead of printing a default warning. `ListOfAlerts` contains the ground instances matching `MonitoredPattern` that triggered the alert.

### 11.2. Behavior

*   Alerts are checked *after* update transactions (both transactional and non-transactional).
*   They trigger only based on *changes* caused by the transaction. Pre-existing conditions do not trigger alerts.
*   Unlike integrity constraints, alerts do *not* cause automatic transaction rollbacks.
*   The `conflict` alert type requires the module to be declared defeasible (`:- use_argumentation_theory.`).

```ergo
// Example: Alert if a VIP's status changes to 'inactive'
employee(vip1, 'Alice').
status(vip1, active).

// Define the callback
alert_vip_inactive(Alerts) :-
    writeln('ALERT: VIP status changed to inactive: ', Alerts)@\io.

// Activate the truth alert with callback
?- +alert{truth, status(?VIP, inactive), alert_vip_inactive(?)}.

// Transaction that triggers the alert
?- t_delete{status(vip1, active)}, t_insert{status(vip1, inactive)}.
// Output: ALERT: VIP status changed to inactive: [status(vip1,inactive)]
```

## 12. Sensors

Sensors are predicates with pre-defined, restricted invocation patterns. ErgoAI uses these patterns to delay the execution of a sensor call until its arguments meet the specified binding requirements (e.g., bound, ground). This is useful for interfacing with external resources or predicates where specific arguments must be known before the call can proceed meaningfully.

### 12.1. Declaring Sensors (`defsensor`)

Sensors must be declared before use, typically in a dedicated module file. The declaration specifies the invocation pattern (template), the implementation details, and the required binding conditions (guard).

*   **Syntax:**
    *   For P-Sensors (implemented in Prolog or C):
        `:- defsensor{ Template, ModuleName, Guard }.`
    *   For F-Sensors (implemented in Ergo):
        `:- defsensor{ Template, Guard }.`
*   **Components:**
    *   `Template`: The predicate signature as seen by the caller (e.g., `mySensor(?Input, ?Output)`).
    *   `ModuleName` (P-Sensors only): The name of the Prolog module where the sensor is implemented.
    *   `Guard`: A Boolean combination of `nonvar(Var)` and `ground(Var)` predicates, specifying the required instantiation state for variables in the `Template` before the sensor can be safely called. Parentheses can be used for grouping (e.g., `(nonvar(?X), ground(?Y))`).

```ergo
// Declare a P-Sensor 'lookup/2' in Prolog module 'extern_db'
// Requires the first argument to be ground before calling.
:- defsensor{lookup(?Key, ?Value), extern_db, ground(?Key)}.

// Declare an F-Sensor 'calculate/3' implemented in the current Ergo module
// Requires the first two arguments to be non-variable before calling.
:- defsensor{calculate(?A, ?B, ?Result), (nonvar(?A), nonvar(?B))}.
```

### 12.2. Defining Sensors

*   **F-Sensors:** Defined using standard Ergo rules in the same module where they are declared. They can use the quasi-variables `\?F` (caller file) and `\?L` (caller line) to report context-specific errors if the guard is not met when called (though Ergo delays the call until the guard *is* met or known to be unsatisfiable).
*   **P-Sensors:** Defined in corresponding Prolog files (`ModuleName.P`) or C code. The actual Prolog predicate receives *two extra initial arguments*: the caller's `FileName` and `LineNumber`, allowing for context-specific error reporting.

```ergo
// Example F-Sensor definition (corresponding to calculate/3 declaration above)
calculate(?A, ?B, ?Result) :-
    \if (\+isnumber{?A} ; \+isnumber{?B}) \then
        abort(['Sensor calculate called (', \?F, ':', \?L, ') with non-numeric args'])@\sys
    \else
        ?Result \is ?A + ?B.
```

### 12.3. Using Sensors (`usesensor`)

Modules that *call* a sensor must declare their intent using the `usesensor` directive.

*   **Syntax:** `:- usesensor{ SensorSpec1, SensorSpec2, ... }.`
    *   `SensorSpec`: The sensor template (e.g., `lookup/2`, `calculate/3`).

```ergo
// In a module that calls the sensors declared previously
:- usesensor{lookup/2, calculate/3}.

process_data(?Key, ?ValA, ?ValB) :-
    lookup(?Key, ?ValA),          // Call might delay if ?Key is not ground
    calculate(?ValA, 5, ?ValB),   // Call might delay if ?ValA is not bound
    write(?ValB)@\io.
```

**Behavior:** When a call to a declared sensor is made (e.g., `lookup(?K, ?V)`), Ergo checks the corresponding `Guard` (e.g., `ground(?K)`). If the guard is true, the sensor is called immediately. If the guard is false but could become true later (e.g., `?K` is currently unbound), the call is delayed. If the guard is determined to be unsatisfiable based on current bindings, the sensor is called anyway, allowing the sensor's implementation to handle the error.

## 13. Delaying Subgoal Execution

ErgoAI provides *delay quantifiers* as a mechanism to explicitly control the execution order of subgoals based on the instantiation state of variables. This allows rearranging goals for correctness or efficiency, ensuring certain conditions are met before a subgoal proceeds.

### 13.1. Syntax

Delay quantifiers are attached to a goal using the `^` operator. Multiple quantifiers can be chained.

*   **Quantifiers:**
    *   `must( Condition )`: The goal execution is delayed *until* `Condition` becomes true. If the system determines `Condition` can *never* become true, the execution of the controlled goal is aborted with an error.
    *   `wish( Condition )`: The goal execution is delayed *until* `Condition` becomes true. If the system determines `Condition` can *never* become true, the controlled goal is executed *anyway*.
*   `Condition`: A Boolean combination of `ground(Var)` and `nonvar(Var)` predicates, using `,` (and) and `;` (or). Parentheses can be used for grouping.
*   **Attaching to Goals:**
    *   `Quantifier^Goal`: Applies the quantifier to an atomic `Goal`.
    *   `Quantifier^(ComplexGoal)`: Applies the quantifier to a `ComplexGoal` (conjunction, disjunction, etc.) enclosed in parentheses.
    *   `Quantifier1^Quantifier2^...^Goal`: Chains multiple quantifiers. They are checked from left to right.

```ergo
// Delay p(?X) until ?X is ground
?- must(ground(?X))^p(?X), ?X = 1.

// Delay the conjunction until ?A is non-variable OR ?B is ground
?- wish(nonvar(?A) ; ground(?B))^( q(?A), r(?B) ), ...

// Nested delay
?- must(ground(?X))^( p(?X), wish(nonvar(?Y))^s(?Y) ), ...
```

### 13.2. Semantics

1.  When a delayable subgoal (`Quantifier^Goal`) is encountered, the `Condition` in the leftmost unsatisfied `Quantifier` is checked.
2.  If `Condition` is true, the quantifier is satisfied. If there are more quantifiers to the right, the next one is checked. If all quantifiers are satisfied, the `Goal` is executed.
3.  If `Condition` is false but could become true later (variables are unbound), the execution of the `Goal` is suspended. The system periodically re-checks the `Condition` when relevant variables get bound.
4.  If `Condition` is determined to be permanently unsatisfiable:
    *   If the quantifier is `must`, an error is raised, and execution typically aborts.
    *   If the quantifier is `wish`, the quantifier is simply discarded, and processing continues (either checking the next quantifier or executing the `Goal`).

### 13.3. Forcing Execution (`!!`)</h3>

The immediate execution operator `!!` can be used as a subgoal. When encountered, it forces all currently suspended delayable subgoals *that are reachable within the current scope* to execute immediately, regardless of whether their delay conditions are met. Reachability typically depends on variable sharing between the suspended goal and the scope where `!!` occurs.

```ergo
?- must(ground(?X))^p(?X), q(?Y), !!, test(?X, ?Y).
// The !! forces p(?X) to execute even if ?X is still unbound at that point.
```
**Note:** Use `!!` with caution, as forcing execution prematurely might lead to errors if the controlled goal relies on the condition specified in its quantifier.

## 14. Regular Expression Matching

ErgoAI provides built-in support for Perl-Compatible Regular Expressions (PCRE) via methods associated with symbols, strings, and URLs (IRIs), accessible through the `@\basetype` module. This requires the PCRE library to be installed (see Section 1.2.3). While these methods are commonly accessed via the `@\basetype` module as shown below, they may also be available for direct invocation on the subject terms (symbols, strings, IRIs), depending on the specific ErgoAI version and configuration. Consult the Manual (Section 43) for details on direct availability.

**Note:** Backslashes in special Perl regex sequences (like `\d` for digit, `\s` for whitespace) must be escaped within Ergo strings/atoms, becoming `\\d`, `\\s`, etc.

*   **`?Subject[matchOne(?Pattern) -> ?Result]`@\basetype**: Finds the *first* match of the PCRE `?Pattern` within the string representation of `?Subject`.
    *   `?Subject`: A symbol, string, or IRI.
    *   `?Pattern`: An atom or string containing the PCRE pattern.
    *   `?Result`: If a match occurs, `?Result` is bound to a term `match(Match, Prematch, Postmatch, Submatches)`.
        *   `Match`: The substring that matched the entire `?Pattern`.
        *   `Prematch`: The part of `?Subject` before `Match`.
        *   `Postmatch`: The part of `?Subject` after `Match`.
        *   `Submatches`: A list of strings corresponding to the parts of `?Subject` captured by parenthesized groups `(...)` within `?Pattern`.
    *   Fails if no match is found.

*   **`?Subject[matchAll(?Pattern) -> ?ResultList]`@\basetype**: Finds *all* non-overlapping matches of `?Pattern` within `?Subject`.
    *   `?ResultList`: Binds to a list of `match(...)` terms as described above, one for each match found. Returns `[]` if no matches.

*   **`?Subject[substitute(?Pattern, ?Substitution) -> ?Result]`@\basetype**: Replaces all occurrences of `?Pattern` within `?Subject` with `?Substitution`.
    *   `?Substitution`: An atom or string used for replacement. Can include backreferences like `$1`, `$2` to refer to captured groups from `?Pattern`.
    *   `?Result`: The resulting string/symbol after all substitutions.

```ergo
// Example: Extracting a date
?- 'Date: 2023-10-27'[matchOne('(\\d{4})-(\\d{2})-(\\d{2})') -> ?M]@\btp.
// ?M = match('2023-10-27', 'Date: ', '', ['2023', '10', '27'])

// Example: Finding all email-like patterns
?- 'a@b.com, c@d.net'[matchAll('[a-z]+@[a-z]+\\.(com|net)') -> ?L]@\btp.
// ?L = [match('a@b.com', '', ', c@d.net', [com]), match('c@d.net', 'a@b.com, ', '', [net])]

// Example: Replacing spaces with underscores
?- 'hello world'[substitute('\\s+', '_') -> ?R]@\btp.
// ?R = 'hello_world'
```

## 15. Appendices

This section provides supplementary reference material extracted from the ErgoAI documentation.

### 15.1. BNF-Style Grammar

The ErgoAI Reasoner User's Manual (ergo-manual.pdf) contains Appendix A, which presents an approximation of the ErgoAI syntax using a BNF-style grammar. This grammar is context-sensitive due to the operator-based nature of the language. It covers the core constructs like rules, queries, directives, terms, and various expressions.

Below is a small excerpt focusing on the top-level `Statement` and `Rule` definitions:

```bnf
Statement := (Rule | Query | LatentQuery | Directive) '.'

Rule := (RuleDescriptor)? Head (':-' Body)? '.'

Query := '?-' Body '.'

LatentQuery := RuleDescriptor '!' Body '.'

Directive := ':-' ExportDirective | OperatorDirective | SetSemanticsDirective
           | IgnoreDependencyCheckDirective | ImportModuleDirective
           | PrefixDirective | CompilerDirective | IndexDirective

RuleDescriptor := '{' RuleTag '}'
                | '{' BooleanRuleDescriptor '}'
                | '@!{' RuleId ( '[' DescrBody ']' )? '}'
```
*(Source: ergo-manual.pdf, Appendix A)*

For the complete grammar details, please refer to Appendix A of the ErgoAI Reasoner User's Manual.

### 15.2. Reserved Symbols

ErgoAI reserves certain symbols and keywords for its syntax. User-defined symbols, predicates, or method names should avoid conflicting with these.

*   **Symbols starting with `\` (backslash):** All symbols beginning with `\` are reserved for built-in predicates, operators, data types, classes, modules, quasi-constants, and quasi-variables. Examples include:
    *   Operators: `\is`, `\=`, `\==`, `\naf`, `\neg`, `\+`, `\in`, `\subset`, `\sublist`, `\or`, `\and`, `\if`, `\then`, `\else`, `\while`, `\do`, `\until`
    *   Data Types/Classes: `\symbol`, `\string`, `\iri`, `\integer`, `\long`, `\double`, `\decimal`, `\float`, `\boolean`, `\date`, `\time`, `\dateTime`, `\duration`, `\currency`, `\list`, `\charlist`, `\skolem`, `\modular`, `\callable`
    *   System Modules: `\io`, `\sys`, `\basetype`, `\typecheck`, `\tpck`, `\set`, `\parse`, `\show`, `\why`, `\sql`, `\json`, `\e2j`, `\http`
    *   Quasi-constants/variables: `\@F`, `\@L`, `\@!`, `\@`, `\@?`, `\?C`, `\?F`, `\?L`
    *   Others: `\true`, `\false`, `\undefined`
*   **Core Operators and Delimiters:**
    *   Rule/Query/Directive markers: `:-`, `?-`, `!-`, `.`
    *   Frame operators: `->`, `=>`, `:`, `::`, `[`, `]`, `[|`, `|]`
    *   Path expression operator: `.`
    *   Logical connectives: `,`, `;`
    *   Arithmetic operators: `+`, `-`, `*`, `/`, `**`
    *   Comparison operators: `=`, `!=`, `==`, `!==`, `=:=`, `=\=`, `>`, `<`, `>=`, `=<`, `@>`, `@<`, `@>=`, `@=<`
    *   List/Set operators: `++`, `--`, `&&`
    *   Quantifier operator: `^`
    *   Implication operators: `~~>`, `<~~`, `<~~>`, `==>`, `<==`, `<==>`
    *   Meta-operators: `~`, `!~`, `=..`
    *   Reification: `${`, `}`
    *   Descriptors: `@!{`, `@{`, `@@{`, `}`
    *   Grouping: `(`, `)`
    *   CURIE separator: `#`
    *   Typed literal separator: `^^`
    *   Module specification: `@`
    *   Transactional prefix: `%`
    *   Skolem prefixes: `\#`, `\##`
    *   Preprocessor prefix: `#`
    *   Shell command prefix: `\`
*   **Reserved Prefixes:** Symbols starting with `flora` or `fl` followed by a capital letter are reserved for internal use.

*(Source: ergo-manual.pdf, Sections 7.1, 7.8, and throughout)*

### 15.3. Operator Precedence Table

The ErgoAI Reasoner User's Manual provides a table detailing operator precedence and associativity. Lower precedence numbers bind tighter.

| Precedence     | Operator                 | Use                                              | Associativity  | Arity                     |
| :------------- | :----------------------- | :----------------------------------------------- | :------------- | :------------------------ |
| not applicable | `( )`                    | parentheses; used to change precedence           | not applicable | n/a                       |
| not applicable | `.`                      | decimal point                                    | not applicable | n/a                       |
|                | `.`                      | object reference                                 | left           | binary                    |
| 400            | `:`, `::`                | class membership and subclass relationships      | left           | binary                    |
| 600            | `-`                      | minus sign                                       | right          | unary                     |
| 600            | `+`                      | plus sign                                        | right          | unary                     |
| 700            | `*`                      | multiplication                                   | left           | binary                    |
| 700            | `**`                     | power                                            | left           | binary                    |
| 700            | `/`                      | division                                         | left           | binary                    |
| 800            | `-`, `+`                 | subtraction and addition                         | left           | binary                    |
| 1000           | `=<`, `>=`               | less/greater than or equals to                   | not applicable | binary                    |
| 1000           | `@<`, `@>`, `@=<`, `@>=` | lexicographical less/greater than (or equals to) | not applicable | binary                    |
| 1000           | `=:=`, `=\=`             | numeric equals/unequal to                        | not applicable | binary                    |
| 1000           | `\is`                    | arithmetic assignment                            | not applicable | binary                    |
| 1000           | `=`, `!=` or `\=`        | unification / disunification                     | left           | binary                    |
| 1000           | `==`, `!==` or `\==`     | identity / not identical                         | left           | binary                    |
| 1000           | `=..`                    | meta decomposition                               | left           | binary                    |
| 1000           | `?=`                     | identical or not unifiable                       | left           | binary                    |
| 1200           | `\naf`                   | well-founded negation                            | not applicable | unary                     |
| 1200           | `\neg`                   | explicit negation                                | not applicable | unary                     |
| 1200           | `\+`                     | Prolog-style negation                            | not applicable | unary                     |
| 1250           | `~`                      | semantic unification                             | left           | binary                    |
| 1250           | `!~` or `\~`             | semantic disunification                          | left           | binary                    |
| 990            | `||`                     | string/term concatenation                        | right          | binary                    |
| 290            | `++`, `--`, `&&`         | list append/set union/difference/intersection    | right          | binary                    |

*(Source: ergo-manual.pdf, Table 3, Section 7.3)*

---

# PART II: ErgoAI Usage Guide for LLMs

---

## 1. Installation and Setup

This section details the necessary prerequisites, procedures, and configurations for installing ErgoAI.

### 1.1. System Prerequisites

Before installing ErgoAI, ensure your system meets the following requirements:

#### 1.1.1. Operating Systems

*   **Supported:** 64-bit versions of Windows, Linux (e.g., Ubuntu, Mint, Fedora, SUSE), and Mac OSX are required.
*   **Linux Specifics:** Must have `make` and `gcc` compiler installed. Verify using the system's package manager.
*   **Mac Specifics:** Requires Xcode to be installed and up-to-date, including the command line tools (`xcode-select --install`).

#### 1.1.2. Java Version Requirements

*   **Java 8** is generally recommended for use with ErgoAI.
    *   **ErgoAI Studio Requirement:** Note that ErgoAI Studio *specifically requires* Java 8. Please consult the ErgoAI Studio Manual for definitive installation requirements.
    *   **Compatibility:** Some features in the Ergo-Java interface might not function correctly with Java 9 or later versions.
*   On Linux, ensure a full JDK installation is present, not just a headless version, to avoid potential `java.awt.AWTError` issues with assistive technologies. If this error occurs, locate the `accessibility.properties` file (e.g., in `/etc/java-8-openjdk/`) and comment out the `assistive_technologies` line.

#### 1.1.3. Main Memory Recommendations

*   **Minimum:** 8GB of main memory.
*   **Recommended:** 16GB of main memory is strongly recommended.

### 1.2. Installation Procedures

#### 1.2.1. Windows Installation

1.  Download the installer `ergoAI_XXXXX.exe` from the official source (e.g., github.com).
2.  Close any running instances of ErgoAI.
3.  Double-click the downloaded `.exe` file to launch the Coherent ErgoAI Setup Wizard.
4.  Follow the prompts. **Important:** It is recommended to install ErgoAI in a directory owned by your user account (e.g., within `C:\Users\YourUsername\`) rather than `Program Files`. Installing in system directories like `Program Files` requires administrative privileges not just for installation but also for running ErgoAI afterwards.
5.  **Anti-Virus:** During installation, your anti-virus software might prompt you to 'Trust' the installer file. Please allow this. If ErgoAI Studio fails to start later, you might need to manually 'Trust' the `runErgoAI.exe` file (typically located in `C:\Users\YourUsername\Coherent\ErgoAI\runErgoAI.exe`) within your anti-virus software settings (e.g., Norton's 'File Insight' -> 'Trust').
6.  **File Association:** Ensure `.jar` files are associated with Java, so double-clicking them runs Java.
7.  **Missing Runtime DLLs:** Occasionally, ErgoAI or its underlying components might require specific Microsoft Visual C++ Redistributable libraries that are missing from the system, leading to errors like "Missing VCRUNTIME140.DLL" (this is just one common example, the exact DLL may vary). This is usually due to system configuration issues or incomplete installations of other software.
    *   *Note:* Do **not** download DLL files from unofficial websites. Obtain the necessary redistributable package directly from the official Microsoft website (search for "Microsoft Visual C++ Redistributable latest supported downloads").
    *   Consult the ErgoAI release notes or installation prerequisites for the *specific version* of the redistributable required for your ErgoAI version.
    *   Install both the x64 and x86 versions of the required redistributable package if applicable for your system.
    *   Restart your PC after installation.
8.  **Desktop Icons:** Installation normally creates two desktop shortcuts: one for ErgoAI Studio (IDE) and one for ErgoAI Engine (command line terminal).

#### 1.2.2. Linux/Mac Installation

1.  Read the specific prerequisites for Linux/Mac installation (see Section 1.1 and 1.2.3).
2.  Download the self-extracting archive `ergoAI_xxxxx.run` from the official source (e.g., github.com).
3.  Move the `.run` file to your desired installation directory. It is generally recommended to install in a user-owned folder.
4.  Open a terminal, navigate to the installation directory, and execute the script:
    ```bash
    sh ergoAI_xxxxx.run
    ```
5.  Follow the prompts. The installation will create a subdirectory named `Coherent`.
6.  **Permissions:** ErgoAI requires read, write, and execute permissions for all users who will use it within the installation directory (e.g., `Coherent/`). If installed in a user's home directory, permissions are usually set correctly. If installed elsewhere (e.g., `/opt/`), you might need to adjust permissions manually:
    ```bash
    chmod -R g+rwX /path/to/Coherent/
    # Or use a+rwX to grant permissions to everybody (potentially less secure)
    ```
7.  **Execution Paths:** After installation, the script will display the paths to run the Studio IDE and the command-line engine:
    *   Studio: `.../Coherent/ERGOAI/runErgoAI.sh`
    *   Command Line: `.../Coherent/ERGOAI/ErgoAI/runergo`
8.  **Desktop Icons (Linux):** Icons are normally installed if a Linux Standard Base (LSB) compliant desktop environment is detected.
9.  **Desktop Icons (Mac):** Icons are normally installed if Mac command line tools are present. A reboot might be necessary for icons to display correctly. If icons do not appear, use the command-line paths provided.
10. **MacOS Upgrade:** If you upgrade MacOS, ErgoAI must be reinstalled. Deactivate the old version first.

#### 1.2.3. Optional Dependencies

These may be required for specific ErgoAI features or packages:

*   **Linux/Mac:**
    *   `gcc` / C compiler: Required for installation on Mac (via Xcode) and potentially Linux.
    *   `make`: Required on Linux.
    *   `autoconf`: Needed for compilation on some Linux/Mac setups.
    *   `rlwrap`: Recommended for a better command-line experience (provides history). Install via package manager (Linux) or `brew install rlwrap` (Mac).
    *   **Database Connectivity:** MySQL/UnixODBC/MyODBC developer packages (e.g., `unixODBC-devel`, `mysql-connector-odbc`). Install via package manager.
        *   *Note:* Specific ODBC driver versions might have compatibility issues (e.g., MySQL ODBC 5.7 had known issues on Linux/Mac). Consult the latest ErgoAI documentation (e.g., Packages Guide) for current recommendations.
    *   **Regular Expressions:** PCRE developer package (e.g., `pcre-devel`, `libpcre-devel`). Install via package manager or `brew install pcre` (Mac).
    *   **Web Access:** Curl developer package (e.g., `curl-devel`, `libcurl4-openssl-dev`). Install via package manager or `brew install curl` (Mac).

### 1.3. Licensing and Activation

The ErgoAI Studio User Manual mentions "Activating and Transferring License" (Section 2.1), implying an activation step is required, likely after installation, possibly via the Studio interface. If upgrading MacOS, the old version must be deactivated before activating the new installation with the same key.

### 1.4. Environment Variables

Certain environment variables may need to be set or are used by ErgoAI. *Note: Consult the official ErgoAI User Manual and Packages Guide for definitive details on environment variable usage, especially regarding the Java API.* Common variables include:

*   **`PATH`:** Ensure the directory containing necessary system tools (`make`, `gcc`, `sh`, `cl.exe` on Windows) and potentially ErgoAI scripts (`runergo`, `runErgoAI.sh`) is included in the system's `PATH`. On Windows, the Visual Studio compiler `cl.exe` path might need explicit setting.
*   **`PROLOGDIR`:** (Used by Java API) Points to the folder containing the XSB executable (e.g., `...\XSB\config\x64-pc-windows\bin`). Can be set via `-D` option or `System.setProperty`.
*   **`FLORADIR`:** (Used by Java API) Points to the main ErgoAI installation folder containing the `Ergo` subdirectory (e.g., `...\Coherent\ErgoAI`). Can be set via `-D` option or `System.setProperty`.
*   **`XSB_USER_AUXDIR`:** (Linux/Mac) If ErgoAI is used by an account different from the installation account, this variable must be set to a writable directory path where ErgoAI can create its `.xsb` auxiliary directory (e.g., `/opt/Coherent/ErgoAI/.xsb`).
*   **`ERGO_RC_FILE`:** Specifies an initialization file containing Ergo commands to be executed on startup. If not set or the file is unreadable, it's ignored.

### 1.5. Security Considerations

*   **Windows:** The ErgoAI installer (`.exe`) is signed with a Coherent Knowledge certificate. Verify this during installation.
*   **Linux/Mac (`.run` file - Optional):**
    1.  **Checksum Verification:** Download the corresponding `.sha256.sum` file. Place it in the same directory as the `.run` file. Run `shasum -c ergoAI.run.sha256.sum`. The output should be `ergoAI.run: OK`.
    2.  **Signature Verification:** Download the corresponding `.sha256.sig` file and the Coherent GPG public key (`CoherentPublic.asc`). Import the key using `gpg --import CoherentPublic.asc`. Verify the signature using `gpg --verify ergoAI.run.sha256.sig ergoAI.run.sha256.sum`. Look for "Good signature from 'Coherent Knowledge Systems, LLC'". GPG must be installed.

### 1.6. Uninstallation

*   **Windows:** Use the standard Windows Control Panel "Add or Remove Programs" (or equivalent).
*   **Linux/Mac:** If installed in a dedicated directory (e.g., `~/my_ergoai` or `/opt/Coherent`), simply remove the main installation folder (e.g., `rm -rf /path/to/Coherent/ERGOAI/`). If desktop icons were created (Linux), they may need to be removed manually.
*   **Ergo Suite:** If switching from the older "Ergo Suite" to "ErgoAI", uninstall Ergo Suite manually using the methods above. ErgoAI installation does not automatically remove Ergo Suite.

## 2. Running ErgoAI and Using ErgoAI Studio

This section covers how to start and interact with the ErgoAI Reasoner, both through the command line interface (shell) and the ErgoAI Studio Integrated Development Environment (IDE).

### 2.1. Command Line Usage

The ErgoAI reasoner can be run as a standalone engine from the command line.

*   **Starting ErgoAI:**
    *   On Linux/Mac, use the `runergo` script located in the `.../ErgoAI/ErgoAI/` subdirectory of your installation (the exact path is provided during installation). An alias can be created for convenience, e.g., `alias ergo='~/ENGINEDIR/Ergo/runergo'`.
    *   On Windows, use the `runergo.bat` script found in the installation directory or the "ErgoAI Engine" desktop shortcut.
    *   Executing the script starts the ErgoAI shell, indicated by the `ergo>` prompt.

*   **Command-Line Options:**
    *   `runergo --devel`: Starts ErgoAI with verbose initialization output (chatter), which is normally suppressed.
    *   `runergo --noprompt`: Starts ErgoAI without printing the `ergo>` prompt, useful for interaction with other programs. The engine waits for input.
    *   `runergo -e "command."`: Executes the specified ErgoAI `command.` immediately after initialization, before displaying the prompt (unless `--noprompt` is also used). The command must be enclosed in quotes and terminated with a period. Example:
        ```bash
        runergo -e "\help."
        ```
    *   **Loading Files on Startup:** While not an explicit option, files can be loaded via the initialization file (see Section 2.4) or using the `-e` option with a load command, e.g.,
        ```bash
        runergo -e "[myfile]."
        ```

*   **Exiting:**
    *   Type `\end.` to exit ErgoAI and return to the underlying Prolog shell.
    *   Type `\halt.` to exit both ErgoAI and the Prolog process.
    *   Use `Control-D` (Unix/Mac) or `Control-Z` (Windows) at the prompt.

#### 2.1.1. Command-Line Flags

When launching the ErgoAI engine from the command line (`runergo` or `runergo.bat`), the following flags can be used:

*   `--devel`: Starts ErgoAI in development mode, providing verbose output during initialization and potentially overriding production mode settings specified within loaded files. This is useful for diagnosing startup issues.
*   `--noprompt`: Starts ErgoAI without displaying the interactive `ergo>` prompt. The engine initializes and then waits for input from standard input. This is primarily used when ErgoAI is being controlled by another program or script.
*   `-e "command."`: Executes the specified ErgoAI `command.` (any valid shell command or query, enclosed in quotes and terminated with a period) immediately after initialization but before entering the interactive prompt (unless `--noprompt` is also used).

```bash
# Start with verbose initialization output
runergo --devel

# Start without a prompt for scripting
runergo --noprompt

# Load a file immediately on startup
runergo -e "[myfile >> mymodule]."

# Execute a query immediately and exit
runergo -e "p(a), \halt."
```

### 2.2. Interactive Shell Commands

The ErgoAI shell accepts various commands to control loading, execution, system information, and debugging. Commands are typically prefixed with `\` or use specific syntax like `[...]` or `{...}`. All commands entered in the shell must be terminated with a period (`.`).

*Note: This list summarizes the commands available in the ErgoAI shell. For definitive details, options, and behavior, consult Section 4 ("ERGO Shell Commands") in the official ErgoAI Reasoner User's Manual.*

#### 2.2.1. Help and System Information

*   `\help.`
    Shows help information about available shell commands.
*   `system{param}.`
    Queries system information. `param` can be a specific property name (e.g., `version`, `info`, `installdir`, `xsbdir`, `archdir`) or a variable (e.g., `?X`) to list all available system parameters and their values.

#### 2.2.2. Loading, Adding, and Compiling Files

These commands manage knowledge bases stored in files. File names can be relative or absolute. Suffixes (`.ergo`, `.P`, `.flr`, `.xwam`) are often optional.

*   `[filename].` or `load{filename}.`
    Loads `filename.ergo` (or `.P`, `.flr`, `.xwam`) into the default module `main`, erasing previous content.
*   `[filename >> moduleName].` or `load{filename >> moduleName}.`
    Loads the file into the specified `moduleName`, erasing previous content of that module.
*   `[+filename].` or `add{filename}.`
    Adds the contents of `filename.ergo` (or `.P`, `.flr`, `.xwam`) to the `main` module without erasing existing content.
*   `[+filename >> moduleName].` or `add{filename >> moduleName}.`
    Adds the file contents to the specified `moduleName`.
*   `[url('URL')].` or `load{url('URL')}.`
    Loads from a URL into `main`. Use `>> moduleName` to specify a different module.
*   `[+url('URL')].` or `add{url('URL')}.`
    Adds from a URL to `main`. Use `>> moduleName` to specify a different module.
*   `[>>moduleName].` or `load{>>moduleName}.`
    Loads from standard input (console) into the specified module (use `[]` or `load{}` for `main`). End input with Ctrl-D (Unix/Mac) or Ctrl-Z (Windows).
*   `[+>>moduleName].` or `add{+>>moduleName}.`
    Adds from standard input to the specified module (use `[+]` or `add{+}` for `main`).
*   `compile{file}.`
    Compiles `file.ergo` for the `main` module without loading it.
*   `compile{file>>module}.`
    Compiles `file.ergo` for the specified `module` without loading it.
*   `compileadd{file}.`
    Compiles `file.ergo` for later addition to the `main` module.
*   `compileadd{file>>module}.`
    Compiles `file.ergo` for later addition to the specified `module`.
*   `demo{demofilename}.`
    Loads and runs a demo file from the Ergo demos directory.
    *   `compile{file}.` / `compile{file>>module}.`: Compiles `file.ergo` for the specified module (default `main`) *without* loading it into memory. Creates the corresponding `.xwam` bytecode file.
*   `compileadd{file}.` / `compileadd{file>>module}.`: Compiles `file.ergo` specifically for being *added* (rather than loaded) to the specified module later. Generates different code than `compile{}`.
*   `demo{demofilename}.`: Loads and runs a demo file located in ErgoAI's standard demos directory. No path or suffix is needed. Example: `demo{flogic_basics}.`
*   `setwarnings{type}.`: Controls which compiler/runtime warnings are displayed. `type` can be `all`, `off`, `compiler=on/off`, `dependency=on/off`, `runtime=on/off`.
*   `warnings{?Type}.`: Queries the current warning settings (e.g., `warnings{compiler=?X}`).
*   `chatter{on|off}.`: Controls display of the number of solutions after a query (default `on`).
*   `feedback{on|off}.`: Controls display of variable bindings in query answers (default `on`). Useful for APIs.

#### 2.2.3. Query Execution Control

*   `\one.`
    Sets the shell to display query answers one at a time. Press `;` for the next answer or `<Enter>` to stop. Affects subsequent queries only.
*   `\all.`
    Sets the shell to display all query answers at once (default). Affects subsequent queries only.

#### 2.2.4. Debugging and Tracing

*   `\trace.`
    Turns on interactive execution tracing for subsequent queries.
*   `\notrace.`
    Turns off execution tracing.
*   `\tracelow.`
    Turns on low-level Prolog tracing.
*   `\logforest(...)` / `\logforestlow(...)`
    Controls forest logging (tracing of tabled calls). Options allow logging to file, hiding certain events, etc. (See User Manual Section 47.10).
*   `\nologforest.`
    Stops forest logging and flushes the log buffer.

#### 2.2.5. System Settings and Runtime Control

*   `setmonitor{Secs, Type}.` or `setmonitor{}.`
    Starts (`Secs > 0`) or stops (`Secs = 0`) runtime monitoring. `Type` can be `heartbeat`, `performance`, or `extended`. The parameter-less version opens a dialog.
*   `op{Precedence, Associativity, Operator}.` or `op{..., [Op1, ...]}.`
    Defines operator(s) for the current shell session.
*   `chatter{on}.` / `chatter{off}.`
    Controls whether the number of solutions is displayed after query evaluation (default: on).
*   `feedback{on}.` / `feedback{off}.`
    Controls whether query answers (variable bindings) are displayed (default: on). Useful primarily for API interactions where only success/failure is needed.
*   `setwarnings{type}.`
    Controls which types of compiler/runtime warnings are displayed. `type` can be `all`, `off`, `compiler=on/off`, `dependency=on/off`, `runtime=on/off`.
*   `warnings{?Type}.`
    Queries the current warning settings. `?Type` can be a variable or a pattern like `compiler=?X`.
*   `setsemantics{Option1, ...}.` / `setsemantics{...}@module.`
    Sets runtime semantics (like `equality`, `inheritance`, `tabling`, `subclassing`, `class_expressions`) for the current or specified module. (See User Manual Section 23).
*   `semantics{Option1, ...}.` / `semantics{...}@module.`
    Queries the current semantic settings.

#### 2.2.6. Exiting ErgoAI

*   `\end.`
    Exits the ErgoAI shell but keeps the underlying XSB Prolog process running. You can re-enter Ergo using `ergo_shell.` at the Prolog prompt.
*   `\halt.`
    Exits both ErgoAI and the underlying XSB Prolog process completely.
*   `Control-D` (Unix/Mac) or `Control-Z` (Windows) at the `ergo>` prompt also typically exits the shell.

#### 2.2.7. File Paths and Current Directory

Understanding how ErgoAI resolves relative file paths is crucial for creating portable, multi-file knowledge bases.

*   **Current Directory on Startup:**
    *   If started from a command line: The shell's current directory, *unless* it's non-writable or the Ergo installation directory, in which case it defaults to the user's home directory.
    *   If started via Studio icon: The user's home directory.
*   **Current Directory During Load/Add:** When processing a `load{file}` or `add{file}` command (or `[file]`, `[+file]`):
    1.  The system's current directory temporarily changes to the directory containing `file`.
    2.  Any *relative* paths used in commands *within* `file` (e.g., `#include "sub/defs.ergo"`, `load{../lib/utils}`) are resolved relative to `file`'s directory.
    3.  If `file` loads/adds another file (`file2`), the current directory changes again temporarily to `file2`'s directory while `file2` is processed.
    4.  Once processing of `file` (and any files it includes/loads) is complete, the current directory reverts to what it was before the initial `load{file}` or `add{file}` command.
*   **Current Directory for I/O:** Relative paths used in I/O operations (`see`, `tell`, `open`, etc.) are resolved relative to the Ergo process's current working directory *at the time the I/O command is executed*. This directory might be different from the directory of the file containing the I/O command if the command is called from a different module or context.
    *   Use `File[cwd->?Dir]@\io` to get the current directory.
    *   Use `File[chdir(?Dir)]@\io` to change it.
    *   Use `here{Goal}` to execute `Goal` with the current directory temporarily set to that of the file where the `here{}` construct appears.
*   **Absolute Paths:** Always resolve to the same location regardless of the current directory.
*   **Portability:** Use relative paths and the `#include` or `load`/`add` mechanisms within files to build portable applications. Avoid absolute paths where possible. Use forward slashes (`/`) for paths, as they work on all platforms (backslashes must be doubled `\\` on Windows).

### 2.3. ErgoAI Studio IDE Usage

*Note: This section summarizes features of the ErgoAI Studio IDE. The primary and definitive source for Studio usage, features, and installation is the official "ErgoAI Studio User Manual". Consult that manual for complete and up-to-date details.*

ErgoAI Studio provides an Integrated Development Environment (IDE) for developing and debugging Ergo knowledge bases.

#### 2.3.1. Listener Window

*   **Function:** The main entry point and gateway to other Studio features. It includes a text input area at the bottom (where the `ergo>` prompt appears) for entering commands and queries directly, similar to the command-line shell. Output from commands and queries is displayed in the area above the input field.
*   **History:** Command history can be accessed using the Up and Down arrow keys in the input area. The `History` menu also provides access to previously typed commands.

#### 2.3.2. Editor Features

*   **Opening/Creating Files:** Use the `File` menu in the Listener to open existing `.ergo` or `.ergotxt` files or create new ones, which open in the Studio Editor window.
*   **Syntax Highlighting:** The editor provides syntax-sensitive highlighting for Ergo code.
*   **Error/Warning Markers:** Displays a red circle with a white X in the left margin for syntax errors and a yellow triangle for warnings. Hovering over the marker shows the error/warning message. Real-time syntax checking can be toggled via `File > Preferences` (useful for large files).
*   **Code Navigation:**
    *   Hovering over a HiLog term shows its structure.
    *   Clicking a variable highlights all its occurrences in the current rule.
    *   Right-clicking a literal provides a context menu with `Go To Definition` to navigate to the rule defining it.
    *   `Goals Called by Selected Goal` and `Goals Calling Selected Goal` show call trees.
    *   The `Navigation > Predicates and Objects` menu lists navigable items in the current file.
*   **Search/Replace:** Standard search and replace functionality is available via the `Edit > Find/Replace` menu, supporting plain text and regular expressions.
*   **Auto-complete:** Pressing `Ctrl-SPACE` while typing a variable name attempts to auto-complete it or shows possible completions.

#### 2.3.3. Query Tool

*   **Access:** Open via `Tools > Query` in the Listener window (or `Ctrl-U`).
*   **Usage:** Type Ergo queries (terminated with `.`) into the upper white input area. Click `Execute` or press `<Enter>` to run the query.
*   **Results:** Answers are displayed in the gray table area below the input.
*   **Execution Control:** `Pause`/`Continue` buttons in the Listener window control query execution.
*   **Query from Editor:** Highlight text in the Editor, right-click and select `Use Current Selection as Query` (or `Ctrl-U`) to send it to the Query Tool.
*   **Explanations:**
    *   Right-click (or double-click) an answer row and select `Why?` to see the derivation explanation.
    *   Right-click the `No Answers Found` message and select `Why not?` to understand query failure.
    *   The `Explain` menu provides further options for explanations.
*   **Result Visualization:** `View > View Results as Graph` can display answers as graph edges (for binary relations).

#### 2.3.4. Project Management

*   **Creating/Opening:** Use `File > New Project` or `File > Open Project` in the Listener. Projects group related Ergo files.
*   **Adding Files:** Use `File > Include` or drag-and-drop files onto the project window.
*   **Loading/Adding:** For each file in the project, choose whether to `load` it (replace module content) or `add` it (append content) and specify the target module.
*   **Saving:** `File > Save` saves the project configuration (list of files, load actions, modules), *not* the content of the editor files.
*   **Batch Operations:** `File > Load All` loads/adds all files in the project according to their settings. `File > Open All` opens all project files in editor windows.

#### 2.3.5. Tools Menu Overview

Accessible from the Listener window:

*   `Query`: Opens the Query Tool window.
*   `Term Finder`: (Experimental) Searches for HiLog terms within loaded files.
*   `Rule Call Graph`: (Experimental) Displays the call graph after a query executes.
*   `Ergo-to-OWL`: Provides tools for importing/querying RDF/OWL and SPARQL endpoints interactively.
*   `Prolog`: Opens a shell to access the underlying XSB Prolog engine directly.
*   `Preferences`: Opens the customization dialog.
*   `Send Bug Report`: Opens a tool to report issues.

#### 2.3.6. Debug Menu Overview

Accessible from the Listener window, provides access to:

*   Setting timers (timeouts, periodic interrupts).
*   Setting monitors (`heartbeat`, `performance`, `extended`).
*   Setting tripwires (e.g., `goaldepth`, `answerdepth`, `memory`).
*   Termination analysis (Terminyzer).
*   Other debugging tools detailed in the ErgoAI Reasoner User's Manual.

#### 2.3.7. Preferences/Customization

Accessed via `File > Preferences` in the Listener window. Allows customization of:

*   Font size and input background color.
*   Editor settings, including the file size threshold for real-time syntax checking.
*   Option to automatically reopen windows from the last session on startup.

### 2.4. Initialization Files

*   **Purpose:** To automatically execute ErgoAI commands or queries upon startup of the ErgoAI shell.
*   **Specification:** The path to the initialization file is specified by the `ERGO_RC_FILE` environment variable. If the variable is not set or the file is invalid, it is ignored.
*   **Content:** Contains any valid ErgoAI commands or queries, each terminated by a period (`.`). The `?-` prefix should *not* be used for queries within this file. Comments are allowed, but a comment cannot be the last statement in the file.
    ```ergo
    // Example content for an initialization file (e.g., myergo.rc)
    writeln('Welcome to my custom Ergo setup!')@\plg.
    insert{default_setting(on)}.
    [common_library >> utils]. // Load a common library
    ```


### 2.5. Troubleshooting File Loading Issues

Occasionally, loading an `.ergo` file using `[file >> module].` or `load{file >> module}.` might report success but fail to make the defined facts or rules accessible for querying, leading to unexpected "No" answers or failures in `\if` conditions. This indicates a potential silent loading issue.

   If you suspect this:
    1.  **Enable Verbose Loading:** Restart ErgoAI using any available verbose or debug flags (e.g., `--devel` from the command line, or check Studio preferences). Reload the file and carefully examine *all* output for subtle warnings or errors during the load process.
    2.  **Verify Basic Loading:** Try the manual insertion test described below to confirm the core runtime is working:
        *   Start a fresh Ergo session.
        *   Load only essential class definitions: `[my_classes >> classes_module].`
        *   Create the target module dynamically: `newmodule{target_module}.`
        *   Manually insert a key fact: `insert{ my_instance : classes_module:my_class }@target_module.`
        *   Manually insert a key property: `insert{ my_instance[property -> value] }@target_module.`
        *   Immediately query these facts: `?- my_instance : my_class @ target_module.` and `?- my_instance[property -> ?V] @ target_module.`
        *   If these manual steps succeed but loading the same facts from a file fails, the problem lies specifically with file processing.
    3.  **Check File Paths/Permissions:** Ensure ErgoAI has read permissions for the `.ergo` file and that the path (relative or absolute) is correct from ErgoAI's current working directory.
    4.  **Check File Encoding:** Ensure the file is saved in a standard encoding (preferably UTF-8 without BOM) and contains no unexpected invisible characters.
    5.  **Check Version:** Consider if this might be a known issue or bug in your specific version of ErgoAI/XSB.

## 3. Integrating with External Systems (APIs and Packages)

ErgoAI provides a suite of Application Programming Interfaces (APIs) and packages to facilitate interaction with various external programming languages, data formats, databases, and web services. These integrations allow ErgoAI knowledge bases to leverage external data and functionality, and allow external applications to utilize ErgoAI's reasoning capabilities.

*Note: Using these APIs often requires installing external dependencies, such as database drivers (e.g., ODBC), specific language libraries (e.g., for Python or Java database access), or tools like `curl`. The details of these APIs (exact method signatures, class names, specific behaviors, setup requirements, and necessary external libraries) are fully documented in the official "Guide to ErgoAI Packages" PDF. This section provides an overview and common usage patterns.*

### 3.1. Java Interface (ErgoAI <-> Java)

*Note: This section provides an overview of ErgoAI's integration capabilities. However, the definitive details for each API (including exact method/function signatures, class names, setup requirements, external dependencies, specific behaviors, and error handling) are documented in the official "Guide to ErgoAI Packages" PDF. The information presented here should be cross-referenced with the official Packages Guide for reliable and up-to-date usage.*

ErgoAI offers bidirectional communication with Java applications.

#### 3.1.1. Low-level API

This is the most commonly used interface for Java to control and query ErgoAI.

*   **Core Class:** `net.sf.flora2.API.FloraSession` represents a connection to a running ErgoAI instance. Multiple sessions can exist concurrently.
*   **Creating a Session:**
    ```java
    FloraSession session = new FloraSession();
    ```
*   **Executing Queries:**
    *   `executeQuery(String query)`: Executes queries that return a single variable or no variables. Returns an `Iterator<FloraObject>`.
    *   `executeQuery(String query, Vector vars)`: Executes queries returning multiple variables specified in the `vars` Vector. Returns an `Iterator<HashMap<String,FloraObject>>`. Queries must be terminated with a period (`.`). Backslashes in Ergo syntax must be escaped (e.g., `\\naf`).
*   **Executing Commands:**
    *   `executeCommand(String command)`: Executes commands that do not need to return results (e.g., loading files, inserts). Returns `boolean`. Handles exceptions differently than `executeQuery`.
*   **Loading Files:**
    *   `loadFile(String fileName, String moduleName)`: Loads an Ergo file into a specified module, replacing existing content.
    *   `addFile(String fileName, String moduleName)`: Adds an Ergo file's content to a module without erasing.
    *   `compileFile(...)`, `compileaddFile(...)`: Compile-only versions.
*   **Error Handling:** Use `hasErrors()` and `hasWarnings()` methods on the `FloraSession` object to check status after commands like `executeCommand` or `loadFile`. `executeQuery` may throw `FlrException`.
*   **Closing Session:**
    ```java
    session.close();
    ```

#### 3.1.2. High-level API (Experimental)

This experimental API generates Java proxy classes for Ergo classes that have signature declarations. It allows manipulating Ergo objects via corresponding Java object methods (getters, setters, deleters).

*   **Generation:** Use the `write(ErgoClass, TargetModule, JavaFileName)@\prolog` predicate in Ergo to generate the Java proxy file.
*   **Usage:** Instantiate proxy objects and call generated methods. This generates methods such as `public Iterator<FloraObject> getVDI_attribute()` to retrieve values, `public boolean setVDN_method(Object arg1, ...)` to set values, etc., following the patterns described in the Packages Guide. Requires retrieving `FloraObject` instances first using the low-level API or using specific proxy constructors.

#### 3.1.3. Setup and Execution

*   **Classpath:** Include `interprolog.jar` and `flora2java.jar` (found in `.../ErgoAI/Ergo/java/`) in the Java classpath during compilation and execution.
    ```bash
    # Compilation (Linux/Mac Example)
    javac -classpath "$FLORADIR/java/flora2java.jar":"$FLORADIR/java/interprolog.jar":. YourProgram.java
    ```
    ```bash
    # Compilation (Windows Example - adjust paths)
    javac -classpath "%FLORADIR%\java\flora2java.jar";"%FLORADIR%\java\interprolog.jar";. YourProgram.java
    ```
*   **Runtime Properties:** Set `PROLOGDIR` (path to XSB binary directory) and `FLORADIR` (path to Ergo installation directory) using `-D` options or `System.setProperty`.
    ```bash
    # Execution (Linux/Mac Example)
    java -classpath "$FLORADIR/java/flora2java.jar":"$FLORADIR/java/interprolog.jar":. \
         -DPROLOGDIR="$XSB_BIN_DIR" \
         -DFLORADIR="$ERGO_INSTALL_DIR" YourProgram
    ```
    ```bash
    # Execution (Windows Example - adjust paths)
    java -classpath "%FLORADIR%\java\flora2java.jar";"%FLORADIR%\java\interprolog.jar";. ^
         -DPROLOGDIR="%XSB_BIN_DIR%" ^
         -DFLORADIR="%ERGO_INSTALL_DIR%" YourProgram
    ```
*   **Code Snippet:**
    ```java
    import net.sf.flora2.API.FloraSession;
    import net.sf.flora2.API.FloraObject; // Added import
    import java.util.Iterator; // Added import
    import java.util.Vector;
    // ... other imports

    public class Example {
        public static void main(String[] args) {
            FloraSession session = new FloraSession();
            // Assuming mykb.ergo defines person class and instances
            session.loadFile("mykb.ergo", "basic_mod");
            String command = "?X:person@basic_mod.";
            Iterator<FloraObject> personObjs = session.executeQuery(command);
            while (personObjs.hasNext()) {
                FloraObject personObj = personObjs.next();
                System.out.println("Person name:" + personObj);
            }
            session.close();
        }
    }
    ```

*Note on Java API Properties:* The exact method for setting `PROLOGDIR` and `FLORADIR` (e.g., using `-D` command-line options vs. `System.setProperty` in code) and other specific Java API configurations should be confirmed in the official "Guide to ErgoAI Packages", as requirements might vary.

### 3.2. Python Interface (pyergo)

The `pyergo` interface allows Python programs to interact with ErgoAI and the underlying XSB engine.

#### 3.2.1. Setup and Connection

*   **Installation:** The `pyergo` module is included with ErgoAI.
*   **Python Path:** Add the path to the `pyergo` directory (`ERGOROOT/python`) to Python's `sys.path`.
    ```python
    import sys
    import os
    # Adjust ERGOROOT and XSBARCHDIR based on your installation
    ERGOROOT = os.environ.get('ERGOROOT', '/path/to/your/ErgoAI/ErgoAI') # Example default
    XSBARCHDIR = os.environ.get('XSBARCHDIR', '/path/to/your/XSB/config/your-arch-dir') # Example default
    sys.path.append(os.path.join(ERGOROOT, 'python'))
    ```
*   **Starting Session:** Import necessary functions and start the session, providing paths to XSB architecture directory and Ergo root directory.
    ```python
    from pyergo import pyergo_start_session, pyergo_end_session
    pyergo_start_session(XSBARCHDIR, ERGOROOT)
    ```
*   **Ending Session:**
    ```python
    pyergo_end_session()
    ```

#### 3.2.2. Querying Ergo and XSB

*   **Ergo Commands:** Use `pyergo_command(command_string)` for commands not expected to return results (e.g., loading files, inserts). Throws `PYERGOException` on failure. Ergo commands must end with `.`. Backslashes must be doubled (`\\`).
    ```python
    from pyergo import pyergo_command, PYERGOException
    try:
        pyergo_command("['mykb.ergo'].")
        pyergo_command("insert{p(a)}.")
    except PYERGOException as e:
        print(f"Ergo command failed: {e}")
    ```
*   **Ergo Queries:** Use `pyergo_query(query_string)` for queries that return results. Returns an iterable list of 4-tuples. Ergo queries must end with `.`.
    ```python
    from pyergo import pyergo_query
    try:
        result = pyergo_query("p(?X).")
        for ans in result:
            # process ans (see unpacking section)
            print(ans)
    except PYERGOException as e:
        print(f"Ergo query failed: {e}")

    ```
*   **XSB Commands/Queries:** Use `pyxsb_command(command_string)` and `pyxsb_query(query_string)` for direct interaction with the XSB engine using Prolog syntax. `pyxsb_query` returns an iterable list of tuples (bindings only).

#### 3.2.3. Unpacking Results

*   **`pyergo_query` Results:** Returns a list where each item is a 4-tuple: `(variable_binding_list, compile_status, truth_value, exception_info)`.
    *   `variable_binding_list`: A list of `(varNameString, value)` tuples.
    *   `value`: Can be Python primitives (int, float, str, bool, None) or specific classes imported from `pyergo` or `pyxsb`, such as `pyergo.HILOGFunctor`, `pyergo.ERGOSymbol`, `pyergo.ERGOIRI`, `pyergo.ERGODatetime`, `pyergo.ERGOVariable`, etc. Functor-like objects typically have `.name` and `.args` attributes. *(Note: Verify exact class names and attributes in the Packages Guide).*
*   **`pyxsb_query` Results:** Returns a list where each item is a tuple containing the bindings for the query variables in lexical order. Values can be Python primitives or classes like `pyxsb.XSBAtom`, `pyxsb.XSBString`, `pyxsb.XSBVariable`, `pyxsb.XSBFunctor`. *(Note: Verify exact class names in the Packages Guide).*

```python
# Example snippet (ensure necessary imports)
from pyergo import pyergo_query, PYERGOException, HILOGFunctor # Import other types as needed

try:
    result = pyergo_query('p(?X, ?Y).') # Assuming p/2 exists
    for ans_tuple in result:
        bindings = ans_tuple[0] # List of (varName, value)
        truth_val = ans_tuple[2]
        print(f"Truth: {truth_val}")
        for var_name, value in bindings:
            if isinstance(value, HILOGFunctor):
                # Access functor attributes (verify exact attributes in docs)
                print(f" {var_name} = {getattr(value, 'name', 'N/A')}({getattr(value, 'args', [])})")
            else:
                print(f" {var_name} = {value}")
except PYERGOException as e:
    print(f"Ergo query failed: {e}")

```

*Note on Python API Object Types:* The exact class names (e.g., `HILOGFunctor`, `ERGOSymbol`) and their available attributes (`.name`, `.args`) for unpacking results from `pyergo_query` and `pyxsb_query` should be verified against the official "Guide to ErgoAI Packages" for the specific ErgoAI version being used.

### 3.3. C/C++ Interface

ErgoAI provides a C API (usable from C++) for embedding the reasoner. This interface relies heavily on the underlying XSB Prolog C interface.

*Note: The C/C++ interface relies heavily on the underlying XSB Prolog C interface. While this section and the "Guide to ErgoAI Packages" cover Ergo-specific aspects like the `ergo_query` call structure, the definitive reference for core XSB C functions (`xsb_init`, `xsb_query_string`, `xsb_next`, etc.), detailed setup, linking, and return codes is the **XSB User Manual, Volume 2: C Interface**. Always consult both the Packages Guide and the XSB Manual.*

#### 3.3.1. Setup and Compilation

*   **Headers:** Include `xsb_config.h` and `cinterf.h` from the XSB installation.
*   **Compilation:** Link against XSB libraries. Examples provided in the Packages Guide (Chapter 4) and `C_calling_Ergo.c` show `gcc` (Linux/Mac) and `cl.exe` (Windows) commands, specifying include paths (`-I` or `/I`) and library paths/files (`-L`, `-l`, `/libpath:`). Static or dynamic linking against XSB is possible.
    ```bash
    # Example Linux GCC (Static Linking - Adjust paths and arch-dir)
    gcc -I$XSB_DIR/emu -I$XSB_DIR/config/your-arch-dir -Wall my_program.c -o my_program \
        $XSB_DIR/config/your-arch-dir/saved.o/xsb.o \
        -L$XSB_DIR/config/your-arch-dir/lib -lm -ldl -Wl,-export-dynamic -lpthread
    ```

#### 3.3.2. Core API Functions

Interaction primarily uses XSB's C interface functions.

*   **Initialization:** `xsb_init(argc, argv)`: Initializes the XSB engine. `argv[0]` must be the path to the XSB installation directory. Other arguments can suppress XSB chatter (e.g., `--noprompt`, `--quietload`).
*   **Ergo Initialization:** Execute Ergo initialization commands using `xsb_command_string()`. This includes setting `library_directory` and loading `flrcc_init`.
    ```c
    // Example - adjust ergo_home path
    char cmd_string[512];
    char *ergo_home = "/path/to/your/ErgoAI/ErgoAI/Ergo";
    sprintf(cmd_string, "asserta(library_directory('%s')).", ergo_home);
    if (xsb_command_string(cmd_string) == XSB_ERROR) { /* handle error */ }
    sprintf(cmd_string, "['%s/cc/flrcc_init'].", ergo_home);
    if (xsb_command_string(cmd_string) == XSB_ERROR) { /* handle error */ }
    ```
*   **Executing Commands/Queries:**
    *   `xsb_command_string(command)`: Executes a command string (Prolog or Ergo via `ergo_query`). Returns `XSB_ERROR`, `XSB_SUCCESS`, or `XSB_FAILURE`.
    *   `xsb_query_string(query)`: Initiates a query. Returns status code.
    *   `xsb_next()`: Fetches the next answer for the current query. Returns status code.
    *   `xsb_close_query()`: Closes the current query.
*   **Accessing Results:** Use functions like `xsb_var_int(VarNum)`, `xsb_var_float(VarNum)`, `xsb_var_string(VarNum)`, `xsb_var_term(VarNum)`, `xsb_var_to_string(VarNum)`, `xsb_var_strequal(VarNum, String)` to access variable bindings by their positive integer index (`VarNum`). Check for exceptions using the exception variable specified in the `ergo_query` call.

```c
#include "cinterf.h"
#include <stdio.h> // For printf

// ... includes, setup, error checking ...

// Example Query (assuming xsb_init and Ergo init succeeded)
char *query = "ergo_query('p(a(?X),b(?Y)).',['?X'=X,'?Y'=Y],_,_,_).";
int rc = xsb_query_string(query);

if (rc == XSB_SUCCESS) {
    do {
        // Access variables, e.g., using xsb_var_int(1) for X, xsb_var_int(2) for Y
        // Check types before accessing! Example assumes integers.
        printf("X = %d, Y = %d\n", xsb_var_int(1), xsb_var_int(2));
        // Check exception variable here if needed
    } while (xsb_next() == XSB_SUCCESS);
} else if (rc == XSB_ERROR) {
    // Handle query string error
} else { // XSB_FAILURE
    printf("Query failed or had no answers.\n");
    // Check exception variable here if needed
}
xsb_close_query();
```

### 3.4. SQL Database Connectivity (`@\sql`)

The `@\sql` module allows Ergo to interact with SQL databases via ODBC or native MySQL drivers.

*Note: This section outlines the `@\sql` module. For detailed setup (including required ODBC/native drivers, database configuration), exact method syntax, options, handling of NULL values, and specific behaviors, consult the official "Guide to ErgoAI Packages" and the ErgoAI Example Bank ("Connecting to SQL databases").*

#### 3.4.1. Connecting

*   **Load Module:** Ensure `@\sql` is loaded (usually automatic on first use). `ensure_loaded@\sql.`
*   **ODBC:**
    ```ergo
    ?- odbc[open(ConnectionId, DSN, User, Password)]@\sql.
    // ConnectionId: An atom chosen by the user (e.g., id1)
    // DSN: ODBC Data Source Name (atom)
    // User, Password: Database credentials (atoms)
    ```
    For DBMS that don't support changing databases at runtime (PostgreSQL, MS Access), `DSN` might need to be `connectDSN + dbDSN`.
*   **MySQL Native:**
    ```ergo
    ?- mysql[open(ConnectionId, Server, Database, User, Password)]@\sql.
    // Server: Hostname or IP, optionally with port (e.g., 'localhost', '127.0.0.1:3306')
    // Database: Database name (atom)
    ```
*   **Closing:**
    ```ergo
    ?- ConnectionId[close]@\sql.
    ```

#### 3.4.2. Executing SQL Queries and Updates

*   **Direct Query/Update:**
    ```ergo
    ?- ConnectionId[query(?QueryId, ?QueryList, ?ReturnList)]@\sql.
    // QueryId: Atom chosen by user to represent the created query statement.
    // QueryList: List of strings/variables that concatenate to a valid SQL statement.
    // ReturnList: List of variables for SELECT results (empty [] for other statements).
    ```
    Example:
    ```ergo
    ?- id1[query(qid, ['SELECT name FROM Person WHERE age=', ?Age], [?Name])]@\sql.
    ```
    This executes the query immediately. `NULL` values are returned as `NULL(?)@\plg`.

#### 3.4.3. Prepared Statements

For frequently executed queries with varying parameters.

*   **Prepare:**
    ```ergo
    ?- ConnectionId[prepare(?QueryId, ?QueryList)]@\sql.
    // QueryList contains '?' placeholders for parameters.
    ```
    Example:
    ```ergo
    ?- id1[prepare(qid, ['SELECT addr FROM Person WHERE name = ? and age = ?'])]@\sql.
    ```
*   **Execute:**
    ```ergo
    ?- QueryId[execute(?BindList, ?ReturnList)]@\sql.
    // BindList: List of values to substitute for '?' placeholders, in order.
    ```
    Example:
    ```ergo
    ?- qid[execute(['mike', 44], [?Address])]@\sql.
    ```
*   **Closing Query Id:**
    ```ergo
    ?- QueryId[qclose]@\sql.
    ```

### 3.4.4. Common Workflow: Populating SQL from Ergo/Files

A frequent use case involves loading data into Ergo (e.g., from CSV files via the `@dsv` module, see Section 3.8) and then populating SQL tables. The typical steps are:
1.  Establish DB connections using `odbc[open(...)]@\sql` or native drivers like `mysql[open(...)]@\sql`.
2.  Optionally, create tables if they don't exist using `ConnId[query(Id, ['CREATE TABLE...'], [])]@\sql`.
3.  Define an Ergo rule that iterates through the relevant Ergo facts (e.g., `my_data(Col1, Col2)@dsv_module`).
4.  Within the loop/rule, use `ConnId[query(Id, ['INSERT INTO ... values (', ?Val1, ', \"', ?Val2, '\")', ...], [])]@\sql` to insert data. Note the need to handle SQL value formatting, especially quoting strings (`\"`).
5.  Use Prolog's fail-loop (`(goal, \false) ; \true`) or recursion to drive the iteration.
6.  Close connections using `ConnId[close]@\sql`.

*(See ErgoAI Example Bank, "Connecting to SQL databases" for detailed code)*.

### 3.5. SPARQL Endpoint Connectivity (`@\sparql`)

The `@\sparql` module enables interaction with SPARQL 1.1 endpoints.

*Note: This section outlines the `@\sparql` module. For detailed setup, exact method syntax, options, query string list formats, result structures, and specific behaviors, consult the official "Guide to ErgoAI Packages".*

#### 3.5.1. Connecting

*   **Load Module:** `ensure_loaded@\sparql.`
*   **Query Endpoint:**
    ```ergo
    ?- System[open(?ConnId, ?EndpointURL, ?User, ?Password)]@\sparql.
    // ConnId: Atom chosen by user.
    // EndpointURL: URL of the SPARQL query endpoint (atom).
    ```
*   **Update Endpoint:**
    ```ergo
    ?- System[open(update(?ConnId), ?EndpointURL, ?User, ?Password)]@\sparql.
    ```
*   **Check Connection Type/URL:**
    ```ergo
    ?- System[connectionType(?ConnId) -> ?Type]@\sparql. // Type = query or update
    ?- System[connectionURL(?ConnId) -> ?URL]@\sparql.
    ```
*   **Closing:**
    ```ergo
    ?- System[close(?ConnId)]@\sparql.
    ```

#### 3.5.2. Executing SPARQL Queries

*   **SELECT (one answer at a time):**
    ```ergo
    ?- Query[select(?ConnId, ?QueryStringOrList) -> ?Result]@\sparql.
    // Result: List of pairs [var1, val1, var2, val2, ...]
    ```
*   **SELECT (all answers):**
    ```ergo
    ?- Query[selectAll(?ConnId, ?QueryStringOrList) -> ?ResultList]@\sparql.
    // ResultList: List of lists of pairs [[var1, val1,...], [var1, val1,...], ...]
    ```
*   **CONSTRUCT:**
    ```ergo
    ?- Query[construct(?ConnId, ?QueryStringOrList) -> ?ResultGraph]@\sparql.
    // ResultGraph: List of triples [S, P, O].
    ```
*   **ASK:**
    ```ergo
    ?- Query[ask(?ConnId, ?QueryStringOrList)]@\sparql. // Succeeds or fails
    ```
*   **DESCRIBE:**
    ```ergo
    ?- Query[describe(?ConnId, ?QueryStringOrList) -> ?ResultDesc]@\sparql.
    ```
    `?QueryStringOrList` can be an atom or a list (like in `@\sql`) to allow passing Ergo variable bindings into the SPARQL query.

#### 3.5.3. Executing SPARQL Updates

*   **UPDATE:**
    ```ergo
    ?- Query[update(?UpdateConnId, ?UpdateStringOrList)]@\sparql.
    // UpdateConnId must be an ID opened for update.
    ```

#### 3.5.4. Creating Local Triple Stores

The Packages guide mentions using GraphDB and Jena TDB as examples of triple stores that provide SPARQL endpoints, implying Ergo can connect to locally hosted instances of these via `@\sparql` if their endpoints are known.

### 3.6. RDF/OWL Integration (`@\owl`)

The `@\owl` module provides tools for importing, querying, and manipulating RDF/OWL data within Ergo modules. This allows ErgoAI to leverage existing ontologies and RDF datasets.

*Note: This section outlines the `@\owl` module. For definitive details on loading options (like `fastload`), supported syntaxes, IRI prefix handling, exact method syntax, result structures (including property paths), and specific behaviors, consult the official "Guide to ErgoAI Packages" and the ErgoAI Example Bank ("Importing RDF and OWL").*

#### 3.6.1. Loading RDF/OWL Files

Ergo can load RDF/OWL data from local files or URLs into a specified Ergo module.

*   **Basic Load:**
    ```ergo
    ?- System[rdf_load(?InputFileName, ?RdfModule)]@\owl.
    // ?InputFileName: Path to the RDF/OWL file (e.g., 'wine.owl', 'family.rdf')
    //                 or a URL using url('http://...').
    // ?RdfModule: The Ergo module name where the triples will be loaded.
    // Guesses syntax from file extension (.rdf, .owl, .ttl, .nt, .nq, .jsonld, .rj, .n3).
    ```
    Example:
    ```ergo
    // Load wine ontology into module 'winekb'
    ?- System[rdf_load('wine.owl', winekb)]@\owl.
    // Load from a URL
    ?- System[rdf_load(url('http://example.com/data.rdf'), myrdfdata)]@\owl.
    ```

*   **Load with Options:** A more detailed version allows specifying syntax, prefixes, and loading options.
    ```ergo
    ?- System[rdf_load(?InputFileName, ?InputLangSyntax, ?Options, ?IriPrefixes, ?RdfModule)]@\owl.
    // ?InputLangSyntax: 'RDF/XML', 'TURTLE', 'N-TRIPLES', 'JSON-LD', etc. (atom). Use '' for auto-detect.
    // ?Options: Atom or list of options. Key option is 'fastload' for potentially faster loading
    //           (may have limitations, consult documentation). Use '' for defaults.
    // ?IriPrefixes: String atom defining prefixes, e.g., 'prefix1=URL1\nprefix2=URL2'. Use '' for none.
    ```
    Example with `fastload`:
    ```ergo
    ?- System[rdf_load('family.owl', '', fastload, '', family_module)]@\owl.
    ```

#### 3.6.2. Querying Imported Triples

Once loaded into `?RdfModule`, the RDF triples `(S, P, O)` are represented as standard Ergo frames `S[P -> O]@?RdfModule`. They can be queried using this frame syntax.

```ergo
// Find all triples in the 'winekb' module
?- ?Subject[?Property -> ?Object]@winekb.

// Find the maker of a specific wine resource in 'winekb'
?- vin:'SomeSpecificWine'[vin:hasMaker -> ?Maker]@winekb.
```

*(Note: Assumes appropriate IRI prefixes like `vin` are defined or full IRIs are used)*.

#### 3.6.3. Modifying RDF Data

Triples can be added or removed from an RDF module after the initial load using methods in the `@\owl` module.

*   `?RdfModule[rdf_insert(?S, ?P, ?O)]@\owl`: Inserts the triple `(S, P, O)` into the specified module. `O` can be a single value or a set `{Val1, Val2, ...}`.
    ```ergo
    // Add John's friends Bob, Mary, Kate to the family_module
    ?- family_module[rdf_insert(ex:John, ex:friend, {ex:Bob, ex:Mary, ex:Kate})]@\owl.
    ```
*   `?RdfModule[rdf_delete(?S, ?P, ?O)]@\owl`: Deletes triples matching the pattern `(S, P, O)` from the module. Variables are allowed. If `O` is specified, only that specific value is removed from potentially multi-valued properties.
    ```ergo
    // Remove Bob as John's friend in family_module
    ?- family_module[rdf_delete(ex:John, ex:friend, ex:Bob)]@\owl.
    ```
*   `?RdfModule[rdf_deleteall]@\owl`: Deletes *all* triples previously loaded or inserted into `?RdfModule`.

#### 3.6.4. Other RDF API Calls

The `@\owl` module provides additional methods for exploring the loaded RDF data:

*   `?Subject[rdf_reachable(?RdfModule, ?Property) -> ?Object]@\owl`: Checks reachability via property paths (details in documentation).
*   `?RdfModule[rdf_predicate -> ?P]@\owl`: Retrieves all unique predicates used in the module.
*   `?RdfModule[rdf_subject -> ?S]@\owl`: Retrieves all unique subjects used in the module.
*   `?RdfModule[rdf_object -> ?O]@\owl`: Retrieves all unique objects used in the module.

#### 3.6.5. Module Structure and Operations

It's important to remember that the RDF data (triples) resides in the *target module* specified during `rdf_load` (e.g., `winekb`, `family_module`). However, the *operations* for manipulating this data (`rdf_load`, `rdf_insert`, `rdf_delete`, etc.) are invoked via the system module `@\owl`.

#### 3.6.6. ErgoRDF/OWL Tool (Studio)

ErgoAI Studio includes a graphical tool (`Tools > Ergo-to-OWL`) for interactively converting RDF/OWL files into Ergo knowledge bases (either native Ergo syntax or fastload format). *(This sub-section remains unchanged)*.

*(Examples derived from ErgoAI Example Bank, "Importing RDF and OWL")*

### 3.7. JSON Integration (`@\json`)

The `@\json` module handles parsing JSON data into Ergo terms or facts, and exporting Ergo terms/objects to JSON.

*Note: This section outlines the `@\json` module. For definitive details on the exact structure of Ergo terms generated from JSON, options for handling duplicate keys, `object2json` filtering, recursive export control, and specific error conditions, consult the official "Guide to ErgoAI Packages".*

#### 3.7.1. Parsing JSON to Terms

*   `?Source[parse -> ?Result]@\json`: Parses JSON from `?Source` into an Ergo term representation.
    *   `?Source`: `string(Atom)`, `str(Atom)`, `url(Atom)`, `file(Atom)`, `Atom` (filename), or a variable (for stdin).
    *   `?Result`: Variable bound to the Ergo term (JSON objects -> `json([...])`, arrays -> lists, strings -> atoms, numbers -> numbers, true/false/null -> `\true`/`\false`/`\@?`).
*   `?Source[parse(Selector) -> ?Result]@\json`: Selects a sub-object using a dot-separated `Selector` string before parsing.
*   `?Source[parse -> pretty(?Var)]@\json`: Binds `?Var` to a pretty-printed string atom of the input JSON.
*   `set_option(duplicate_keys=true|false)@\json`: Controls handling of duplicate keys in JSON objects (default is `false`, causing an error).

```ergo
?- string('{"a": 1, "b": [2,3]}')[parse -> ?Term]@\json.
// ?Term = json([a=1, b=[2,3]])

?- file('data.json')[parse('results.records') -> ?Records]@\json.
```

#### 3.7.2. Parsing JSON to Facts

Converts a JSON object into Ergo frames, representing the structure as facts.

*   `?Source[parse2memory(?Module)]@\json`: Parses the JSON object from `?Source` and inserts corresponding facts into `?Module`.
*   `?Source[parse2memory(?Module, ?Selector)]@\json`: Parses only the selected sub-object.
*   `?Source[parse2file(?File)]@\json`: Parses and writes facts to `?File`.
*   `?Source[parse2file(?File, ?Selector)]@\json`: Parses selected sub-object and writes facts.
*   `?Module[json_root -> ?Oid]@\json`: Retrieves the object Id(s) assigned to the root(s) of the JSON structure(s) parsed into `?Module`.
*   `?Module[forget_roots]@\json`: Clears the stored root Oids.

```ergo
?- string('{"name":"X","val":1}')[parse2memory(mydata)]@\json.
?- mydata[json_root -> ?RootOid]@\json.
?- ?RootOid[name -> ?N]@mydata. // Query the generated facts
```

#### 3.7.3. Exporting Ergo Terms/Objects to JSON

*   `?Term[term2json -> ?JsonAtom]@\json`: Converts an Ergo HiLog term `?Term` into a JSON string representation (atom `?JsonAtom`).
*   `?Object[object2json -> ?JsonAtom]@\json`: Converts an Ergo object `?Object` (its properties and superclasses) into a JSON string atom.
*   `?Object[object2json(?Module)... -> ?JsonAtom]@\json`: Variants allowing module specification and filtering.
*   `set_option(recursive_export=true|false)@\json`: Controls whether `object2json` recursively expands object-valued properties (default `false`).

```ergo
?- p(a, [1,2])[term2json -> ?J]@\json.
// ?J = '{"functor":"p","arguments":["a",[1,2]]}'

?- kati[object2json -> ?J]@\json. // Assuming kati object exists

// To get a pretty-printed string from an Ergo object (useful for display):
?- kati[object2json -> ?JsonString]@\json,
   string(?JsonString)[parse -> pretty(?PrettyJsonString)]@\json.
// ?PrettyJsonString will contain the formatted JSON.
```

### 3.8. Tabular Data (CSV, DSV, TSV) (`@dsv`)

The `@dsv` module (loaded via `[e2dsv>>dsv].`) handles delimiter-separated value files.

*Note: This section outlines the `@dsv` module. For definitive details on supported type conversions, specific format options (`separator`, `delimiter`, `titles`, `pad`, `error`), frame mapping for tabular data, and specific behaviors, consult the official "Guide to ErgoAI Packages" and the ErgoAI Example Bank ("Importing tabular data").*

#### 3.8.1. Loading Tabular Data

*   `dsv_load(?Infile, ?Spec, ?Format)@dsv`: Loads data from `?Infile` according to `?Spec` and `?Format`.
    *   `?Infile`: File path atom or `url(URL)`.
    *   `?Spec`: Defines the target predicate and column types:
        *   `predname/arity`: Loads all columns as atoms.
        *   `predname(Type1, ..., TypeN)`: Specifies type for each column (`atom`, `integer`, `float`, `string`, `date`, `time`, `dateTime`, `duration`, `currency`, `currency(Unit)`, `term`, `hilog`).
        *   `predname`: Loads each row as a single list `predname([Col1, Col2, ...])`.
    *   `?Format`: Specifies the file format:
        *   `csv`, `tsv`, `psv` (for comma, tab, pipe separators).
        *   List of options: `[separator="chars"^^ \charlist, delimiter="char"^^ \charlist, titles(N), pad(N), error]`. `titles(N)` skips N header lines. `pad(N)` pads/truncates rows. `error` turns warnings into errors.

```ergo
// Load CSV into p/3, converting columns 1 and 3 to integer
?- dsv_load('data.csv', p(integer, atom, integer), csv)@dsv.

// Load TSV into q/1 (list per row), skipping 1 header line
?- dsv_load('data.tsv', q, [tsv, titles(1)])@dsv.

// Load custom delimiter '\>' file
?- dsv_load('salary.dsv', s, [separator="\\>"^^\charlist, titles(1)])@dsv. // titles(1) assumed
```
Loaded data populates the specified predicate (e.g., `p/3`) in the module where `@dsv` resides. Query using `predicate(...)@module`.

#### 3.8.2. Saving Data

*   `dsv_save(?Infile, ?Spec, ?OutFile, ?Format)@dsv`: Converts data from `?Infile` using `?Spec` and saves to `?OutFile` in `?Format`.

#### 3.8.3. Accessing via Frames and Meta Data

Tabular data can also be accessed using frames by defining a mapping between column names and numbers.

1.  Create a meta-data file (e.g., `meta.ergo`) defining column names:
    ```ergo
    :- export{column_name(?,?)}.
    column_name(colA, 1).
    column_name(colB, 2).
    ```
2.  Add this meta-data to the data module: `[+meta >> dsv].`
3.  Add a bridge rule to the querying module:
    ```ergo
    ?rowId[?property -> ?val] :-
        ( column_name(?property, ?colNum),
          ?rowId[arg(?colNum) -> ?val]
        )@dsv.
    ```
4.  Query using column names: `?- ?Row[colA -> ?ValA, colB -> ?ValB]@dsv.` (Requires frame representation `\e2dsv(...)` for `?rowId`).

### 3.9. HTTP and Web Services (`@\http`)

The `@\http` module provides functionality for making HTTP requests.

*Note: This section outlines the `@\http` module. For definitive details on all available request options (`redirect`, `secure`, `timeout`, `header`, `auth`, etc.), specific behaviors for different HTTP methods (POST, PUT, DELETE), result/warning structures, and utility method specifications, consult the official "Guide to ErgoAI Packages".*

#### 3.9.1. Basic GET Requests

*   `?URL[http -> (?Result, ?Warnings)]@\http`: Performs an HTTP GET request to `?URL`. `?Result` gets the response body (atom), `?Warnings` gets server warnings (list of atoms). `?URL` can be an atom or `\iri`.

```ergo
?- 'http://example.com'[http -> (?Res, ?Warn)]@\http.
```

#### 3.9.2. Advanced Requests

*   `?URL[http(?OptionList) -> (?Result, ?Warnings)]@\http`: Performs HTTP requests with options.
    *   `?OptionList`: A list containing options like:
        *   `redirect = true|false` (default true)
        *   `secure = false | 'path/to/cert.pem'` (default false)
        *   `timeout = Integer` (seconds)
        *   `useragent = Atom`
        *   `header = AtomOrListOfAtoms` (e.g., `'Content-Type: application/json'`)
        *   `auth = 'user/password'`
        *   `post = Atom` (request body for POST)
        *   `put = Atom` (request body for PUT)
        *   `delete` (Boolean option for DELETE method)

```ergo
// POST request with JSON body and authentication
?- 'https://api.example.com/data'[http([
       auth='user/pass',
       post='{"key": "value"}',
       header='Content-Type: application/json'
   ]) -> (?R, ?W)]@\http.

// DELETE request
?- "http://example.com/resource/123"^^\iri[http([delete]) -> (?R, ?W)]@\http.
```

#### 3.9.3. Utility Methods

*   `?URL[properties -> ?Props]@\http`: Gets properties `[PageSize, ModTime, RedirectedURL]` of a URL without fetching the full content.
*   `?URL[properties(Options) -> ?Props]@\http`: Like above, but accepts options (e.g., `redirect=false`).
*   `?URL[encoding -> ?EncList]@\http`: URL-encodes a URL string into `[Dir, File, Ext]`.
*   `?Item[base64encode -> ?EncodedAtom]@\http`: Base64 encodes `?Item` (atom, charlist, or `file(Path)`).
*   `?Atom[base64decode -> ?DecodedResult]@\http`: Base64 decodes `?Atom`. `?DecodedResult` can be an atom, `file(Path)`, or `list(VarOrCharlist)`.

### 3.10. Persistent Modules (`@pm`)

The `@pm` module (loaded via `[persistentmodules>>pm].`) allows Ergo modules to be backed by an ODBC database.

*Note: This section outlines the `@pm` module. For definitive details on database schema requirements, supported ODBC drivers, transaction semantics, `set_field_type` options, and specific behaviors, consult the official "Guide to ErgoAI Packages".*

#### 3.10.1. Attaching/Detaching Databases

*   `?Module[attach(?DSN, ?DB, ?User, ?Password)]@pm`: Attaches `?Module` to an existing database `?DB` specified by ODBC `?DSN`. Creates necessary tables if they don't exist.
*   `?Module[attachNew(?DSN, ?DB, ?User, ?Password)]@pm`: Creates a new database `?DB` via `?DSN` and attaches `?Module`. Fails if the database exists.
*   `?Module[detach]@pm`: Detaches the module from its database. Changes are no longer persisted.
*   `set_field_type(?TypeString)@pm`: Sets the SQL type used for storing facts (e.g., `'TEXT DEFAULT NULL'`). Must be called *before* `attachNew`.

#### 3.10.2. Loading Data

*   `?Module[loadDB]@pm`: Loads facts from the attached database into the module's memory cache for faster querying (on-demand loading is the default).

Once attached, facts inserted/deleted in the module are automatically reflected in the database and persist across sessions. Rules are not persisted.

### 3.11. Constraint Solving (MiniZinc) (`@mzn`)

The `@mzn` module (loaded via `[minizinc>>mzn].`) provides an interface to the MiniZinc constraint modeling language. *Note: Verify exact method syntax, parameters, and behavior in the Packages Guide.*

*Note: This section outlines the `@mzn` module interface. It requires a separate MiniZinc installation. For definitive details on solver options, input/output template syntax, exception types, `solve_flex` behavior, and setup requirements, consult the official "Guide to ErgoAI Packages" and the ErgoAI Example Bank ("Constraint Optimization").*

#### 3.11.1. Loading the API

```ergo
?- [minizinc>>mzn].
```

#### 3.11.2. The `solve`/`solve_flex` API

*   `solve(+MznF, +DatFs, +InPars, +Solver, +Solns, +OutTempl, -Rslt, -Xceptns)@mzn`: The main predicate.
    *   `MznF`: Path to the `.mzn` model file.
    *   `DatFs`: List of paths to `.dzn` data files.
    *   `InPars`: List of inline parameters (`id=value`).
    *   `Solver`: Solver name atom (e.g., `gecode`, `osicbc`).
    *   `Solns`: Number of solutions (`all` or positive integer). Use `1` for optimization problems.
    *   `OutTempl`: Output template term (e.g., `predname(Var1, Var2=Expr, +atom)`).
    *   `Rslt`: Variable bound to the result term matching `OutTempl`.
    *   `Xceptns`: List bound to exceptions (e.g., `unsatisfiable`, `unbounded`).
*   `solve_flex(...)@mzn`: A version where evaluation is delayed until `InPars` and `OutTempl` are ground.

```ergo
// Example from Packages Guide/Example Bank (adjust paths)
?- solve('path/to/game.mzn', [], [n=3, A='[|0.0,1.0,-2.0,|-3.0,0.0,4.0,|5.0,-6.0,0.0|]'],
         osicbc, 1, game(+X=X,+w=w), ?Result, ?Exceptions)@mzn.
```
```ergo
// Example call structure (illustrative)
?- solve('path/to/model.mzn', // .mzn model file
         ['datafile.dzn'],    // .dzn data files (optional)
         [n=10, param='foo'], // Inline parameters (optional)
         gecode,              // Solver choice
         all,                 // Number of solutions ('all' or integer)
         output_pred(Var1=X), // Output template
         ?Result,             // Variable for result term(s)
         ?Exceptions          // Variable for exception list
        )@mzn.
```

#### 3.11.3. Handling Results and Exceptions

*   Solutions are bound to the `Rslt` variable according to the `OutTempl`.
*   Exceptions (like `unsatisfiable`) are returned in the `Xceptns` list.
*   Syntax errors in model/data files cause the call to fail and print messages to standard output.

### 3.12. Evidential Probabilistic Reasoning (`@ergo_ep`)

The `@ergo_ep` module (loaded via `[evidential_probability >> ergo_ep].`) supports reasoning with evidential probability.

*Note: This section outlines the `@ergo_ep` module. For definitive details on the underlying theory, handling of specificity and precision, exact syntax for statistical statements, and specific behaviors, consult the official "Guide to ErgoAI Packages".*

#### 3.12.1. `\pct` Syntax

Statistical statements are represented as:
```ergo
\pct(TargetClass, ReferenceClass, LowerBound, UpperBound).
```
Example:
```ergo
\pct(stolen, redRacing, 0.0084, 0.0476).
```

#### 3.12.2. Querying Probabilities

The `\ep` predicate is used to query the derived probability interval for an object belonging to a class:
```ergo
?- \ep(TargetClass, Object, ?LowerBound, ?HigherBound)@ergo_ep.
```
Example:
```ergo
?- \ep(stolen, redRacingImported, ?L, ?H)@ergo_ep.
// ?L = 0, ?H = 0.0454 (based on example calculation)
```
This package combines statistical statements with subclass (`::`) and membership (`:`) information using principles of specificity and precision to derive probability bounds.

## 4. Advanced Semantics and Usage (Deep Dive)

This section explores the semantic underpinnings and behavior of several advanced ErgoAI features, providing a deeper understanding beyond basic syntax. For detailed grammatical rules, please refer to the *ErgoAI Syntax Guide for LLMs*.

### 4.1. Defeasible Reasoning Semantics

Defeasible reasoning in ErgoAI allows for handling conflicts and exceptions in logical rules. It relies on user-defined specifications of opposition and overriding, combined with a chosen argumentation theory.

#### 4.1.1. Concepts

*   **Opposition (`\opposes`):** Defines which literals are considered contradictory. `Lit` and `\neg Lit` are implicitly opposing. The user can define additional oppositions, e.g., `\opposes(price(?X,?P1), price(?X,?P2)) :- regulated(?X), ?P1 != ?P2.`. If two opposing literals are derived, they are in conflict.
*   **Overriding (`\overrides`):** Specifies priority between potentially conflicting rules, identified by their tags or rule Ids. `\overrides(tag1, tag2)` means rules tagged `tag1` take precedence over rules tagged `tag2`. A 4-argument version allows specifying overriding based on matching rule heads.
*   **Conflict:** Two rule instances are in conflict if their heads oppose each other and their bodies are true in the intended model.
*   **Refutation:** A rule instance `ρ1` (tag `i1`) *refutes* another rule instance `ρ2` (tag `i2`) if they are in conflict and `ρ1` overrides `ρ2` (`\overrides(i1, i2)` holds).
*   **Rebuttal:** A rule instance `ρ1` *rebuts* `ρ2` if they are in conflict and neither overrides the other.
*   **Defeat:** A rule instance is defeated if it is refuted, rebutted, or disqualified. Defeated rules do not need to be satisfied in the final model.
*   **Disqualification:** A rule instance can be disqualified under certain conditions defined by the argumentation theory. Common reasons include being *canceled* (by a `\cancel` literal), being overridden by a *strict* (non-defeasible) rule, or participating in a cyclic chain of defeats (in some theories).

#### 4.1.2. Argumentation Theories

ErgoAI supports several argumentation theories, selectable per module using `:- use_argumentation_theory{TheoryName}.`. The theory defines precisely how conflicts, overriding, and cancellation lead to defeat.

*   **Cautious Courteous Logic (`\gcl`, Default):** A rule `R` is defeated if another rule defeats, rebuts, or cancels `R`, provided that the defeating/rebutting/canceling rule is not itself defeated. It also disallows circular defeat chains. This is the default theory and suitable for most applications.
*   **Original Courteous Logic (`ogcl`):** Similar to cautious, but a rule `R` is defeated if another rule defeats, rebuts, or cancels `R`, regardless of whether that other rule is itself defeated. It does not check for circular defeat chains.
*   **Strong Courteous Logic (`sgcl`):** An intermediate theory. Like the original theory, but disallows a defeating rule `ρ1` to be rebutted or refuted by the rule `ρ2` it is defeating.
*   **Courteous Logic with Exclusion Constraints (`gcle`):** Extends the courteous logic framework to handle `\Exclusion` constraints, where a set of literals (more than two) are declared mutually opposing.

#### 4.1.3. Interaction with Explicit Negation

Explicit negation (`\neg`) plays a key role in defining opposition.

*   `Lit` and `\neg Lit` are always considered opposing literals by the defeasible reasoning system, without needing an explicit `\opposes` statement.
*   User-defined `\opposes` rules can establish conflicts between other pairs of literals (e.g., between two different price assignments for the same regulated item).
*   `\neg` can appear in the heads of defeasible rules.
*   The derivation of `\neg p` implies `\naf p` (if `p` is known to be false, it cannot be proven true).

### 4.1.4. Common Defeasible Patterns (Illustrated in ErgoAI Example Bank)

*   **Defaults and Exceptions:** A general rule (`@{default_rule} default_conclusion :- condition.`) is often paired with more specific rules that contradict it (`@{exception_rule} \neg default_conclusion :- specific_condition.`) and an override statement (`\overrides(exception_rule, default_rule).`). The classic "Birds Fly" example follows this pattern.
*   **Inertia:** Rules can express that properties persist over time/state changes unless overridden by an explicit action. For example: `prop(State+1) :- prop(State).` tagged `@{inertia}` might be overridden by `\neg prop(State+1) :- action(State).` tagged `@{action}` using `\overrides(action, inertia)`. The Blocks example demonstrates this.

### 4.2. Omniformity Semantics

Omniformity allows general first-order formulas in rule heads, enabling more direct logical representations and contrapositive reasoning. It must be enabled via `:- compiler_options{omni=on}.`.

#### 4.2.1. Formulas in Rule Heads

When omniformity is enabled, rule heads can contain:

*   Atomic formulas (frames, HiLog predicates).
*   `\neg head`.
*   Conjunctions (`,`, `\and`) and Disjunctions (`;`, `\or`) of head formulas.
*   Implications: `head1 ==> head2`, `head1 <== head2`, `head1 <==> head2`.
*   Quantifiers: `forall(VarList)(head)`, `exists(VarList)(head)`.

Built-ins, updates, non-logical operators, `\naf`, `\+`, and the implications `~~>`, `<~~`, `<~~>` are *not* permitted in omniform heads.

#### 4.2.2. Transformations and Contrapositives

The key semantic implication of omniformity applies to the `<==` connective (and consequently `==>` and `<==>`) when used in rule heads (or facts).

*   A statement `head <== body.` is treated not just as `head :- body.` but also implies its contrapositives. For example, if `body` is `b1, b2`, the statement implies:
    *   `head :- b1, b2.`
    *   `\neg b1 :- \neg head, b2.`
    *   `\neg b2 :- \neg head, b1.`
*   The `:-` connective does *not* support this contrapositive reasoning.
*   Disjunction (`\or`) in the head also enables contrapositive-like reasoning: `h1 \or h2.` is equivalent to `h1 :- \neg h2.` and `h2 :- \neg h1.`.

#### 4.2.3. Interaction with Built-ins

Built-in predicates and non-logical operators (like I/O, updates, cuts, `\is`) are generally prohibited within omniform rule heads. If an implication like `<==` contains such constructs, it must be rewritten as a standard rule (`:-`) with the non-logical parts moved to the body.

### 4.3. Inheritance Semantics

ErgoAI supports structural and behavioral inheritance, with options for monotonic and non-monotonic behavior.

#### 4.3.1. Monotonic vs. Non-monotonic Behavioral Inheritance

This applies to default values specified using `->` in class frames (`[|...|]`).

*   **Non-monotonic (`flogic`, Default):** This is the standard F-logic inheritance. Definitions in subclasses override definitions in superclasses. Conflicts arising from multiple inheritance (from incomparable classes providing different definitions for the same method) result in the inherited property becoming `\false` (or `\undefined` in some views). Specificity matters: information from a more specific class takes precedence. Information defined directly on an object overrides any inherited defaults.
*   **Monotonic (`monotonic`):** Information from superclasses is accumulated by subclasses and members without overriding. If multiple values are inherited for the same property, the object/subclass effectively inherits the set of all those values. This mode is computationally cheaper but less common than non-monotonic inheritance.

#### 4.3.2. Structural Inheritance (Signatures)

This applies to type signatures specified using `=>` in class frames (`[|...|]`).

*   Structural inheritance is always **monotonic**.
*   Signatures propagate from superclasses to subclasses and members.
*   There is no overriding; if multiple signatures are inherited for the same property, the effective type becomes the intersection of the inherited types.
*   Cardinality constraints specified in signatures are also inherited.

#### 4.3.3. Negative Inheritance

ErgoAI handles the inheritance of negative information differently based on the inheritance mode.

*   **Monotonic Mode:** Negative behavioral defaults (`\neg prop->val`) and negative signatures (`\neg prop=>type`) propagate upwards from objects/subclasses to superclasses as class-level (`[|...|]`) negative statements.
*   **Non-monotonic Mode:** Negative information does *not* propagate upwards. However, explicitly stated negative information (e.g., `obj[\neg prop->val]`, `subclass[|\neg prop->val|]`) acts locally and *blocks* the inheritance of corresponding positive default values from superclasses.

#### 4.3.4. Code Inheritance Simulation

ErgoAI does not directly support "code inheritance" in the style of Java instance methods. However, this pattern can be simulated using standard Ergo features and value inheritance as a design pattern:

1.  Define auxiliary methods (using standard Ergo rules) that implement the desired logic, applicable to any object (e.g., `aux_foo(?Self, ?Arg)`).
2.  Define an attribute (e.g., `dispatch(meth)`) in classes using standard value inheritance (`[|...|]`). The value of this attribute should be the *name* (atom) of the appropriate auxiliary method (e.g., `aux_foo`).
3.  Define the "real" method (e.g., `meth`) via a rule that retrieves the inherited auxiliary method name using `?Self[dispatch(meth)->?RealMethName]` and then constructs and calls the auxiliary method using meta-calls or HiLog features (e.g., `?RealMethName(?Self, ?Arg)`).

### 4.4. Custom Module Semantics (`setsemantics{...}`)

The `setsemantics{...}` directive (compile-time `:-` or runtime `?-`) allows customization of a module's semantics.

*Note: The options listed below are based on available documentation. Consult the official ErgoAI Reasoner User's Manual (Section 23) for the definitive list of options, their exact behavior, and defaults.*

#### 4.4.1. Equality Maintenance Levels

*   `equality=none` (Default): `:=:` is treated as a simple symmetric, reflexive, transitive relation. No congruence properties are maintained (e.g., `a:=:b` and `p(a)` does not imply `p(b)`).
*   `equality=basic`: `:=:` obeys standard equality rules, including limited congruence (substitution within arguments of frames and HiLog predicates). This incurs performance overhead.

#### 4.4.2. Inheritance Modes

*   `inheritance=flogic` (Default): Enables standard non-monotonic behavioral inheritance (overriding, conflict resolution).
*   `inheritance=monotonic`: Enables monotonic behavioral inheritance (accumulation of defaults). Structural inheritance remains monotonic.
*   `inheritance=none`: Disables behavioral inheritance completely. Structural inheritance remains active.

#### 4.4.3. Tabling Modes

Controls how query answers are tabled (memoized).

*   `tabling=reactive` (Default): Tables are incrementally updated when underlying base facts change.
*   `tabling=passive`: Tables are computed once and not updated if base facts change, potentially returning stale answers. Computationally cheaper.
*   `tabling=variant` (Default): Default tabling identification mechanism.
*   `tabling=subsumptive` (Experimental): Stores only the most general answers in tables. Can improve performance/reduce memory in some cases, but currently only works with `passive` tabling.

#### 4.4.4. Subclassing Modes

Controls the interpretation of the subclass hierarchy (`::`).

*   `subclassing=strict` (Default): The subclass hierarchy must be acyclic. Cycles detected at runtime cause an error.
*   `subclassing=nonstrict`: Allows cycles in the subclass hierarchy.

#### 4.4.5. Class Expressions

*   `class_expressions=on`: Enables set-theoretic class expressions like `(c1, c2)` (intersection), `(c1; c2)` (union), `(c1 - c2)` (difference).
*   `class_expressions=none` (Default): Disables class expressions. Enabling can lead to infinite answers for certain queries if not used carefully.

#### 4.4.6. Custom Axioms

*   `custom=filename`: Loads additional axioms from `filename` to define custom module semantics, using the same API as Ergo trailers.

### 4.5. Tabling Semantics

Tabling is fundamental to ErgoAI's performance and termination properties for recursive queries.

#### 4.5.1. Operational Semantics Overview

*   When a tabled goal (predicate or frame) is called, the system checks if answers are already stored in a table.
*   If yes, answers are retrieved from the table.
*   If no (or if more answers might exist), the rules defining the goal are evaluated.
*   Computed answers are stored in the table and returned.
*   For mutually recursive goals, the system computes answers for the entire set of interdependent goals (the Strongly Connected Component or SCC) before returning answers or proceeding.

#### 4.5.2. Passive vs. Reactive Tabling

*   **Reactive (Default):** The system monitors dependencies between tabled goals and base facts. When base facts involved in a derivation are updated (via transactional updates), the relevant tables are incrementally updated or invalidated, ensuring subsequent queries receive fresh results.
*   **Passive:** Tables are not updated after their initial computation, even if underlying base facts change. Queries may return stale results. This mode is computationally less expensive. The `refresh{...}` primitive can be used to manually invalidate specific stale table entries.

#### 4.5.3. Subsumptive Tabling

*   (Experimental) Instead of storing all derived answers, only the most general answers that subsume others are stored. Can save space and potentially speed up queries where only the most general results are needed. Currently works only with `passive` tabling.

#### 4.5.4. Interaction with Updates

*   **Transactional Updates:** Generally safe with tabling, but tabled predicates should not *depend* on transactional updates, as backtracking during tabling might undo updates unpredictably.
*   **Non-transactional Updates:** Tabled predicates *must not* depend on non-transactional updates. Doing so leads to warnings and likely runtime errors, as the update's side effect violates the logical assumptions of tabling. The `stealth{...}` primitive allows updates that are hidden from the tabling dependency mechanism, for expert use cases like logging or counters.

#### 4.5.5. Cuts and Tabling

*   Prolog-style cuts (`!`) have limited interaction with tabling.
*   A cut **cannot** appear in a rule body *after* a call to a tabled predicate or frame within the same rule.
*   A cut **can** appear *before* any tabled calls.
*   A cut **can** appear within the body of a rule defining a tabled predicate/frame, provided no tabled calls precede it in that body.
*   Violating these rules leads to a "cannot cut tabled predicates" error. Use transactional predicates (`%`) or structure rules differently if cuts seem necessary after tabled calls.

## 5. Debugging, Runtime Analysis, and Error Handling

ErgoAI provides a comprehensive suite of tools and techniques for debugging knowledge bases, analyzing runtime behavior, and handling errors. These range from interactive tracing to sophisticated non-termination analysis.

*Note: This section provides an overview of debugging tools and concepts. For definitive syntax, detailed behavior, and advanced usage, consult the relevant debugging sections and Appendix B ("The ERGO Tracing Debugger") in the official ErgoAI Reasoner User's Manual.*

### 5.1. Tracing Debugger

ErgoAI includes an interactive, Prolog-style debugger for stepping through query execution.

*   **Activation/Deactivation:**
    *   `\trace.` : Turns on tracing for subsequent queries in the shell. Can also be used as a subgoal within rules to start tracing from that point.
    *   `\notrace.` : Turns off tracing.
    *   `\tracelow.` : Enables low-level tracing, showing the actual Prolog subgoals being executed (useful for debugging runtime libraries or Ergo itself).
    *   `\notracelow.` : Turns off low-level tracing.
*   **Output Format:** The tracer prompts the user at four key points (ports) during the execution of a subgoal:
    *   `Call`: When a subgoal is first invoked.
    *   `Exit`: When the subgoal succeeds.
    *   `Redo`: When backtracking requires the subgoal to produce another solution.
    *   `Fail`: When the subgoal fails (cannot produce more solutions).
*   **User Commands at Trace Prompt:**
    *   `<Enter>` (creep): Proceed to the next trace port.
    *   `s` (skip): Execute the current subgoal non-interactively; stop again upon Exit or Fail.
    *   `S` (verbose skip): Like `s`, but also shows the trace output generated during the skipped execution.
    *   `l` (leap): Stop tracing and execute the remainder of the query without interruption.
    *   *(Note: Additional commands may be available; see User Manual Appendix B).*
*   **Logging Trace Output:**
    *   `?- \trace('filename.log').`: Redirects the standard trace output to the specified file. Requires `\notrace.` or exiting Ergo to flush the buffer.
    *   `?- \trace('filename.log', log).`: Dumps the trace to the file as Ergo facts of the form `flora_tracelog(CallId, CallNumber, PortType, CurrentCall, Time)`.
    *   `?- \tracelow('filename.log').`: Redirects the low-level Prolog trace to the specified file.
    *   `?- \tracelow('filename.log', log).`: Dumps the low-level trace as facts (in Prolog format).

#### 5.1.1. Interactive Tracer Commands

At the tracer prompt (`Call:`, `Exit:`, `Redo:`, `Fail:`), the user can enter single-letter commands (followed by `<Enter>`) to control the debugger:

*   `<Enter>` (creep): Step to the next port (the default action). Shows every step of the execution.
*   `s` (skip): Execute the current goal non-interactively. The debugger will stop again only when the *current* goal either exits (succeeds) or fails. Internal steps of the skipped goal are not shown.
*   `S` (verbose skip): Similar to `s`, but *does* print the trace messages generated during the execution of the skipped goal.
*   `l` (leap): Stop interactive tracing completely and resume normal, uninterrupted execution of the rest of the query.
*   `a` (abort): Abort the current query execution entirely.
*   `f` (fail): Force the current goal to fail, initiating backtracking immediately.
*   `n` (nodebug): Turn off tracing (equivalent to `\notrace.`).
*   `?` (help): Display help information about available debugger commands.
*   *(`g` (ancestors), `d` (display term), `w` (write term) might also be available - check XSB Manual)*

### 5.2. Terminyzer (Non-termination Analysis)

Terminyzer is a powerful tool for detecting potential infinite loops (non-termination) in queries.

#### 5.2.1. Invocation and Tripwires

*   **Invocation:**
    *   Shell: `terminyzer{}.`
    *   Studio: `Debug > Use Terminyzer`.
*   **Tripwires:** Invoking `terminyzer{}` (or using the menu) opens a dialog (in graphical environments) to set limits (tripwires) that pause execution if exceeded:
    *   `Timeout (in seconds)`: Pauses if execution time exceeds the limit.
    *   `Maximal goal size`: Pauses if a subgoal term exceeds a certain size/depth. Allows enabling *call abstraction*.
    *   `Maximal answer size`: Pauses if a derived answer term exceeds a certain size/depth. Allows enabling *answer abstraction*.
    *   `Maximal number of active subgoals`: Pauses if the number of currently executing (incomplete) tabled subgoals exceeds the limit.

#### 5.2.2. Call Abstraction and Answer Abstraction

*   **Call Abstraction:** When enabled (via the Terminyzer dialog or `setruntime{goalsize(..., abstract)}.`), deeply nested subterms within subgoal calls are replaced by variables. This can break infinite chains of calls with growing arguments, potentially allowing termination. Example: `p(f(f(f(a))))` might become `p(f(f(?Y)))` with `?Y = f(a)`.
*   **Answer Abstraction:** When enabled (via `setruntime{answersize(..., abstract)}.`), large answer terms exceeding the size limit are replaced with a representation indicating undefinedness. This guarantees termination for queries that produce infinitely many, increasingly large answers, at the cost of precision.

#### 5.2.3. Interpreting Reports

When a tripwire is hit and Terminyzer analysis runs, it may report:

*   **Possibly infinite call loop:** Identifies a set of subgoals and the rules/locations involved that indicate a potential recursive loop with growing arguments.
*   **Possibly infinite answer-producing pattern:** Identifies subgoals where answers generated by one rule feed into another rule, potentially generating infinitely many answers.
*   **No loops found:** Terminyzer may not find issues within the current analysis time/depth. The user can choose to continue the query and let Terminyzer analyze a larger trace later.

### 5.3. Runtime Inspection During Pauses

When execution is paused (via Ctrl-C, Studio Pause button, or a tripwire), specific informational queries can be issued. Regular queries or updates are generally disallowed.

*   **`showgoals{}` / `showgoals{CallCutoff, AnswerCutoff}`:** Displays information about currently incomplete (active) tabled subgoals. Shows the number of answers found so far and the number of calls made to each subgoal. Useful for identifying subgoals consuming excessive resources or involved in loops. The two-argument version filters goals based on call/answer counts.
*   **`peek{Goal}`:** Allows inspecting the answers computed *so far* for a tabled `Goal` without resuming or altering the computation state. Useful for seeing partial results during long computations.

### 5.4. Post-Execution Analysis

After a query completes, these tools help analyze performance:

*   **`showtables{}` / `showtables{CallCutoff, AnswerCutoff}`:** Similar to `showgoals`, but operates *after* the query finishes. It displays information (call/answer counts) for *all* tabled subgoals involved in the computation, not just incomplete ones. Useful for identifying performance bottlenecks (goals with unexpectedly high call or answer counts).

### 5.5. Forest Logging (Tracing Tabled Calls)

Forest logging provides a fast, structured way to trace the execution of *tabled* calls, preserving the call tree structure.

*   **Enabling/Disabling:**
    *   `?- \logforest.` (logs to console)
    *   `?- \logforest(FileName).` (logs Ergo facts to `FileName`)
    *   `?- \logforest(FileName, XsbLogFile).` (logs Ergo facts and raw XSB log)
    *   `?- \logforest(HideOptions).` / `?- \logforest(File, HideOptions).` (skips logging specified event types)
    *   `?- \nologforest.` (stops logging and flushes buffer)
*   **Log Format:** Creates facts like `call(Id)[goal->S1, stage->..., parent->S2].`, `answer(Id)[goal->S, answer->A].`, `completed(Id)[goal->S, ...]`, etc., capturing the key events in tabled evaluation. *(Note: Verify exact fact structure in the User Manual).*
*   **Low-level Logging:** `\logforestlow(...)` provides access to the raw XSB forest log format.

### 5.6. Checking Undefinedness

Ergo can check for calls to undefined predicates or methods at runtime.

*   **Enabling/Disabling:**
    *   `?- Method[mustDefine(on|off)]@\sys.` (global)
    *   `?- Method[mustDefine(on(?Module)|off(?Module))]@\sys.` (per module)
*   **Querying Status:**
    *   `?- Method[mustDefine(?Flag)]@\sys.` (global status)
    *   `?- Method[mustDefine(?Flag(?Module))]@\sys.` (status for a module)
*   **Exempting Predicates:**
    *   `?- Method[mustDefine(off, PredSpec)]@\sys.` (e.g., `PredSpec = ?(?)@foo`)
*   **Behavior:** If enabled, calls to undefined predicates/methods cause a runtime error (`ERGO_UNDEFINED_EXCEPTION`), which can be caught using `catch`.

### 5.7. Type Checking (`check` method in `\typecheck`)

The `@\typecheck` (or `@\tpck`) module provides explicit runtime type checking based on signature declarations (`=>`).

*   **Usage:**
    ```ergo
    ?- Type[check(?Specification, ?Result)]@\typecheck.
    ```
*   **`?Specification`:** A frame representing the check to perform:
    *   `?[?Meth->?]@?Mod`: Checks object methods against signatures in `?Mod`. Flags missing types.
    *   `?[?Meth=>?]@?Mod`: Checks object methods. Ignores missing types.
    *   `?[|?Meth->?|]@?Mod`: Checks class default methods for consistency between `->` and `=>`. Flags missing types.
    *   `?[|?Meth=>?|]@?Mod`: Checks class default methods for consistency. Ignores missing types.
    *   *(Note: Verify exact patterns and behavior in User Manual Section 47.2).*
*   **`?Result`:** Bound to evidence of type violations if the query succeeds. Fails if no violations are found.

### 5.8. Cardinality Checking (`check` method in `\typecheck`)

Checks if the number of values for a method complies with cardinality constraints specified in signatures (`Meth{L..H}=>Type`).

*   **Usage:** Uses the same `check` method as type checking, but the `?Specification` frame includes cardinality information.
    ```ergo
    // Check object method cardinality
    ?- Cardinality[check(?Obj[?Meth{?Lo..?Hi}=>?])]@\typecheck.
    // Check class default cardinality
    ?- Cardinality[check(?Class[|?Meth{?Lo..?Hi}=>?|]@?Mod)]@\typecheck.
    ```
    *(Note: Verify exact patterns and behavior in User Manual Section 47.3).*
*   **Output:** If a violation occurs, the query succeeds, binding `?Obj`/`?Class`, `?Meth`, and `?LoBound`/`?HiBound` (bound to the violated bound, or `ok` if not violated).

### 5.9. Exception Handling

Ergo supports explicit exception handling using `catch` and `throw`.

*   **Catching:**
    ```ergo
    catch{Goal, ErrorPattern, Handler}
    ```
    Executes `Goal`. If `Goal` throws an exception that unifies with `ErrorPattern`, execution of `Goal` stops, and `Handler` is executed. If `Goal` succeeds or throws a non-matching exception, `Handler` is ignored.
*   **Throwing:**
    ```ergo
    throw{ErrorTerm}
    ```
    Throws `ErrorTerm` as an exception. `ErrorTerm` must be a HiLog or Prolog term.
*   **System Exceptions:**
    *   `ERGO_UNDEFINED_EXCEPTION(?Call, ?ErrorMessage)`: Thrown by `mustDefine` checks.
    *   `ERGO_ABORT(?Message, ?_)` or `ERGO_ABORT`: Thrown by `abort@\sys`.
    *   Prolog exceptions (e.g., `error(type_error(...), ...)`): Ergo attempts to intercept and contextualize these.

```ergo
// Example catching a user-defined error
?- catch{ (X=0, throw(myError(zeroValue, X)) ; process(X)),
          myError(Reason, Val),
          handle_error(Reason, Val)
       }.
```

### 5.10. Reporting Bugs

*   **Distinguish Ergo vs. XSB:** Memory violations are likely XSB bugs. Incorrect results or compiler/runtime errors for valid Ergo code are likely Ergo bugs.
*   **Simplify:** Reduce the knowledge base to the smallest possible example that reproduces the bug. Consolidate modules if possible.
*   **Use `dump{}`:** For suspected XSB bugs triggered by Ergo, use `dump{module}` or `dump{file}` to generate a more readable Prolog version of the compiled code.
    ```ergo
    ?- dump{mymodule}. // Creates mymodule_dump.P
    ```
*   **Isolate from Ergo Libraries:** Try to remove calls to Ergo system modules (`@\io`, `@\sys`, etc.) and Prolog library calls (`?- flora_load_library(...)`) from the dumped code, if possible, while still reproducing the bug.
*   **Provide Context:** When reporting, include the simplified code, steps to reproduce, Ergo/XSB versions, and OS details. Use the Studio's `Help > Send Bug Report` feature if applicable.

### 5.11. Dumping Tabled Data

For deep debugging or analysis, ErgoAI allows dumping the contents of XSB's tables to a file.

*   `\tabledump(FileName, AtomicGoal)`: Dumps summary information about tables for subgoals matching `AtomicGoal` to `FileName`. If `AtomicGoal` is a variable (e.g., `?`), dumps info for all tables.
*   `\tabledump(FileName, AtomicGoal, Option)`: Dumps table information with different levels of detail specified by `Option`:
    *   `summary` (Default): Minimal output, overall statistics.
    *   `subgoals`: Includes details about individual subgoals subsumed by `AtomicGoal`.
    *   `answers`: Full details, including all computed answers for each subgoal. **Warning:** This can generate extremely large files for complex queries.

```ergo
// Dump summary for all tables to 'summary.log'
?- \tabledump('summary.log', ?).

// Dump full answers for p(2,?) to 'p2_details.log'
?- \tabledump('p2_details.log', p(2,?), answers).
```
The output is in Ergo syntax (frames) and can be loaded and queried for analysis.

### 5.12. Dumping Incomplete Tables (After Exception)

If a query terminates due to an error or is aborted, especially if non-termination or tabling issues are suspected, it can be useful to inspect the tables that were still being computed.

1.  **Enable Dumping on Exception:** Execute the following command *before* running the problematic query:
    `?- \set_dump_incomplete_tables_on_exception.`
2.  **Run the Query:** Execute the query that causes the error/abort.
3.  **Dump the Tables:** After the error occurs, execute:
    `?- \dump_incomplete_tables_after_exception(FileName).`
    This writes the state of the incomplete tables at the time of the exception to `FileName`. The format includes information about the strongly connected components (SCCs) being evaluated.

### 5.13. Runtime Configuration (`setruntime`)

The `setruntime{...}` primitive allows fine-grained control over various runtime behaviors, particularly related to resource limits, tabling, and non-termination handling. Multiple options can be set in one call.

*   **Timeout Control:** (See Manual Sec 47.11.1)
    *   `timeout(Spec)` / `timeout(Spec, Spec)` / `timeout(0)`: Sets or removes maximum execution time limits and periodic interrupts. `Spec` is `max(Time, Handler)` or `repeating(Time, Handler)`. `Handler` can be `fail`, `abort`, `pause`, or a predicate.
*   **Subgoal Size Control:** (See Manual Sec 47.11.2)
    *   `goalsize(TermSize, Action)`: Limits the maximum size (nesting depth/arity) of terms allowed in subgoals. `Action` is `abort`, `abstract` (replaces deep terms with variables), or `pause`.
*   **Answer Size Control:** (See Manual Sec 47.11.3)
    *   `answersize(TermSize, Action)`: Limits the maximum size of answer terms returned from tables. `Action` is `abort`, `abstract` (returns `\undefined` for oversized answers), or `pause`.
*   **Active Goals Control:** (See Manual Sec 47.11.4)
    *   `activegoals(Limit, Action)`: Limits the number of concurrently active (incomplete) tabled subgoals. `Action` is `abort` or `pause`.
*   **Memory Usage Limit:** (See Manual Sec 47.11.5)
    *   `memory(LimitInGBs)` / `memory(LimitInGBs, Action)`: Sets a memory usage limit for the Ergo process. `Action` is `abort` (default) or `pause`.
*   **Unification Mode:** (See Manual Sec 47.11.6)
    *   `unification(fast | pedantic)`: Controls unification. `fast` (default) is faster but unsound (no occurs-check). `pedantic` is sound but slower.
*   **Unsafe Negation Warning:** (See Manual Sec 47.11.7)
    *   `unsafe_naf(ignore | ignoreonce)`: Suppresses warnings about potentially unsafe negation (`\naf` applied to non-ground goals) either globally (`ignore`) or for the next query only (`ignoreonce`).
*   **Strict `setof` Mode:** (See Manual Sec 47.11.8)
    *   `setof(strict | lax)`: Controls `setof` aggregate. `lax` (default) might not eliminate all duplicates involving variables or reified terms. `strict` performs full duplicate elimination but incurs overhead.

```ergo
// Example: Set 10 sec timeout, enable goal abstraction size 500
?- setruntime{timeout(max(10, abort)), goalsize(500, abstract)}.

// Example: Set pedantic unification
?- setruntime{unification(pedantic)}.
```

### 5.14. Checking Dependencies on Non-Logical Features

Tabled predicates and frames in ErgoAI are intended to represent pure logical relationships. Dependencies on non-logical operations (like I/O via `@\io` or `@\prolog`, updates via `insert`/`delete`, transactional methods `%m`, non-tabled predicates `%p`) can violate the assumptions of tabling and lead to incorrect results or unpredictable behavior, especially under reactive tabling or backtracking.

ErgoAI's compiler performs dependency checking and issues warnings if a tabled literal appears to depend (directly or transitively through rule calls) on such non-logical constructs.

*   **Warning:** `++Warning[Ergo]> tabled predicate/method depends on an update.` (or similar for I/O, non-tabled calls).
*   **Why it's problematic:**
    *   **Updates:** Backtracking during tabled evaluation might undo transactional updates unexpectedly. Non-transactional updates violate the logical semantics entirely. Reactive tabling relies on tracking base facts, which is disrupted by arbitrary updates.
    *   **I/O & Side Effects:** Tabled results should be consistent and reproducible. Calling a predicate that reads from a changing file or prints output multiple times (once during computation, subsequent times via table lookup) violates this.
*   **Suppressing Warnings (`ignore_depchk`):** In rare, well-understood cases (like specialized logging or histogram updates using *stealth* updates), the dependency might be intentional. The `:- ignore_depchk{PredicateOrMethodSpec}` compiler directive can be used to suppress warnings for specific dependencies. Use with extreme caution. (See Manual Sec 27.3).
*   **Best Practice:** Avoid such dependencies. Encapsulate side effects in non-tabled predicates (`%p`) or methods (`%m`) and call them outside the core logic that defines tabled predicates, or structure the logic so the dependency is removed.

### 5.15. Debugging ErgoText Templates

When an ErgoText phrase (`\(...\)`) fails to match an intended template definition, leading to a "no matching template" error, it can be difficult to diagnose the cause, especially due to Ergo's operator precedence affecting how the phrase and template are parsed. The `@prolog(flrparser)` module provides tools to inspect the parsed form.

*   `show_ergotext_phrase_as_term(ErgoTextPhrase)@prolog(flrparser)`: Shows how Ergo parses the given `ErgoTextPhrase`. The phrase should be enclosed in `\(...\)`. Compare this output to the parsed form of the template definition phrase (using the same primitive) to identify discrepancies.
*   `ergo_show_active_templates@prolog(flrparser)`: Lists all ErgoText templates currently active in the environment (loaded via `:- ergotext` or `?- ergotext`). Shows their context, parsed phrase, and translation.
*   `ergo_show_matching_templates(ErgoTextPhrase, TemplateFile)@prolog(flrparser)`: Shows which templates defined in `TemplateFile.ergotxt` match the given parsed `ErgoTextPhrase`.
*   `ergo_show_active_matching_templates(ErgoTextPhrase, Module)@prolog(flrparser)`: Shows which *active* templates (in the specified `Module`) match the given `ErgoTextPhrase`.

```ergo
// Template definition:
// template(body, \(Is ?X true?\), ?X).

// Query causing 'no match' error:
?- \(Is p:q true?\).

// Debugging:
?- show_ergotext_phrase_as_term(\(Is p:q true?\))@prolog(flrparser).
// Output might be: [Is, p : (q, (true, ?))]  <- Parsed structure

?- show_ergotext_phrase_as_term(\(Is ?X true?\))@prolog(flrparser).
// Output might be: [Is, ?X, true, ?]        <- Template structure (different!)

// Corrected Phrase (forcing parse structure with commas):
?- show_ergotext_phrase_as_term(\(Is, p:q, true?\))@prolog(flrparser).
// Output might be: [Is, p : q, true, ?]      <- Now might match template better (depends on template var types)
```

### 5.16. Debugging Defeasible Reasoning

When using defeasible reasoning (Section 41), understanding *why* a particular conclusion was derived or, more often, *defeated* is crucial. The `@\why` module provides status methods associated with rules (identified by Tag/Head pairs) to introspect the outcome.

*   `status(?Tag, ?Head)[howDefeated -> ?Reason]`@\why: If the rule instance(s) identified by `?Tag` and ground `?Head` were defeated, binds `?Reason` to the cause. Fails if the rule was not defeated. `?Reason` can be:
    *   `refutedBy(RuleTag, RuleHead)`: Defeated by a higher-priority conflicting rule.
    *   `rebuttedBy(RuleTag, RuleHead)`: Defeated by a conflicting rule of equal or unknown priority.
    *   `disqualified`: Defeated due to cancellation, strict override, or cyclic defeat (depending on the argumentation theory). Use `howDisqualified` for details.
*   `status(?Tag, ?Head)[howDisqualified -> ?DInfo]`@\why: If the rule was disqualified, provides details. `?DInfo` can be:
    *   `canceled`: If the rule was explicitly canceled via `\cancel`.
    *   `beatenByStrictRule(?StrictHead)`: If opposed by a strict rule instance with head `?StrictHead`.
    *   `defeatCycle(?Defeater, ?Defeated)`: (In cautious theories) Indicates participation in a defeat cycle. `?Defeater` and `?Defeated` are tag/head pairs where `?T/?H` defeats `?Defeated`, and `?Defeater` defeats `?T/?H`. Following these pairs reveals the cycle.
*   `status(?Tag, ?Head)[info -> ?Info]`@\why: Provides a list of terms describing the rule's status, including:
    *   `candidate`: If the rule's body was true (a candidate for firing).
    *   `conflictsWith(?Head)`: Lists heads of conflicting candidate rules.
    *   `competes(?Exclusion, ?Head)`: (In theories with exclusion) Lists heads involved in the same exclusion constraint.
    *   `refutes(?Head)` / `rebuts(?Head)`: Lists heads of rules refuted/rebutted *by* this rule.

```ergo
// Example: Why was the default rule for birds flying defeated for Sam?
?- status(default, sam:flies)[howDefeated -> ?Reason]@\why.
// ?Reason = refutedBy(penguin, \neg sam:flies) (assuming appropriate overrides)

// Example: Check if rule 'r1' with head p(a) was disqualified by cancellation
?- status(r1, p(a))[howDisqualified -> canceled]@\why.
```
**Note:** The exact terms returned by `howDefeated` and `howDisqualified` may vary slightly depending on the active argumentation theory (e.g., `gcl`, `ogcl`, `gcle`).

### 5.17. Checking Truth Values (`true`, `false`, `undefined`, `truthvalue`)

Due to the three-valued nature of the Well-Founded Semantics used by `\naf`, simply succeeding in a query doesn't guarantee the result is logically `\true` (it could be `\undefined`). Ergo provides primitives to explicitly check the specific truth value.

*   `true{ Goal }`: Succeeds if and only if `Goal` succeeds with a truth value of `\true`. Fails if `Goal` fails or succeeds with value `\undefined`.
*   `false{ Goal }`: Succeeds if and only if `Goal` fails (has truth value `\false`). Equivalent to `\naf Goal`.
*   `undefined{ Goal }`: Succeeds if and only if `Goal` succeeds with a truth value of `\undefined`. Fails if `Goal` fails or succeeds with value `\true`.
*   `truthvalue{ ?TruthVal }`: This primitive is placed *after* a goal in a query or rule body. If the preceding goal succeeded, `?TruthVal` is bound to the atom representing its truth value (`\true` or `\undefined`). If the preceding goal failed, `truthvalue{...}` also fails.

**Usage Restrictions:**
*   `true{...}`, `undefined{...}`, and `truthvalue{...}` can generally only be used in top-level queries or in rules whose heads are *not* mutually recursive with `Goal`. Using them within complex recursive structures can lead to undefined results.
*   `false{...}` (or `\naf Goal`) can typically be used anywhere.

```ergo
p(a). // True
p(b) :- \naf p(b). // Undefined
// p(c) is False

?- true{p(a)}.      // Succeeds
?- true{p(b)}.      // Fails
?- true{p(c)}.      // Fails

?- undefined{p(a)}.  // Fails
?- undefined{p(b)}.  // Succeeds
?- undefined{p(c)}.  // Fails

?- false{p(a)}.      // Fails
?- false{p(b)}.      // Fails
?- false{p(c)}.      // Succeeds

?- p(?X), truthvalue{?TV}.
// Output: ?X = a, ?TV = \true ;
// Output: ?X = b, ?TV = \undefined
```

## 6. Performance and Programming Style

This section provides guidelines and discusses common practices related to writing efficient, maintainable, and correct ErgoAI knowledge bases, based on the system's evaluation strategy and features.

*Note: Performance characteristics can be complex and depend on specific knowledge base structure, data, and hardware. The guidelines here are general; consult the official ErgoAI Reasoner User's Manual for more detailed performance analysis techniques and options.*

### 6.1. Performance Considerations

While ErgoAI incorporates optimizations, understanding its evaluation model can significantly improve query performance.

*   **Goal Ordering:** ErgoAI evaluates rule bodies and query subgoals from **left-to-right**. Therefore, it is generally advisable to place more *selective* subgoals (those with smaller answer sets or those that bind variables used later) earlier in a conjunction. Avoid Cartesian products where possible by ensuring variables are bound before they are used in subsequent joins.
*   **Nesting (Frames and Path Expressions):** Nested frames (e.g., `?X[attr1->?Y[attr2->?Z]]`) and path expressions (e.g., `?X.attr1.attr2`) imply a left-to-right data flow for binding variables. While concise, if an inner part (e.g., `?Y[attr2->?Z]`) is more selective or has fewer solutions than an outer part (`?X[attr1->?Y]`), it might be more efficient to *unnest* the literals and order them explicitly in the rule body based on selectivity.
*   **Open vs. Bound Calls:** Queries where variables are already bound before a subgoal call (`bound call`) are generally much faster than queries where variables are unbound (`open call`), especially if the predicate is indexed on the corresponding argument position. Consider rule structure and goal ordering to maximize the use of bound calls where appropriate.
*   **Indexing:** ErgoAI automatically uses efficient trie-based indexing for facts. For tabled rules, indexing is typically only on the predicate name. The `:- index{Arity-Argument}.` directive can be used to force indexing on specific argument positions for tabled HiLog predicates, potentially speeding up queries with bindings for those arguments. This is less useful for fact-heavy predicates due to the default trie indexing. *(Note: Verify exact syntax and applicability in User Manual Section 49.2).*
    ```ergo
    // Example: Index predicate mypred/3 on its 2nd argument
    :- index{3-2}.
    ```
*   **Tabling Modes:**
    *   `reactive` tabling (default) provides correctness in the presence of updates but incurs overhead.
    *   `passive` tabling is computationally cheaper but may return stale answers after updates. Use `refresh{...}` to manually invalidate stale tables if needed. Consider passive tabling for modules with infrequent or no updates. (See Section 4.5.2).
*   **Updates:** Transactional updates (`t_insert`, `t_delete`, etc.) are generally slower than non-transactional ones (`insert`, `delete`, etc.) due to the overhead of managing transaction state for potential rollbacks. Use non-transactional updates when logical atomicity is not required or when an operation is known never to fail. Avoid dependencies of tabled predicates on updates (see Section 4.5.4).
*   **Aggregates:** Aggregates can be computationally intensive. Ensure the query part within the aggregate is as efficient as possible.
*   **Equality Maintenance:** Using `equality=basic` incurs significant performance overhead due to congruence checks. Use it only when necessary and preferably in localized modules. Avoid using `:=:` purely for aliasing; use preprocessor `#define` instead (See Section 4.4.1).
*   **Data Types:** Abstract symbols (`atom`) are generally more efficient (memory, compilation, runtime) than character lists (`\charlist`). Use charlists primarily when parsing the content of the string is necessary *(Note: Verify details in User Manual Section 42.14)*.
*   **Fast Loading:** For very large datasets consisting only of simple Prolog-style facts (no operators, no HiLog terms), use the `fastload{...}` primitive for significantly faster loading compared to standard `load{...}` or `add{...}`. Querying requires the `fastquery{...}` primitive. *(Note: Verify details in User Manual Section 16.16).*
    ```ergo
    // Example: Load data from file.P into storage 'mydata'
    ?- fastload{'path/to/file.P', mydata}.
    // Example: Query the storage container
    ?- fastquery{mydata, some_predicate(?X, ?Y)}.
    ```

### 6.2. Style Guidelines and Common Pitfalls

Adhering to good style and being aware of common pitfalls can prevent errors and improve code clarity.

*   **Style:**
    *   **Variable Naming:** Use meaningful names. Use `?_` (anonymous) or `?_Name` (don't care/silent) for variables whose specific binding is not important or should not be reported, especially to avoid singleton variable warnings when a variable legitimately appears only once.
    *   **Comments:** Use `//` for single-line and `/* ... */` for multi-line comments to document code.
*   **Common Pitfalls:**
    *   **Fact Ordering:** Do not rely on the physical order of facts in a file. Ergo treats facts as an unordered set. Catch-all rules using facts (like `p(?_).` at the end of Prolog code) do not work reliably; use rules with `:- \true.` instead (e.g., `%p(?_) :- \true.`). *(Ref: User Manual Section 54.1)*.
    *   **ISA vs. Typed Variables:** Do not confuse `?X:Class` (asserts/tests membership, potentially deriving `?X`) with `?X^^Class` (a declaration restricting `?X`, checked only when `?X` is bound). Using `?X:Class` in rule heads where a type restriction is intended is a common mistake. *(Ref: User Manual Section 54.2)*.
    *   **Composite Heads:** Remember that a rule with multiple literals in the head (e.g., `a[b->c, d->e] :- body.`) is treated as multiple rules (`a[b->c] :- body.` and `a[d->e] :- body.`). This is especially important when using `deleterule` or reasoning about rule properties. *(Ref: User Manual Section 54.3)*.
    *   **Cuts (`!`):** Avoid using cuts (`!`) in rules involving tabled predicates, especially after a tabled call. Cuts can interfere with tabling completion and lead to errors or incorrect results. Use transactional predicates (`%`) or restructure logic if cuts seem necessary in tabled contexts. *(Ref: User Manual Section 24.7)*.
    *   **Negation (`\naf`, `\+`):** Understand the difference between `\naf` (well-founded semantics, preferred for tabled goals) and `\+` (Prolog negation-as-failure, faster for non-tabled/transactional goals but logically weaker). Be cautious with non-ground goals under negation; `\naf` might delay and result in `\undefined`, while `\+` performs universal quantification over free variables. *(Ref: User Manual Section 19)*. Avoid negating updates or non-logical predicates directly.
    *   **Module Scopes:** Remember that module qualifiers (`@module`) have specific scoping rules and do not automatically propagate into all term arguments unless they are reified (`${...}`). Calls to Prolog require careful use of `@\prolog`, `@\prologall`, or specific module names. *(Ref: User Manual Section 16)*.
    *   **Skolem Scopes:** Understand the difference between local (`\#`, `\#N`) and global (`\##N`) Skolems and their scope (single sentence vs. global scope section). Be aware of their different interpretation in rule heads (constants) vs. bodies (tests/variables). *(Ref: User Manual Section 13)*.
    *   **Operator Precedence:** Use parentheses `()` to clarify intent when mixing operators with different precedence levels (e.g., `,` vs. `;`, arithmetic vs. path operators). *(Ref: User Manual Section 7.3)*.
    *   **Updates in Tabled Rules:** Avoid having tabled predicates depend (directly or indirectly) on predicates that perform updates, unless using `stealth{...}` updates for specific, well-understood cases like logging. This typically leads to warnings or runtime errors. *(Ref: User Manual Sections 27.3, 27.6)*.
    *   **Descriptive Tags:** When using defeasible reasoning, employ meaningful, descriptive tags (e.g., `@{default_shipping_rule}`, `@{express_shipping_exception}`) rather than generic ones. This greatly improves readability and maintainability when defining `\overrides` relationships. *(See ErgoAI Example Bank, "Defeasible reasoning" files)*.
    *   **Prefix for Side Effects:** It is a strong convention, demonstrated in the ErgoAI Example Bank, to prefix predicates or rules that perform non-logical side effects (like I/O, database updates via `@\sql`, etc.) with `%` (e.g., `%connect_to_db`, `%print_report`). This visually distinguishes them from purely logical, potentially tabled predicates and reminds the developer that they are non-transactional by default and might behave differently under backtracking or tabling.
    *   **Fail-Loops:** For iterating through all solutions of a goal and performing an action for each, the fail-loop `(goal, action, \false) ; \true.` is a common, efficient (though procedural) pattern in Prolog and ErgoAI. The final `\true` (or `!`) prevents the overall predicate from failing. *(See ErgoAI Example Bank, e.g., "Importing tabular data" for examples)*.

### 6.3. Production vs. Development Mode

ErgoAI can be compiled and run in different modes, affecting performance and debugging capabilities.

*   **Development Mode (Default):**
    *   This is the standard mode when running ErgoAI.
    *   Includes debugging features like embedding rule Ids and source information into compiled code, which facilitates tracing and explanations.
    *   Performs additional checks, potentially leading to slower execution compared to production mode.
    *   Can be explicitly entered using `production{off}.` or by *not* using the `--devel` flag when starting `runergo`.
*   **Production Mode:**
    *   Optimized for performance. Disables the inclusion of rule Ids and other debugging information in the compiled code.
    *   Tracing and detailed explanations relying on rule Ids may be less informative or unavailable.
    *   Can be enabled by adding the compiler directive `:- compiler_options{production=on}.` to source files or by executing `?- production{on}.` in the shell before compilation/loading.
    *   The `--devel` flag for `runergo` suppresses production mode even if set via compiler options.
*   **Expert Mode:**
    *   Enabled via `:- compiler_options{expert=on}.` or `?- expert{on}.`.
    *   Allows certain advanced syntactic constructs that might be confusing or error-prone for novice users (e.g., shortcut for charlists, expanded scope for `->`/`=>`, double implications `<==>`/`<~~>`). *(Ref: User Manual Section 58)*.

Switching to production mode (`production=on`) is recommended for deploying applications to gain significant performance benefits, but should generally be done after debugging is complete.

#### 6.3.1. Syntax Enabled by Expert Mode

When expert mode is enabled (`:- compiler_options{expert=on}.` or `?- expert{on}.`), the following additional syntactic constructs become available:

*   **Charlists Shortcut:** Allows writing character lists using double quotes directly (e.g., `"abc"`) instead of the standard `"abc"^^ \charlist` syntax. **Warning:** This can be easily confused with strings (`\string`) or symbols (`\symbol`) by novice users and is generally discouraged unless significant parsing work is involved.
*   **Expanded Scope for `->` and `=>`:** Allows using the frame operators `->` and `=>` as general infix operators outside of frame syntax (`[...]` or `[|...|]`). This might be used, for example, to simulate named arguments in predicates like `p(arg1->val1, arg2=>type2)`, but this usage is non-standard.
*   **Double Implications (`<==>` and `<~~>`):** Enables the use of the logical equivalence operators `<==>` (based on `\neg`) and `<~~>` (based on `\naf`) in rule bodies. These are disabled by default to prevent users from mistakenly using equivalence ("iff") when only implication ("if") is intended.

**Note:** Expert mode should only be used by experienced developers who understand the implications and potential ambiguities of these constructs.

## 7. System Modules and Built-in API Reference

ErgoAI provides several pre-loaded system modules offering essential functionalities. These modules are accessed using the `@\moduleName` syntax (e.g., `@\io`).

*Note: This section provides an overview of common system modules and their key functionalities based on the information in this Guide. For the definitive list of all modules, methods, exact signatures, parameter details, return values, specific behaviors, and error conditions, always consult the official **ErgoAI Reasoner User's Manual, Section 50** and its subsections.*

### 7.1. Module `\io`

*   **Purpose:** Provides Input/Output operations, including file and stream handling.
*   **Key Predicates/Methods:**
    *   **Default Stream I/O:** (Operates on implicit current input/output streams)
        *   `see(?Filename)` / `?Filename[see]`: Sets the current default input stream.
        *   `seen`: Closes the current default input stream.
        *   `seeing(?Stream)`: Gets the current default input stream.
        *   `tell(?Filename)` / `?Filename[tell]`: Sets the current default output stream.
        *   `told`: Closes the current default output stream.
        *   `telling(?Stream)`: Gets the current default output stream.
        *   `write(?Obj)`, `writeln(?Obj)`: Writes to the current default output stream.
        *   `write(?Obj, ?Options)`, `writeln(?Obj, ?Options)`: Writes with options (`oid`, `goal`).
        *   `read(?Term)`: Reads a Prolog term (ending with '.') from the current default input.
        *   `readline(?Type)`: Reads a line into `?String` (Type `atom` or `charlist`).
        *   `nl`: Writes a newline character.
        *   `fmt_write(?Format, ?Term)`, `fmt_write(?Format, ?Term, ?Options)`: C-style formatted output.
        *   `write_canonical(?Term)`: Writes term in canonical Prolog form.
    *   **Stream-based I/O:** (Operates on explicitly named streams)
        *   `?Filename[open(?OpMode, ?Stream)]`: Opens a file/URL, binds `?Stream`. `OpMode`: `read`, `write`, `append`, `write_binary`, `append_binary`.
        *   `?Stream[close]`: Closes the specified stream.
        *   `?Stream[prolog_read -> ?Result]`: Reads a Prolog term from `?Stream`.
        *   `?Stream[ergo_read -> ?Term]`: Reads an Ergo term (HiLog, reified) from `?Stream`.
        *   `?Stream[read_canonical -> ?Term]`: Reads a canonical Prolog term from `?Stream`.
        *   `?Stream[readline(?Type) -> ?String]`: Reads a line from `?Stream`.
        *   `?Stream[write(?Obj)]`, `?Stream[writeln(?Obj)]`: Writes to `?Stream`.
        *   `?Stream[fmt_write(?Format, ?O)]`, `?Stream[fmt_write(?Format, ?O, ?Options)]`: Formatted write to `?Stream`.
        *   `?Stream[write_canonical(?Term)]`: Writes canonical term to `?Stream`.
    *   **File Class Methods:** (Operate on the `File` object itself)
        *   `File[exists(?F)]`, `File[isdir(?F)]`, `File[isplain(?F)]`, `File[readable(?F)]`, `File[writable(?F)]`, `File[executable(?F)]`, `File[isabsolute(?F)]`: File status checks.
        *   `File[modtime(?F)->?T]`: Gets last modification time.
        *   `File[mkdir(?Dir)]`, `File[rmdir(?Dir)]`: Directory manipulation.
        *   `File[chdir(?Dir)]`: Changes current working directory for Ergo.
        *   `File[cwd->?Dir]`: Gets current working directory.
        *   `File[link(?F,?Dest)]`, `File[unlink(?F)]`, `File[remove(?F)]`: File/link manipulation.
        *   `File[tmpfilename(?F)]`: Gets a temporary filename.
        *   `File[rename(?F,?To)]`: Renames a file.
        *   `File[basename(?F) -> ?Base]`: Extracts filename from path.
        *   `File[extension(?F) -> ?Ext]`: Extracts file extension.
        *   `File[dirname(?F) -> ?Dir]`: Extracts directory path.
        *   `File[expand(?F) -> ?Expanded]`: Expands relative path to absolute.
        *   `File[newerthan(?F,?F2)]`: Compares file modification times.
        *   `File[copy(?F,?To)]`: Copies file content.

### 7.2. Module `\sys`

*   **Purpose:** System interaction, controlling runtime behavior, accessing system information.
*   **Key Predicates/Methods:**
    *   `abort(?Message)`: Aborts current execution, prints `?Message`.
    *   `warning(?Message)`: Prints `?Message` as a warning, continues execution.
    *   `message(?Message)`: Prints `?Message` without the "warning" header.
    *   `Method[mustDefine(?Mode)]`: Controls runtime checks for undefined predicates/methods (globally or per-module). `?Mode` can be `on`, `off`, `on(Module)`, `off(Module)`, or `off(PredSpec)`. (See Section 5.6).
    *   `System[type->?Info]`: Returns OS/architecture information (e.g., `unix/linux/64`).
    *   `Libpath[add(?Path)]`, `Libpath[remove(?Path)]`, `Libpath[removeall(?Path)]`, `Libpath[query(?Path)]`: Manage the library search path.
    *   `Tables[abolish]`: Discards all tabled data in Prolog.

### 7.3. Module `\basetype`

*   **Purpose:** Provides common methods applicable to Ergo's primitive data types.
*   **Key Predicates/Methods (General):**
    *   `?DataValue[toSymbol -> ?Symbol]`: Converts data type constant to its printable Prolog atom representation.
    *   `\DataType[toType(Args...) => \DataType]`: Constructs a data type value from components.
    *   `\DataType[toType(\symbol) => \DataType]`: Constructs a data type value from its string/symbol representation.
    *   `\DataType[=> isTypeOf(\object)]`: Checks if an object belongs to the primitive type `\DataType`.
    *   `?DataValue[=> equals(\object)]`, `?DataValue[=> lessThan(\object)]`, `?DataValue[=> lessEq(\object)]`: Comparison methods.
    *   `?DataValue[typeName => \symbol]`: Returns the type name.
    *   `?DataValue[rawValue => UnderlyingValue]`: Extracts the core value.
*   **Key Predicates/Methods (`\symbol` specific):**
    *   Includes methods for number conversion (`toNumber`), concatenation (`concat`), substring operations (`contains`, `startsWith`, `endsWith`, `subsymbol`), case conversion (`toUpper`, `toLower`), length (`length`), list conversion (`toList`), etc.
*   **Type-Specific Component Methods:** Specific data types like `\dateTime`, `\date`, `\time`, `\duration`, `\iri`, etc., have additional methods to access their unique components (e.g., `?dt[year -> ?Y]`, `?iri[host -> ?H]`). See Section 42 of the User Manual for details on each primitive type.

### 7.4. Module `\typecheck`

*   **Purpose:** Provides methods for explicit runtime checking of type and cardinality constraints defined in signatures. (Synonym: `@\tpck`).
*   **Key Predicates/Methods:**
    *   `Type[check(?Specification, ?Result)]@\typecheck`: Performs type checking. `?Specification` is a frame pattern (e.g., `?[?M->?]@?Mod`, `?[|?M=>?|]@?Mod`). `?Result` binds to evidence of violations. *(Ref: User Manual Section 47.2)*.
    *   `Cardinality[check(?Specification)]@\typecheck`: Performs cardinality checking. `?Specification` is a signature frame with cardinality (e.g., `?O[?M{?L..?H}=>?]`). Succeeds if violations are found, binding variables in the specification. *(Ref: User Manual Section 47.3)*.

### 7.5. Module `\set`

*   **Purpose:** Provides data structures and operations for sets, maps (key -> single value), and multi-valued maps (key -> set of values).
*   **Key Predicates/Methods (Common):**
    *   `?SetMap[exists]@\set`: Checks if the set/map exists.
    *   `?SetMap[empty]@\set`: Checks if the set/map is empty.
    *   `?SetMap[destroy]@\set`: Destroys the set/map.
    *   `?SetMap[union(?SetMap2)->?SetMap3]@\set` (or `?SetMap3 \is ?SetMap++?SetMap2`): Set/map union.
    *   `?SetMap[minus(?SetMap2)->?SetMap3]@\set` (or `?SetMap3 \is ?SetMap--?SetMap2`): Set/map difference.
    *   `?SetMap[intersect(?SetMap2)->?SetMap3]@\set` (or `?SetMap3 \is ?SetMap&&?SetMap2`): Set/map intersection.
    *   `?SetMap[subset(?SetMap2)]@\set` (or `?SetMap \subset ?SetMap2`): Subset/submap check.
    *   `?SetMap[equal(?SetMap2)]@\set`: Equality check.
    *   `?SetMap[copy->?SetMap2]@\set`: Creates a copy.
    *   `?SetMap[tolist->?List]@\set`: Converts content to a sorted list.
    *   `?SetMap[type->?Type]@\set`: Returns type (`set`, `map`, or `mvm`).
*   **Key Predicates/Methods (Set specific):**
    *   `?Set[insert(?Element)]@\set`: Inserts element(s).
    *   `?Set[delete(?Element)]@\set`: Deletes matching element(s).
    *   `?Set[member->?Element]@\set` (or `?Element \in ?Set`): Membership test/generator.
*   **Key Predicates/Methods (Map specific):**
    *   `?Map[mapinsert(?Key=?Value)]@\set`: Inserts key-value pair (fails if key exists with different value).
    *   `?Map[mapreplace(?Key=?Value)]@\set`: Inserts/replaces key-value pair.
    *   `?Map[mapdelete(?Key)]@\set`: Deletes entry for `?Key` (fails if key doesn't exist).
    *   `?Map[maperase(?Key)]@\set`: Deletes entry for `?Key` (succeeds always).
    *   `?Map[mapfind(?Key)->?Value]@\set`: Retrieves value for `?Key`.
*   **Key Predicates/Methods (MV-Map specific):**
    *   `?MV[mvminsert(?Key=?Value)]@\set`: Inserts key-value pair (allows multiple values per key).
    *   `?MV[mvmdelete(?Key=?Value)]@\set`: Deletes a specific value associated with `?Key`.
    *   `?MV[mvmerase(?Key)]@\set`: Deletes all values associated with `?Key`.
    *   `?MV[mvmfind(?Key)->?Value]@\set`: Retrieves values associated with `?Key` via backtracking.

### 7.6. Module `\parse`

*   **Purpose:** Reading and compiling Ergo terms from input streams or files.
*   **Key Predicates/Methods:**
    *   `read(?Code, ?Stat)@\parse`: Reads one term (ending with '.') from standard input, compiles it, binds to `?Code`. `?Stat` indicates status.
    *   `read(?Module)(?Code, ?Stat)@\parse`: Like `read/2`, but builds reified terms for the specified `?Module`.
    *   `?Stream[read(?Code, ?Stat)]@\parse`: Reads one term from `?Stream`.
    *   `?Stream[read(?Module)(?Code, ?Stat)]@\parse`: Reads one term from `?Stream` for `?Module`.
    *   `readAll(?Code, ?Stat)@\parse`: Reads terms interactively (one-at-a-time mode) or all terms (all-answers mode) from standard input.
    *   `?Source[readAll(?CodeList)]@\parse`: Reads all terms from `?Source` (`file(F)` or `string(S)`) into `?CodeList`.
    *   `?Source[readAll(?Module)(?CodeList)]@\parse`: Reads all terms from `?Source` for `?Module`.

### 7.7. Module `\show`

*   **Purpose:** Generating printable string representations of Ergo terms and goals.
*   **Key Predicates/Methods:**
    *   `?Term[show -> ?Result]@\show`: Binds `?Result` to the standard printable atom representation of `?Term`. Equivalent to `?Term[show(oid) -> ?Result]@\show`.
    *   `?Term[show(oid|goal) -> ?Result]@\show`: Converts `?Term` to string. `oid` (default) shows reified terms as objects (`${...}`). `goal` shows reified terms as goals (without `${...}`).
    *   `?List[splice(?Separator) -> ?Result]@\show`: Concatenates the string representations of elements in `?List`, inserting `?Separator` atom between elements.

### 7.8. Module `\why`

*   **Purpose:** Provides the API for generating explanations for query results.
*   **Key Predicates/Methods:**
    *   `?Goal[why(full) -> ?Explanation]@\why`: Generates a full explanation structure for why the reified `?Goal` is true, false, undefined, or contradictory.
    *   `?Goal[why(full, withtext) -> ?Explanation]@\why`: Similar to `why(full)`, but includes textual representations (from ErgoText/TextIt) in the explanation structure.
    *   `?Goal[why(full, textonly) -> ?Explanation]@\why`: Returns only the textual components of the explanation.
    *   `?Goal[why(full, raw) -> ?Explanation]@\why`: Returns a lower-level explanation structure using support objects.
    *   `?Explanation[size -> ?Number]@\why`: Calculates the size of a full explanation structure.
    *   **(Step-by-step API):** Includes methods like `?Goal[why -> ?SupportObject]`, `?SupportObject[support -> ?ChildSupportObject]`, `?SupportObject[isleaf]`, `?SupportObject[goal -> ?Goal]`, `?SupportObject[text -> ?GoalText]`, `?SupportObject[rule -> ruleid(...)]`, `?SupportObject[info -> TruthValue(...)]` for navigating the explanation tree manually. *(Ref: User Manual Section 52.2)*.

### 7.9. Module `\db` (or `\storage`)

*   **Purpose:** Provides primitives for controlling transactional updates and managing the underlying storage (tries) for facts.
*   **Key Predicates/Methods:**
    *   `commit`: Commits all changes made by *transactional* updates (`t_insert`, `t_delete`, etc.) in the current transaction scope for *all* user modules. After a `commit`, these changes will persist even if subsequent operations in the same rule/query fail and cause backtracking. Non-transactional updates are unaffected.
    *   `commit(?Module)`: Commits transactional changes made *only* to the specified user `?Module`. Changes in other modules remain uncommitted and subject to rollback.
    *   `purgedb(?Module)`: Deletes *all* base facts (both those loaded from files and those inserted dynamically) from the storage associated with the user `?Module`. This is a drastic, non-transactional operation. Use with caution.

```ergo
?- t_insert{p(1)}, commit, \false. // p(1) is inserted and committed before \false
?- p(1). // Succeeds

?- t_insert{q(2)@mod1}, t_insert{r(3)@mod2}, commit(mod1), \false.
?- q(2)@mod1. // Succeeds (mod1 was committed)
?- r(3)@mod2. // Fails (mod2 changes were rolled back)

?- insert{s(4)@data}, purgedb(data).
?- s(4)@data. // Fails
```

### 7.10. Other System Modules

Details on modules for specific integrations can be found in Section 3:

*   `@\sql`: SQL Database Connectivity (Section 3.4)
*   `@\sparql`: SPARQL Endpoint Connectivity (Section 3.5)
*   `@\owl`: RDF/OWL Integration (Section 3.6)
*   `@\json`: JSON Integration (Section 3.7)
*   `@dsv`: Tabular Data (CSV/DSV/TSV) Integration (Section 3.8)
*   `@\http`: HTTP and Web Services (Section 3.9)
*   `@pm`: Persistent Modules (Section 3.10)
*   `@mzn`: Constraint Solving (MiniZinc) (Section 3.11)
*   `@ergo_ep`: Evidential Probabilistic Reasoning (Section 3.12)
*   `@\e2j`: Ergo-to-Java Interface (Section 3.1)

### 7.11. Useful XSB Predicates

Many standard and library predicates from the underlying XSB Prolog system can be called from Ergo using the `@\prolog` or `@\prologall` module specifiers. Consult the XSB Manuals (Volume 1 and 2) for a complete list. Some potentially useful categories include:

*   **Term Manipulation:** `functor/3`, `arg/3`, `=../2`.
*   **List Processing:** `member/2`, `append/3`, `sort/2`, `length/2`.
*   **Meta-calls:** `call/1`, `findall/3`.
*   **File System:** (Many covered by `@\io`, but others like `file_exists/1` might exist).
*   **Time/Date:** (Many covered by `@\basetype`, but epoch time predicates exist).
*   **Hashing/Crypto:** `term_hash/3`, `crypto_hash/3`.

```ergo
// Example: Using XSB's functor/3
?- functor(f(a,b), ?F, ?A)@\prolog.
// ?F = f, ?A = 2
```

#### 7.11.1 Notable XSB Predicates

While ErgoAI provides high-level abstractions for many common tasks, sometimes direct access to the underlying XSB Prolog predicates (via `@\prolog` or `@\prologall`) is necessary or convenient. Consult the XSB Manuals for full details. Some potentially useful predicates include:

*   **Term Manipulation:**
    *   `functor(Term, Functor, Arity)`: Decomposes/constructs a term.
    *   `arg(N, Term, ArgN)`: Accesses the Nth argument of a term.
    *   `Term =.. List`: Converts between a term and its list representation `[Functor|Args]`. (Ergo's `=..` has different behavior, see Section 8.1.2).
*   **List Processing:**
    *   `member(Element, List)`: Checks/generates list membership.
    *   `append(List1, List2, List3)`: Appends/splits lists.
    *   `sort(ListIn, ListOut)`: Sorts a list, removing duplicates.
    *   `length(List, Length)`: Determines the length of a list.
*   **Meta-calls:**
    *   `call(Goal)`: Executes a Prolog goal.
    *   `findall(Template, Goal, List)`: Collects all solutions for `Goal`.
*   **Time/Date (Low-level):**
    *   `epoch_seconds(?Seconds)`: Seconds since the epoch (Jan 1, 1970).
    *   `epoch_milliseconds(?Secs, ?Millis)`: Milliseconds since the epoch.
    *(Note: Ergo's `\dateTime` type is generally preferred).*
*   **Hashing:**
    *   `term_hash(Term, Range, ?HashValue)`: Computes a hash value for a term.
    *   `crypto_hash(Type, Input, ?Hash)`: Computes cryptographic hashes (MD5, SHA1). `Input` can be an atom or `file(FileName)`.
*   **File System (Low-level):**
    *   `file_exists(FileName)`: Checks if a file exists.
    *   *(Note: `@\io` module provides richer file operations).*

```ergo
// Example: Using XSB's =..
?- (f(a,b) =.. ?L)@\prolog.
// ?L = [f, a, b]

// Example: Using findall
?- findall(?X, (member(?X, [1,2,3]), ?X > 1), ?Results)@\prolog.
// ?Results = [2, 3]
```

## Appendix A: Prolog Evaluation Background (for context)

Understanding how standard Prolog evaluates queries provides useful context for appreciating ErgoAI's different approach (often based on tabling). This appendix summarizes concepts from the Prolog Tutorial Slides (Slides 16-24).

**A.1 Procedural Interpretation & SLD Resolution**

Prolog evaluation is *goal-directed*. Starting with a query (the initial goal), Prolog uses *SLD Resolution* (Linear resolution for Definite clauses with Selection function).
1.  Select the leftmost literal (goal) in the current resolvent.
2.  Find the *first* program clause (rule or fact) whose head unifies with the selected goal (top-down *rule selection strategy*).
3.  Replace the selected goal with the body of the unifying clause, applying the unifying substitution to the entire new resolvent.
4.  Repeat until the resolvent is empty (success) or no unifying clause can be found (failure).

**A.2 Unification**

Unification (Prolog Tutorial Slides, Slide 28) is the process of finding a substitution that makes two terms syntactically identical. It binds variables to terms. In Prolog:
*   Variables are "assign-once" within a derivation path.
*   Bindings are undone upon backtracking.
*   Unifying a variable `X` with a term `T` fails if `X` already occurs within `T` (the *occurs-check*), though this check is often omitted for performance in standard Prolog (Prolog Tutorial Slides, Slide 29). ErgoAI's unification modes are discussed in the ErgoAI Reasoner User Manual, Section 47.11.6.
*   Prolog systems automatically "standardize apart" variables, meaning variables with the same name in a goal and a rule head are treated as distinct during unification.

**A.3 Backtracking**

When a goal fails (no unifying clause head found), Prolog *backtracks* (Prolog Tutorial Slides, Slide 19). It returns to the most recent choice point (where multiple clauses could have unified with a previous goal) and tries the *next* available clause. This systematically explores the *SLD Search Tree* (Prolog Tutorial Slides, Slides 17, 23).

**A.4 Recursion and Termination**

*   **Right Recursion:** Recursion where the recursive call is the *last* goal in the body (e.g., `reach(X,Y) :- edge(X,Z), reach(Z,Y).`) is generally efficient in Prolog (tail-recursive) and terminates for acyclic data (Prolog Tutorial Slides, Slides 10, 20).
*   **Left Recursion:** Recursion where the recursive call is the *first* goal (e.g., `reach(X,Y) :- reach(X,Z), edge(Z,Y).`) leads to non-termination in standard Prolog due to the fixed literal selection strategy (Prolog Tutorial Slides, Slides 10, 22, 23). Tabling (see Part II, Section 4.5) solves this.

This SLD resolution with backtracking differs significantly from ErgoAI's tabled evaluation, which memoizes results and handles recursion differently, often providing better termination and performance properties.

## Appendix B: Constraint Logic Programming (CLP) Overview

Constraint Logic Programming (CLP) extends logic programming by incorporating techniques for solving constraints over specific domains, often significantly improving performance and expressiveness for combinatorial problems. While ErgoAI integrates with external solvers like MiniZinc (Part II, Section 3.11), other Prolog systems have built-in CLP capabilities (Prolog Tutorial Slides, Slides 49-61).

**B.1 Core Concepts**

*   **Constraint Domains:** CLP systems typically specialize in domains like Finite Domains (integers), Booleans, Reals (CLP(R)), or Rationals (CLP(Q)).
*   **Constraint Variables:** Special variables whose values are restricted to a specific domain (e.g., `X :: 1..10` declares X as an integer between 1 and 10).
*   **Constraints:** Relations between variables (e.g., `X #> Y`, `A + B #=< C`, `alldifferent([X,Y,Z])`). The `#` prefix is common in FD solvers.
*   **Constraint Store:** The solver maintains a store of active constraints.
*   **Constraint Propagation:** When a variable's domain is modified (e.g., by binding it or adding another constraint), the solver propagates this information to potentially reduce the domains of other related variables.
*   **Solvers:** Different techniques are used:
    *   **Propagation Solvers (e.g., Picat's `cp`):** Focus on domain reduction and consistency checks.
    *   **SAT/SMT Solvers (e.g., Picat's `sat`/`smt`):** Translate the problem into propositional logic (often with theories for arithmetic) and use efficient SAT/SMT solvers.
    *   **MIP Solvers (e.g., Picat's `mip`):** Use Mixed Integer Programming techniques.

**B.2 Attributed Variables**

A common implementation technique in Prolog for CLP is *attributed variables* (Prolog Tutorial Slides, Slide 56). These are logic variables with an associated attribute (a data structure) stored outside the normal Prolog term representation. This attribute can hold the variable's domain, constraints it participates in, etc. When attributed variables are unified, special handlers are invoked to merge their constraints or propagate changes.

**B.3 Example (Finite Domain - Sudoku Logic)**

The core idea in solving Sudoku with CLP(FD) involves (Prolog Tutorial Slides, Slides 51-55):
1.  Representing the board as a list or array of FD variables, each with domain `1..9`.
2.  Posting initial constraints based on the given clues (e.g., `Board[1,1] #= 5`).
3.  Posting `alldifferent/1` constraints on each row, column, and 3x3 block.
4.  Calling a labeling procedure (like Picat's `solve`) which systematically tries values for the variables, using constraint propagation to prune the search space efficiently.

**B.4 Systems**

Prolog systems with notable CLP support include ECLiPSe, SICStus Prolog, Ciao Prolog, SWI-Prolog, GNU Prolog, and Picat (Prolog Tutorial Slides, Slide 61). ErgoAI currently focuses on integration with external solvers.

## Appendix C: Program Analysis Overview

Program analysis techniques automatically infer properties of programs, aiding in debugging, verification, and optimization. While ErgoAI provides powerful runtime analysis (see Part II, Section 5), static analysis is also prominent in the Prolog world (Prolog Tutorial Slides, Slides 63-76).

**C.1 Static vs. Dynamic Analysis**

*   **Dynamic Analysis:** Analyzes program properties *during* execution (e.g., profiling, runtime type checks, ErgoAI's Terminyzer). XSB's profiling and JIT indexing are examples (Prolog Tutorial Slides, Slide 64).
*   **Static Analysis:** Analyzes program properties *without* executing the program, typically at compile time. Common in many languages for type checking.

**C.2 Abstract Interpretation**

The dominant approach to static analysis in logic programming is *Abstract Interpretation* [CC77] (Prolog Tutorial Slides, Slides 65-67).
*   It executes the program over an *abstract domain* (a simpler representation of the actual data, e.g., using types like `int`, `list`, `any` instead of concrete values).
*   It uses abstract operations (like *join* for combining information from different paths, and *meet* for finding common properties) that safely approximate the concrete program execution.
*   It often requires computing fixpoints over the abstract domain.
*   Guarantees *safe approximations*: e.g., if analysis says a variable is *always* ground upon success, it is true; but if it cannot determine this, the variable *might* still be ground.

**C.3 Ciao Prolog and `ciaopp`**

Ciao Prolog provides a mature static analysis framework (`ciaopp`) based on abstract interpretation (Prolog Tutorial Slides, Slides 68-73). It can infer various properties:
*   **Types/Modes:** Infers data types and instantiation states (e.g., `var`, `nonvar`, `ground`) of predicate arguments at different points (call, success). Allows user-defined types/properties (Slide 71).
*   **Determinacy:** Infers if predicates can produce multiple solutions or leave choice points (Slide 69).
*   **Non-failure:** Infers if goals are guaranteed to succeed.
*   **Cost:** Approximates computational cost based on term sizes.
*   **Termination:** Analyzes potential non-termination.

Analysis results are often expressed as *assertions* added to the code, which can be checked statically or dynamically. The qsort example (Slides 72-73) shows inferred assertions like `: - checked calls qsort(A,B) : list_num(A).`

**C.4 Relevance**

While ErgoAI focuses on runtime analysis, understanding static analysis provides context. Furthermore, analysis techniques (static or dynamic) may prove useful for validating or repairing code generated by Large Language Models (LLMs) (Prolog Tutorial Slides, Slide 74). XSB also performs some static mode analysis (Prolog Tutorial Slides, Slide 75).

## Appendix D: Probabilistic Logic Programming (PLP) Overview

Probabilistic Logic Programming (PLP) combines logic programming's representational power with probabilistic reasoning capabilities. While ErgoAI has its own `@ergo_ep` module for evidential probability (Part II, Section 3.12), a major PLP paradigm is based on the *Distribution Semantics* [Sat95] (Prolog Tutorial Slides, Slides 79-91).

**D.1 Distribution Semantics**

Systems like Problog and PITA implement the distribution semantics, often using *Annotated Disjunctions* [VVB04] as their core syntax:
`H1:P1 ; H2:P2 ; ... ; Hn:Pn :- Body.`
This states that if `Body` is true, exactly one of the heads `Hi` becomes true, with probability `Pi` (where ΣPi ≤ 1). If ΣPi < 1, there's a `1-ΣPi` chance that *none* of the heads become true (represented implicitly or via `null`).

*   **Atomic Choice:** Each grounding of an annotated disjunction represents a probability distribution. Selecting one head `Hi` based on its probability `Pi` is an *atomic choice*.
*   **Worlds:** A *consistent composite choice* selects exactly one atomic choice for each grounded annotated disjunction. A *world* is a consistent composite choice covering *all* possible groundings.
*   **Probability:** The probability of a world is the product of the probabilities of the atomic choices it contains (due to independence between different ground annotated disjunctions).
*   **Query Probability:** The probability of a query `Q` is the sum of the probabilities of all worlds where `Q` is true.

**D.2 Evaluation**

Evaluating PLP queries under the distribution semantics involves finding all explanations (sets of atomic choices) that support the query and summing their probabilities, often using techniques like Binary Decision Diagrams (BDDs) to handle the potentially exponential number of worlds efficiently (Prolog Tutorial Slides, Slides 83-85). Systems often use tabling for performance and semantic clarity.

**D.3 Extensions**

PLP systems based on the distribution semantics have been extended to include:
*   **Parameter Learning:** Learning probabilities from data (e.g., using cplint [RA23]).
*   **Decision Theory:** Combining probabilities with utilities (e.g., DTProblog [vdBTvOR10]).
*   **Inhibition Effects:** Modeling inhibitory causal interactions [MV14].
*   **Fuzzy Logic:** PITA also supports reasoning with fuzzy logic.

**D.4 Examples**

Common examples include modeling Bayesian Networks (Slide 88) and influence scenarios like the Smokers example (Slide 89). Hidden Markov Models (HMMs) can also be modeled (Slide 90). Alternative syntaxes like Prism [SK97] also exist (Slide 91).