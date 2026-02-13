import Menu from '../models/Menu.js';

// Fetch all menu items
export const getMenu = async (req, res) => {
  try {
    const items = await Menu.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
};

// Seed function to populate the database with high-quality images
export const seedMenu = async (req, res) => {
  try {
    // Optional: Clears existing items so you don't get duplicates every time you seed
    await Menu.deleteMany({}); 

    const sampleItems = [
      { 
        name: "Margherita Pizza", 
        description: "Fresh basil, tomato sauce, and mozzarella cheese on a thin crust.", 
        price: 299, 
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop" 
      },
      { 
        name: "Classic Cheeseburger", 
        description: "Juicy patty topped with melted cheddar, lettuce, and onions.", 
        price: 189, 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop" 
      },
      { 
        name: "Veggie Momos", 
        description: "Steamed dumplings filled with finely chopped seasonal vegetables.", 
        price: 129, 
        image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop" 
      },
      { 
        name: "Spicy Pepperoni", 
        description: "Classic pepperoni with a kick of chili flakes and honey drizzle.", 
        price: 399, 
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop" 
      },
      { 
        name: "Crispy Chicken Wings", 
        description: "Six pieces of jumbo wings tossed in your choice of buffalo or BBQ sauce.", 
        price: 249, 
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&auto=format&fit=crop" 
      }
    ];

    await Menu.insertMany(sampleItems);
    res.status(201).json({ message: "Menu seeded with professional images!" });
  } catch (error) {
    res.status(500).json({ message: "Seeding failed", error: error.message });
  }
};