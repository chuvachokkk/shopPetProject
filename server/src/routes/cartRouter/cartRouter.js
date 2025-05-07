const router = require("express").Router();
const cartController =require('../../controllers/cart.controller')
const {Cart, Product}=require('../../../db/models');


router.post('/',async(req, res)=>{
   try {
    const {userId,productId, size}=req.body;
    
    const [cart,isCreated]=await Cart.findOrCreate ({
        where: {userId,productId, size},
        defaults: {userId,productId, size, count: 1}
    })
    
    if(!isCreated){
      await cart.update({count: cart.count+1})
    }
    const result = cart.get();
    delete result.userId
    res.send(result)
    } catch (error) {
    console.error(error);
    res.sendStatus(500);
    } 
})

router.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const cart = await Cart.findAll({
      where: { userId: id },
      include: [
        {
          model: Product,
          attributes: ["title", "price", "description", "image", "discount"],
        },
      ],
    });
    const result = cart.map((el) => ({
      ...el.get(),
      ...el.Product.dataValues,
    }));
    res.send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findAll({ where: { userId: id } });
    const result = cart.map((el) => el.get());
    const data = result.map((el) => delete el.userId);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: { id },
    });

    if(cartItem.count === 1){
      await cartItem.destroy();
      res.send(id);
    }else{
      await cartItem.update({count: cartItem.count-1})
      res.send(cartItem)
    }  
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete("/all/:id", async (req, res) => {
  try {
    const { id } = req.params;

     await Cart.destroy({
      where: { userId: id},
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



module.exports = router;
