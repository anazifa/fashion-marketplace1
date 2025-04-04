import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Fashion clothing items',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessories',
        description: 'Fashion accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Shoes',
        description: 'Footwear',
      },
    }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Fashion Forward',
        description: 'Trendy fashion brand',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Luxury Wear',
        description: 'High-end fashion brand',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Street Style',
        description: 'Urban fashion brand',
      },
    }),
  ]);

  // Create collections
  const collections = await Promise.all([
    prisma.collection.create({
      data: {
        name: 'Summer Collection',
        description: 'Summer fashion items',
        brandId: brands[0].id,
      },
    }),
    prisma.collection.create({
      data: {
        name: 'Winter Collection',
        description: 'Winter fashion items',
        brandId: brands[1].id,
      },
    }),
  ]);

  // Create users (including sellers)
  const hashedPassword = await bcrypt.hash('test123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller@example.com',
        password: hashedPassword,
        firstName: 'Seller',
        lastName: 'User',
        role: 'SELLER',
      },
    }),
  ]);

  // Create addresses
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: users[0].id,
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
      },
    }),
    prisma.address.create({
      data: {
        userId: users[0].id,
        street: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
      },
    }),
  ]);

  // Create products for the seller
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Classic T-Shirt',
        description: 'A comfortable cotton t-shirt',
        price: 29.99,
        mainImage: 'https://example.com/tshirt.jpg',
        categoryId: categories[0].id,
        brandId: brands[0].id,
        collectionId: collections[0].id,
        sellerId: users[1].id,
        variants: {
          create: [
            {
              size: 'S',
              color: 'Black',
              stock: 100,
              sku: 'TSH-BLK-S-001',
            },
            {
              size: 'M',
              color: 'Black',
              stock: 100,
              sku: 'TSH-BLK-M-001',
            },
            {
              size: 'L',
              color: 'Black',
              stock: 100,
              sku: 'TSH-BLK-L-001',
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans',
        price: 79.99,
        mainImage: 'https://example.com/jeans.jpg',
        categoryId: categories[0].id,
        brandId: brands[1].id,
        collectionId: collections[1].id,
        sellerId: users[1].id,
        variants: {
          create: [
            {
              size: '30x32',
              color: 'Blue',
              stock: 50,
              sku: 'DEN-BLU-30-001',
            },
            {
              size: '32x32',
              color: 'Blue',
              stock: 50,
              sku: 'DEN-BLU-32-001',
            },
            {
              size: '34x32',
              color: 'Blue',
              stock: 50,
              sku: 'DEN-BLU-34-001',
            },
          ],
        },
      },
    }),
  ]);

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        userId: users[0].id,
        productId: products[0].id,
        rating: 5,
        comment: 'Great quality t-shirt!',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[0].id,
        productId: products[1].id,
        rating: 4,
        comment: 'Good fit, comfortable jeans.',
      },
    }),
  ]);

  // Create orders
  await Promise.all([
    prisma.order.create({
      data: {
        userId: users[0].id,
        status: 'COMPLETED',
        total: 109.98,
        shippingAddressId: addresses[0].id,
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 29.99,
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: 79.99,
            },
          ],
        },
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 