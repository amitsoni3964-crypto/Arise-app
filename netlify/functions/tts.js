
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const text = body.text;
    const el_key = body.el_key;

    if (!text || !el_key) {
      return { statusCode: 400, body: 'Missing text or key' };
    }

    // Rachel - free default voice on all plans
    const voice_id = '21m00Tcm4TlvDq8ikWAM';

    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/' + voice_id,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': el_key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs error:', error);
      return { statusCode: 500, body: JSON.stringify({ error }) };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ audio: base64Audio })
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
