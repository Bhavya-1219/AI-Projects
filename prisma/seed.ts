import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});

  console.log('Seeding users...');
  
  // Seed Users
  // Customer User (default CUSTOMER role)
  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2b$12$CoSj2ZbFZiqScBTZQIpPGecHAIwY4vNYlCatCINFR6rC0UTAVKBV6', // 'password123' hashed
      phone: '+15551234567',
      defaultAddress: '123 Main Street, Apt 4B, New York, NY 10001',
      role: 'CUSTOMER',
    },
  });

  // Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'admin@gourmetgo.com',
      password: '$2b$12$4fTojOiDPqqLlsHtFZwbiOKmXUTVEWVC1424O0NTUGqpisGlUpC1C', // 'adminpassword' hashed
      phone: '+15559876543',
      defaultAddress: '99 Wall Street, Suite 500, New York, NY 10005',
      role: 'ADMIN',
    },
  });

  console.log('Seeding restaurants and menu items...');

  // 1. Bella Italia (Italian)
  const bellaItalia = await prisma.restaurant.create({
    data: {
      name: 'Bella Italia',
      slug: 'bella-italia',
      address: '12 Pine Street, Downtown, NY 10012',
      rating: 4.6,
      cuisine: 'Italian',
      coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 25,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: 'Margherita Pizza',
            description: 'Classic sourdough base with sweet San Marzano tomato sauce, fresh buffalo mozzarella, and aromatic organic basil leaves.',
            price: 14.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Garlic Bread with Cheese',
            description: 'Crisp baguette slices smothered in herb-infused garlic butter and loaded with melted mozzarella.',
            price: 6.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Pasta Carbonara',
            description: 'Al dente spaghetti tossed in rich egg yolk sauce, crispy pancetta lardons, freshly cracked black pepper, and aged Pecorino Romano.',
            price: 17.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Truffle Mushroom Risotto',
            description: 'Creamy Arborio rice slowly simmered in rich vegetable broth with wild forest mushrooms, drizzled with aromatic white truffle oil.',
            price: 19.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Classic Tiramisu',
            description: 'Layers of espresso-soaked ladyfingers and velvety mascarpone cream, dusted with organic cocoa powder.',
            price: 7.99,
            category: 'Desserts',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'San Pellegrino Sparkling Water',
            description: 'Sparkling natural mineral water (750ml).',
            price: 4.50,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1608885898957-a599fb1ee19b?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 2. Spice Symphony (Indian)
  const spiceSymphony = await prisma.restaurant.create({
    data: {
      name: 'Spice Symphony',
      slug: 'spice-symphony',
      address: '45 Curry Lane, Westside, NY 10019',
      rating: 4.8,
      cuisine: 'Indian',
      coverImage: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 35,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: 'Paneer Tikka Shaslik',
            description: 'Tender cottage cheese cubes marinated in yogurt and spices, skewered with bell peppers and onions, grilled in a traditional tandoor.',
            price: 12.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Butter Chicken (Murgh Makhani)',
            description: 'Tandoori grilled chicken shreds simmered in a smooth, rich, buttery tomato sauce with cream and dried fenugreek leaves.',
            price: 18.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Dal Makhani',
            description: 'Black lentils slow-cooked overnight with tomatoes, butter, and cream for a rich, earthy flavor.',
            price: 14.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Butter Garlic Naan',
            description: 'Leavened flatbread cooked in tandoor, topped with minced garlic and melted butter.',
            price: 3.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Mango Lassi',
            description: 'Creamy yogurt drink blended with sweet Alfonso mango pulp and green cardamom.',
            price: 4.99,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Gulab Jamun',
            description: 'Warm milk solid dumplings fried and soaked in cardamom-flavored sugar syrup (3 pcs).',
            price: 5.99,
            category: 'Desserts',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 3. Golden Dragon (Chinese)
  const goldenDragon = await prisma.restaurant.create({
    data: {
      name: 'Golden Dragon',
      slug: 'golden-dragon',
      address: '88 Wok Road, Chinatown, NY 10002',
      rating: 4.3,
      cuisine: 'Chinese',
      coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 30,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: 'Veg Spring Rolls',
            description: 'Crispy fried pastries filled with shredded cabbage, carrots, glass noodles, and mushrooms. Served with sweet chili dipping sauce (4 pcs).',
            price: 7.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Hot & Sour Chicken Soup',
            description: 'Classic spicy and tangy soup with chicken shreds, wood ear mushrooms, tofu, and bamboo shoots.',
            price: 6.99,
            category: 'Starters',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1547592165-e1d17f57655c?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Kung Pao Chicken',
            description: 'Stir-fried chicken cubes with peanuts, bell peppers, and scallions in a spicy, sweet, and savory Szechuan peppercorn sauce.',
            price: 15.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Mapo Tofu',
            description: 'Silken tofu cubes simmered in a spicy, aromatic fermented broad bean paste and chili oil sauce with minced garlic.',
            price: 13.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Schezwan Fried Rice',
            description: 'Stir-fried jasmine rice with assorted vegetables in spicy Schezwan sauce.',
            price: 11.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Jasmine Green Tea',
            description: 'Hot brewed organic jasmine green tea (500ml).',
            price: 3.50,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 4. Burger & Co (Fast Food)
  const burgerCo = await prisma.restaurant.create({
    data: {
      name: 'Burger & Co',
      slug: 'burger-and-co',
      address: '102 Fast Boulevard, Midtown, NY 10022',
      rating: 4.5,
      cuisine: 'Fast Food',
      coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 20,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: 'Truffle Parmesan Fries',
            description: 'Crispy skin-on french fries tossed in aromatic white truffle oil, grated parmesan cheese, and fresh parsley.',
            price: 6.49,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Classic Bacon Cheeseburger',
            description: 'Grilled Angus beef patty, cheddar cheese, crispy bacon, butter lettuce, ripe tomato slices, pickles, and our signature burger sauce on a toasted brioche bun.',
            price: 12.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Spicy Crispy Chicken Burger',
            description: 'Crispy buttermilk fried chicken breast dipped in hot buffalo glaze, served with creamy coleslaw and pickles on a brioche bun.',
            price: 11.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Gourmet Veggie Burger',
            description: 'House-made patty from black beans, quinoa, and sweet potatoes, loaded with sliced avocado, melted Swiss cheese, and chipotle mayo.',
            price: 10.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Double Chocolate Milkshake',
            description: 'Rich, thick milkshake blended with premium Belgian dark chocolate ice cream, topped with whipped cream and chocolate shavings.',
            price: 5.99,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 5. The Green Bowl (Healthy)
  const theGreenBowl = await prisma.restaurant.create({
    data: {
      name: 'The Green Bowl',
      slug: 'the-green-bowl',
      address: '15 Organic Way, Uptown, NY 10027',
      rating: 4.7,
      cuisine: 'Healthy',
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 20,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: 'Avocado Quinoa Salad',
            description: 'Fluffy organic quinoa, ripe diced avocado, cherry tomatoes, cucumbers, roasted chickpeas, and baby spinach, tossed in a lemon herb vinaigrette.',
            price: 11.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Hummus & Pita Plate',
            description: 'Creamy house-made hummus drizzled with extra virgin olive oil, served with warm whole-wheat pita bread and sliced cucumbers.',
            price: 8.49,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73bc2c31243?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Grilled Salmon Power Bowl',
            description: 'Wild-caught grilled salmon fillet over brown jasmine rice, steamed broccoli, edamame beans, and roasted sweet potatoes, with ginger soy dressing.',
            price: 18.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Tofu Buddha Bowl',
            description: 'Crispy sesame-baked tofu cubes, organic red quinoa, shredded purple cabbage, avocado, edamame, and broccoli, served with creamy tahini dressing.',
            price: 14.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Cold Pressed Green Glow Juice',
            description: 'Freshly extracted juice of celery, cucumber, green apples, kale, ginger, and lemon (330ml). No added sugar.',
            price: 6.99,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587caa9a?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Berry Chia Pudding',
            description: 'Organic chia seeds soaked in unsweetened almond milk, layered with strawberry puree, topped with fresh raspberries and blueberries.',
            price: 6.49,
            category: 'Desserts',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 6. Sakura Sushi (Japanese)
  const sakuraSushi = await prisma.restaurant.create({
    data: {
      name: 'Sakura Sushi',
      slug: 'sakura-sushi',
      address: '23 Tokyo Walk, Midtown, NY 10017',
      rating: 4.9,
      cuisine: 'Japanese',
      coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 40,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: 'Edamame with Sea Salt',
            description: 'Steamed green soybean pods tossed in flaky sea salt.',
            price: 5.49,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Veggie Gyoza',
            description: 'Pan-fried Japanese dumplings filled with cabbage, mushrooms, and chives. Served with light soy dipping sauce (6 pcs).',
            price: 8.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Premium Sushi Combo',
            description: 'Chef\'s selection of 4 pcs Nigiri (Salmon, Tuna, Shrimp, Yellowtail) and 6 pcs California Roll. Served with wasabi, pickled ginger, and soy sauce.',
            price: 24.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Vegetarian Maki Roll Box',
            description: 'Assorted vegetarian sushi rolls: 6 pcs Avocado Roll, 6 pcs Cucumber Roll, and 6 pcs Asparagus Roll.',
            price: 16.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Organic Matcha Mochi',
            description: 'Sweet Japanese rice cakes filled with premium matcha green tea ice cream (3 pcs).',
            price: 6.99,
            category: 'Desserts',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Iced Oolong Tea',
            description: 'Refreshing, unsweetened brewed Japanese oolong tea, served chilled (500ml).',
            price: 3.99,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 7. Taco Fiesta (Mexican)
  const tacoFiesta = await prisma.restaurant.create({
    data: {
      name: 'Taco Fiesta',
      slug: 'taco-fiesta',
      address: '64 Sombrero Street, East Village, NY 10009',
      rating: 4.4,
      cuisine: 'Mexican',
      coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 25,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: 'Chips & Fresh Guacamole',
            description: 'Crispy hand-cut corn tortilla chips served with fresh avocado mash, jalapeños, onions, cilantro, and lime juice.',
            price: 8.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73bc2c31243?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Grilled Chicken Quesadilla',
            description: 'Toasted flour tortilla stuffed with spiced grilled chicken breast, melted Monterey Jack cheese, and bell peppers. Served with sour cream and pico de gallo.',
            price: 13.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1618254512620-c5a7dfdb26cd?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Jackfruit Carnitas Tacos',
            description: 'Corn tortillas topped with seasoned shredded jackfruit "carnitas", pickled red onions, fresh cilantro, and salsa verde (3 pcs).',
            price: 11.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Loaded Beef Nachos',
            description: 'Corn tortilla chips smothered in warm cheese sauce, seasoned ground beef, black beans, jalapeños, tomatoes, sour cream, and guacamole.',
            price: 14.99,
            category: 'Main Course',
            isVeg: false,
            imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Mexican Churros',
            description: 'Fried dough pastry sticks tossed in cinnamon sugar, served with warm dark chocolate sauce for dipping.',
            price: 6.99,
            category: 'Desserts',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Horchata',
            description: 'Traditional sweet Mexican drink made from rice milk, milk, vanilla, and ground cinnamon.',
            price: 3.99,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // 8. Healthy Greens (Healthy / Vegetarian Focus)
  const healthyGreens = await prisma.restaurant.create({
    data: {
      name: 'Healthy Greens',
      slug: 'healthy-greens',
      address: '77 Wellness Boulevard, Soho, NY 10013',
      rating: 4.6,
      cuisine: 'Healthy',
      coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60',
      deliveryTime: 22,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: 'Roasted Tomato Basil Soup',
            description: 'Creamy tomato soup slow-roasted with garlic, fresh basil, and extra virgin olive oil, served with toasted sourdough bread croutons.',
            price: 7.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1547592165-e1d17f57655c?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Vegan Caesar Wrap',
            description: 'Grilled protein strips, crisp romaine lettuce, cherry tomatoes, and crunchy breadcrumbs tossed in house vegan Caesar dressing, wrapped in a spinach tortilla.',
            price: 11.49,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Mediterranean Chickpea Salad',
            description: 'Spiced chickpeas, fresh cucumbers, kalamata olives, cherry tomatoes, red onion, and crumbled vegan feta cheese, with red wine vinaigrette.',
            price: 12.99,
            category: 'Starters',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Tofu Teriyaki Stir-fry',
            description: 'Pan-seared silken tofu cubes stir-fried with snap peas, broccoli, mushrooms, carrots, and sweet bell peppers in home-made ginger-teriyaki glaze, served over brown rice.',
            price: 14.99,
            category: 'Main Course',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Warm Apple Cinnamon Oatmeal',
            description: 'Rolled oats cooked in almond milk, spiced with cinnamon, topped with caramelized apple slices and walnuts.',
            price: 6.99,
            category: 'Desserts',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=60',
            available: true,
          },
          {
            name: 'Lemon Mint Infused Water',
            description: 'Fresh cold water infused with fresh lemon slices, organic cucumber, and crushed mint leaves (500ml).',
            price: 2.99,
            category: 'Beverages',
            isVeg: true,
            imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587caa9a?w=600&auto=format&fit=crop&q=60',
            available: true,
          }
        ]
      }
    }
  });

  // Seed some Reviews
  console.log('Seeding reviews...');
  await prisma.review.create({
    data: {
      userId: customer.id,
      restaurantId: bellaItalia.id,
      rating: 5,
      comment: 'Absolutely amazing pizza! Crust is perfect and ingredients are very fresh.',
    },
  });

  await prisma.review.create({
    data: {
      userId: customer.id,
      restaurantId: spiceSymphony.id,
      rating: 5,
      comment: 'Best butter chicken in town. True spices, rich creamy sauce. A must try!',
    },
  });

  await prisma.review.create({
    data: {
      userId: customer.id,
      restaurantId: sakuraSushi.id,
      rating: 4,
      comment: 'Top quality sushi, beautifully packed. The delivery took a bit longer but was worth it.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Standard SQLite client close
    await prisma.$disconnect();
  });
