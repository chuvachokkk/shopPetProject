const router = require('express').Router();
const { Product, Review } = require('../../../db/models');

router.post('/', async (req, res) => {
  const { inputs, user, product } = req.body;
  let { rating, review, name} = inputs;
  if(!rating){
    rating=0;
  }

  try {
    const Onereview = await Review.create({
      userId: Number(user.id),
      productId: product.id,
      rating,
      review,
      name: name,
    });
    const reviewResult = Onereview.get();

    if (Onereview) {
      const reviews = await Review.findAll({
        where: { productId: product.id },
      });
      const result = reviews.map((el) => el.get());
      const newRate = (
        result.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      ).toFixed(1);

      const oneProduct = await Product.findOne({ where: { id: product.id } });
      oneProduct.update({ rating: newRate });
      res.send({reviewResult,newRate });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



router.delete('/del/:id', async (req,res)=>{
  try {
    const {id}=req.params;
     await Review.destroy({where:{id}})
    res.send(id)
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

module.exports = router;
