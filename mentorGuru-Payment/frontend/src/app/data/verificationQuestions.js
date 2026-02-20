// Question Bank structured by Skill/Category
export const questionBank = {
    'React': [
        {
            id: 'react-1',
            title: "What is the primary purpose of React hooks?",
            description: "Select the most accurate answer regarding React hooks functionality.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "To add state and lifecycle features to functional components", isCorrect: true },
                { id: "b", text: "To replace class components entirely", isCorrect: false },
                { id: "c", text: "To improve rendering performance automatically", isCorrect: false },
                { id: "d", text: "To handle client-side routing", isCorrect: false }
            ]
        },
        {
            id: 'react-2',
            title: "Which of the following is NOT a valid React hook?",
            description: "Identify the hook that doesn't exist in React's standard library.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "useState", isCorrect: false },
                { id: "b", text: "useEffect", isCorrect: false },
                { id: "c", text: "useModel", isCorrect: true },
                { id: "d", text: "useContext", isCorrect: false }
            ]
        },
        {
            id: 'react-3',
            title: "What does the useEffect hook do?",
            description: "Choose the best description of useEffect's functionality.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "Manages component state", isCorrect: false },
                { id: "b", text: "Performs side effects in functional components", isCorrect: true },
                { id: "c", text: "Creates context providers", isCorrect: false },
                { id: "d", text: "Optimizes component rendering", isCorrect: false }
            ]
        }
    ],
    'Node.js': [
        {
            id: 'node-1',
            title: "In Node.js, what is the purpose of the 'require' function?",
            description: "Select the correct explanation of the require function.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "To import modules and dependencies", isCorrect: true },
                { id: "b", text: "To export functions", isCorrect: false },
                { id: "c", text: "To create HTTP servers", isCorrect: false },
                { id: "d", text: "To handle asynchronous operations", isCorrect: false }
            ]
        },
        {
            id: 'node-2',
            title: "What is the purpose of middleware in Express.js?",
            description: "Choose the correct explanation of middleware functionality.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "To process requests before they reach route handlers", isCorrect: true },
                { id: "b", text: "To store session data", isCorrect: false },
                { id: "c", text: "To render HTML templates", isCorrect: false },
                { id: "d", text: "To connect to databases", isCorrect: false }
            ]
        }
    ],
    'General': [
        {
            id: 'gen-1',
            title: "What is the correct way to create a Promise in JavaScript?",
            description: "Identify the proper Promise constructor syntax.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "new Promise((resolve, reject) => {})", isCorrect: true },
                { id: "b", text: "Promise.create((resolve, reject) => {})", isCorrect: false },
                { id: "c", text: "new Promise(resolve => {})", isCorrect: false },
                { id: "d", text: "Promise((resolve, reject) => {})", isCorrect: false }
            ]
        },
        {
            id: 'gen-2',
            title: "Which HTTP method is idempotent?",
            description: "Select the HTTP method that produces the same result when called multiple times.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "POST", isCorrect: false },
                { id: "b", text: "PUT", isCorrect: true },
                { id: "c", text: "PATCH", isCorrect: false },
                { id: "d", text: "All of the above", isCorrect: false }
            ]
        },
        {
            id: 'gen-3',
            title: "In REST API design, what does CRUD stand for?",
            description: "Identify the correct expansion of the CRUD acronym.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "Create, Read, Update, Delete", isCorrect: true },
                { id: "b", text: "Connect, Retrieve, Upload, Download", isCorrect: false },
                { id: "c", text: "Create, Retrieve, Update, Destroy", isCorrect: false },
                { id: "d", text: "Call, Request, Update, Delete", isCorrect: false }
            ]
        },
        {
            id: 'gen-4',
            title: "What is the time complexity of binary search?",
            description: "Choose the correct Big O notation for binary search algorithm.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "O(n)", isCorrect: false },
                { id: "b", text: "O(log n)", isCorrect: true },
                { id: "c", text: "O(n²)", isCorrect: false },
                { id: "d", text: "O(1)", isCorrect: false }
            ]
        },
        {
            id: 'gen-5',
            title: "What is the purpose of Git branching?",
            description: "Select the primary reason for using branches in Git.",
            type: "multiple-choice",
            options: [
                { id: "a", text: "To work on features independently without affecting main code", isCorrect: true },
                { id: "b", text: "To make commits faster", isCorrect: false },
                { id: "c", text: "To reduce repository size", isCorrect: false },
                { id: "d", text: "To automatically merge code", isCorrect: false }
            ]
        }
    ]
};

export const getQuestionsForSkills = (skills = []) => {
    let selectedQuestions = [...questionBank['General']]; // Always include general questions

    // Flatten skills to lowercase for case-insensitive matching
    const normalizedSkills = skills.map(s => s.toLowerCase());

    if (normalizedSkills.includes('react')) {
        selectedQuestions = [...selectedQuestions, ...questionBank['React']];
    }
    if (normalizedSkills.includes('node.js') || normalizedSkills.includes('node')) {
        selectedQuestions = [...selectedQuestions, ...questionBank['Node.js']];
    }

    // Add logic for other skills if we had more questions...

    // Shuffle and limit to 20 (or fewer if we don't have enough)
    return selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
};

export const verificationTest = {
    duration: 1800, // 30 minutes
    passingScore: 70
};
