import React, { useEffect, useState } from 'react';

interface ProfilePhotoProps {
  login?: string;
  src?: string;
  label?: string;
  /** Shown when src is missing or fails to load. */
  fallbackSrc?: string;
  onCycle?: () => void;
}

function ProfilePhoto({
  login, src, label = '', fallbackSrc, onCycle,
}: ProfilePhotoProps) {
  const primary = src || fallbackSrc || (login ? `https://github.com/${login}.png` : '');
  const [failed, setFailed] = useState(false);
  const imageSrc = failed && fallbackSrc && fallbackSrc !== primary ? fallbackSrc : primary;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [primary]);

  useEffect(() => {
    setLoaded(!imageSrc);
  }, [imageSrc]);

  const photo = (
    <div className="relative mx-auto aspect-square w-full">
      <div
        className={`absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${loaded ? 'hidden' : ''}`}
        data-testid="profile-skeleton"
        aria-hidden="true"
      />
      {imageSrc ? (
        <img
          alt={label || 'ME!'}
          className={`absolute inset-0 h-full w-full rounded-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={imageSrc}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (imageSrc !== fallbackSrc && fallbackSrc) setFailed(true);
            else setLoaded(true);
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200 text-2xl font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-100">
          {(label || '?').slice(0, 1)}
        </div>
      )}
    </div>
  );

  if (!onCycle) return photo;

  return (
    <button
      type="button"
      className="block w-full rounded-full"
      aria-label={label ? `Show the next source after ${label}` : 'Show the next source'}
      onClick={onCycle}
    >
      {photo}
    </button>
  );
}

export default ProfilePhoto;
