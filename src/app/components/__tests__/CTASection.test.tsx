import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { act } from 'react';
import CTASection from '../CTASection';

describe('CTASection', () => {
  it('renders the CTA heading', () => {
    render(<CTASection />);
    const heading = screen.getByText(/あなたの新しい可能性/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the CTA button', () => {
    render(<CTASection />);
    const button = screen.getByRole('button', { name: /無料で診断を始める/i });
    expect(button).toBeInTheDocument();
  });

  it('opens dialog when CTA button is clicked', async () => {
    render(<CTASection />);
    const button = screen.getByRole('button', { name: /無料で診断を始める/i });

    await act(async () => {
      fireEvent.click(button);
    });

    const dialogTitle = screen.getByText(/Coming Soon!/i);
    expect(dialogTitle).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    render(<CTASection />);
    const openButton = screen.getByRole('button', { name: /無料で診断を始める/i });

    await act(async () => {
      fireEvent.click(openButton);
    });

    const dialogTitle = screen.getByText(/Coming Soon!/i);
    expect(dialogTitle).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /閉じる/i });

    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Wait for the dialog to be removed from the DOM
    await waitForElementToBeRemoved(() => screen.queryByText(/Coming Soon!/i));
  });
});
