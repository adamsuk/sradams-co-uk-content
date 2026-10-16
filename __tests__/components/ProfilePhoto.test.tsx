import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ProfilePhoto from '../../components/ProfilePhoto';

describe('ProfilePhoto', () => {
  it('holds a circle while the photo loads, then shows the image', () => {
    render(<ProfilePhoto login="adamsuk" />);
    const image = screen.getByRole('img', { name: 'ME!' });
    expect(image).toHaveAttribute('src', 'https://github.com/adamsuk.png');
    expect(image.className).toContain('opacity-0');
    expect(screen.getByTestId('profile-skeleton')).not.toHaveClass('hidden');

    fireEvent.load(image);

    expect(image.className).toContain('opacity-100');
    expect(screen.getByTestId('profile-skeleton')).toHaveClass('hidden');
  });

  it('swaps to the fallback picture when a source picture fails to load', () => {
    render(<ProfilePhoto src="https://images.gr-assets.com/users/1/1.jpg" fallbackSrc="https://github.com/adamsuk.png" label="Reading" />);
    const image = screen.getByRole('img', { name: 'Reading' });
    expect(image).toHaveAttribute('src', 'https://images.gr-assets.com/users/1/1.jpg');
    fireEvent.error(image);
    expect(screen.getByRole('img', { name: 'Reading' })).toHaveAttribute('src', 'https://github.com/adamsuk.png');
  });

  it('uses the fallback picture when a source has none', () => {
    render(<ProfilePhoto fallbackSrc="https://github.com/adamsuk.png" label="Training" />);
    expect(screen.getByRole('img', { name: 'Training' })).toHaveAttribute('src', 'https://github.com/adamsuk.png');
  });
});
