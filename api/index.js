import('../dist/index.js').catch(err => {
  console.error('Failed to load app:', err);
  process.exit(1);
});
