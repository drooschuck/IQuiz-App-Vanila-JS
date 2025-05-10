/* Function to set the subject in the quiz header */
let quizSubject = ""; // Initialize quizSubject variable

function setSubject() {
    const subjectElem = document.querySelector('.subject');
    subjectElem.textContent = 'Sub: ' + quizSubject; // Use the quiz subject
}

/* Function to dynamically import questions and subject based on a specific or current date and subject */
async function loadQuestions(subject, dateString) {
    if (!dateString) {
        const today = new Date();
        dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }

    let filePath = "";

    switch(subject) {
        case "Phy":
            filePath = `../data/Sc/Phys/Y9_Sc_Phy_${dateString}.js`;
            break;
        case "Chem":
            filePath = `../data/Sc/Chem/Y9_Sc_Chem_${dateString}.js`;
            break;
        case "Biol":
            filePath = `../data/Sc/Biol/Y9_Sc_biol_${dateString}.js`;
            break;
        case "Math":
            filePath = `../data/math/Y9_Math_Pt1_${dateString}.js`;
            break;
        case "CS":
            filePath = `../data/CS/Y9_Cs_Pt1_${dateString}.js`;
            break;
        case "Eng":
            filePath = `../data/Eng/Y9_Eng_${dateString}.js`;
            break;
        default:
            throw new Error("Invalid subject specified");
    }

    let questions = [];
    let localQuizSubject = "KS3"; // Default subject

    try {
        const module = await import(filePath);
        console.log(`Successfully loaded questions from ${filePath}`);
        localQuizSubject = module.quizSubject || localQuizSubject; // Update quizSubject if available
        questions = module.questions || [];
    } catch (error) {
        console.error(`Error loading questions from ${filePath}:`, error);
        showFileNotFoundError();
    }

    return {
        questions: questions,
        quizSubject: localQuizSubject
    };
}

function showFileNotFoundError() {
    // Hide all other boxes
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.remove("activeResult");

    // Show error box or create one dynamically
    let errorBox = document.querySelector(".error_box");
    if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.className = "error_box";
        errorBox.style.cssText = "position: fixed; top: 20%; left: 50%; transform: translateX(-50%); background: #f8d7da; color: #721c24; padding: 20px; border: 1px solid #f5c6cb; border-radius: 5px; z-index: 1000; max-width: 300px; text-align: center;";
        errorBox.innerHTML = `
            <p>Question file not found for the selected subject.</p>
            <button class="back_to_menu_btn">Back to Main Menu</button>
        `;
        document.body.appendChild(errorBox);

        const backBtn = errorBox.querySelector(".back_to_menu_btn");
        backBtn.addEventListener("click", () => {
            errorBox.remove();
            showWelcomeMenu();
        });
    } else {
        errorBox.style.display = "block";
    }
}

function showWelcomeMenu() {
    // Show welcome message container
    const welcomeMessage = document.querySelector('.welcome_message');
    if (welcomeMessage) welcomeMessage.style.display = 'block';

    // Show subject selection dropdown and label by removing inline display style
    const subjectLabel = document.querySelector('label[for="subjectSelect"]');
    if (subjectLabel) subjectLabel.style.display = '';
    if (subjectSelect) subjectSelect.style.display = '';

    // Reset subject selection dropdown to placeholder
    subjectSelect.value = "";
    selectedSubject = "";
    updateWelcomeTitle(selectedSubject);

    // Enable start button if disabled
    startBtn.disabled = true;
}

/* Load questions for specific Date */
/*loadQuestions("2025-05-00").then(({ questions, quizSubject: loadedSubject }) => {
    quizQuestions = questions;
    quizSubject = loadedSubject; // Assign to global quizSubject
    setSubject(); // Set the subject after loading
    initializeQuiz();
}); */

/* Load questions for the current Date and subject */
let quizQuestions = [];
let selectedSubject = ""; // Default subject, can be changed to "Chem" or "Biol"

