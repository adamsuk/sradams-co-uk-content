import React from 'react';
import { evaluate } from 'mathjs';

let displayVal = '';
let savedVal = 0;
let op = '';

const mathEval = (val1, val2, operation) => {
  const ans = evaluate(+val1 + operation + +val2);
  return +ans;
};

const setScreenVal = (val) => {
  document.getElementById('calculator-screen').value = +val;
};

const handleClick = (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }

  const { className } = event.target;

  if (className.split(' ').includes('digit')) {
    displayVal += event.target.value;
    setScreenVal(displayVal);
  } else if (className.split(' ').includes('operator')) {
    savedVal = displayVal;
    displayVal = '';
    op = event.target.value;
  } else if (className.split(' ').includes('equal-sign')) {
    if (displayVal && savedVal && op) {
      displayVal = mathEval(savedVal, displayVal, op);
      savedVal = '';
      setScreenVal(+displayVal);
    }
  } else if (className.split(' ').includes('all-clear')) {
    displayVal = '';
    savedVal = '';
    op = '';
    setScreenVal('0');
  }
};

const buttonClassNames = 'button p-3 rounded-lg';
const digitClassNames = `digit ${buttonClassNames} bg-gray-800 border-gray-800 text-white hover:bg-white hover:text-black`;
const operatorClassNames = `operator ${buttonClassNames} bg-white border-white text-black hover:bg-gray-800 hover:text-white`;

function Calculator() {
  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="rounded absolute items-center max-w-full h-auto bg-gray-200 p-3"
      onClick={handleClick}
    >
      <input
        type="text"
        className="w-full rounded-lg text-6xl h-20 bg-gray-900 text-white text-right pr-5 pl-2 max-h-[150px]"
        id="calculator-screen"
        value="0"
        disabled
      />

      <div className="grid grid-cols-4 p-1 gap-2">
        <button type="button" className={digitClassNames} value="7">
          7
        </button>
        <button type="button" className={digitClassNames} value="8">
          8
        </button>
        <button type="button" className={digitClassNames} value="9">
          9
        </button>
        <button type="button" className={operatorClassNames} value="+">
          +
        </button>

        <button type="button" className={digitClassNames} value="4">
          4
        </button>
        <button type="button" className={digitClassNames} value="5">
          5
        </button>
        <button type="button" className={digitClassNames} value="6">
          6
        </button>
        <button type="button" className={operatorClassNames} value="-">
          -
        </button>

        <button type="button" className={digitClassNames} value="1">
          1
        </button>
        <button type="button" className={digitClassNames} value="2">
          2
        </button>
        <button type="button" className={digitClassNames} value="3">
          3
        </button>
        <button type="button" className={operatorClassNames} value="*">
          &times;
        </button>

        <button type="button" className={digitClassNames} value="0">
          0
        </button>
        <button type="button" className={digitClassNames} value=".">
          .
        </button>
        <button
          type="button"
          className={`all-clear ${buttonClassNames} bg-red-500 border-red-700 text-white hover:bg-red-400`}
          value="all-clear"
        >
          AC
        </button>
        <button type="button" className={operatorClassNames} value="/">
          &divide;
        </button>

        <button
          type="button"
          className={`equal-sign ${buttonClassNames} col-span-4 bg-blue-600 border-blue-700 text-white h-full hover:bg-blue-500`}
          value="="
        >
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;
