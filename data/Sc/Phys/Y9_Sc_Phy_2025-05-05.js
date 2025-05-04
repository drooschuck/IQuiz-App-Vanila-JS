export const quizSubject = "Phy5 - Wave properties ";

let questions = [
    {
        numb: 1,
        question: "What is the symbol for a resistor in a circuit diagram?",
        answer: "R",
        options: [
            "R",
            "C",
            "V",
            "I"
        ]
    },
    {
        numb: 2,
        question: "Define electric current.",
        answer: "The flow of electric charge.",
        options: [
            "The flow of electric charge.",
            "The potential difference across a circuit.",
            "The opposition to the flow of current.",
            "The energy per unit charge."
        ]
    },
    {
        numb: 3,
        question: "What is the equation for calculating current?",
        answer: "I = Q / t",
        options: [
            "I = V / R",
            "I = Q / t",
            "I = R / V",
            "I = V * R"
        ]
    },
    {
        numb: 4,
        question: "Define potential difference (p.d.).",
        answer: "The work done per unit charge.",
        options: [
            "The work done per unit charge.",
            "The flow of electric charge.",
            "The total energy in a circuit.",
            "The resistance in a circuit."
        ]
    },
    {
        numb: 5,
        question: "Define resistance.",
        answer: "The opposition to the flow of electric current.",
        options: [
            "The flow of electric charge.",
            "The work done per unit charge.",
            "The opposition to the flow of electric current.",
            "The total energy in a circuit."
        ]
    },
    {
        numb: 6,
        question: "State Ohm's Law.",
        answer: "V = I * R",
        options: [
            "V = I * R",
            "I = V / R",
            "R = V / I",
            "All of the above"
        ]
    },
    {
        numb: 7,
        question: "How can you determine the resistance of a wire using a circuit?",
        answer: "By measuring the voltage across the wire and the current through it.",
        options: [
            "By measuring the voltage across the wire and the current through it.",
            "By measuring the length of the wire.",
            "By calculating the power used.",
            "By counting the number of resistors."
        ]
    },
    {
        numb: 8,
        question: "Describe the relationship between resistance and length of a wire.",
        answer: "Resistance increases with the length of the wire.",
        options: [
            "Resistance decreases with the length of the wire.",
            "Resistance increases with the length of the wire.",
            "Resistance is independent of the length of the wire.",
            "Resistance is only affected by temperature."
        ]
    },
    {
        numb: 9,
        question: "How does the p.d. and current change in a series circuit?",
        answer: "The p.d. is divided among components, and current remains the same.",
        options: [
            "The p.d. is divided among components, and current remains the same.",
            "The p.d. is the same across all components, and current varies.",
            "Both p.d. and current are the same across all components.",
            "The p.d. is zero, and current is maximum."
        ]
    },
    {
        numb: 10,
        question: "How do you calculate the total resistance of resistors in series?",
        answer: "R_total = R1 + R2 + R3 + ...",
        options: [
            "R_total = R1 + R2 + R3 + ...",
            "R_total = R1 * R2 * R3",
            "R_total = R1 / R2 / R3",
            "R_total = R1 + R2 - R3"
        ]
    },
    {
        numb: 11,
        question: "Why does adding resistors in series increase the total resistance?",
        answer: "Because the total resistance is the sum of individual resistances.",
        options: [
            "Because the total resistance is the sum of individual resistances.",
            "Because it decreases the current.",
            "Because it increases the voltage.",
            "Because it decreases the potential difference."
        ]
    },
    {
        numb: 12,
        question: "How does the p.d. and current change in a parallel circuit?",
        answer: "The p.d. is the same across all branches, and current is divided.",
        options: [
            "The p.d. is the same across all branches, and current is divided.",
            "The p.d. is divided among branches, and current remains the same.",
            "Both p.d. and current are the same across all branches .",
            "The p.d. is zero, and current is maximum."
        ]
    },
    {
        numb: 13,
        question: "Why does adding resistors in parallel decrease the total resistance?",
        answer: "Because the total current increases, allowing more paths for the flow.",
        options: [
            "Because the total current increases, allowing more paths for the flow.",
            "Because it increases the voltage.",
            "Because it decreases the current.",
            "Because it increases the potential difference."
        ]
    },
    {
        numb: 14,
        question: "How can you use the scientific method and Ohm's law to calculate equivalent resistance?",
        answer: "By conducting experiments to measure voltage and current, then applying V = I * R.",
        options: [
            "By conducting experiments to measure voltage and current, then applying V = I * R.",
            "By estimating values based on previous knowledge.",
            "By using a calculator without any measurements.",
            "By assuming all resistors have the same value."
        ]
    }
];

export { questions };