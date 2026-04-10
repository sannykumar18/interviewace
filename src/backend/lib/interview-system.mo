import Types "../types/interview-system";
import List "mo:core/List";
import Char "mo:core/Char";

module {
  // --- Profile helpers ---

  public func newProfile(id : Types.UserId, name : Text) : Types.UserProfile {
    { id; var name; var totalSessions = 0; var scoreHistory = [] };
  };

  public func toPublicProfile(profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = profile.id;
      name = profile.name;
      totalSessions = profile.totalSessions;
      scoreHistory = profile.scoreHistory;
    };
  };

  public func addSessionSummary(profile : Types.UserProfile, summary : Types.SessionSummary) {
    profile.scoreHistory := profile.scoreHistory.concat([summary]);
    profile.totalSessions += 1;
  };

  // --- Session helpers ---

  public func newSession(
    id : Types.SessionId,
    userId : Types.UserId,
    category : Types.Category,
    difficulty : Types.Difficulty,
    startTime : Types.Timestamp,
  ) : Types.InterviewSession {
    {
      id;
      userId;
      category;
      difficulty;
      startTime;
      var endTime = null;
      var questionsAttempted = 0;
      var totalScore = 0;
      var isComplete = false;
    };
  };

  public func toPublicSession(session : Types.InterviewSession) : Types.InterviewSessionPublic {
    {
      id = session.id;
      userId = session.userId;
      category = session.category;
      difficulty = session.difficulty;
      startTime = session.startTime;
      endTime = session.endTime;
      questionsAttempted = session.questionsAttempted;
      totalScore = session.totalScore;
      isComplete = session.isComplete;
    };
  };

  // --- Question filtering ---

  public func filterQuestions(
    questions : List.List<Types.Question>,
    category : Types.Category,
    difficulty : Types.Difficulty,
  ) : [Types.Question] {
    questions.filter(func(q) {
      q.category == category and q.difficulty == difficulty
    }).toArray();
  };

  // --- NLP helpers ---

  func isAlphaNumChar(c : Char) : Bool {
    c.isAlphabetic() or c.isDigit()
  };

  func charToLower(c : Char) : Char {
    if (c.isUpper()) {
      // A=65, a=97, offset=32
      Char.fromNat32(c.toNat32() + 32)
    } else {
      c
    };
  };

  /// Tokenize answer text into lowercase words, stripping punctuation
  public func tokenize(text : Text) : [Text] {
    let cleaned = text.map(func(c : Char) : Char {
      if (isAlphaNumChar(c)) { charToLower(c) } else { ' ' }
    });
    let parts = cleaned.split(#char ' ');
    let tokens = List.empty<Text>();
    for (part in parts) {
      if (not part.isEmpty()) {
        tokens.add(part);
      };
    };
    tokens.toArray();
  };

  /// Compute keyword match score (0–100)
  public func computeKeywordScore(answerTokens : [Text], expectedKeywords : [Text]) : Nat {
    if (expectedKeywords.size() == 0) { return 0 };
    var matched = 0;
    for (kw in expectedKeywords.values()) {
      let kwLower = kw.toLower();
      let found = answerTokens.any(func(t : Text) : Bool { t == kwLower });
      if (found) { matched += 1 };
    };
    (matched * 100) / expectedKeywords.size();
  };

  /// Compute grammar score (0–100) based on word count
  public func computeGrammarScore(_answerText : Text, answerTokens : [Text]) : Nat {
    let wordCount = answerTokens.size();
    if (wordCount < 10) { 20 }
    else if (wordCount < 30) { 50 }
    else if (wordCount < 50) { 70 }
    else if (wordCount <= 100) { 85 }
    else { 100 };
  };

  /// Compute confidence score (0–100): matched keywords / total expected keywords * 100
  public func computeConfidenceScore(answerTokens : [Text], expectedKeywords : [Text]) : Nat {
    if (expectedKeywords.size() == 0) { return 0 };
    var matched = 0;
    for (kw in expectedKeywords.values()) {
      let kwLower = kw.toLower();
      let found = answerTokens.any(func(t : Text) : Bool { t == kwLower });
      if (found) { matched += 1 };
    };
    let score = (matched * 100) / expectedKeywords.size();
    if (score > 100) { 100 } else { score };
  };

  let positiveWords : [Text] = [
    "good", "great", "excellent", "correct", "useful", "efficient",
    "fast", "better", "important", "clear", "easy", "powerful", "robust",
  ];

  let negativeWords : [Text] = [
    "slow", "bad", "wrong", "incorrect", "difficult", "complex",
    "confusing", "poor",
  ];

  /// Classify sentiment: "Positive" | "Neutral" | "Negative"
  public func classifySentiment(answerTokens : [Text]) : Text {
    var posCount = 0;
    var negCount = 0;
    for (token in answerTokens.values()) {
      if (positiveWords.any(func(w : Text) : Bool { w == token })) {
        posCount += 1;
      };
      if (negativeWords.any(func(w : Text) : Bool { w == token })) {
        negCount += 1;
      };
    };
    if (posCount > negCount) { "Positive" }
    else if (negCount > posCount) { "Negative" }
    else { "Neutral" };
  };

  /// Map sentiment label to 0–100 numeric score
  public func sentimentToScore(sentiment : Text) : Nat {
    if (sentiment == "Positive") { 100 }
    else if (sentiment == "Neutral") { 50 }
    else { 20 };
  };

  /// Compute completeness score (0–100) based on word count vs min/max
  public func computeCompletenessScore(wordCount : Nat, minLen : Nat, maxLen : Nat) : Nat {
    if (wordCount < minLen) { 30 }
    else if (wordCount > maxLen) { 100 }
    else {
      let range = maxLen - minLen;
      if (range == 0) { 100 }
      else {
        let progress = wordCount - minLen;
        30 + (progress * 70) / range;
      };
    };
  };

  /// Compute overall score: keywordScore*40% + grammarScore*30% + completeness*30%
  public func computeOverallScore(keywordScore : Nat, grammarScore : Nat, completenessScore : Nat) : Nat {
    (keywordScore * 40 + grammarScore * 30 + completenessScore * 30) / 100;
  };

  /// Generate human-readable feedback string
  public func generateFeedback(
    _keywordScore : Nat,
    _grammarScore : Nat,
    _confidenceScore : Nat,
    _sentiment : Text,
    overallScore : Nat,
  ) : Text {
    if (overallScore >= 80) {
      "Excellent answer! Strong keyword coverage and clear explanation."
    } else if (overallScore >= 60) {
      "Good answer. Try to include more technical keywords and expand your explanation."
    } else if (overallScore >= 40) {
      "Fair answer. Focus on key concepts and provide more detail."
    } else {
      "Needs improvement. Review the topic and practice including core technical terms."
    };
  };

  /// Run full NLP pipeline on an answer against a question
  public func analyzeAnswer(question : Types.Question, answerText : Text) : Types.NlpAnalysisResult {
    let tokens = tokenize(answerText);
    let wordCount = tokens.size();
    let keywordScore = computeKeywordScore(tokens, question.expectedKeywords);
    let grammarScore = computeGrammarScore(answerText, tokens);
    let confidenceScore = computeConfidenceScore(tokens, question.expectedKeywords);
    let sentiment = classifySentiment(tokens);
    let completenessScore = computeCompletenessScore(wordCount, question.minAnswerLength, question.maxAnswerLength);
    let overallScore = computeOverallScore(keywordScore, grammarScore, completenessScore);
    let feedback = generateFeedback(keywordScore, grammarScore, confidenceScore, sentiment, overallScore);
    {
      keywordScore;
      grammarScore;
      confidenceScore;
      sentiment;
      overallScore;
      feedback;
      betterAnswer = question.sampleBetterAnswer;
    };
  };

  // --- Question bank seeding ---

  public func seedQuestions() : [Types.Question] {
    [
      // Python Basics - Beginner
      {
        id = 1;
        text = "What is Python?";
        category = #PythonBasics;
        difficulty = #Beginner;
        expectedKeywords = ["interpreted", "high-level", "programming", "language", "general-purpose", "dynamic", "readable"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Python is a high-level, interpreted, general-purpose programming language known for its simple and readable syntax. It supports multiple programming paradigms including procedural, object-oriented, and functional programming. Python uses dynamic typing and automatic memory management, making it easy to learn and widely used in web development, data science, AI, and automation.";
      },
      {
        id = 2;
        text = "What are Python lists?";
        category = #PythonBasics;
        difficulty = #Beginner;
        expectedKeywords = ["ordered", "mutable", "collection", "elements", "index", "dynamic", "heterogeneous"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Python lists are ordered, mutable collection of elements that can hold heterogeneous data types. They are defined using square brackets and support indexing, slicing, and various built-in methods like append, remove, and sort. Lists are dynamic in size, meaning you can add or remove elements after creation.";
      },
      {
        id = 3;
        text = "What is a dictionary in Python?";
        category = #PythonBasics;
        difficulty = #Beginner;
        expectedKeywords = ["key-value", "mutable", "unordered", "hash", "mapping", "dictionary", "pairs"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A dictionary in Python is a mutable, unordered collection of key-value pairs. It is defined using curly braces and allows fast lookup by key using hashing. Keys must be immutable and unique, while values can be of any data type. Dictionaries are ideal for representing mappings and structured data.";
      },
      // Python Basics - Intermediate
      {
        id = 4;
        text = "What is list comprehension in Python?";
        category = #PythonBasics;
        difficulty = #Intermediate;
        expectedKeywords = ["concise", "list", "expression", "iterable", "filter", "transform", "syntax"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "List comprehension is a concise way to create lists in Python using a single expression. It consists of an expression followed by a for clause and optional if clauses. It allows you to filter and transform elements from an iterable in a compact, readable syntax.";
      },
      {
        id = 5;
        text = "Explain decorators in Python.";
        category = #PythonBasics;
        difficulty = #Intermediate;
        expectedKeywords = ["wrapper", "function", "modify", "higher-order", "syntax", "behavior", "callable"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Decorators in Python are a way to modify or extend the behavior of functions or classes without changing their source code. A decorator is a higher-order function that takes a callable as input and returns a modified callable. They use the @ syntax as syntactic sugar. Common uses include logging, authentication, memoization, and timing functions.";
      },
      {
        id = 6;
        text = "What is a lambda function in Python?";
        category = #PythonBasics;
        difficulty = #Intermediate;
        expectedKeywords = ["anonymous", "inline", "single", "expression", "lambda", "function", "callable"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A lambda function in Python is an anonymous inline function defined using the lambda keyword. It can take multiple arguments but contains only a single expression. Lambda functions are commonly used with map, filter, and sorted functions.";
      },
      // Python Basics - Advanced
      {
        id = 7;
        text = "Explain generators in Python.";
        category = #PythonBasics;
        difficulty = #Advanced;
        expectedKeywords = ["yield", "iterator", "lazy", "memory", "generator", "sequence", "efficient"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Generators in Python are functions that use the yield keyword to return values lazily, one at a time. They implement the iterator protocol and produce values on demand, making them memory-efficient for large sequences. Unlike regular functions, they pause execution at each yield and resume on the next call.";
      },
      {
        id = 8;
        text = "What is the GIL in Python?";
        category = #PythonBasics;
        difficulty = #Advanced;
        expectedKeywords = ["global", "interpreter", "lock", "thread", "cpython", "concurrency", "memory"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "The GIL (Global Interpreter Lock) is a mutex in CPython that allows only one thread to execute Python bytecode at a time. It protects memory management by preventing race conditions but limits true multi-threading parallelism. For CPU-bound tasks, multiprocessing or native extensions bypass the GIL.";
      },
      // Machine Learning - Beginner
      {
        id = 9;
        text = "What is machine learning?";
        category = #MachineLearning;
        difficulty = #Beginner;
        expectedKeywords = ["algorithms", "data", "patterns", "predictions", "training", "model", "learn"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Machine learning is a subset of artificial intelligence where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed. Models are trained on historical data to identify relationships and generalize to new inputs.";
      },
      {
        id = 10;
        text = "What is the difference between supervised and unsupervised learning?";
        category = #MachineLearning;
        difficulty = #Beginner;
        expectedKeywords = ["labeled", "unlabeled", "classification", "clustering", "supervised", "unsupervised", "training"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Supervised learning uses labeled training data where each example has an input and corresponding output. The model learns to map inputs to outputs. Unsupervised learning uses unlabeled data to discover hidden patterns. Supervised tasks include classification and regression; unsupervised tasks include clustering and dimensionality reduction.";
      },
      // Machine Learning - Intermediate
      {
        id = 11;
        text = "What is overfitting in machine learning?";
        category = #MachineLearning;
        difficulty = #Intermediate;
        expectedKeywords = ["overfitting", "generalize", "training", "noise", "regularization", "validation", "bias"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Overfitting occurs when a model learns the training data too well, including noise and random fluctuations, resulting in poor generalization to new data. An overfitted model has low training error but high validation error. It can be prevented using regularization, dropout, cross-validation, or collecting more data.";
      },
      {
        id = 12;
        text = "What is gradient descent?";
        category = #MachineLearning;
        difficulty = #Intermediate;
        expectedKeywords = ["optimization", "gradient", "loss", "learning", "minimize", "weights", "descent"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Gradient descent is an optimization algorithm used to minimize a loss function by iteratively updating model weights in the direction of the negative gradient. The learning rate controls the step size. Variants include batch gradient descent, stochastic gradient descent, and mini-batch gradient descent.";
      },
      // Machine Learning - Advanced
      {
        id = 13;
        text = "Explain neural networks.";
        category = #MachineLearning;
        difficulty = #Advanced;
        expectedKeywords = ["neurons", "layers", "activation", "weights", "biases", "feedforward", "deep"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Neural networks are computational models inspired by the human brain, consisting of layers of interconnected neurons. Each neuron computes a weighted sum of inputs, applies an activation function, and passes the result forward. Deep neural networks with many hidden layers can learn complex hierarchical representations from data.";
      },
      {
        id = 14;
        text = "What is backpropagation?";
        category = #MachineLearning;
        difficulty = #Advanced;
        expectedKeywords = ["gradient", "backward", "chain", "weights", "loss", "update", "training"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Backpropagation is the algorithm used to train neural networks by computing gradients of the loss function with respect to each weight using the chain rule of calculus. It propagates the error backward from the output layer to the input layer. The computed gradients are used by gradient descent to update weights and reduce the loss.";
      },
      // Data Structures - Beginner
      {
        id = 15;
        text = "What is an array?";
        category = #DataStructures;
        difficulty = #Beginner;
        expectedKeywords = ["contiguous", "elements", "index", "fixed", "memory", "random", "access"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "An array is a contiguous collection of elements of the same data type stored in memory. Elements are accessed using a zero-based index in O(1) time. Arrays have a fixed size and support random access. They are the foundation for many other data structures.";
      },
      {
        id = 16;
        text = "What is a linked list?";
        category = #DataStructures;
        difficulty = #Beginner;
        expectedKeywords = ["nodes", "pointer", "dynamic", "singly", "doubly", "insertion", "deletion"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A linked list is a dynamic data structure where elements (nodes) are connected via pointers. Each node contains data and a pointer to the next node. Singly linked lists have one direction, doubly linked lists have two. Insertion and deletion are efficient at known positions but random access is O(n).";
      },
      // Data Structures - Intermediate
      {
        id = 17;
        text = "What is the difference between a stack and a queue?";
        category = #DataStructures;
        difficulty = #Intermediate;
        expectedKeywords = ["lifo", "fifo", "stack", "queue", "push", "pop", "enqueue", "dequeue"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A stack follows LIFO (Last In First Out) order where the last element added is the first to be removed. Operations are push and pop from the top. A queue follows FIFO (First In First Out) order. Operations are enqueue (add to back) and dequeue (remove from front). Stacks are used for function calls; queues for task scheduling.";
      },
      {
        id = 18;
        text = "What is a binary tree?";
        category = #DataStructures;
        difficulty = #Intermediate;
        expectedKeywords = ["nodes", "root", "children", "left", "right", "leaf", "traversal"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A binary tree is a hierarchical data structure where each node has at most two children called left and right. The topmost node is called the root, and nodes with no children are leaves. Binary trees support efficient searching, insertion, and deletion when balanced. Common traversals include inorder, preorder, and postorder.";
      },
      {
        id = 19;
        text = "What is the difference between a hash table and a hash map?";
        category = #DataStructures;
        difficulty = #Intermediate;
        expectedKeywords = ["hash", "key-value", "collision", "bucket", "synchronized", "null", "table"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A hash table is a data structure that maps keys to values using a hash function to compute an index into buckets. In Java, Hashtable is synchronized and does not allow null keys, while HashMap is unsynchronized and allows one null key. Both offer O(1) average case for insert, delete, and lookup with collision handling.";
      },
      // Data Structures - Advanced
      {
        id = 20;
        text = "What is a graph data structure?";
        category = #DataStructures;
        difficulty = #Advanced;
        expectedKeywords = ["vertices", "edges", "directed", "undirected", "adjacency", "weighted", "traversal"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A graph is a non-linear data structure consisting of vertices (nodes) and edges (connections). Graphs can be directed or undirected, weighted or unweighted. They are represented using adjacency matrices or adjacency lists. Common algorithms include BFS, DFS, Dijkstra shortest path, and topological sort.";
      },
      // AI Concepts - Beginner
      {
        id = 21;
        text = "What is artificial intelligence?";
        category = #AIConcepts;
        difficulty = #Beginner;
        expectedKeywords = ["intelligence", "machines", "simulate", "human", "learning", "reasoning", "problem-solving"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Artificial intelligence (AI) is the simulation of human intelligence processes by machines. It encompasses machine learning, natural language processing, computer vision, and robotics. AI systems can perform tasks that typically require human intelligence such as visual perception, speech recognition, decision-making, and language translation.";
      },
      // AI Concepts - Intermediate
      {
        id = 22;
        text = "What is a decision tree?";
        category = #AIConcepts;
        difficulty = #Intermediate;
        expectedKeywords = ["nodes", "branches", "classification", "split", "leaf", "entropy", "feature"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A decision tree is a tree-shaped model used for classification and regression. It splits data based on feature values at each internal node to maximize information gain or minimize impurity (entropy or Gini index). Leaf nodes represent final predictions. Decision trees are interpretable but prone to overfitting.";
      },
      {
        id = 23;
        text = "What is deep learning?";
        category = #AIConcepts;
        difficulty = #Intermediate;
        expectedKeywords = ["neural", "networks", "layers", "representation", "features", "deep", "training"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Deep learning is a subfield of machine learning that uses neural networks with many layers (deep architectures) to learn hierarchical feature representations from raw data. It excels at tasks like image recognition, speech processing, and natural language understanding. Models like CNNs and transformers have achieved state-of-the-art results.";
      },
      {
        id = 24;
        text = "What is NLP (Natural Language Processing)?";
        category = #AIConcepts;
        difficulty = #Intermediate;
        expectedKeywords = ["text", "language", "processing", "understanding", "tokenization", "sentiment", "translation"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Natural Language Processing (NLP) is a branch of AI that enables machines to understand, interpret, and generate human language. It involves tasks like tokenization, sentiment analysis, named entity recognition, machine translation, and question answering. Modern NLP relies on transformer models like BERT and GPT.";
      },
      // AI Concepts - Advanced
      {
        id = 25;
        text = "What is reinforcement learning?";
        category = #AIConcepts;
        difficulty = #Advanced;
        expectedKeywords = ["agent", "environment", "reward", "policy", "action", "state", "exploration"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Reinforcement learning is a type of machine learning where an agent learns to make decisions by interacting with an environment to maximize cumulative reward. The agent takes actions, receives rewards or penalties, and updates its policy. Key concepts include state, action, reward, policy, and value function.";
      },
      // Database - Beginner
      {
        id = 26;
        text = "What is a database?";
        category = #Database;
        difficulty = #Beginner;
        expectedKeywords = ["organized", "data", "storage", "retrieval", "dbms", "structured", "persistent"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "A database is an organized collection of structured data stored electronically and managed by a Database Management System (DBMS). It allows efficient storage, retrieval, modification, and deletion of data. Databases support concurrent access, data integrity, and security. Common types include relational databases like MySQL and NoSQL databases like MongoDB.";
      },
      // Database - Intermediate
      {
        id = 27;
        text = "What is the difference between SQL and NoSQL databases?";
        category = #Database;
        difficulty = #Intermediate;
        expectedKeywords = ["relational", "schema", "scalability", "flexible", "structured", "horizontal", "acid"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "SQL databases are relational with fixed schemas and support ACID transactions using SQL for querying and scale vertically. NoSQL databases are non-relational with flexible schemas supporting documents, key-value, column-family, or graph models. They scale horizontally and excel with unstructured or rapidly changing data. SQL is best for complex queries; NoSQL for high-volume distributed workloads.";
      },
      {
        id = 28;
        text = "What is normalization in databases?";
        category = #Database;
        difficulty = #Intermediate;
        expectedKeywords = ["normal", "forms", "redundancy", "dependency", "tables", "anomalies", "decomposition"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "Normalization is the process of organizing a relational database to reduce data redundancy and improve data integrity. It involves decomposing tables into smaller well-structured tables and defining relationships between them. Normal forms (1NF, 2NF, 3NF, BCNF) progressively eliminate different types of anomalies. Normalized databases reduce update, insert, and delete anomalies.";
      },
      {
        id = 29;
        text = "What is an index in a database?";
        category = #Database;
        difficulty = #Intermediate;
        expectedKeywords = ["index", "performance", "query", "btree", "lookup", "search", "optimize"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "An index is a data structure that improves the speed of data retrieval in a database at the cost of additional storage and write overhead. Indexes are typically B-trees or hash structures built on one or more columns. They allow the database engine to quickly locate rows without scanning the entire table. Common types include primary, unique, composite, and full-text indexes.";
      },
      // Database - Advanced
      {
        id = 30;
        text = "What are ACID properties in databases?";
        category = #Database;
        difficulty = #Advanced;
        expectedKeywords = ["atomicity", "consistency", "isolation", "durability", "transaction", "integrity", "rollback"];
        minAnswerLength = 30;
        maxAnswerLength = 200;
        sampleBetterAnswer = "ACID properties ensure reliable database transactions. Atomicity guarantees all operations in a transaction succeed or all are rolled back. Consistency ensures the database moves from one valid state to another. Isolation ensures concurrent transactions execute as if sequential. Durability guarantees committed transactions persist even after system failures. These properties are critical for financial systems.";
      },
    ];
  };
};
