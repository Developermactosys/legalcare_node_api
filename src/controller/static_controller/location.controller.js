const axios = require('axios');

const getLocation = async (req, res) => {
    const apiKey = 'AIzaSyAXdZsci8RH_GLRp3UVPDuhHRLDUzopgH0';
    const { text } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&components=country:in&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const descriptions = response.data.predictions.map(prediction => prediction.description);
        return res.status(200).json({
            status : true,
            message : "Locations showing successfully",
            data : descriptions
        })
    } catch (err) {
        return res.status(500).json({
            status : false,
            message : err.message
        })
    }
};

module.exports = {
    getLocation
};
