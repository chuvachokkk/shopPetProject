const cartService= require('../services/cart.service')

async function create(req,res,next) {
    try {
     const {userId,productId, size}=req.body;
     const data =await cartService.create({userId,productId, size})
     const result = data.get();
     delete result.userId
     res.send(result)
    } catch (error) {
    console.log(error)
    }
}

module.exports={create}