// ---------- Time Functionality ----------
const hours = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");

function updateTime() {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (currentHour === 0) {
        currentHour = 12;
    } else if (currentHour > 12) {
        currentHour -= 12;
    }

    const formattedHours = currentHour.toString();
    const formattedMinutes = currentMinute.toString().padStart(2, "0");

    hours.textContent = formattedHours;
    minutes.textContent = formattedMinutes;
}

setInterval(updateTime, 1000);
updateTime();

// ---------- Calculator Functionality ----------
function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    if (num2 === 0) {
        return "Error: Division by 0";
    }
    return num1 / num2;
}

// Helper function to check if input is an operator
function isOperator(char) {
    return ["+", "-", "×", "÷"].includes(char);
}

// Helper function to reset the calculator
function resetCalculator() {
    currentNumber = "";
    equation = [];
    result = "";
    hasResult = false;
    review.value = "";
    display.value = "0";
}

// Helper function to handle clearing result when starting a new input
function clearResultIfNeeded() {
    if (hasResult) {
        equation = [];
        hasResult = false;
    }
}

// ---------- Main Logic ----------
let currentNumber = "";
let equation = [];
let result = "";
let hasResult = false;

const review = document.getElementById("review");
const display = document.getElementById("display");
const buttons = Array.from(document.querySelectorAll(".button"));

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const buttonContent = e.target.innerText;

        // ---------- Number buttons ----------
        if (button.classList.contains("number")) {
            clearResultIfNeeded();
            currentNumber += buttonContent;
            display.value = equation.join("") + currentNumber;

        // ---------- Decimal button ----------
        } else if (button.classList.contains("decimal")) {
            if (!currentNumber.includes(".")) {
                currentNumber += ".";
                display.value = equation.join("") + currentNumber;
            }

        // ---------- Operator buttons ----------
        } else if (button.classList.contains("operand")) {
            const lastChar = equation[equation.length - 1];

            if (!currentNumber && (!lastChar || isOperator(lastChar))) {
                currentNumber = "0";
            }

            if (currentNumber || result) {
                clearResultIfNeeded();
                equation.push(currentNumber);
                currentNumber = "";
                equation.push(buttonContent);
                display.value = equation.join("");
            }

        // ---------- Equals button ----------
        } else if (button.classList.contains("equals")) {
            if (currentNumber || result) {
                equation.push(currentNumber);

                result = orderOfOperations(equation);
                review.value = equation.join("");
                display.value = result;

                currentNumber = result.toString();
                equation = [];
                hasResult = true;
            }

        // ---------- Clear button ----------
        } else if (button.classList.contains("clear")) {
            resetCalculator();
        }
    });
});

// Helper function to handle PEMDAS
function orderOfOperations(equation) {
    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "×": (a, b) => a * b,
        "÷": (a, b) => divide(a, b)
    };

    let newEquation = [];
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] === "×" || equation[i] === "÷") {
            const prev = parseFloat(newEquation.pop());
            const next = parseFloat(equation[++i]);
            const result = operators[equation[i - 1]](prev, next);

            if (typeof result === "string") {
                return result;
            }
            newEquation.push(result);
        } else {
            newEquation.push(equation[i]);
        }
    }

    let finalResult = parseFloat(newEquation[0]);
    for (let i = 1; i < newEquation.length; i += 2) {
        const operator = newEquation[i];
        const nextNumber = parseFloat(newEquation[i + 1]);
        finalResult = operators[operator](finalResult, nextNumber);
    }

    return finalResult;
}

// ---------- History Functionality ----------
const listIcon = document.querySelector(".list-icon");
const historyContainer = document.querySelector(".history-container");

listIcon.addEventListener("click", () => {
    historyContainer.classList.toggle("active");
    buttons.forEach(button => {
        button.classList.toggle("inactive");
    })
})