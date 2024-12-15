import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Gamepad2, RefreshCcw, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { CHARADE_WORDS } from '../constants/words';

const CharadesApp = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([...CHARADE_WORDS]);
  const [gameStage, setGameStage] = useState('setup');
  const [currentTeam, setCurrentTeam] = useState('Team A');
  const [scores, setScores] = useState({
    'Team A': 0,
    'Team B': 0
  });
  const [timeRemaining, setTimeRemaining] = useState(75);
  const timerRef = useRef(null);

  const getRandomWord = useCallback(() => {
    if (remainingWords.length === 0) {
      setRemainingWords([...CHARADE_WORDS]);
      setUsedWords([]);
    }

    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    const word = remainingWords[randomIndex];

    const newRemainingWords = remainingWords.filter((_, index) => index !== randomIndex);
    setRemainingWords(newRemainingWords);
    setUsedWords(prev => [...prev, word]);

    return word;
  }, [remainingWords]);

  const startTimer = () => {
    setGameStage('playing');
    setCurrentWord(getRandomWord());
    setTimeRemaining(75);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endTurn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endTurn = () => {
    clearInterval(timerRef.current);
    setGameStage('turnEnd');
    setCurrentTeam(currentTeam === 'Team A' ? 'Team B' : 'Team A');
  };

  const adjustScore = (points) => {
    setScores(prev => ({
      ...prev,
      [currentTeam]: prev[currentTeam] + points
    }));
    setCurrentWord(getRandomWord());
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (gameStage === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Charades!</h1>
        <div className="text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-blue-700">Current Turn: {currentTeam}</h2>
          </div>
          <button 
            onClick={startTimer} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto"
          >
            <Gamepad2 className="mr-2" /> Start Turn
          </button>
        </div>
      </div>
    );
  }

  if (gameStage === 'turnEnd') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Turn Ended</h1>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-700">Next Turn: {currentTeam}</h2>
        </div>
        <button 
          onClick={() => setGameStage('setup')} 
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Next Team's Turn
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between p-4 bg-blue-200">
        <div className="text-lg font-bold">
          Team A: <span className="text-green-600">{scores['Team A']}</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 text-blue-600" />
          <span className="text-xl font-bold">{timeRemaining}</span>
        </div>
        <div className="text-lg font-bold">
          Team B: <span className="text-green-600">{scores['Team B']}</span>
        </div>
      </div>

      <div 
        className="flex-grow flex items-center justify-center bg-blue-100 select-none"
      >
        <div className="text-center p-4">
          <div className="text-6xl font-bold text-blue-800 mb-6">
            {currentWord}
          </div>
          <div className="mt-4 text-sm text-blue-500">
            Remaining Words: {remainingWords.length}
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 bg-blue-200">
        <button 
            onClick={() => adjustScore(-1)}
            className="flex-1 mr-2 bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg flex items-center justify-center"
        >
            <ThumbsDown size={32} />
        </button>
        <button 
            onClick={() => adjustScore(1)}
            className="flex-1 ml-2 bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg flex items-center justify-center"
        >
            <ThumbsUp size={32} />
        </button>
        </div>
    </div>
  );
};

export default CharadesApp;