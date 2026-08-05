import { fadeInOut } from './animations';

// This file exports animation triggers, not a class — the generated `new Animations()` stub never
// compiled, and one spec that doesn't compile stops the whole Karma suite from running.
describe('animations', () => {
  it('exposes the fadeInOut trigger', () => {
    expect(fadeInOut).toBeTruthy();
  });
});
