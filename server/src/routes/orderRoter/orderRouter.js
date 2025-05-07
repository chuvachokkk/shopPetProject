const router = require('express').Router();
const { Order } = require('../../../db/models');

router.post('/', async (req, res) => {
  const { inputs, user, data } = req.body;

  try {
    const order = await Order.create({
      userId: Number(user.id),
      name: inputs.name,
      phone:inputs.phone,
      data
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports=router;