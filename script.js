// Time Functionality
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

// Calculator Functionality
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
        return "Error: Division by zero"
    }
    return num1 / num2;
}

function operate(num1, num2, operator) {
    if (operator === "+") {
        return add(num1, num2);
    } else if (operator === "−") {
        return subtract(num1, num2);
    } else if (operator === "×") {
        return multiply(num1, num2);
    } else if (operator === "÷") {
        return divide(num1, num2);
    } else {
        return "Error: Invalid operator"
    }
}

let currentNumber = "";
let firstNumber = "";
let operator = "";

const display = document.getElementById("display");
const buttons = Array.from(document.querySelectorAll(".button"));

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const value = e.target.innerText;

        // Number buttons
        if (button.classList.contains("number")) {
            currentNumber += value;
            display.value = currentNumber;

        // Decimal button
        } else if (button.classList.contains("decimal")) {
            if (!currentNumber.includes(".")) {
                currentNumber += ".";
                display.value = currentNumber;
            }

        // Operator buttons
        } else if (button.classList.contains("operand")) {
            if (currentNumber) {
                if (firstNumber && operator) {
                    firstNumber = operate(parseFloat(firstNumber), parseFloat(currentNumber), operator);
                    display.value = firstNumber;
                } else {
                    firstNumber = currentNumber;
                }
                operator = value;
                currentNumber = "";
            }

        // Equals button
        } else if (button.classList.contains("equals")) {
            if (firstNumber && operator && currentNumber) {
                display.value = operate(parseFloat(firstNumber), parseFloat(currentNumber), operator);
                currentNumber = display.value;
                firstNumber = "";
                operator = "";
            }

        // Clear button
        } else if (button.classList.contains("clear")) {
            currentNumber = "";
            firstNumber = "";
            operator = "";
            display.value = "0";
        }
    });
});