import React, { useState } from 'react';

interface ProfilePhotoProps {
  login: string;
}

function ProfilePhoto({ login }: ProfilePhotoProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mx-auto aspect-square w-full">
      <div
        className={`absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${loaded ? 'hidden' : ''}`}
        data-testid="profile-skeleton"
        aria-hidden="true"
      />
      <img
        alt="ME!"
        className={`absolute inset-0 h-full w-full rounded-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
        src={`https://github.com/${login}.png`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default ProfilePhoto;
