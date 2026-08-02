/**
 * Selective component boot for the homepage.
 * Loads only tags present in the DOM via ESM chunks (not the full IIFE).
 */
import { bootFromDOM } from '../../dist/chunks/runtime-entry.js';

const root = document;

bootFromDOM(root, {
  attributes: true,
  highlight: true,
})
  .then(async () => {
    try {
      const { VelinTransparency } = await import('../../dist/transparency/index.js');
      VelinTransparency.enhanceAll(root);
    } catch (err) {
      console.error('[expo-boot] VelinTransparency.enhanceAll failed', err);
    }
  })
  .catch((err) => {
    console.error('[expo-boot] bootFromDOM failed', err);
  });
