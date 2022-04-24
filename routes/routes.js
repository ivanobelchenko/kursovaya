const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { User,  Kitchen, Cook, Order, Difficulty, Recipe} = require('../models.js');


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('index', {});
});
router.get('/loginPage', (req, res) => {
  res.status(200).render('login', {});
});
router.get('/cooks', (req, res) => {
  res.status(200).render('cooks', {});
});
router.get('/register', (req, res) => {
  res.status(200).render('register', {});
});
router.get('/profile', (req, res) => {
  res.status(200).render('profile', {});
});
router.get('/order', (req, res) => {
  res.status(200).render('order', {});
});
router.get('/admin', (req, res) => {
  res.status(200).render('admin', {});
});

router.get('/getRecipes', async (req, res) => {
  let recipes = await Recipe.findAll();
  
  res.json(recipes);
});
router.get('/getKitchens', async (req, res) => {
  let kitchens = await Kitchen.findAll();
  
  res.json(kitchens);
});
router.get('/getCooks', async (req, res) => {
  let cooks = await Cook.findAll();
  
  res.json(cooks);
});
router.get('/getOrders', async (req, res) => {
  let orders = await Order.findAll();
  
  res.json(orders);
});
router.get('/getDifficulties', async (req, res) => {
  let difficulties = await Difficulty.findAll();
  
  res.json(difficulties);
});
router.get('/getUsers', async (req, res) => {
  let users = await User.findAll();
  
  res.json(users);
});


router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    });
    
    console.log(user);
    
    res.status(200).render('login', {
      username: user.dataValues.username,
      user_id: user.dataValues.id
    });
    
  } catch (e) {
    res.status(400).send('Error!');
  }
  
});

router.post('/createUser', async (req, res) => {
  let userData = {
    username: req.body.username,
    password: req.body.password
  };
  
  try {
  
    let user = await User.create(userData);
    
    res.status(200).render('register', {
      username: user.dataValues.username,
      user_id: user.dataValues.id
    });
    
  } catch (e) {
    console.log('Error while creating a user!');
    res.status(400).send(e);
  }
  
  
});

router.post('/createCookAndKitchen', async (req, res) => {
  let cookData = {
    username: req.body.username
  };
  
  let kitchenData = {
    model: req.body.kitchen_model,
    number: req.body.kitchen_number
  }
  
  try {
    let cook = await Cook.create(cookData);
    cook.kitchen_id = cook.dataValues.id;
    await cook.save();
    
    let kitchen = await Kitchen.create(kitchenData);
    
    res.status(200).redirect('/admin');
  } catch (e) {
    console.log('Error while creating a cook or a kitchen!');
    
    res.status(400).send(e);
  }
});

router.post('/updateCookAndKitchen', async (req, res) => {
  
  let reqID = req.body.id;
  
  let cookData = {
    username: req.body.username
  };
  
  let kitchenData = {
    number: req.body.kitchen_number,
    model: req.body.kitchen_model
  }
  

  
  try {
    let cook = await Cook.findOne({ where: { id: reqID } });
    let kitchen = await Kitchen.findOne({ where: { id: reqID } });
    
    if (cookData.username) {
      cook.username = cookData.username;
      await cook.save();
    }
    
    if (kitchenData.number) {
      kitchen.number = kitchenData.number;
      await kitchen.save();
    }
    
    if (kitchenData.model) {
      kitchen.model = kitchenData.model;
      await kitchen.save();
    }
    
    res.status(200).redirect('/admin');
  } catch (e) {
    console.log('Error while creating a cook or a kitchen!');
    
    res.status(400).send(e);
  }
  
  
});

router.post('/deleteCookAndKitchen', async (req, res) => {
  try {
    let reqID = req.body.id;
    
    let cook = await Cook.findOne({where: { id: reqID } });
    let kitchen = await Kitchen.findOne({ where: { id: cook.dataValues.kitchen_id } });
    
    console.log(cook.dataValues.isBusy);
    
    if (cook.dataValues.isBusy) {
      let order = await Order.findOne({ where: { id: cook.dataValues.order_id } });
      let recipe = await Recipe.findOne({ where: { id: order.dataValues.recipe_id } });
      
      await order.destroy();
      await recipe.destroy();
    }
    
    await cook.destroy();
    await kitchen.destroy();
    
    res.status(200).redirect('/admin');
  } catch (e) {
    console.log('Error while deleting a cook or a kitchen!');
    
    res.status(400).send(e);
  }
  
});


router.post('/createOrder', async (req, res) => {
  let recipeData = {
    title: req.body.text_title,
    text: req.body.text,
    user_id: req.body.user_id
  };
  try {
    let recipe = await Recipe.create(recipeData);
    
    let orderData = {
      recipe_id: recipe.dataValues.id,
      user_id: req.body.user_id
    };
    
    let order = await Order.create(orderData);
    
    let cook = await Cook.findOne({ 
      where: {
        isBusy: false
      } 
    });
    
    if (!cook) throw new Error('Все редакторы сейчас заняты');
    
    cook.order_id = order.dataValues.id;
    cook.isBusy = true;
    await cook.save();
    
    res.status(200).render('order', {});
  } catch (e) {
    console.log('Возникла ошибка');
    
    res.status(400).send(e);
  }
  
  
});

router.get('/getOrderTable', async(req, res) => {
  let orders = await Order.findAll();
  let cooks = [];
  let users = [];
  let recipes = [];
  
  try {
    for (let i = 0; i < orders.length; i++) {
      cooks.push(await Cook.findOne({ where: { order_id: orders[i].dataValues.id } }));
      users.push(await User.findOne({ where: { id: orders[i].dataValues.user_id } }));
      recipes.push(await Recipe.findOne({ where: orders[i].dataValues.recipe_id }));
    }
    
    res.status(200).json({orders, cooks, users, recipes});
  } catch (e) {
    res.status(200).json({orders, cooks, users, recipes});
  }
  
  
  
});

module.exports = router;