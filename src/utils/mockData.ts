import chilledSugar from "../assets/images/chilled-sugar.jpg";
import chocolateChip from "../assets/images/chocolate_chip.jpg";
import darkDoubleChocolate from "../assets/images/Dark-Double-Chocolate.jpg";
import dulceDeLeche from "../assets/images/dulce-de-leche.jpg";
import lemonMeringue from "../assets/images/lemon-meringue.jpg";
import lotusLava from "../assets/images/lotus-lava.jpg";
import milkshakeDream from "../assets/images/milkshake-dream.jpg";
import peanutButter from "../assets/images/Peanut-Butter.jpg";
import pinkVelvet from "../assets/images/pink-velvet.jpg";

export interface Cookie {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export const COOKIE_MOCK_DATA: Cookie[] = [
  {
    id: 2,
    name: "Chocolate Chip",
    price: 1290,
    description:
      "Classic Chocolate Chip Cookies... The Perfect Bite of Nostalgia",
    imageUrl: chocolateChip,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Pink Velvet",
    price: 1350,
    description:
      "A velvety cake batter cookie topped with a swirl of vanilla cream.",
    imageUrl: pinkVelvet,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Chilled Sugar",
    price: 1190,
    description:
      "A vanilla sugar cookie served chilled and topped with sweet almond.",
    imageUrl: chilledSugar,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Milkshake Dream",
    price: 1420,
    description:
      "A chilled cookie featuring layers of malted milkshake mousse and a cherry on top.",
    imageUrl: milkshakeDream,
    isAvailable: false,
  },
  {
    id: 6,
    name: "Lotus Biscoff",
    price: 1490,
    description:
      "Packed with Biscoff cookie pieces and drizzled with white chocolate.",
    imageUrl: lotusLava,
    isAvailable: true,
  },
  {
    id: 7,
    name: "Chocolate Fudge",
    price: 1290,
    description:
      "A rich, dark chocolate cookie loaded and drizzled with a hot fudge glaze.",
    imageUrl: darkDoubleChocolate,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Peanut Butter Cup",
    price: 1350,
    description:
      "Classic peanut butter cookie topped with  melted milk chocolate",
    imageUrl: peanutButter,
    isAvailable: false,
  },
  {
    id: 9,
    name: "Dulce de Leche",
    price: 1390,
    description:
      "Spiced cinnamon cookie layered with thick dulce de leche caramel.",
    imageUrl: dulceDeLeche,
    isAvailable: true,
  },
  {
    id: 10,
    name: "Lemon Meringue Pie",
    price: 1450,
    description:
      "A graham cracker crust  filled with tart lemon curd & topped with fluffy meringue swirl.",
    imageUrl: lemonMeringue,
    isAvailable: true,
  },
  {
    id: 11,
    name: "Brown Sugar Crinkle",
    price: 1250,
    description:
      "Soft crinkled cookie rolled in sugar with a chewy caramel centre and crisp sugared edges.",
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 12,
    name: "Salted Dark Chocolate",
    price: 1390,
    description:
      "Deep dark chocolate cookie finished with a pinch of sea salt for the perfect sweet-salty hit.",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 13,
    name: "Vanilla Butter Round",
    price: 1190,
    description:
      "Classic round butter cookie with a pure vanilla finish — light, crumbly and melt-in-your-mouth.",
    imageUrl:
      "https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 14,
    name: "Glazed Choco Stack",
    price: 1320,
    description:
      "Stacked double-chocolate cookies drizzled with a shiny glaze — rich, fudgy and deeply satisfying.",
    imageUrl:
      "https://images.unsplash.com/photo-1598839950984-034f6dc7b495?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 15,
    name: "Classic Choco Chip",
    price: 1280,
    description:
      "Four perfectly baked chocolate chip cookies with golden edges and gooey centres — a timeless favourite.",
    imageUrl:
      "https://images.unsplash.com/photo-1634188023615-7e08901193b6?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 16,
    name: "Pecan Toffee Crunch",
    price: 1450,
    description:
      "Buttery toffee cookie loaded with roasted pecans and a caramelised crunchy top.",
    imageUrl:
      "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 17,
    name: "Heritage Cocoa",
    price: 1310,
    description:
      "Deep cocoa cookie made with premium heritage chocolate — bold flavour, dense texture.",
    imageUrl:
      "https://images.unsplash.com/photo-1590080874088-eec64895b423?w=800&q=80&auto=format&fit=crop",
    isAvailable: false,
  },
  {
    id: 18,
    name: "Dark Chocolate Pile",
    price: 1360,
    description:
      "A tower of dark chocolate cookies — intensely bittersweet with a soft, pillowy bite.",
    imageUrl:
      "https://images.unsplash.com/photo-1557310717-d6bea9f36682?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 19,
    name: "Wooden Spoon Special",
    price: 1290,
    description:
      "House-recipe chocolate chip cookies baked fresh daily — chewy, golden and generously chunked.",
    imageUrl:
      "https://images.unsplash.com/photo-1639678111962-88fffeb071cb?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 20,
    name: "Rustic Oat Chip",
    price: 1220,
    description:
      "Hearty oat-based cookie with chocolate chips and a rustic homemade finish — wholesome and satisfying.",
    imageUrl:
      "https://images.unsplash.com/photo-1612845575953-f4b1e3d63160?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 21,
    name: "Bakehouse Assorted",
    price: 1480,
    description:
      "A signature assorted bake featuring the day's freshest cookies straight from our bakehouse oven.",
    imageUrl:
      "https://images.unsplash.com/photo-1576717585968-8ea8166b89b8?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 22,
    name: "Single Origin Cookie",
    price: 1350,
    description:
      "One perfect cookie. Single origin chocolate, slow-baked to crisp edges and a gooey warm centre.",
    imageUrl:
      "https://images.unsplash.com/photo-1600147566401-c2056eb69479?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 23,
    name: "Bowl Cookie Bites",
    price: 1200,
    description:
      "Bite-sized cookie rounds served in a bowl — perfect for sharing or a light sweet snack.",
    imageUrl:
      "https://images.unsplash.com/photo-1583743089695-4b816a340f82?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 24,
    name: "Toffee Chip Cluster",
    price: 1410,
    description:
      "Cookie loaded with toffee bits and chocolate clusters — every bite is a different kind of sweet.",
    imageUrl:
      "https://images.unsplash.com/photo-1657418830273-40c19cfff4d7?w=800&q=80&auto=format&fit=crop",
    isAvailable: false,
  },
  {
    id: 25,
    name: "Choco Hazelnut Swirl",
    price: 1490,
    description:
      "Chocolate cookie swirled with hazelnut paste and topped with crushed hazelnuts — rich and nutty.",
    imageUrl:
      "https://images.unsplash.com/photo-1557310717-d6bea9f36682?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 26,
    name: "White Choc Macadamia",
    price: 1460,
    description:
      "Buttery cookie packed with white chocolate chips and roasted macadamia nuts — tropical and indulgent.",
    imageUrl:
      "https://images.unsplash.com/photo-1598839950984-034f6dc7b495?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 27,
    name: "Espresso Chip",
    price: 1370,
    description:
      "Strong espresso cookie base with dark chocolate chips — a coffee lover's dream in cookie form.",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 28,
    name: "Cinnamon Dusted",
    price: 1230,
    description:
      "Warm cinnamon sugar cookie dusted to golden perfection — cosy, spiced and perfectly sweetened.",
    imageUrl:
      "https://images.unsplash.com/photo-1576717585968-8ea8166b89b8?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: 29,
    name: "Brownie Cookie",
    price: 1420,
    description:
      "Half brownie, half cookie — fudgy in the middle, crackled on top, and dangerously chocolatey.",
    imageUrl:
      "https://images.unsplash.com/photo-1634188023615-7e08901193b6?w=800&q=80&auto=format&fit=crop",
    isAvailable: false,
  },
  {
    id: 30,
    name: "Golden Chip Classic",
    price: 1260,
    description:
      "Golden-baked butter cookie with a classic chocolate chip layout — simple, perfect, timeless.",
    imageUrl:
      "https://images.unsplash.com/photo-1600147566401-c2056eb69479?w=800&q=80&auto=format&fit=crop",
    isAvailable: true,
  },
];
