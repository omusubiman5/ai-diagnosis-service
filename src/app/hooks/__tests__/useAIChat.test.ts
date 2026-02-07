import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useAIChat } from '../useAIChat';

// Mock fetch globally
global.fetch = jest.fn();

describe('useAIChat', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useAIChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('adds user message and assistant response on successful sendMessage', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: {
          role: 'assistant',
          content: 'こんにちは！お手伝いします。',
        },
      }),
    });

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('こんにちは');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('こんにちは');
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.messages[1].content).toBe('こんにちは！お手伝いします。');
    });
  });

  it('sets error on failed API call', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        error: 'APIエラーが発生しました',
      }),
    });

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('テスト');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('APIエラーが発生しました');
    });
  });

  it('clears messages when clearMessages is called', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: {
          role: 'assistant',
          content: 'テスト応答',
        },
      }),
    });

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('テスト');
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('does not send empty messages', async () => {
    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(result.current.messages).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
