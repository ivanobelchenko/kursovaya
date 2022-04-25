const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('std_1371_kursach', 'std_1371_kursach', 'vanya555', {
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