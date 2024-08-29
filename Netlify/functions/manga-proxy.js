const axios = require('axios');

exports.handler = async (event, context) => {
  const { path, queryStringParameters } = event;
  const apiUrl = `https://api.mangadex.org${path}`;

  try {
    const response = await axios.get(apiUrl, { params: queryStringParameters });
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust this for production
      },
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust this for production
      },
    };
  }
};
