// JavaScript code for VAT Calculator
const calculate = document.getElementById('calculate');
const input = document.getElementById('input');
const taxableResult = document.getElementsByClassName('taxable');

const standard = document.getElementById('standard');
const standardLocal = document.getElementById('standard-input');
const flatLocal = document.getElementById('flat-input');
const flat = document.getElementById('flat');
const selected = document.getElementById('selected');

// Tax Rates
const covid = 10 / 1219;
const nhil = 25 / 1219;
const getfund = 25 / 1219;
const vat = 159 / 1219;

// Flat Rates
const flatRate = 0.03;
const vatRate = 0.15;
const covidRate = 0.01;

// Standard Inputs
const localInputRate = 3 / 103; 
const localStandardInputRate = 159 / 1219;

/**
 * Truncate number to two decimal places
 */
function truncateToTwoDecimals(num) {
    return Math.floor(num * 100) / 100;
}

/**
 * Format number with commas
 */
function formatWithCommas(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Format input while typing
 */
input.addEventListener('input', (event) => {
    let rawValue = input.value.replace(/,/g, ''); // Remove existing commas
    let cursorPosition = input.selectionStart;
    
    if (!/^\d*\.?\d*$/.test(rawValue)) {
        input.value = input.value.slice(0, -1); // Prevent invalid characters
        return;
    }

    let parts = rawValue.split('.');
    let integerPart = parts[0] ? parseInt(parts[0], 10).toLocaleString() : '';
    let decimalPart = parts[1] !== undefined ? '.' + parts[1] : '';

    input.value = integerPart + decimalPart;

    // Keep cursor at the end
    input.setSelectionRange(input.value.length, input.value.length);
});


/**
 * Handle calculation button click
 */
calculate.addEventListener('click', () => {
    let value = parseFloat(input.value.replace(/,/g, ''));

    if (isNaN(value) || value <= 0) {
        alert('Please enter a valid number');
        return;
    }

    if (standard.checked && selected.value === 'output') {
         document.querySelector(".output-flat").style.display = "none";
        calculateStandardOutput(value);

    } else if (standard.checked && selected.value === 'input' && standardLocal.checked) {
        // Show standard input
        document.querySelector(".inputs-standard").style.display = "block";
        document.querySelector(".inputs-flat").style.display = "none";
        document.querySelector(".outputs").style.display = "none";
        document.querySelector(".output-flat").style.display = "none";

        standardInput(value); // This covers standard 15%

    } else if (standard.checked && selected.value === 'input' && flatLocal.checked) {
        // Show flat input
        document.querySelector(".inputs-flat").style.display = "block";
        document.querySelector(".inputs-standard").style.display = "none";
        document.querySelector(".outputs").style.display = "none";
        document.querySelector(".output-flat").style.display = "none";

        standardInput(value); // This covers flat 3%

    } else if (flat.checked && selected.value === "output") {
        document.querySelector(".output-flat").style.display = "block";
        document.querySelector(".outputs").style.display = "none";
        document.querySelector(".inputs-flat").style.display = "none";
        document.querySelector(".inputs-standard").style.display = "none";

        calculateFlatOutput(value);
    }
});

/**
 * Hide input field for Flat Rate
 */
function hideInputValueForFlatRate() {
    const inputValueElement = document.querySelector(".input-value");

    if (flat.checked) {
        inputValueElement.style.display = "none";  // Hide input for Flat Rate
    } else {
        inputValueElement.style.display = "block"; // Show input when Flat is unchecked
    }
}

// Call the function whenever the checkbox state changes
flat.addEventListener('change', hideInputValueForFlatRate);
standard.addEventListener('change', hideInputValueForFlatRate);
// localDisplays.addEventListener('change', inputsCompute)
// inputsCompute()
hideInputValueForFlatRate(); // Initial check on page load


// Function to show/hide local-inputs
function localInputsDisplay() {
    const localInputs = document.querySelector(".local-inputs");
    const standardLocal = document.querySelector(".standard-input");
    const flatLocal = document.querySelector(".flat-input");

    if (standard.checked && selected.value === "input") {
        localInputs.style.display = "flex";
    } else {
        localInputs.style.display = "none";
    }
}

// Run it initially
localInputsDisplay() ;



// Re-run it when user switches between standard/flat
standard.addEventListener('change', localInputsDisplay);
flat.addEventListener('change', localInputsDisplay);

// Re-run it when the dropdown value changes
selected.addEventListener('change', localInputsDisplay);

// Optional: recheck when calculate is clicked
calculate.addEventListener('click', () => {
    localInputsDisplay() ; // Ensure visibility is updated
    // ... your existing calculation logic
});

/**
 * Calculate Standard Output
 */
function calculateStandardOutput(value) {
    let covidRate = truncateToTwoDecimals(value * covid);
    let nhilRate = truncateToTwoDecimals(value * nhil);
    let getFundRate = truncateToTwoDecimals(value * getfund);
    let vatRateValue = truncateToTwoDecimals(value * vat);
    
    let totalRates = truncateToTwoDecimals(covidRate + nhilRate + getFundRate + vatRateValue);
    let taxableSupply = truncateToTwoDecimals(value - totalRates);

    let totalLevies = truncateToTwoDecimals(covidRate + nhilRate + getFundRate);
    let taxableValue = truncateToTwoDecimals(taxableSupply + totalLevies);

    taxableResult[0].innerHTML = formatWithCommas(taxableSupply);
    taxableResult[1].innerHTML = formatWithCommas(nhilRate);
    taxableResult[2].innerHTML = formatWithCommas(getFundRate);
    taxableResult[3].innerHTML = formatWithCommas(covidRate);
    taxableResult[4].innerHTML = formatWithCommas(taxableValue);
    taxableResult[5].innerHTML = formatWithCommas(vatRateValue);
    taxableResult[6].innerHTML = formatWithCommas(totalLevies);

    document.querySelector(".outputs").style.display = "block";
    document.querySelector(".inputs").style.display = "none";
    document.querySelector(".output-flat").style.display = "none";
    document.querySelector(".input-flat").style.display = "none";
}

/**
 * Calculate Standard Input
 */
function standardInput(value) {
    //  local flat
    const flatResult = document.getElementsByClassName('flat-result');
    let localInput = truncateToTwoDecimals(value * localInputRate);
    localInput = value - localInput;

    // local standard rate
    let localStandardInput = truncateToTwoDecimals(value * localStandardInputRate);
    localStandardInput = value - localStandardInput;

    let vatRateFlat = truncateToTwoDecimals(0.03 * localInput);
    let vatRateStandard = truncateToTwoDecimals(0.15 * localStandardInput);

    flatResult[0].innerHTML = formatWithCommas(localInput);
    flatResult[1].innerHTML = formatWithCommas(vatRateFlat);
    flatResult[2].innerHTML = formatWithCommas(localStandardInput);
    flatResult[3].innerHTML = formatWithCommas(vatRateStandard);
}



/**
 * Calculate Flat Output
 */
function calculateFlatOutput(value) {
    const flatResult = document.getElementsByClassName('flat-rate');
    let vatNHIL = truncateToTwoDecimals(value * flatRate);
    let covidResult = truncateToTwoDecimals(value * covidRate);
    let totalVatFlat = truncateToTwoDecimals(vatNHIL + covidResult)

    flatResult[0].innerHTML = formatWithCommas(vatNHIL);
    flatResult[1].innerHTML = formatWithCommas(covidResult);
    flatResult[2].innerHTML = formatWithCommas(totalVatFlat);
}

/**
 * Display Current Year
 */
function updateYear() {
    let date = new Date();
    document.querySelector(".year").innerHTML = date.getFullYear();
}
updateYear();
