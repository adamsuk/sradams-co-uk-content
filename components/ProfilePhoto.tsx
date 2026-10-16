import React, { useEffect, useRef, useState } from 'react';

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

  const imgRef = useRef<HTMLImageElement>(null);

  // On a statically rendered page the browser can finish (or fail) loading the
  // image before React hydrates, so onLoad/onError never fire. Check the
  // element's real state whenever the source changes.
  useEffect(() => {
    const img = imgRef.current;
    if (!imageSrc || !img) {
      setLoaded(!imageSrc);
      return;
    }
    if (img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else if (imageSrc !== fallbackSrc && fallbackSrc) setFailed(true);
      else setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [imageSrc, fallbackSrc]);

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
          ref={imgRef}
          key={imageSrc}
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
