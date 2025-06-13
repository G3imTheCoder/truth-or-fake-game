import React, { useState, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Paper,
  Center,
  Loader,
  Stack, 
  Badge, 
  ScrollArea 
} from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import rawFakeAdviceData from './fakeAdvice.json';
const fakeAdviceData: string[] = rawFakeAdviceData as string[];


interface HistoryItem {
  advice: string;
  actualIsTrue: boolean;
  guessedTrue: boolean;
  correct: boolean;
}

function App() {
  const [score, setScore] = useState<number>(10);
  const [currentAdvice, setCurrentAdvice] = useState<string>('');
  const [isTrueAdvice, setIsTrueAdvice] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]); 

  console.log("App component rendered. Current gameStarted state:", gameStarted, "Score:", score);

  const fetchRealAdvice = useCallback(async (): Promise<string> => {
    console.log("fetchRealAdvice: Attempting to fetch real advice...");
    try {
     
      const resp = await fetch(`https://api.adviceslip.com/advice?timestamp=${Date.now()}`);

      console.log("fetchRealAdvice: Fetch response status:", resp.status);

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data = await resp.json();
      console.log("fetchRealAdvice: Advice data received:", data.slip.advice);
      return data.slip.advice;
    } catch (error) {
      console.error("fetchRealAdvice: Error fetching real advice:", error);
      notifications.show({
        title: 'API Error',
        message: "Failed to fetch advice from API. Displaying fallback advice.",
        color: 'red',
      });
      
      return "The true secret is to never give up.";
    }
  }, []);

  const fetchAndDisplayNextAdvice = useCallback(async () => {
    console.log("fetchAndDisplayNextAdvice: Called for next round.");
    setIsLoadingAdvice(true);
    const shouldBeTrue = Math.random() < 0.5; 
    setCurrentAdvice('Loading advice...'); 

    if (shouldBeTrue) {
      console.log("fetchAndDisplayNextAdvice: Decided to fetch REAL advice.");
      const advice = await fetchRealAdvice();
      setCurrentAdvice(advice);
      setIsTrueAdvice(true);
    } else {
      console.log("fetchAndDisplayNextAdvice: Decided to use FAKE advice.");
      const randomIndex = Math.floor(Math.random() * fakeAdviceData.length);
      setCurrentAdvice(fakeAdviceData[randomIndex]);
      setIsTrueAdvice(false);
    }
    setIsLoadingAdvice(false);
    console.log("fetchAndDisplayNextAdvice: Advice set.");
  }, [fetchRealAdvice, setCurrentAdvice, setIsTrueAdvice]);

  const startGame = useCallback(async () => {
    console.log("startGame: Initializing new game.");
    setScore(10); 
    setGameResult(null); 
    setGameOver(false);
    setGameStarted(true); 
    setHistory([]); 
    await fetchAndDisplayNextAdvice(); 
    console.log("startGame: Game initialized and first advice loaded.");
  }, [setScore, setGameResult, setGameOver, setGameStarted, fetchAndDisplayNextAdvice]);

  const handleGuess = useCallback((guessedTrue: boolean) => {
    console.log("handleGuess: Player guessed:", guessedTrue, "Actual was:", isTrueAdvice, "Current Score:", score);
    if (gameOver) {
      console.log("handleGuess: Game is over, ignoring guess.");
      return; 
    }

    let newScore = score;
    const correctGuess = (guessedTrue === isTrueAdvice); 

    if (correctGuess) {
      newScore += 1;
      notifications.show({
        title: 'Correct!',
        message: 'You guessed correctly! +1 point.',
        color: 'green',
      });
      console.log("handleGuess: Correct guess. New score:", newScore);
    } else {
      newScore -= 1;
      notifications.show({
        title: 'Incorrect!',
        message: 'Too bad, that was wrong. -1 point.',
        color: 'red',
      });
      console.log("handleGuess: Incorrect guess. New score:", newScore);
    }

    setScore(newScore); 

    
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        advice: currentAdvice,
        actualIsTrue: isTrueAdvice,
        guessedTrue: guessedTrue,
        correct: correctGuess,
      },
    ]);

    
    if (newScore >= 20) {
      setGameResult("Congratulations! You won!");
      setGameOver(true);
      console.log("handleGuess: Game Won!");
      notifications.show({
        title: 'Victory! 🎉',
        message: 'You reached 20 points!',
        color: 'blue',
      });
    } else if (newScore <= 0) {
      setGameResult("Too bad! You lost.");
      setGameOver(true);
      console.log("handleGuess: Game Lost!");
      notifications.show({
        title: 'Defeat! 😔',
        message: 'Your score dropped to 0. Try again!',
        color: 'gray',
      });
    } else {
      console.log("handleGuess: Game continues. Fetching next advice...");
      fetchAndDisplayNextAdvice(); 
    }
  }, [gameOver, score, isTrueAdvice, currentAdvice, setScore, setGameResult, setGameOver, fetchAndDisplayNextAdvice]); 

  const resetGame = useCallback(() => {
    console.log("resetGame: Called. Starting a new game...");
    startGame(); 
  }, [startGame]);

  return (
    <Container size="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
      <Paper shadow="xs" p="xl" withBorder>
        <Title order={1} mb="md">Truth or Fake?</Title>

        {!gameStarted ? (
          <Center style={{ flexDirection: 'column', minHeight: '200px' }}>
            <Text size="lg" mb="xl">
              Click to start the game!
            </Text>
           
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </Center>
        ) : (
          <>
            <Text size="xl" fw={500} mb="xl">Score: {score}</Text>

            {gameResult ? (
              <Center mb="xl" style={{ flexDirection: 'column' }}>
                <Text size="xl" fw={700} color={score >= 20 ? 'green' : 'red'}>
                  {gameResult}
                </Text>

                <Button size="lg" onClick={resetGame} mt="md">
                  Play Again
                </Button>
              </Center>
            ) : (
              <Paper shadow="sm" p="md" mb="xl">
                {isLoadingAdvice ? (
                  <Center style={{ minHeight: '80px' }}>
                    <Loader color="blue" />
                  </Center>
                ) : (
                  <Text size="lg" style={{ fontStyle: 'italic' }}>
                    "{currentAdvice}"
                  </Text>
                )}
              </Paper>
            )}

            {!gameOver && !isLoadingAdvice && (
              <Group justify="center" gap="xl">
               
                <Button size="lg" color="green" onClick={() => handleGuess(true)}>
                  True Advice
                </Button>
              
                <Button size="lg" color="red" onClick={() => handleGuess(false)}>
                  Fake Advice
                </Button>
              </Group>
            )}

          
            {gameStarted && history.length > 0 && gameOver && ( 
              <Paper shadow="xs" p="xl" withBorder mt="xl" style={{ textAlign: 'left' }}>
                <Title order={2} mb="md">Game History</Title>
                <ScrollArea h={250} type="always"> 
                  <Stack>
                    {history.map((item, index) => (
                      <Group
                        key={index}
                        justify="space-between"
                        align="center"
                        style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', paddingTop: '8px' }}
                      >
                        <Text size="sm" style={{ flex: 1, fontStyle: 'italic', marginRight: '10px' }}>
                          "{item.advice}"
                        </Text>
                        <Group gap="xs">
                         
                          <Badge color={item.actualIsTrue ? 'green' : 'red'} variant="filled">
                            {item.actualIsTrue ? 'TRUE' : 'FAKE'}
                          </Badge>
                         
                          <Badge color={item.correct ? 'blue' : 'gray'} variant="filled">
                            {item.correct ? 'Correct Guess' : 'Incorrect Guess'}
                          </Badge>
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                </ScrollArea>
              </Paper>
            )}
          </>
        )}
      </Paper>
      
      <Notifications position="top-right" />
    </Container>
  );
}

export default App;

