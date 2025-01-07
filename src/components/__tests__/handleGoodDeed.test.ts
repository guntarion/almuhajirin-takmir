// src/components/__tests__/handleGoodDeed.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

interface Deed {
  label: string;
  points: number;
  maxFrequency: number;
}

type CounterState = {
  [key: string]: {
    count: number;
    totalPoints: number;
  };
};

// Mock state setters with proper types
const setMainGoodDeedCounters = vi.fn<(state: (prev: CounterState) => CounterState) => void>();
const setMainGoodDeedsToday = vi.fn<(value: (prev: number) => number) => void>();
const setMainGoodDeedsScore = vi.fn<(value: (prev: number) => number) => void>();
const setTotalScore = vi.fn<(value: (prev: number) => number) => void>();
const setLevel = vi.fn<(value: (prev: number) => number) => void>();

// Mock next level score
const nextLevelScore = 100;




// Test cases
describe('handleGoodDeed', () => {
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

it('should correctly handle sequence of clicks with maxFrequency', () => {
  const deed = {
    label: 'Help Someone',
    points: 10,
    maxFrequency: 4,
  };

  // Create a state tracker to simulate actual state
  let currentState = {
    mainGoodDeedsToday: 0,
    mainGoodDeedsScore: 0,
    counters: {} as CounterState
  };

  // Mock implementations to track state
  setMainGoodDeedCounters.mockImplementation((fn) => {
    currentState.counters = fn(currentState.counters);
  });

  setMainGoodDeedsToday.mockImplementation((fn) => {
    if (typeof fn === 'function') {
      currentState.mainGoodDeedsToday = fn(currentState.mainGoodDeedsToday);
    } else {
      currentState.mainGoodDeedsToday = fn;
    }
  });

  setMainGoodDeedsScore.mockImplementation((fn) => {
    if (typeof fn === 'function') {
      currentState.mainGoodDeedsScore = fn(currentState.mainGoodDeedsScore);
    } else {
      currentState.mainGoodDeedsScore = fn;
    }
  });

  // Test sequence of 10 clicks
  const expectedStates = [
    { today: 1, score: 10 },  // Click 1
    { today: 2, score: 20 },  // Click 2
    { today: 3, score: 30 },  // Click 3
    { today: 4, score: 40 },  // Click 4
    { today: 0, score: 0 },   // Click 5 (reset)
    { today: 1, score: 10 },  // Click 6
    { today: 2, score: 20 },  // Click 7
    { today: 3, score: 30 },  // Click 8
    { today: 4, score: 40 },  // Click 9
    { today: 0, score: 0 },   // Click 10 (reset)
  ];

  expectedStates.forEach((expected, index) => {
    handleGoodDeed(deed);

    expect(currentState.mainGoodDeedsToday).toBe(expected.today,
      `Click ${index + 1}: mainGoodDeedsToday should be ${expected.today}`);

    expect(currentState.mainGoodDeedsScore).toBe(expected.score,
      `Click ${index + 1}: mainGoodDeedsScore should be ${expected.score}`);
  });
});

// Function under test
const handleGoodDeed = (deed: Deed) => {
  setMainGoodDeedCounters((prev: CounterState) => {
    const current = prev[deed.label] || { count: 0, totalPoints: 0 };
    const newCount = current.count + 1;
    if (newCount > deed.maxFrequency) {
      // Decrease the total counts and scores
      setMainGoodDeedsToday((prevTotal: number) => prevTotal - current.count);
      setMainGoodDeedsScore((prevScore: number) => prevScore - current.totalPoints);
      setTotalScore((prevScore: number) => Math.max(0, prevScore - current.totalPoints));
      return {
        ...prev,
        [deed.label]: {
          count: 0,
          totalPoints: 0,
        },
      };
    }

    setTotalScore((prev: number) => {
      const newScore = prev + deed.points;
      if (newScore >= nextLevelScore) {
        setLevel((prevLevel: number) => prevLevel + 1);
        return 0;
      }
      return newScore;
    });
    return {
      ...prev,
      [deed.label]: {
        count: newCount,
        totalPoints: current.totalPoints + deed.points,
      },
    };
  });
  setMainGoodDeedsToday((prev: number) => prev + 1);
  setMainGoodDeedsScore((prev: number) => prev + deed.points);
  setTotalScore((prevScore: number) => Math.max(0, prevScore - deed.points));
};
