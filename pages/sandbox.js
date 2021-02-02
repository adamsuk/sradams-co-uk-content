import React from 'react'
import Layout from '../components/Layout'

function calc() {
    // +  -  *  /   %  ^   SQRT.
    var ans = "TBC";
    var [val1, val2, op] = getVals();
    ans = perf_calc(val1, val2, op);
    setAns(ans);
}

function perf_calc(val1, val2, op) {
    // use a switch to determine the maths func
    var ans;
    switch (op) {
        case 'add':
        ans = (val1 + val2).toString();
        break;
        case 'sub':
        ans = (val1 - val2).toString();
        break;
        case 'mult':
        ans = (val1 * val2).toString();
        break;
        case 'div':
        ans = (val1 / val2).toString();
        break;
        case 'mod':
        ans = (val1 % val2).toString();
        break;
        case 'pow':
        ans = (Math.pow(val1, val2)).toString();
        break;
        case 'sqrt':
        ans = (Math.sqrt(val1)).toString();
        break;
        default:
        ans = "Unsupported Operation"
    }
    return ans;
}

function getVals() {
    var val1 = parseFloat(document.getElementById("val1").value);
    var val2 = parseFloat(document.getElementById("val2").value);
    var mathsOp = document.getElementById("mathsOp").value;
    return [val1, val2, mathsOp];
}

function setAns(val="TBC") {
    document.getElementById("ansText").innerHTML = val; //number;
}

function assessSelects() {
    // obtain current values
    var [val1, val2, op] = getVals();
    if (op == 'sqrt') {
        document.getElementById("val2").disabled = true;
    } else {
        document.getElementById("val2").disabled = false;
    }
}

const Calculator = () => <Layout title="Calculator">
    <body onLoad={setAns}>
        <form>
        Input Value 1: <input type="number" id="val1"></input>
        <br></br>
        Input Value 2: <input type="number" id="val2"></input>
        <br></br>
        <select id="mathsOp" onChange={assessSelects}>
                <option selected disabled>Maths Operator</option>
                <option value="add">add</option>
                <option value="sub">sub</option>
                <option value="mult">mult</option>
                <option value="div">div</option>
                <option value="mod">mod</option>
                <option value="pow">pow</option>
                <option value="sqrt">sqrt</option>
        </select>
        <br></br>
        <input type="button" value="Submit" id="submit" onClick={calc}></input>
        </form>
        <p>ANSWER: <span id="ansText"></span></p>
    </body>
    </Layout>

export default Calculator