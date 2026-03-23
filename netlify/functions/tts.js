exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { text, el_key, voice_id = 'amiAXapsDOAiHJqbsAZj' } = JSON.parse(event.body);

  if (!text || !el_key) {
    return { statusCode: 400, body: 'Missing text or key' };
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': el_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.85,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error }) };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      body: JSON.stringify({ audio: base64Audio })
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
