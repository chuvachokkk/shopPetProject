const { User, Order } = require("../../db/models");
const bcrypt = require("bcrypt");
const tokenService = require("../services/token.service");

//TODO Дописать функцию поиска юзера по почте
async function findUserByEmail(email) {
  const userData = await User.findOne({ where: { email } });
  if (userData) return userData;
}

//! Поиск пользователя по почте и паролю (расшех пароля и сравнение)
async function findUserByEmailAndPassword(email, password) {
  const userData = await User.findOne({ where: { email } });
  if (!userData) throw new Error("Неверная почта или пароль");

  const isPasswordValid = await bcrypt.compare(password, userData.password);

  if (isPasswordValid) {
    const plainUser = userData.get({ plain: true });

    const tokens = await tokenService.generateTokens({ ...plainUser });
    return { ...plainUser, tokens };
  }

  throw new Error("Неверная почта или пароль");
}

async function findUserById(id) {
  const userData = await User.findOne({ where: { id } });
  return userData;
}

async function getAllUsers() {
  const users = await User.findAll({
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });

  return users;
}

//! Создание пользователя
async function createUser(email, password) {
  const isExist = await findUserByEmail(email);

  if (!isExist) {
    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await User.create({ email, password: hashedPassword });
    const plainUser = user.get({ plain: true });

    const tokens = await tokenService.generateTokens({ ...plainUser });
    return { ...plainUser, tokens };
  } else {
    throw new Error("Email уже занят");
  }
}

async function getUserOrders(id) {
  try {
    const orders = await Order.findAll({ where: { userId: id } });

    if (orders) {
      return orders;
    }
  } catch (error) {
    throw new Error("Ошибка получения заказов");
  }
}

async function changeUserData(email, name, surname, lastname, address, phone) {
  try {
    const isExist = await findUserByEmail(email);
    console.log("UPDATE?");

    if (isExist) {
      const user = await User.update(
        { name, surname, lastname, address, phone },
        {
          where: {
            email,
          },
        }
      );

      return user;
    }

    //const plainUser = user.get({ plain: true });
  } catch (error) {
    throw new Error("Ошибка обновление пользователя в базе данных");
  }
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  findUserByEmailAndPassword,
  getAllUsers,
  changeUserData,
  getUserOrders,
};
