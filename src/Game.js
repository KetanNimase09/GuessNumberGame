import React, { useState, useEffect, useCallback } from 'react';
import './script.css'; // Ensure you link to your external CSS file

const Game = () => {
  const [targetNumber, setTargetNumber] = useState(null); // Set a value to guess
  const [guess, setGuess] = useState(''); // Save user guess
  const [message, setMessage] = useState(''); // Message to show user
  const [attempts, setAttempts] = useState(0); // Count attempts
  const [maxNumber, setMaxNumber] = useState(100); // Default max number
  const [guessHistory, setGuessHistory] = useState([]); // Saves the history of guesses
  const [startTime, setStartTime] = useState(null); // Starts the timer
  const [elapsedTime, setElapsedTime] = useState(0); // Count the time
  const [gameOver, setGameOver] = useState(false); // Check if game is over or not
  const [hasStarted, setHasStarted] = useState(false); // Checks if user has guessed a number

  const generateRandomNumber = useCallback(() => {
    const number = Math.floor(Math.random() * maxNumber) + 1; // Generate within maxNumber
    setTargetNumber(number);
  }, [maxNumber]);

  useEffect(() => {
    generateRandomNumber();
  }, [maxNumber, generateRandomNumber]);

  useEffect(() => {
    if (hasStarted && !gameOver) { // Only run the timer if the game has started
      const timer = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, gameOver, hasStarted]);

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const parsedGuess = parseInt(guess, 10);
    // Checks if the number is in valid format and range
    if (isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > maxNumber) {
      setMessage(`Please enter a valid number between 1 and ${maxNumber}.`);
      return;
    }

    // Starts the timer for the first-time start
    if (!hasStarted) {
      setHasStarted(true);
      setStartTime(Date.now());
    }

    setAttempts((prev) => prev + 1);
    setGuessHistory((prevHistory) => [...prevHistory, parsedGuess]); // Correctly update guess history

    if (parsedGuess === targetNumber) {
      setMessage(`Congratulations! You've guessed the number in ${attempts + 1} attempts! Elapsed Time: ${elapsedTime} seconds`);
      setGameOver(true); // Stop timers once the game is over
    } else if (parsedGuess < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }

    if (attempts >= 3 && attempts < 6) {
      setMessage((prev) => `${prev} Hint: The number is ${targetNumber % 2 === 0 ? 'even' : 'odd'}.`);
    }

    setGuess(''); // Clear the input field
  }, [guess, targetNumber, attempts, maxNumber, hasStarted, elapsedTime]);

  const handleRestart = () => {
    setAttempts(0); // Reset attempts
    setMessage(''); // Clear message
    setGuess(''); // Clear guess
    setGuessHistory([]); // Clear history
    generateRandomNumber(); // Regenerate number
    setElapsedTime(0); // Reset elapsed time
    setStartTime(null); // Reset start timer
    setGameOver(false); // Reset game status
    setHasStarted(false); // Reset the start condition
  };

  return (
    <div className="container">
      <h1>Guess the Number Game!</h1>

      <label>
        Choose Difficulty:
        <select onChange={(e) => setMaxNumber(parseInt(e.target.value, 10))} value={maxNumber}>
          <option value={100}>Easy-Level (1-100)</option>
          <option value={500}>Medium-Level (1-500)</option>
          <option value={1000}>Hard-Level (1-1000)</option>
          <option value={2000}>Professional-Level (1-2000)</option>
        </select>
      </label>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={guess}
          onChange={handleGuessChange}
          placeholder={`Enter your guess (1-${maxNumber})`}
          required
        />
        <button type="submit">Guess</button>
      </form>

      {message && <p className={`message ${message.includes('Congratulations') ? 'correct-guess' : ''}`}>{message}</p>}

      {message.includes('Congratulations') && (
        <button onClick={handleRestart}>Play Again</button>
      )}

      {guessHistory.length > 0 && (
        <div>
          <h3>Your Guesses:</h3>
          <ul>
            {guessHistory.map((g, index) => (
              <li key={index}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="time-elapsed">Time Elapsed: {elapsedTime} seconds</p>
    </div>
  );
};

export default Game;
