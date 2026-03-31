const Shop = require('../models/Shop');

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
};

const getNearestShops = async (req, res) => {
    const { lat, lng } = req.body;
    if(!lat || !lng) { res.status(400).json({message: "Location coordinates required"}); return; }
    const shops = await Shop.find({});
    const nearestShops = shops.map(shop => {
        const distance = getDistanceFromLatLonInKm(lat, lng, shop.location.lat, shop.location.lng);
        return { ...shop._doc, distance: distance.toFixed(2) };
    }).sort((a, b) => a.distance - b.distance);
    res.json(nearestShops);
};

const createShop = async (req, res) => {
    const shop = new Shop(req.body); await shop.save(); res.status(201).json(shop);
}

module.exports = { getNearestShops, createShop };