const subjectSelect = document.getElementById("subjectSelect");
const welcomeTitle = document.getElementById("welcomeTitle");
const startBtn = document.querySelector(".start_btn button");

// Disable start button initially
startBtn.disabled = true;

// Enable start button only when a valid subject is selected
subjectSelect.addEventListener("change", (e) => {
    selectedSubject = e.target.value;
    updateWelcomeTitle(selectedSubject);
    startBtn.disabled = !selectedSubject;

    // Remove notification if present when user selects a subject
    let notification = document.querySelector(".subject-notification");
    if (notification) {
        console.log("Removing subject selection notification");
        notification.remove();
    }
});

// Update welcome title based on selected subject
function updateWelcomeTitle(subject) {
    let subjectName = "";
    switch(subject) {
        case "Phy":
            subjectName = "Physics";
            break;
        case "Chem":
            subjectName = "Chemistry";
            break;
        case "Biol":
            subjectName = "Biology";
            break;
        case "CS":
            subjectName = "Computer Science";
            break;
        case "Math":
            subjectName = "Maths";
            break;
        case "Eng":
            subjectName = "English";
            break;
        default:
            subjectName = "KS3";
    }
    welcomeTitle.textContent = `Welcome to Year 9 ${subjectName} Quiz`;
}

// Load quiz for selected subject and date
async function loadQuizForSubject(subject) {
    const { questions, quizSubject: loadedSubject } = await loadQuestions(subject);
    quizQuestions = questions;
    quizSubject = loadedSubject;
    setSubject();
    initializeQuiz();
}

// Listen for subject selection change
subjectSelect.addEventListener("change", (e) => {
    selectedSubject = e.target.value;
    updateWelcomeTitle(selectedSubject);
});

// Start quiz button click handler
startBtn.addEventListener("click", () => {
    if (!selectedSubject) {
        console.log("No subject selected, showing notification");
        // Show visible notification message below subject selection
        let notification = document.querySelector(".subject-notification");
        if (!notification) {
            notification = document.createElement("div");
            notification.className = "subject-notification";
            // Add inline styles for debugging visibility
            notification.style.cssText = "color: white; background-color: #ff0000; margin-top: 5px; font-weight: bold; padding: 10px; border-radius: 5px; border: 2px solid #cc0000; max-width: 300px;";
            // Insert notification inside welcome_message after subjectSelect
            const welcomeMessage = document.querySelector('.welcome_message');
            if (welcomeMessage && subjectSelect) {
                welcomeMessage.insertBefore(notification, subjectSelect.nextSibling);
            } else if (subjectSelect) {
                subjectSelect.insertAdjacentElement('afterend', notification);
            }
        }
        notification.textContent = "Please select a subject before starting the quiz.";
        return;
    }
    // Remove notification if present
    let notification = document.querySelector(".subject-notification");
    if (notification) {
        notification.remove();
    }
    loadQuizForSubject(selectedSubject);
    info_box.classList.add("activeInfo"); // Show info box

    // Hide subject selection dropdown and label after starting quiz
    const subjectLabel = document.querySelector('label[for="subjectSelect"]');
    if (subjectLabel) subjectLabel.style.display = 'none';
    if (subjectSelect) subjectSelect.style.display = 'none';
});

updateWelcomeTitle(selectedSubject);

/* Rest of the code remains unchanged */
let start_btn = document.querySelector(".start_btn button");
let info_box = document.querySelector(".info_box");
let exit_btn = info_box.querySelector(".buttons .quit");
let continue_btn = info_box.querySelector(".buttons .restart");
let quiz_box = document.querySelector(".quiz_box");
let result_box = document.querySelector(".result_box");
let option_list; // Declare option_list in a broader scope
let bottom_ques_counter; // Declare bottom_ques_counter in a broader scope
let next_btn; // Declare next_btn in a broader scope
let time_line = document.querySelector("header .time_line");
let timeText = document.querySelector(".timer .time_left_txt");
let timeCount = document.querySelector(".timer .timer_sec");

