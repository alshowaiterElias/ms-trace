// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

// Polyfill ResizeObserver for Recharts ResponsiveContainer in jsdom
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = MockResizeObserver;
}

describe('MS Trace end-to-end application workflows', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('supports Patient dashboard, About guide, Practice pad, Hold-proof tapping, Aborted test exclusion, Live completion, Sharing, Arabic RTL preservation, Doctor review, and LocalStorage persistence', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] });
    vi.setSystemTime(new Date('2026-11-18T12:00:00.000Z'));

    const firstRender = render(<App />);

    // 1. Initial Patient 1 Dashboard
    expect(screen.getByText(/Welcome back, Layla Al-Harbi/i)).toBeInTheDocument();
    expect(screen.getByText(/Experimental Monitoring Prototype/i)).toBeInTheDocument();

    // Open and close About MS Trace modal
    fireEvent.click(screen.getByRole('button', { name: /About MS Trace/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/1\. What MS Trace Is/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Got it/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // 2. Navigate to Test Intro
    fireEvent.click(screen.getByRole('button', { name: /Start New Tapping Test/i }));
    expect(screen.getByText(/Digital Finger Tapping Test/i)).toBeInTheDocument();

    // Practice pad check (practice taps do NOT get saved to history)
    const practiceTarget = screen.getByRole('button', { name: /Tap here to practice/i });
    fireEvent.pointerDown(practiceTarget, { pointerId: 1, button: 0, pointerType: 'mouse' });
    fireEvent.pointerUp(window, { pointerId: 1 });
    fireEvent.pointerDown(practiceTarget, { pointerId: 1, button: 0, pointerType: 'mouse' });
    fireEvent.pointerUp(window, { pointerId: 1 });
    const practiceCounterBox = screen.getByText('Practice taps').parentElement!;
    expect(within(practiceCounterBox).getByText('2')).toBeInTheDocument();

    // Select Left Hand
    fireEvent.click(screen.getByRole('button', { name: /Left Hand/i }));

    // 3. Test Cancellation / Interrupted Session Flow
    fireEvent.click(screen.getByRole('button', { name: /Start Official 30s Test/i }));
    const cancelBtn = screen.getByRole('button', { name: /Cancel Test/i });
    fireEvent.click(cancelBtn);
    expect(screen.getByText(/Cancel Active Tapping Test\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Discard Session/i }));
    expect(
      screen.getByText(/Session Interrupted — Not Recorded as Completed/i),
    ).toBeInTheDocument();

    // Return to setup and start an official test that completes
    fireEvent.click(screen.getByRole('button', { name: /Return to Test Setup/i }));
    fireEvent.click(screen.getByRole('button', { name: /Start Official 30s Test/i }));

    const tapTarget = screen.getByRole('button', {
      name: /Tapping target area/i,
    });

    // Perform 4 valid pointer taps across first 10s, plus attempt long-hold (must NOT double count)
    for (let i = 0; i < 4; i++) {
      act(() => {
        vi.advanceTimersByTime(300);
      });
      fireEvent.pointerDown(tapTarget, { pointerId: 2, button: 0, pointerType: 'touch' });
      // Attempting second simultaneous pointer while held must be ignored
      fireEvent.pointerDown(tapTarget, { pointerId: 3, button: 0, pointerType: 'touch' });
      fireEvent.pointerUp(window, { pointerId: 2 });
      fireEvent.pointerUp(window, { pointerId: 3 });
    }

    // Perform 2 valid keyboard Space taps and verify OS key-repeat hold is ignored!
    act(() => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.keyDown(window, { code: 'Space', repeat: false });
    fireEvent.keyDown(window, { code: 'Space', repeat: true });
    fireEvent.keyDown(window, { code: 'Space', repeat: true });
    fireEvent.keyUp(window, { code: 'Space' });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.keyDown(window, { code: 'Enter', repeat: false });
    fireEvent.keyUp(window, { code: 'Enter' });

    // Switch language to Arabic MID-TEST and confirm state/taps are preserved & RTL applies!
    fireEvent.click(screen.getByRole('button', { name: /Switch interface language/i }));
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    // Tap count (6) must still be active on screen
    expect(screen.getByText('6')).toBeInTheDocument();

    // Advance into segment 2 and segment 3 while tapping 4 more times
    act(() => {
      vi.advanceTimersByTime(11000);
    });
    const arabicTarget = screen.getByRole('button', { name: /منطقة النقر المستهدفة/i });
    for (let i = 0; i < 2; i++) {
      fireEvent.pointerDown(arabicTarget, { pointerId: 4, button: 0, pointerType: 'mouse' });
      fireEvent.pointerUp(window, { pointerId: 4 });
      act(() => {
        vi.advanceTimersByTime(300);
      });
    }

    act(() => {
      vi.advanceTimersByTime(11000);
    });
    for (let i = 0; i < 2; i++) {
      fireEvent.pointerDown(arabicTarget, { pointerId: 5, button: 0, pointerType: 'mouse' });
      fireEvent.pointerUp(window, { pointerId: 5 });
      act(() => {
        vi.advanceTimersByTime(300);
      });
    }

    // Finish remaining time past 30s
    act(() => {
      vi.advanceTimersByTime(8000);
    });

    // 4. Automatically navigated to Results screen in Arabic with Live Recorded badge and 10 taps
    expect(screen.getByText(/نتائج اختبار النقر/i)).toBeInTheDocument();
    expect(screen.getByText(/قياس فعلي مسجّل/i)).toBeInTheDocument();
    const arabicTotalTapsBox = screen
      .getAllByText(/إجمالي عدد النقرات/i)[0]
      .closest('div')!.parentElement!;
    expect(within(arabicTotalTapsBox).getByText('10')).toBeInTheDocument();

    // Switch back to English on Results screen without losing current session
    fireEvent.click(screen.getByRole('button', { name: /^EN$/i }));
    expect(document.documentElement.dir).toBe('ltr');
    expect(screen.getByText(/Tapping Test Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Recorded Measurement/i)).toBeInTheDocument();

    // 5. Explicitly Save and Share Results with Doctor
    fireEvent.click(screen.getByRole('button', { name: /Save and Share Results/i }));
    expect(screen.getByText(/Shared with Assigned Doctor/i)).toBeInTheDocument();

    // 6. Switch to Doctor Role via Demo Account Switcher
    fireEvent.click(screen.getByRole('button', { name: /Layla Al-Harbi/i }));
    const doctorMenuBtn = screen.getByRole('menuitem', { name: /Dr\. Karim Al-Mansoor/i });
    fireEvent.click(doctorMenuBtn);

    expect(screen.getByText(/Neurologist Monitoring Dashboard/i)).toBeInTheDocument();
    const reviewSection = screen
      .getByText(/Sessions Requiring Clinical Review/i)
      .closest('section')!;
    // Live Recorded Measurement should appear in pending review queue
    expect(within(reviewSection).getByText(/Live Recorded Measurement/i)).toBeInTheDocument();

    // Click Inspect & Review on the first pending session (Layla's newly shared live session)
    const reviewButtons = within(reviewSection).getAllByRole('button', {
      name: /Inspect & Review/i,
    });
    fireEvent.click(reviewButtons[0]);

    // Verify note validation blocks empty submission
    fireEvent.click(screen.getByRole('button', { name: /Mark as Reviewed & Save Note/i }));
    expect(
      screen.getByText(/Please enter a brief clinical note before marking this test as reviewed/i),
    ).toBeInTheDocument();

    // Enter clinical note and save
    const noteField = screen.getByLabelText(/Clinical Observation Note/i);
    fireEvent.change(noteField, {
      target: { value: 'Live session reviewed: consistent 10-tap verification flow.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Mark as Reviewed & Save Note/i }));
    expect(screen.getByText(/Update Review Note/i)).toBeInTheDocument();

    // 7. Unmount and remount to verify LocalStorage persistence across page refresh!
    firstRender.unmount();
    render(<App />);

    // Should persist Doctor role after reload; switch back to Layla to verify she sees the Doctor's note
    expect(screen.getByText(/Neurologist Monitoring Dashboard/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Dr\. Karim Al-Mansoor/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /Layla Al-Harbi/i }));

    // Layla's dashboard shows latest session (10 taps) as Live Recorded + Reviewed
    expect(screen.getByText(/Welcome back, Layla Al-Harbi/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /View Details/i })[0]);
    expect(
      screen.getByText(/Live session reviewed: consistent 10-tap verification flow\./i),
    ).toBeInTheDocument();
  });
});
