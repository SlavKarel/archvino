function syncMotionPreference(mediaQuery: MediaQueryList): void {
  document.documentElement.dataset.motion = mediaQuery.matches ? 'reduce' : 'allow';
}

export default function initMotion(): void {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleChange = () => {
    syncMotionPreference(mediaQuery);
  };

  syncMotionPreference(mediaQuery);
  mediaQuery.addEventListener('change', handleChange);
}
