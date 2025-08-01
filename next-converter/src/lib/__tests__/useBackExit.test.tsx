import { renderHook, act } from '@testing-library/react';
import useBackExit from '../hooks/useBackExit';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: { info: jest.fn(), isActive: jest.fn(() => false) }
}));

const firePop = () => {
  const event = new PopStateEvent('popstate');
  window.dispatchEvent(event);
};

describe('useBackExit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    history.replaceState(null, '', '/');
    history.pushState(null, '', '/page1');
    document.body.innerHTML = '';
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Android',
      configurable: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    const nav = window.navigator as { userAgent?: string };
    delete nav.userAgent;
  });

  test('허용 횟수 이하에서는 뒤로가기만 동작', () => {
    const pushSpy = jest.spyOn(history, 'pushState');
    const goSpy = jest.spyOn(history, 'go');

    renderHook(() => useBackExit(2));
    act(() => {
      firePop();
    });

    expect(pushSpy).not.toHaveBeenCalled();
    expect(goSpy).not.toHaveBeenCalled();
  });

  test('허용 횟수 이후에는 토스트 후 종료', () => {
    const pushSpy = jest.spyOn(history, 'pushState');
    const goSpy = jest.spyOn(history, 'go');

    renderHook(() => useBackExit(1));
    act(() => {
      firePop();
    });

    expect(toast.info).toHaveBeenCalledWith('앱을 종료하려면 뒤로가기를 한 번 더 누르세요.');
    expect(pushSpy).toHaveBeenCalled();

    act(() => {
      firePop();
    });

    expect(goSpy).toHaveBeenCalled();
  });
});
