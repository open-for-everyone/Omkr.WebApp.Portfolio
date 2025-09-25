import 'jest-preset-angular/setup-jest';
// Polyfills or global mocks can be added here.

// Suppress jsdom canvas getContext not implemented error spam triggered by axe color contrast checks
const originalError = console.error;
console.error = (...args: unknown[]) => {
	if (typeof args[0] === 'string' && args[0].includes('HTMLCanvasElement.prototype.getContext')) {
		return; // swallow
	}
	originalError(...args as []);
};

// Basic mock so libraries expecting a canvas context don't blow up
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
	value: function () { return { canvas: this }; },
});
