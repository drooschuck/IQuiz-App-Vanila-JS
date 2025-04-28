// Function to dynamically import questions based on a given date or the current date if none is provided
async function loadQuestions(dateString, folderPath) {
    // If no date is provided, use the current date
    if (!dateString) {
        const today = new Date();
        dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }

    // Validate the date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateString)) {
        console.error("Invalid date format. Please use 'YYYY-MM-DD'.");
        return []; // Return an empty array for invalid date
    }

    // Construct the file path
    const filePath = `${folderPath}/Y9_Sc_Phy_${dateString}.js`;

    try {
        const module = await import(filePath);
        return module.questions; // Assuming the questions are exported as 'questions'
    } catch (error) {
        console.error(`Error loading questions from ${filePath}:`, error);
        // Fallback to a default set of questions or handle the error as needed
        return []; // Return an empty array or a default set of questions
    }
}

// Example usage
const folder = '../data/Sc/Phys'; // Specify the folder path

// Load questions for the current date
loadQuestions(null, folder).then(questions => {
   console.log("Questions for today:", questions); // Handle the loaded questions
});

// Load questions for a specific date
const dateToLoad = '2025-04-26'; // Specify the date to load questions for
loadQuestions(dateToLoad, folder).then(questions => {
    console.log(`Questions for ${dateToLoad}:`, questions); // Handle the loaded questions
});

// Load questions when the script runs
let quizQuestions = []; // Renamed from questions to quizQuestions
loadQuestions(null, folder).then(loadedQuestions => {
    quizQuestions = loadedQuestions; // Use the renamed variable
    initializeQuiz();
});

let  start_btn = document.querySelector(".start_btn button");
let  info_box = document.querySelector(".info_box");
let  exit_btn = info_box.querySelector(".buttons .quit");
let  continue_btn = info_box.querySelector(".buttons .restart");
let  quiz_box = document.querySelector(".quiz_box");
let  result_box = document.querySelector(".result_box");
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
    next_btn = document.querySelector("footer .next_btn");// Initialize  next_btn  here
    time_line = document.querySelector("header .time_line");
    timeText = document.querySelector(".timer .time_left_txt");
    timeCount = document.querySelector(".timer .timer_sec");

    // Event listeners for buttons
    start_btn.onclick = () => {
        info_box.classList.add("activeInfo"); // Show info box
    };

    exit_btn.onclick = () => {
        info_box.classList.remove("activeInfo"); // Hide info box
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
        window.location.reload(); // Reload the current window
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
        option_list.children[i].classList.add("disabled"); // Once user select an option then disable all options
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
                option_list.children[i].classList.add("disabled"); // Once user select an option then disable all options
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