function initializeQuiz() {
    // Selecting all required elements
    start_btn = document.querySelector(".start_btn button");
    info_box = document.querySelector(".info_box");
    exit_btn = info_box.querySelector(".buttons .quit");
    continue_btn = info_box.querySelector(".buttons .restart");
    quiz_box = document.querySelector(".quiz_box");
    result_box = document.querySelector(".result_box");
    option_list = document.querySelector(".option_list"); // Initialize option_list here
    bottom_ques_counter = document.querySelector("footer .total_que"); // Initialize bottom_ques_counter here
    next_btn = document.querySelector("footer .next_btn"); // Initialize next_btn here
    time_line = document.querySelector("header .time_line");
    timeText = document.querySelector(".timer .time_left_txt");
    timeCount = document.querySelector(".timer .timer_sec");

// Event listeners for buttons
start_btn.onclick = () => {
    info_box.classList.add("activeInfo"); // Show info box
};

// Quit button in info box (exit quiz before starting)
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // Hide info box

    // Show welcome message container
    const welcomeMessage = document.querySelector('.welcome_message');
    if (welcomeMessage) welcomeMessage.style.display = 'block';

    // Show subject selection dropdown and label by removing inline display style
    const subjectLabel = document.querySelector('label[for="subjectSelect"]');
    if (subjectLabel) subjectLabel.style.display = '';
    if (subjectSelect) subjectSelect.style.display = '';

    // Reset subject selection dropdown to placeholder
    subjectSelect.value = "";
    selectedSubject = "";
    updateWelcomeTitle(selectedSubject);

    // Enable start button if disabled
    startBtn.disabled = true;
};

continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // Hide info box
    quiz_box.classList.add("activeQuiz"); // Show quiz box
    showQuestions(0); // Calling showQuestions function
    queCounter(1); // Passing 1 parameter to queCounter
    startTimer(120); // Calling startTimer function
    startTimerLine(0); // Calling startTimerLine function
};

    const restart_quiz = result_box.querySelector(".buttons .restart");
    const quit_quiz = result_box.querySelector(".buttons .quit");

    // Restart quiz
    restart_quiz.onclick = () => {
        quiz_box.classList.add("activeQuiz"); // Show quiz box
        result_box.classList.remove("activeResult"); // Hide result box
        resetQuiz();
    };

// Quit quiz
quit_quiz.onclick = () => {
    // Hide quiz and result boxes
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.remove("activeResult");
    info_box.classList.remove("activeInfo");

    // Show welcome message container
    const welcomeMessage = document.querySelector('.welcome_message');
    if (welcomeMessage) welcomeMessage.style.display = 'block';

    // Show subject selection dropdown and label by removing inline display style
    const subjectLabel = document.querySelector('label[for="subjectSelect"]');
    if (subjectLabel) subjectLabel.style.display = '';
    if (subjectSelect) subjectSelect.style.display = '';

    // Reset subject selection dropdown to placeholder
    subjectSelect.value = "";
    selectedSubject = "";
    updateWelcomeTitle(selectedSubject);

    // Enable start button if disabled
    startBtn.disabled = true;
};

    // Next question button
    next_btn.onclick = () => {
        if (que_count < quizQuestions.length - 1) { // If question count is less than total question length
            que_count++; // Increment the que_count value
            que_numb++; // Increment the que_numb value
            showQuestions(que_count); // Calling showQuestions function
            queCounter(que_numb); // Passing que_numb value to queCounter
            clearInterval(counter); // Clear counter
            clearInterval(counterLine); // Clear counterLine
            startTimer(timeValue); // Calling startTimer function
            startTimerLine(widthValue); // Calling startTimerLine function
            timeText.textContent = "Time Left"; // Change the timeText to Time Left
            next_btn.classList.remove("show"); // Hide the next button
        } else {
            clearInterval(counter); // Clear counter
            clearInterval(counterLine); // Clear counterLine
            showResult(); // Calling showResult function
        }
    };
}

