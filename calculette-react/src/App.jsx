import './assets/style.css'
import {useEffect, useRef, useState} from "react";

function App() {

    const [screen, setScreen] = useState("10000")
    const screenRef = useRef(null)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        screenRef.current.focus()
        screenRef.current.setSelectionRange(screen.length, screen.length)
    }, []);

    function replaceForEval(expression) {
        let regex = /√\(([^)]+)\)/g;

        // Remplacer √(x) par Math.sqrt(x) de manière récursive
        while (regex.test(expression)) {
            expression = expression.replace(regex, (_, innerExpression) => {
                return `Math.sqrt(${replaceForEval(innerExpression)})`;
            });
        }

        // Remplacer √x par Math.sqrt(x)
        expression = expression.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

        return expression;
    }

    const addToScreen = (input) => {
        if (screen === "0" || screen === "undefined") {
            setScreen("")
        }
        setError(false)
        const screenEl = screenRef.current;
        const startPos = screenEl.selectionStart;
        const endPos = screenEl.selectionEnd;

        switch (true) {
            case /[0-9]/.test(input) || [".", "(", ")", '√', "+", "-", "%", "*", "/"].includes(input):
                if (input === '√') {
                    setScreen((oldScreen) => oldScreen.substring(0, startPos) + `${input}(` + oldScreen.substring(startPos, endPos) + ')' + oldScreen.substring(endPos))
                    let pos = Math.min(endPos + 3, screen.length + 1)
                    setTimeout(() => screenEl.setSelectionRange(pos, pos), 0)
                } else {
                        setScreen((oldScreen) => oldScreen.substring(0, startPos) + input + oldScreen.substring(endPos))
                    let pos = Math.min(startPos + 1, screen.length + 1)
                    setTimeout(() => screenEl.setSelectionRange(pos, pos), 0)
                }
                break
            case input === 'C':
                if (endPos > startPos) {
                    setScreen((oldScreen) => oldScreen.substring(0, startPos) + oldScreen.substring(endPos))
                    let pos = Math.max(startPos, 0)
                    setTimeout(() => screenEl.setSelectionRange(pos, pos), 0)
                } else {
                    setScreen((oldScreen) => oldScreen.substring(0, startPos - 1) + oldScreen.substring(startPos))
                    let pos = Math.max(startPos - 1, 0)
                    setTimeout(() => screenEl.setSelectionRange(pos, pos), 0)
                }

                break
            case input === 'del':
                setScreen("")
                setResult(null)
                break
            case input === '=':
                try {
                    let calcul = eval(replaceForEval(screen))
                    setResult(calcul)
                    setError(false)
                } catch (e) {
                    setError(true)
                }
                break
        }


    }

    const handleKeyPress = (event) => {
        const {key} = event;
        switch (true) {
            case /[0-9+\-*/().%]/.test(key):
                addToScreen(key);
                break
            case key === 'Enter':
                addToScreen('=');
                break
            case key === 'Backspace':
                addToScreen('C');
                break
            case key === 'r':
                addToScreen('√');
                break
            case key === 'Delete':
                addToScreen('del');
                break
        }
    };

    return (
        <>
            <h1>Ma Super Calculette Objet</h1>
            <div className="container" onKeyDown={handleKeyPress}>
                <div className="header">Calculator</div>
                <textarea ref={screenRef} style={{color: error ? 'red' : 'black'}} className="screen" id="display"
                          readOnly={true}
                          onBlur={(e) => e.target.focus()}
                          value={screen}/>
                {error &&
                    <p style={{color: "red"}}>Erreur de calcul</p>
                }
                {!error && result &&
                    <p onClick={() => setScreen(`${result}`)} className={"float-right result"}>{result}</p>
                }
                <div className="first-row">
                    <input onClick={() => addToScreen('√')} className="global operation" name="" type="button"
                           value="&radic;"/>
                    <input onClick={() => addToScreen('(')} className="global chiffre" name="" type="button" value="("/>
                    <input onClick={() => addToScreen(')')} className="global chiffre" name="" type="button" value=")"/>
                    <input onClick={() => addToScreen('%')} className="global operation" name="" type="button"
                           value="%"/>
                </div>
                <div className="second-row">
                    <input onClick={() => addToScreen(7)} className="global chiffre" name="" type="button" value="7"/>
                    <input onClick={() => addToScreen(8)} className="global chiffre" name="" type="button" value="8"/>
                    <input onClick={() => addToScreen(9)} className="global chiffre" name="" type="button" value="9"/>
                    <input onClick={() => addToScreen('/')} className="global operation" name="" type="button"
                           value="/"/>
                </div>
                <div className="third-row">
                    <input onClick={() => addToScreen(4)} className="global chiffre" name="" type="button" value="4"/>
                    <input onClick={() => addToScreen(5)} className="global chiffre" name="" type="button" value="5"/>
                    <input onClick={() => addToScreen(6)} className="global chiffre" name="" type="button" value="6"/>
                    <input onClick={() => addToScreen("*")} className="global operation" name="" type="button"
                           value="*"/>
                </div>
                <div className="fourth-row">
                    <input onClick={() => addToScreen(1)} className="global chiffre" name="" type="button" value="1"/>
                    <input onClick={() => addToScreen(2)} className="global chiffre" name="" type="button" value="2"/>
                    <input onClick={() => addToScreen(3)} className="global chiffre" name="" type="button" value="3"/>
                    <input onClick={() => addToScreen('-')} className="global operation" name="" type="button"
                           value="-"/>
                </div>
                <div className="conflict">
                    <div className="left">
                        <input onClick={() => addToScreen(0)} className="chiffre big" name="" type="button" value="0"/>
                        <input onClick={() => addToScreen('.')} className="chiffre small" name="" type="button"
                               value="."/>
                        <input onClick={() => addToScreen('del')} className=" red small white-text top-margin operation"
                               name="" type="button"
                               value="Del"/>
                        <input onClick={() => addToScreen('C')} className=" grey small top-margin operation"
                               name="" type="button" value="C"/>
                        <input onClick={() => addToScreen('+')} className=" grey small top-margin operation"
                               name="" type="button" value="+"/>
                    </div>
                    <div className="right">
                        <input onClick={() => addToScreen('=')} className="global white-text green plus operation"
                               id='plus'
                               name=""
                               type="button" value="="/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
