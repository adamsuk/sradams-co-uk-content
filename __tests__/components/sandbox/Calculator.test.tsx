import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Calculator from '../../../components/sandbox/Calculator';

function getScreen() {
  return screen.getByRole('textbox') as HTMLInputElement;
}

function clickButton(label: string) {
  const btn = screen.getByRole('button', { name: label });
  fireEvent.click(btn);
}

function clickAC() {
  clickButton('AC');
}

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />);
    clickAC();
  });

  it('renders the calculator screen with default value of 0', () => {
    expect(getScreen()).toHaveValue('0');
  });

  it('renders digit buttons 0–9 and operators', () => {
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument();
  });

  it('displays a digit when a digit button is clicked', () => {
    clickButton('5');
    expect(getScreen()).toHaveValue('5');
  });

  it('appends multiple digits', () => {
    clickButton('1');
    clickButton('2');
    expect(getScreen()).toHaveValue('12');
  });

  it('performs addition correctly', () => {
    clickButton('3');
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    clickButton('4');
    clickButton('=');
    expect(getScreen()).toHaveValue('7');
  });

  it('performs subtraction correctly', () => {
    clickButton('9');
    fireEvent.click(screen.getByRole('button', { name: '-' }));
    clickButton('3');
    clickButton('=');
    expect(getScreen()).toHaveValue('6');
  });

  it('performs multiplication correctly', () => {
    clickButton('6');
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    clickButton('7');
    clickButton('=');
    expect(getScreen()).toHaveValue('42');
  });

  it('performs division correctly', () => {
    clickButton('8');
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    clickButton('2');
    clickButton('=');
    expect(getScreen()).toHaveValue('4');
  });

  it('resets to 0 when AC is pressed', () => {
    clickButton('5');
    clickButton('=');
    clickAC();
    expect(getScreen()).toHaveValue('0');
  });

  it('does not evaluate when second operand is missing', () => {
    clickButton('5');
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    // Press = without entering a second number — should not crash
    clickButton('=');
    // displayVal is empty so condition fails; screen retains last shown value
    expect(getScreen()).toHaveValue('5');
  });
});
