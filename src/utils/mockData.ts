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
    name: "Lotus Biscoff Lava",
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
];
