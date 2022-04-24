const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('', '', '', {
  host: 'std-mysql',
  dialect: 'mysql'
});

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

test();

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

const Difficulty = sequelize.define('Difficulty', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Cook = sequelize.define('Cook', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isBusy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  kitchen_id: {
    type: DataTypes.INTEGER,
    defaultValue: this.id
  }
});

const Kitchen = sequelize.define('Kitchen', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  model: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

sequelize
  // .sync({
  //   force: true
  // })
  .sync({
    alter: true
  })
  // .sync()
  .then(result => {
    console.log("Подключено к БД");
  })
  .catch(err => console.log("Ошибка подключения к БД", err));



module.exports = {
  User,
  Difficulty,
  Cook,
  Kitchen,
  Recipe,
  Order
}