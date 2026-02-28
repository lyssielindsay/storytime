const { checkAuth } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!checkAuth(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Parse KIDS from env: "Name1:Age1,Name2:Age2,Name3:Age3"
  // e.g. "Enna:7,Maddie:4,Teo:1"
  const kidsRaw = process.env.KIDS || '';
  const kids = kidsRaw
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
    .map(k => {
      const [name, age] = k.split(':');
      return { name: name?.trim(), age: parseInt(age?.trim()) || 0 };
    })
    .filter(k => k.name);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kids,
      aunty: process.env.AUNTY_NAME || 'Aunty',
      storiesPerDay: parseInt(process.env.STORIES_PER_DAY || '3'),
      storyPromptExtras: process.env.STORY_PROMPT_EXTRAS || '',
    }),
  };
};
