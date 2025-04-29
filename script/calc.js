
const display = document.querySelector('.input-display');

// Format numbers with commas while preserving decimals
function formatWithCommas() {
    let rawValue = display.value.replace(/,/g, ""); // Remove existing commas
    let parts = rawValue.split(/([+\-*/])/); // Split expression into numbers and operators

    let formattedParts = parts.map(part => {
        if (!isNaN(part) && part.trim() !== "" && part !== ".") {
            let [integer, decimal] = part.split(".");
            integer = Number(integer).toLocaleString();
            return decimal !== undefined ? integer + "." + decimal : integer;
        }
        return part;
    });

    display.value = formattedParts.join(""); // Rejoin formatted expression
}

// Add input while preventing invalid cases
function calc(value) {
    let lastChar = display.value.slice(-1);

    // Prevent consecutive operators
    if (["+", "-", "*", "/"].includes(lastChar) && ["+", "-", "*", "/"].includes(value)) {
        return;
    }

    // Prevent multiple dots in a single number
    if (value === ".") {
        let lastNumberMatch = display.value.match(/(\d+\.\d*)$/);
        if (lastNumberMatch) return;
    }

    display.value += value;
    formatWithCommas();
    display.scrollLeft = display.scrollWidth; // <--- auto scroll to end
}


// Compute the result safely
function compute() {
    try {
        let rawValue = display.value.replace(/,/g, ""); // Remove commas

        // Convert percentages to decimal (e.g., 25% -> 0.25)
        rawValue = rawValue.replace(/(\d+\.?\d*)%/g, (match, num) => {
            return parseFloat(num) / 100;
        });

        display.value = new Function("return " + rawValue)();
        formatWithCommas();
    } catch (error) {
        display.value = 'Error';
    }
}

// Clear the display
function cleared() {
    display.value = "";
}

// Delete last character
function del() {
    display.value = display.value.slice(0, -1);
    formatWithCommas();
}

// Convert last number to percentage (e.g., 25 -> 0.25)
function percent() {
    let expression = display.value;
    let lastNumberMatch = expression.match(/(\d+\.?\d*)$/);

    if (lastNumberMatch) {
        let lastNumber = parseFloat(lastNumberMatch[0]);
        let newNumber = lastNumber / 100;
        display.value = expression.replace(/(\d+\.?\d*)$/, newNumber);
        formatWithCommas();
    }
}

// Auto-balance parentheses
function parenthesis() {
    let expression = display.value;
    let openCount = (expression.match(/\(/g) || []).length;
    let closeCount = (expression.match(/\)/g) || []).length;

    if (openCount > closeCount) {
        calc(')');
    } else {
        calc('(');
    }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    let key = event.key;
    let allowedKeys = /\d|[\+\-\*\/\.\(\)%]/;

    if (allowedKeys.test(key)) {
        calc(key);
        event.preventDefault();
    } else if (key === "Enter" || key === "=") {
        compute();
        event.preventDefault();
    } else if (key === "Backspace") {
        del();
        event.preventDefault();
    } else if (key === "Escape" || key === "Delete") {
        cleared();
        event.preventDefault();
    } else if (key === "%") {
        percent();
        event.preventDefault();
    } else if (key === "(" || key === ")") {
        parenthesis();
        event.preventDefault();
    }
});


function updateYear() {
    let date = new Date();
    document.querySelector(".year").innerHTML = date.getFullYear();
}
updateYear();


