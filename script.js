// ========== Time Functionality ==========
const timeHours = document.querySelector(".time-hours");
const timeMinutes = document.querySelector(".time-minutes");

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

    timeHours.textContent = formattedHours;
    timeMinutes.textContent = formattedMinutes;
}

setInterval(updateTime, 1000);
updateTime();

// ========== Operation Functionality ==========
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

// ========== Calculator Functionality ==========
let currentNumber = "";
let equation = [];
let result = "";
let hasResult = false;

const displayEquation = document.getElementById("display-equation");
const displayResult = document.getElementById("display-result");
const buttons = Array.from(document.querySelectorAll(".button"));

buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const buttonContent = e.target.innerText;

        // ========== Number Buttons ==========
        if (button.classList.contains("number")) {
            clearResultIfNeeded();
            currentNumber += buttonContent;
            displayResult.value = equation.join("") + currentNumber;
        }

        // ========== Decimal Button ==========
        else if (button.classList.contains("decimal")) {
            if (!currentNumber.includes(".")) {
                currentNumber += ".";
                displayResult.value = equation.join("") + currentNumber;
            }
        }

        // ========== Operator Buttons ==========
        else if (button.classList.contains("operand")) {
            const lastChar = equation[equation.length - 1];

            if (!currentNumber && (!lastChar || isOperator(lastChar))) {
                return;
            }

            if (currentNumber || result) {
                clearResultIfNeeded();
                equation.push(currentNumber);
                currentNumber = "";
                equation.push(buttonContent);
                displayResult.value = equation.join("");
            }
        }

        // ========== Equals Button ==========
        else if (button.classList.contains("equals")) {
            if (currentNumber || result) {
                equation.push(currentNumber);

                const evaluatedEquation = equation.map((item) => {
                    if (typeof item === "string" && item.includes("%")) {
                        return parseFloat(item) / 100;
                    } else {
                        return item;
                    }
                });

                result = orderOfOperations(evaluatedEquation);
                displayEquation.value = equation.join("");
                displayResult.value = result;

                const calculationEntry = document.createElement("div");
                calculationEntry.classList.add("calculation-entry");

                calculationEntry.innerHTML = `
                    <img src="images/delete.svg" alt="Delete Icon" class="entry-delete" style="display: none">
                    <div class="entry-container">
                        <div class="entry-equation">${displayEquation.value}</div>
                        <div class="entry-result">${result}</div>
                    </div>
                `;

                historyCalculationContainer.appendChild(calculationEntry);
                historyEmptyContainer.style.display = "none";

                currentNumber = result.toString();
                equation = [];
                hasResult = true;
            }
        }

        // ========== Clear Button ==========
        else if (button.classList.contains("clear")) {
            resetCalculator();
        }

        // ========== Plus/Minus Button ==========
        else if (button.classList.contains("plus-minus")) {
            if (currentNumber) {
                if (currentNumber.startsWith("-")) {
                    currentNumber = currentNumber.slice(1);
                } else {
                    currentNumber = "-" + currentNumber;
                }

                displayResult.value = equation.join("") + currentNumber;
            }
        }

        // ========== Percent Button ==========
        else if (button.classList.contains("percent")) {
            if (!currentNumber.includes("%")) {
                currentNumber += "%";
                displayResult.value = equation.join("") + currentNumber;
            }
        }
    });
});

// ========== Helper Functions (Calculator Functionality) ==========

// Clears the result when starting a new input
function clearResultIfNeeded() {
    if (hasResult) {
        equation = [];
        hasResult = false;
    }
}

// Checks if the input is an operator
function isOperator(char) {
    return ["+", "-", "×", "÷"].includes(char);
}

// Resets the calculator to its initial state
function resetCalculator() {
    currentNumber = "";
    equation = [];
    result = "";
    hasResult = false;
    displayEquation.value = "";
    displayResult.value = "0";
}

// Handles order of operations (PEMDAS)
function orderOfOperations(equation) {
    const operators = {
        "+": (a, b) => add(a, b),
        "-": (a, b) => subtract(a, b),
        "×": (a, b) => multiply(a, b),
        "÷": (a, b) => divide(a, b),
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

// ========== History Functionality ==========
const historyIcon = document.querySelector(".history-icon");
const historyContainer = document.querySelector(".history-container");
const historyEdit = document.querySelector(".history-edit");
const historyEmptyContainer = document.querySelector(".history-empty-container");
const historyCalculationContainer = document.querySelector(".history-calculation-container");
const calculatorContainer = document.querySelector(".calculator-container");

let isEditMode = false;

historyIcon.addEventListener("click", () => {
    historyContainer.classList.toggle("active");
    calculatorContainer.classList.toggle("inactive");

    if (historyContainer.classList.contains("active")) {
        if (historyCalculationContainer.children.length === 0) {
            historyEmptyContainer.style.display = "flex";
            historyEdit.style.display = "none";
        } else {
            historyEmptyContainer.style.display = "none";
            historyEdit.style.display = "block";
        }
    } else {
        historyEmptyContainer.style.display = "none";
    }

    resetEditMode();
});

historyEdit.addEventListener("click", () => {
    isEditMode = !isEditMode;
    const entryDelete = document.querySelectorAll(".entry-delete");

    entryDelete.forEach((entry) => {
        if (isEditMode) {
            entry.style.display = "block";
        } else {
            entry.style.display = "none";
        }
    });

    if (isEditMode) {
        historyEdit.textContent = "Done";
    } else {
        historyEdit.textContent = "Edit";
    }
});

historyCalculationContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("entry-delete")) {
        const entryToDelete = event.target.parentElement;
        historyCalculationContainer.removeChild(entryToDelete);

        if (historyCalculationContainer.children.length === 0) {
            document.querySelector(".history-empty-container").style.display = "flex";
            historyEdit.style.display = "none";
        }
    }
});

calculatorContainer.addEventListener("click", () => {
    if (historyContainer.classList.contains("active")) {
        historyContainer.classList.remove("active");
        calculatorContainer.classList.remove("inactive");
        resetEditMode();
    }
});

// ========== Helper Function (History Functionality) ==========

// Resets edit mode
function resetEditMode() {
    if (isEditMode) {
        isEditMode = false;
        historyEdit.textContent = "Edit";

        const entryDelete = document.querySelectorAll(".entry-delete");
        entryDelete.forEach((entry) => {
            entry.style.display = "none";
        });
    }
}
