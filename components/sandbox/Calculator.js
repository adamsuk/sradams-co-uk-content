import React from 'react'
import { evaluate } from 'mathjs';

var display_val = "";
var saved_val = 0;
var op = "";

var math_eval = (val1, val2, op) => {
  var ans = evaluate(+val1 + op + +val2);
  return (+ans);
}

const handleClick = ((event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }

  const className = event.target.className;

  if (className.split(' ').includes('digit')) {
    display_val += event.target.value;
    setScreenVal(display_val);
  } else if (className.split(' ').includes('operator')) {
    saved_val = display_val;
    display_val = "";
    op = event.target.value;
  } else if (className.split(' ').includes('equal-sign')) {
    if (display_val && saved_val && op) {
      display_val = math_eval(saved_val, display_val, op);
      saved_val = "";
      setScreenVal(+display_val);
    } else {
      return
    }
  } else if (className.split(' ').includes('all-clear')) {
    display_val = "";
    saved_val = "";
    op = "";
    setScreenVal("0");
  }
})

const setScreenVal = (val) => {
  document.getElementById("calculator-screen").value = +val;
}

const buttonClassNames = "button p-3 rounded-lg";
const digitClassNames = `digit ${buttonClassNames} bg-gray-800 border-gray-800 text-white hover:bg-white hover:text-black`;
const operatorClassNames = `operator ${buttonClassNames} bg-white border-white text-black hover:bg-gray-800 hover:text-white`;

const Calculator = (props) => {
  return (
    <div className="rounded absolute items-center max-w-full h-auto bg-gray-200 p-3" onClick={handleClick}>
      <input type="text" className="w-full rounded-lg text-6xl h-20 bg-gray-900 text-white text-right pr-5 pl-2 max-h-[150px]" id="calculator-screen" value="0" disabled />

      <div className="grid grid-cols-4 p-1 gap-2">
        <button type="button" className={digitClassNames} value="7">7</button>
        <button type="button" className={digitClassNames} value="8">8</button>
        <button type="button" className={digitClassNames} value="9">9</button>
        <button type="button" className={operatorClassNames} value="+">+</button>

        <button type="button" className={digitClassNames} value="4">4</button>
        <button type="button" className={digitClassNames} value="5">5</button>
        <button type="button" className={digitClassNames} value="6">6</button>
        <button type="button" className={operatorClassNames} value="-">-</button>

        <button type="button" className={digitClassNames} value="1">1</button>
        <button type="button" className={digitClassNames} value="2">2</button>
        <button type="button" className={digitClassNames} value="3">3</button>
        <button type="button" className={operatorClassNames} value="*">&times;</button>

        <button type="button" className={digitClassNames} value="0">0</button>
        <button type="button" className={digitClassNames} value=".">.</button>
        <button type="button" className={`all-clear ${buttonClassNames} bg-red-500 border-red-700 text-white hover:bg-red-400`} value="all-clear">AC</button>
        <button type="button" className={operatorClassNames} value="/">&divide;</button>

        <button type="button" className={`equal-sign ${buttonClassNames} col-span-4 bg-blue-600 border-blue-700 text-white h-full hover:bg-blue-500`} value="=">=</button>

      </div>
    </div>
  )
}

export default Calculator
