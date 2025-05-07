const TypeService = require("../services/type.service");

async function getAllItemsByType(req, res, next) {
  try {
    const { gender } = req.params;
    if (gender === "all") {
      const data = await TypeService.getAllItemsByType();
      return res.json({ success: true, data });
    }

    const genderType =
      gender === "m" ? "Мужчинам" : gender === "f" ? "Женщинам" : null;

    if (genderType === null) return res.sendStatus(404);

    const data = await TypeService.getAllItemsByType(genderType);

    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
}

module.exports = { getAllItemsByType };
