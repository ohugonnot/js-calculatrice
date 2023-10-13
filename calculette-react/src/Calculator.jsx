import React, {useEffect, useState} from 'react';
import './Calculator.css';
import {evaluate, sqrt} from 'mathjs'

const Calculator = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const inputRef = React.createRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleButtonClick = (value) => {
        const input = inputRef.current;
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;

        const newExpression =
            expression.substring(0, startPos) + value + expression.substring(endPos);
        setExpression(newExpression);


        input.focus();
        console.log(startPos);
        // Positionne le curseur après le texte inséré
        window.setTimeout(function () {
            input.setSelectionRange(startPos + 1, startPos + 1);
        }, 0)
    };

    const handleClear = () => {
        setExpression('');
        setResult('');
    };

    const handleCalculate = () => {
        try {
            const evaluatedResult = evaluate(expression);
            setResult(evaluatedResult);
        } catch (error) {
            setResult('Erreur');
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;

        if (/[0-9+\-*/().\n]/.test(key)) {

            handleButtonClick(key);
        } else if (key === 'Enter') {
            handleCalculate();
        }
    };

    return (
        <div className="calculator" tabIndex="0" onKeyPress={handleKeyPress}>
            <input
                ref={inputRef}
                id="calculator-screen"
                className="calculator-screen"
                type="text"
                value={expression}
                placeholder="0"
            />
            <div className="calculator-buttons">
                <button onClick={handleClear} className="clear-button">
                    AC
                </button>
                <button onClick={() => handleButtonClick('/')}>&#247;</button>
                <button onClick={() => handleButtonClick('*')}>&times;</button>
                <button onClick={() => handleButtonClick('7')}>7</button>
                <button onClick={() => handleButtonClick('8')}>8</button>
                <button onClick={() => handleButtonClick('9')}>9</button>
                <button onClick={() => handleButtonClick('-')}>-</button>
                <button onClick={() => handleButtonClick('4')}>4</button>
                <button onClick={() => handleButtonClick('5')}>5</button>
                <button onClick={() => handleButtonClick('6')}>6</button>
                <button onClick={() => handleButtonClick('+')}>+</button>
                <button onClick={() => handleButtonClick('1')}>1</button>
                <button onClick={() => handleButtonClick('2')}>2</button>
                <button onClick={() => handleButtonClick('3')}>3</button>
                <button onClick={() => handleButtonClick('sqrt')}>√</button>
                <button onClick={() => handleButtonClick('(')}>(</button>
                <button onClick={() => handleButtonClick(')')}>)</button>
                <button onClick={handleCalculate} className="equal-button">
                    =
                </button>
                <button onClick={() => handleButtonClick('0')}>0</button>
                <button onClick={() => handleButtonClick('.')}>.</button>
            </div>
            {result !== '' && (
                <div className="calculator-result">{result}</div>
            )}
        </div>
    );
};

export default Calculator;