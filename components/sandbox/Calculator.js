import css from 'styled-jsx/css'

export default css.global`
  .calculator {
    border: 1px solid #ccc;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    max-width: 100%;
    height:auto;
  }

  .calculator-screen {
    width: 100%;
    font-size: 5rem;
    height: 80px;
    max-height: 10%;
    border: none;
    background-color: #252525;
    color: #fff;
    text-align: right;
    padding-right: 20px;
    padding-left: 10px;
  }

  .calculator-keys {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 5px;
    padding: 5px;
  }

  button {
    height: 60px;
    border-radius: 3px;
    border: 1px solid #c4c4c4;
    font-size: 2rem;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.05), inset 0 1px 0 0 rgba(255,255,255,.45), inset 0 -1px 0 0 rgba(255,255,255,.15), 0 1px 0 0 rgba(255,255,255,.15);
    text-shadow: 0 1px rgba(255,255,255,.4);
  }

  button:hover {
    background-color: $on-secondary;
  }

  .all-clear {
    background-color: #f0595f;
    border-color: #b0353a;
    color: #fff;
  }

  .all-clear:hover {
    background-color: #f17377;
  }

  .digit {
    background-color: #2a3747;
    border-color: #2a3747;
    color: #fff;
  }

  .digit:hover {
    background-color: #fff;
    color: #000;
  }

  .operator {
    background-color: #fff;
    border-color: #fff;
    color: #000;
  }

  .operator:hover {
    background-color: #2a3747;
    color: #fff;
  }

  .equal-sign {
    background-color: #2e86c0;
    border-color: #337cac;
    color: #fff;
    height: 100%;
    grid-row: 2 / 6;
    grid-column: 4 / 5;
  }

  .equal-sign:hover {
    background-color: #4e9ed4;
  }
`