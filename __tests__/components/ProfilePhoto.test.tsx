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
});
