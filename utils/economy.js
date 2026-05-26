const User =
  require('../models/User');

async function getUser(userId) {

  let user =
    await User.findOne({ userId });

  if (!user) {

    user = await User.create({
      userId
    });

  }

  return user;
}

async function addMoney(userId, amount) {

  const user =
    await getUser(userId);

  user.money += amount;

  await user.save();

  return user.money;
}

async function removeMoney(userId, amount) {

  const user =
    await getUser(userId);

  user.money -= amount;

  if (user.money < 0)
    user.money = 0;

  await user.save();

  return user.money;
}

async function getMoney(userId) {

  const user =
    await getUser(userId);

  return user.money;
}

module.exports = {

  getUser,
  addMoney,
  removeMoney,
  getMoney

};
