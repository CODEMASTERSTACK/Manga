const axios = require('axios');

exports.handler = async function(event, context) {
    const { endpoint } = event.queryStringParameters;
    
    if (!endpoint) {
        console.error('No endpoint provided');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Endpoint parameter is required' })
        };
    }

    console.log(`Requesting: https://api.mangadex.org${endpoint}`);

    try {
        const response = await axios.get(`https://api.mangadex.org${endpoint}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        
        console.log('Response received:', response.status);
        
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({ 
                error: error.message,
                details: error.response ? error.response.data : null
            })
        };
    }
};
