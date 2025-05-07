const router = require('express').Router();
const { Question } = require('../../../db/models');

router.post('/', async (req, res) => {
  const { inputsQ, user, product } = req.body;
  let { question, name } = inputsQ;
  try {
    const OneQuestin = await Question.create({
      userId: Number(user.id),
      productId: product.id,
      question,
      name: name,
    });
    const questionResult = OneQuestin.get();

    res.send(questionResult);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const questions = await Question.findAll({ where: { productId: id } });
    const result = questions.map((el) => el.get());
    res.send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put('/:id/answer', async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  try {
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).send({ message: "Вопросы не найдены" });
    }

    question.answer = answer;

    await question.save();

    res.send(question.get());
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
