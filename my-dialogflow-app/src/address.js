const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

functions.http('helloHttp', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).send({ error: 'Address is required' });
    }

    // Request to Google Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=`;
    
    // Await the response from Google Geocoding API
    const response = await axios.get(url);

    // Check if the response contains valid address data
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      res.status(200).send({
        formatted_address: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        valid: true
      });
    } else {
      res.status(400).send({ error: 'Invalid address', valid: false });
    }
  } catch (error) {
    console.error('Error validating address:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});
