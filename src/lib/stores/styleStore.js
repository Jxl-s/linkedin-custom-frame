import { writable } from 'svelte/store';

export const styleStore = writable({
	textContent: '#OPENTOWORK',
	forceUppercase: true,
	ringColor: '#00B140',
	fontSize: 56,
	fontSpacing: 10,
	textRotation: 0,
	textHeightOffset: 5
});

/**
 * Updates a specific style property in the style store.
 * @param {string} prop - The property to update.
 * @param {any} val - The new value for the property.
 * @return {void}
 */
export function updateStyle(prop, val) {
	styleStore.update((current) => ({ ...current, [prop]: val }));
}
