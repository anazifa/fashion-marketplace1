require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

const testProducts = [
    {
        title: "Classic White T-Shirt",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "T-Shirts",
        description: "A comfortable and stylish white t-shirt made from 100% organic cotton."
    },
    {
        title: "Slim Fit Jeans",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "Jeans",
        description: "Modern slim fit jeans with a comfortable stretch."
    },
    {
        title: "Leather Jacket",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "Outerwear",
        description: "Classic leather jacket with a modern cut."
    }
];

async function addTestProducts() {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL');

        await Product.sync({ force: true }); // This will drop the table if it exists
        console.log('Product table created');

        await Product.bulkCreate(testProducts);
        console.log('Test products added successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addTestProducts(); 