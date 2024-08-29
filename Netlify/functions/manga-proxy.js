const axios = require('axios');

exports.handler = async function(event, context) {
    const { endpoint } = event.queryStringParameters;
    
    if (!endpoint) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Endpoint parameter is required' })
        };
    }

    try {
        const response = await axios.get(`https://api.mangadex.org${endpoint}`);
        
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};