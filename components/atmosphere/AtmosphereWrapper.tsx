'use client';

import StarField from './StarField';
import CosmicFog from './CosmicFog';
import BreathingGlow from './BreathingGlow';

export function AtmosphereWrapper() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <StarField />
      <CosmicFog />
      <BreathingGlow />
    </div>
  );
}
