import React from 'react'
import Layout from '../../components/Layout'
import globalStyles from "../../components/sandbox/Calculator.js";
import { evaluate } from 'mathjs';

var display_val = "";
var saved_val = 0;
var op = "";

var math_eval = (val1, val2, op) => {
    // string display trick from
    // https://flaviocopes.com/how-to-convert-string-to-number-javascript/
    var ans = evaluate(+val1 + op + +val2);
    return (+ans);
}

const handleClick = ((event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
        return;
    }

    const className = event.target.className;
    console.log(className);

    if (className === 'digit') {
        display_val += event.target.value;
        setScreenVal(display_val);
    } else if (className === 'operator') {
        saved_val = display_val;
        display_val = "";
        op = event.target.value;
    } else if (className === "equal-sign") {
        if (display_val && saved_val && op) {
            display_val = math_eval(saved_val, display_val, op);
            saved_val = "";
            setScreenVal(+display_val);
        } else {
            return
        }
    } else if (className === "all-clear") {
        display_val = "";
        saved_val = "";
        op = "";
        setScreenVal("0");
    }
    console.log(`saved_val: ${saved_val}`);
    console.log(`display_val: ${display_val}`);
    console.log(`op: ${op}`);
})

const setScreenVal = (val) => {
    document.getElementById("calculator-screen").value = +val;
}


var calculator = () => {
    return (
        <Layout title="Calculator">
            <div className="calculator" onClick={handleClick}>
                <input type="text" className="calculator-screen" id="calculator-screen" value="0" disabled />

                <div className="calculator-keys">

                    <button type="button" className="operator" value="+">+</button>
                    <button type="button" className="operator" value="-">-</button>
                    <button type="button" className="operator" value="*">&times;</button>
                    <button type="button" className="operator" value="/">&divide;</button>

                    <button type="button" className="digit" value="7">7</button>
                    <button type="button" className="digit" value="8">8</button>
                    <button type="button" className="digit" value="9">9</button>

                    <button type="button" className="digit" value="4">4</button>
                    <button type="button" className="digit" value="5">5</button>
                    <button type="button" className="digit" value="6">6</button>

                    <button type="button" className="digit" value="1">1</button>
                    <button type="button" className="digit" value="2">2</button>
                    <button type="button" className="digit" value="3">3</button>

                    <button type="button" className="digit" value="0">0</button>
                    <button type="button" className="digit" value=".">.</button>
                    <button type="button" className="all-clear" value="all-clear">AC</button>

                    <button type="button" className="equal-sign" value="=">=</button>

                </div>
            </div>
            <style jsx global>
                {globalStyles}
            </style>
        </Layout>
    )
};

export default calculator