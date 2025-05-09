/* Function to set the subject in the quiz header */
let quizSubject = ""; // Initialize quizSubject variable

function setSubject() {
    const subjectElem = document.querySelector('.subject');
    subjectElem.textContent = 'Sub: ' + quizSubject; // Use the quiz subject
}

/* Function to dynamically import questions and subject based on selected subject */
async function loadQuestions(subjectKey) {
    // Map subjectKey to file path
    const subjectFileMap = {
        'Chem_2025-05-05': '../data/Sc/Chem/Y9_Sc_chem_2025-05-05.js',
        'Biol_2025-05-05': '../data/Sc/Biol/Y9_Sc_biol_2025-05-05.js',
        'Phys_2025-05-05': '../data/Sc/Phys/Y9_Sc_Phy_2025-05-05.js'
    };

    const filePath = subjectFileMap[subjectKey];
    if (!filePath) {
        console.error('Invalid subject key:', subjectKey);
        return { questions: [], quizSubject: "Unknown" };
    }

    try {
        const module = await import(filePath);
        console.log(`Successfully loaded questions from ${filePath}`);
        return {
            questions: module.questions || [],
            quizSubject: module.quizSubject || "Unknown"
        };
    } catch (error) {
        console.error(`Error loading questions from ${filePath}:`, error);
        return { questions: [], quizSubject: "Unknown" };
    }
}

/* Variables for quiz state */
let quizQuestions = [];
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let timeValue = 120;
let widthValue = 0;

/* Elements */
const subjectSelect = document.getElementById('subjectSelect');
const startBtn = document.querySelector('.start_btn button');
const infoBox = document.querySelector('.info_box');
const exitBtn = infoBox.querySelector('.buttons .quit');
const continueBtn = infoBox.querySelector('.buttons .restart');
const quizBox = document.querySelector('.quiz_box');
const resultBox = document.querySelector('.result_box');
const optionList = document.querySelector('.option_list');
const bottomQueCounter = document.querySelector('footer .total_que');
const nextBtn = document.querySelector('footer .next_btn');
const timeLine = document.querySelector('header .time_line');
const timeText = document.querySelector('.timer .time_left_txt');
const timeCount = document.querySelector('.timer .timer_sec');

/* Initialize quiz on start button click */
startBtn.onclick = async () => {
    const selectedSubject = subjectSelect.value;
    const { questions, quizSubject: loadedSubject } = await loadQuestions(selectedSubject);
    quizQuestions = questions;
    quizSubject = loadedSubject;
    setSubject();
    infoBox.classList.add('activeInfo');
};

/* Exit quiz */
exitBtn.onclick = () => {
    infoBox.classList.remove('activeInfo');
};

/* Continue quiz */
continueBtn.onclick = () => {
    infoBox.classList.remove('activeInfo');
    quizBox.classList.add('activeQuiz');
    showQuestions(0);
    queCounter(1);
    startTimer(timeValue);
    startTimerLine(0);
};

/* Restart quiz */
resultBox.querySelector('.buttons .restart').onclick = () => {
    quizBox.classList.add('activeQuiz');
    resultBox.classList.remove('activeResult');
    resetQuiz();
};

/* Quit quiz */
resultBox.querySelector('.buttons .quit').onclick = () => {
    window.location.reload();
};

/* Next question button */
nextBtn.onclick = () => {
    if (que_count < quizQuestions.length - 1) {
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(0);
        timeText.textContent = "Time Left";
        nextBtn.classList.remove("show");
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
};

/* Reset quiz */
function resetQuiz() {
    timeValue = 120;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(0);
    timeText.textContent = "Time Left";
    nextBtn.classList.remove("show");
}

/* Show questions */
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>' + quizQuestions[index].numb + ". " + quizQuestions[index].question + '</span>';
    let option_tag = quizQuestions[index].options.map(option => `<div class="option"><span>${option}</span></div>`).join('');
    que_text.innerHTML = que_tag;
    optionList.innerHTML = option_tag;

    const option = optionList.querySelectorAll(".option");
    option.forEach((opt) => {
        opt.addEventListener("click", () => optionSelected(opt));
    });
}

/* Icons */
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

/* Option selected */
function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent;
    let correcAns = quizQuestions[que_count].answer;
    const allOptions = optionList.children.length;

    if (userAns == correcAns) {
        userScore++;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIconTag);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIconTag);
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correcAns) {
                optionList.children[i].setAttribute("class", "option correct");
                optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
            }
        }
    }
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add("disabled");
    }
    nextBtn.classList.add("show");
}

/* Show result */
function showResult() {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");
    const scoreText = resultBox.querySelector(".score_text");
    if (userScore > 3) {
        scoreText.innerHTML = '<span>and congrats! 🎉, You got <p>' + userScore + '</p> out of <p>' + quizQuestions.length + '</p></span>';
    } else if (userScore > 1) {
        scoreText.innerHTML = '<span>and nice 😎, You got <p>' + userScore + '</p> out of <p>' + quizQuestions.length + '</p></span>';
    } else {
        scoreText.innerHTML = '<span>and sorry 😐, You got only <p>' + userScore + '</p> out of <p>' + quizQuestions.length + '</p></span>';
    }
}

/* Timer functions */
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            timeCount.textContent = "0" + timeCount.textContent;
        }
        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Time Off";
            const allOptions = optionList.children.length;
            let correcAns = quizQuestions[que_count].answer;
            for (let i = 0; i < allOptions; i++) {
                if (optionList.children[i].textContent == correcAns) {
                    optionList.children[i].setAttribute("class", "option correct");
                    optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                }
            }
            for (let i = 0; i < allOptions; i++) {
                optionList.children[i].classList.add("disabled");
            }
            nextBtn.classList.add("show");
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time++;
        timeLine.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

function queCounter(index) {
    bottomQueCounter.innerHTML = '<span><p>' + index + '</p> of <p>' + quizQuestions.length + '</p> Questions</span>';
}
