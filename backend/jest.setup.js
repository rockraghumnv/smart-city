import { jest } from '@jest/globals';

// This file runs before all tests and sets up the mocks for the AI modules.
// This is the modern, correct way to mock ES Modules with Jest.
jest.unstable_mockModule('@langchain/google-genai', () => ({
  ChatGoogleGenerativeAI: jest.fn(() => ({
    bindTools: jest.fn(() => ({
      invoke: jest.fn().mockResolvedValue({
        content: 'All clear. Mocked response.',
        tool_calls: [],
      }),
    })),
  })),
}));
