const Appointment = require("../models/Appointment");
const Treatment = require("../models/Treatment");

const search = async (req, res) => {
  try {
    const { type, ...filters } = req.body;

    let model;
    switch (type) {
      case "appointment":
        model = Appointment;
        break;
      case "treatment":
        model = Treatment;
        break;
      // Add more types as needed
      default:
        return res.status(400).json({ error: "Invalid entity type." });
    }

    const query = {};

    for (const key in filters) {
      // You can make this more advanced (like regex for strings, etc.)
      if (filters[key]) {
        query[key] = filters[key];
      }
    }

    const results = await model.find(query);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { search };