let timeValue = 120;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// Reset quiz function
function resetQuiz() {
    timeValue = 120;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count); // Calling showQuestions function
    queCounter(que_numb); // Passing que_numb value to queCounter
    clearInterval(counter); // Clear counter
    clearInterval(counterLine); // Clear counterLine
    startTimer(timeValue); // Calling startTimer function
    startTimerLine(widthValue); // Calling startTimerLine function
    timeText.textContent = "Time Left"; // Change the text of timeText to Time Left
    next_btn.classList.remove("show"); // Hide the next button
}

// Getting questions and options from array
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");

    // Creating a new span and div tag for question and option and passing the value using array index
    let que_tag = '<span>' + quizQuestions[index].numb + ". " + quizQuestions[index].question + '</span>';
    let option_tag = quizQuestions[index].options.map(option => `<div class="option"><span>${option}</span></div>`).join('');
    que_text.innerHTML = que_tag; // Adding new span tag inside que_tag
    option_list.innerHTML = option_tag; // Adding new div tag inside option_tag

    const option = option_list.querySelectorAll(".option");

    // Set onclick attribute to all available options using event listeners
    option.forEach((opt) => {
        opt.addEventListener("click", () => optionSelected(opt));
    });
}

// Creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// If user clicked on option
function optionSelected(answer) {
    clearInterval(counter); // Clear counter
    clearInterval(counterLine); // Clear counterLine
    let userAns = answer.textContent; // Getting user selected option
    let correcAns = quizQuestions[que_count].answer; // Getting correct answer from array
    const allOptions = option_list.children.length; // Getting all option items

    if (userAns == correcAns) { // If user selected option is equal to array's correct answer
        userScore += 1; // Upgrading score value with 1
        answer.classList.add("correct"); // Adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Adding tick icon to correct selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    } else {
        answer.classList.add("incorrect"); // Adding red color to incorrect selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Adding cross icon to incorrect selected option
        console.log("Wrong Answer");

        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) { // If there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); // Adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Adding tick icon to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); // Once user selects an option then disable all options
    }
    next_btn.classList.add("show"); // Show the next button if user selected any option
}

function showResult() {
    info_box.classList.remove("activeInfo"); // Hide info box
    quiz_box.classList.remove("activeQuiz"); // Hide quiz box
    result_box.classList.add("activeResult"); // Show result box
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3) { // If user scored more than 3
        let scoreTag = '<span>and congrats! 🎉, You got <p>' + userScore + '</p> out of <p>' + quizQuestions.length + '</p></span>';
        scoreText.innerHTML = scoreTag; // Adding new span tag inside score_Text
    } else if (userScore > 1) { // If user scored more than 1
        let scoreTag = '<span>and nice 😎, You got <p>' + userScore + '</p> out of <p>' + quizQuestions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else { // If user scored less than 1
        let scoreTag = '<span>and sorry 😐, You got only <p>' + userScore + '</p> out of <p>' + quizQuestions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; // Changing the value of timeCount with time value
        time--; // Decrement the time value
        if (time < 9) { // If timer is less than 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; // Add a 0 before time value
        }
        if (time < 0) { // If timer is less than 0
            clearInterval(counter); // Clear counter
            timeText.textContent = "Time Off"; // Change the time text to time off
            const allOptions = option_list.children.length; // Getting all option items
            let correcAns = quizQuestions[que_count].answer; // Getting correct answer from array
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) { // If there is an option which is matched to an array answer
                    option_list.children[i].setAttribute("class", "option correct"); // Adding green color to matched option
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // Adding tick icon to matched option
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); // Once user selects an option then disable all options
            }
            next_btn.classList.add("show"); // Show the next button if user selected any option
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1; // Upgrading time value with 1
        time_line.style.width = time + "px"; // Increasing width of time_line with px by time value
        if (time > 549) { // If time value is greater than 549
            clearInterval(counterLine); // Clear counterLine
        }
    }
}

function queCounter(index) {
    // Creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>' + index + '</p> of <p>' + quizQuestions.length + '</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag; // Adding new span tag inside bottom_ques_counter
}
