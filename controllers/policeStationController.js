// controllers/policeStationController.js (Police Stations)
const { PoliceStation } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all police stations
 */
exports.getStations = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { stationName: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const stations = await PoliceStation.findAll({
      where,
      order: [['stationName', 'ASC']]
    });

    res.json(stations);
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

/**
 * Create new police station (admin only)
 */
exports.createStation = async (req, res) => {
  try {
    const { stationName, contact, location } = req.body;

    const station = await PoliceStation.create({
      stationName,
      contact,
      location
    });

    res.status(201).json(station);
  } catch (error) {
    console.error('Create station error:', error);
    res.status(500).json({ error: 'Failed to create station' });
  }
};

/**
 * Delete police station (admin only)
 */
exports.deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await PoliceStation.findByPk(id);

    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    await station.destroy();
    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error('Delete station error:', error);
    res.status(500).json({ error: 'Failed to delete station' });
  }
};