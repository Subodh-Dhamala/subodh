let firstNumber = '';
let secondNumber = '';
let step = 0;
let operation = null;
let result = 0;
let evaluated = false; // Added flag to track post-calculation state

let numArray = [];
let secondNumberArr = [];

const display = document.getElementById('display');

function getNumber(num) {
    if (step === 0 || step === 1) {
        if (evaluated) {
            numArray = []; // Clear numArray to start fresh after a result
            firstNumber = ''; // Reset firstNumber
            evaluated = false; // Reset evaluated flag
        }
        numArray.push(num);
        firstNumber = numArray.join('');
        display.value = firstNumber;
        step = 1;
    } else if (step === 2) {
        secondNumberArr.push(num);
        secondNumber = secondNumberArr.join('');
        display.value = secondNumber;
    }
}

function getOperator(operator) {
    if (step === 1 && firstNumber !== '') {
        step = 2;
        operation = operator;
        display.value = firstNumber + ' ' + operator;
    }
}

function calculateResult() {
    if (step === 2 && firstNumber !== '' && secondNumber !== '') {
        firstNumber = parseInt(firstNumber);
        secondNumber = parseInt(secondNumber);
        
        switch (operation) {
            case '+':
                result = firstNumber + secondNumber;
                break;
            case '-':
                result = firstNumber - secondNumber;
                break;
            case '*':
                result = firstNumber * secondNumber;
                break;
            case '/':
                if (secondNumber === 0) {
                    display.value = 'Error';
                    return;
                }
                result = firstNumber / secondNumber; 
                break;
        }

        display.value = result;
        firstNumber = result.toString();
        secondNumber = '';
        numArray = [firstNumber];
        secondNumberArr = [];
        step = 1;
        operation = null;
        evaluated = true; // Set evaluated to true after calculation
    }
}

function clearDisplay() {
    display.value = '0';
    firstNumber = '';
    secondNumber = '';
    step = 0;
    operation = null;
    result = 0;
    numArray = [];
    secondNumberArr = [];
    evaluated = false; // Reset evaluated flag
}

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
        getNumber(parseInt(key));
    } else if (['+', '-', '*', '/'].includes(key)) {
        getOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape' || key === 'c') {
        clearDisplay();
    }
});