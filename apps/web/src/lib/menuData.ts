export interface MenuItem {
  id: string;
  name: string;
  category: "pizza" | "burgers" | "wraps" | "drinks" | "starters" | "mains";
  price: number;
  isVeg: boolean;
  description: string;
  image: string;
}

export const menuItems: MenuItem[] = [
  {
    id: "kuhlad-pizza",
    name: "Kuhlad Pizza",
    category: "pizza",
    price: 199,
    isVeg: true,
    description: "Signature pizza served in a clay kuhlad — loaded with fresh veggies, mozzarella, and house-made tomato sauce.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  },
  {
    id: "bbq-chicken-pizza",
    name: "BBQ Chicken Pizza",
    category: "pizza",
    price: 249,
    isVeg: false,
    description: "Smoky BBQ base with tender grilled chicken, caramelized onions, and melted cheese on a crispy crust.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
  },
  {
    id: "chicken-burger",
    name: "Chicken Burger",
    category: "burgers",
    price: 179,
    isVeg: false,
    description: "Juicy grilled chicken patty with lettuce, tomato, pickles, and our signature café sauce in a toasted bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  },
  {
    id: "veg-wrap",
    name: "Veg Wrap",
    category: "wraps",
    price: 149,
    isVeg: true,
    description: "Crispy veggies, paneer, fresh greens, and tangy mint chutney wrapped in a soft whole-wheat tortilla.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80",
  },
  {
    id: "chicken-wrap",
    name: "Chicken Wrap",
    category: "wraps",
    price: 169,
    isVeg: false,
    description: "Grilled chicken strips, crunchy slaw, jalapeños, and chipotle mayo in a warm flour tortilla.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600",
  },
  {
    id: "mojito",
    name: "Mojito",
    category: "drinks",
    price: 99,
    isVeg: true,
    description: "Refreshing mint-lime mojito with crushed ice, sugar syrup, and a hint of soda — our bestseller.",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    category: "drinks",
    price: 129,
    isVeg: true,
    description: "Rich blended cold coffee made with premium espresso, chilled milk, and topped with whipped cream.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
  },
  {
    id: "blue-lagoon",
    name: "Blue Lagoon",
    category: "drinks",
    price: 119,
    isVeg: true,
    description: "Stunning electric-blue mocktail with lemon, ice cream soda, and a splash of blue curacao syrup.",
    image: "/items/blue-lagoon.jpg",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    category: "starters",
    price: 219,
    isVeg: true,
    description: "Marinated cottage cheese cubes grilled to perfection with bell peppers, onions, and aromatic spices.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80",
  },
  {
    id: "loaded-nachos",
    name: "Loaded Nachos",
    category: "starters",
    price: 189,
    isVeg: true,
    description: "Crispy corn tortilla chips piled high with melted cheese, jalapeños, salsa, and sour cream.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
  },
  {
    id: "mac-and-cheese",
    name: "Mac & Cheese",
    category: "mains",
    price: 199,
    isVeg: true,
    description: "Creamy four-cheese macaroni pasta baked golden — the ultimate comfort food in a cast iron skillet.",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600&q=80",
  },
  {
    id: "chilli-chicken",
    name: "Chilli Chicken",
    category: "mains",
    price: 229,
    isVeg: false,
    description: "Wok-tossed crispy chicken with green chillies, capsicum, ginger-garlic, and dark soya sauce glaze.",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
  },
];

export const PROMO_CODES: Record<string, { discount: number; type: "percent" | "flat"; description: string }> = {
  BOGOPIZZA: { discount: 50, type: "percent", description: "50% off on Pizzas (Wed/Sat/Sun)" },
  FIRST20: { discount: 20, type: "percent", description: "20% off on your first order" },
  MOJITO600: { discount: 60, type: "flat", description: "₹60 off when Mojito is in cart" },
};
