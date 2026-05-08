const { answerPages } = require('./lib/content/answers');

try {
  const json = JSON.stringify(answerPages);
  console.log('Successfully stringified answerPages');
} catch (err) {
  console.error('Failed to stringify answerPages:', err);
}
