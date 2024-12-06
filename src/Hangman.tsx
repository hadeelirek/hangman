import { useState, useRef, useEffect, FormEvent } from 'react';
import './Hangman.css';

const Hangman = () => {
    const [word, setWord] = useState<string>('');
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [errors, setErrors] = useState<number>(0);
    const [gameStage, setGameStage] = useState<'input' | 'guessing'>('input');
    const maxErrors = 6;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const guessRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (gameStage === 'input') {
            inputRef.current?.focus();
        } else {
            guessRef.current?.focus();
        }
    }, [gameStage]);

    const handleWordSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (word.length < 1 || !/^[a-zA-Z]+$/.test(word)) {
            alert('Please enter a valid word with no numbers!');
            return;
        }
        setWord(word.toLowerCase());
        setGuessedLetters([]);
        setErrors(0);
        setCurrentGuess('');
        setGameStage('guessing');
    };

    const handleGuessSubmit = (e: FormEvent) => {
        e.preventDefault();
        const guess = currentGuess.toLowerCase();
        if (guessedLetters.includes(guess) || guess.length !== 1 || !/^[a-zA-Z]$/.test(guess)) {
            alert('Please enter a valid and new letter!');
            return;
        }

        setGuessedLetters([...guessedLetters, guess]);

        if (!word.includes(guess)) {
            setErrors(errors + 1);
        }
        setCurrentGuess('');
    };

    const handleLetterClick = (letter: string) => {
        if (!guessedLetters.includes(letter) && !isGameOver()) {
            setGuessedLetters((prev) => [...prev, letter]); 
            if (!word.includes(letter)) {
                setErrors((prev) => prev + 1);
            }
        }
    };

    const renderWord = () => {
        return word.split('').map((letter, index) => (
            <span key={index} style={{ margin: '0 5px' }}>
                {guessedLetters.includes(letter) ? letter : 'x'}
            </span>
        ));
    };

    const renderLetterBoard = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        return (
            <div className="letter-board">
                {alphabet.map(letter => {
                    const isGuessed = guessedLetters.includes(letter);
                    return (
                        <button 
                            key={letter} 
                            className={`letter ${isGuessed ? (word.includes(letter) ? 'correct' : 'incorrect') : ''}`}
                            onClick={() => handleLetterClick(letter)}
                            disabled={isGuessed}
                        >
                            {isGuessed && !word.includes(letter) ? '/' + letter : letter}
                        </button>
                    );
                })}
            </div>
        );
    };

    const isGameOver = () => {
        return errors >= maxErrors || isWinner();
    };

    const isWinner = () => {
        return word.split('').every(letter => guessedLetters.includes(letter));
    };

    const resetGame = () => {
        setWord('');
        setGuessedLetters([]);
        setErrors(0);
        setCurrentGuess('');
        setGameStage('input');
    };

    return (
        <div className="game-container">
            <div className="hangman-drawing">
                {!isGameOver() && (
                    <div className={"hangman stage-" + Math.min(errors, maxErrors)}>
                        <div className="gallows"></div>
                        {errors >= 1 && <div className="head"></div>}
                        {errors >= 2 && <div className="body"></div>}
                        {errors >= 3 && <div className="left-arm"></div>}
                        {errors >= 4 && <div className="right-arm"></div>}
                        {errors >= 5 && <div className="left-leg"></div>}
                        {errors >= 6 && <div className="right-leg"></div>}
                    </div>
                )}
            </div>

            <div className="hangman-container">
                <h1>Hangman Game</h1>
                {gameStage === 'input' && (
                    <form onSubmit={handleWordSubmit}>
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            placeholder="Enter a word"
                            className="input"
                            ref={inputRef}
                        />
                        <button type="submit" className="button">Submit Word</button>
                    </form>
                )}

                {gameStage === 'guessing' && (
                    <div>
                        <h2>Guess the Word</h2>
                        <div className="word-display">{renderWord()}</div>
                        <form onSubmit={handleGuessSubmit}>
                            <input
                                type="text"
                                value={currentGuess}
                                onChange={(e) => setCurrentGuess(e.target.value)}
                                maxLength={1}
                                placeholder="Guess a letter"
                                className="input"
                                ref={guessRef}
                            />
                            <button type="submit" className="button">Submit Guess</button>
                        </form>
                        {renderLetterBoard()}
                    </div>
                )}

                {isGameOver() && (
                    <div className="game-over">
                        {errors >= maxErrors ? (
                            <h2 className="lost-message">Game Over! The word was: <strong>{word}</strong></h2>
                        ) : (
                            isWinner() && guessedLetters.length > 0 && (
                                <h2 className="win-message">🎉 You guessed it! 🎉 The word was: <strong>{word}</strong></h2>
                            )
                        )}
                        <button onClick={resetGame} className="button">Play Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hangman;
