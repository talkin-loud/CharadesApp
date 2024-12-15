import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Gamepad2, RefreshCcw, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { CHARADE_WORDS } from '../constants/words';

const CharadesApp = () => {
  const [teamNames, setTeamNames] = useState({
    'Team A': 'Team A',
    'Team B': 'Team B'
  });
  const [timerDuration, setTimerDuration] = useState(60);
  const [gameInitialized, setGameInitialized] = useState(false);

  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([...CHARADE_WORDS]);
  const [gameStage, setGameStage] = useState('setup');
  const [currentTeam, setCurrentTeam] = useState('Team A');
  const [scores, setScores] = useState({
    'Team A': 0,
    'Team B': 0
  });
  const [timeRemaining, setTimeRemaining] = useState(60);
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
    setTimeRemaining(timerDuration);
    
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

  if (!gameInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Game Setup</h1>
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-blue-700">Team 1 Name:</span>
              <input
                type="text"
                value={teamNames['Team A']}
                onChange={(e) => setTeamNames(prev => ({ ...prev, 'Team A': e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            
            <label className="block">
              <span className="text-blue-700">Team 2 Name:</span>
              <input
                type="text"
                value={teamNames['Team B']}
                onChange={(e) => setTeamNames(prev => ({ ...prev, 'Team B': e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <div className="space-y-2">
              <span className="text-blue-700">Timer Duration: {timerDuration} seconds</span>
              <input
                type="range"
                min="10"
                max="120"
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={() => setGameInitialized(true)}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameStage === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Charades!</h1>
        <div className="text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-blue-700">
              Current Turn: {teamNames[currentTeam]}
            </h2>
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
          <h2 className="text-2xl font-semibold text-blue-700">
            Next Turn: {teamNames[currentTeam]}
          </h2>
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
          {teamNames['Team A']}: <span className="text-green-600">{scores['Team A']}</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 text-blue-600" />
          <span className="text-xl font-bold">{timeRemaining}</span>
        </div>
        <div className="text-lg font-bold">
          {teamNames['Team B']}: <span className="text-green-600">{scores['Team B']}</span>
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