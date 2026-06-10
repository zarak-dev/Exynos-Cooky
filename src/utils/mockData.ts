// src/utils/mockData.ts
import chilledSugar from '../assets/images/chilled-sugar.jpg';
import chocolateChip from '../assets/images/chocolate_chip.jpg';
import darkDoubleChocolate from '../assets/images/Dark-Double-Chocolate.jpg';
import dulceDeLeche from '../assets/images/dulce-de-leche.jpg';
import lemonMeringue from '../assets/images/lemon-meringue.jpg';
import lotusLava from '../assets/images/lotus-lava.jpg';
import milkshakeDream from '../assets/images/milkshake-dream.jpg';
import peanutButter from '../assets/images/Peanut-Butter.jpg';
import pinkVelvet from '../assets/images/pink-velvet.jpg';

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
    name: "Classic Chocolate Chip",
    price: 1290,
    description: "Classic Chocolate Chip Cookies... The Perfect Bite of Nostalgia",
    imageUrl: chocolateChip,
    isAvailable: true
  },
  {
    id: 3,
    name: "Pink Velvet",
    price: 1350,
    description: "A velvety cake batter cookie topped with a swirl of vanilla cream cheese frosting and pink velvet crumbs.",
    imageUrl: pinkVelvet,
    isAvailable: true
  },
  {
    id: 4,
    name: "Chilled Sugar",
    price: 1190,
    description: "A vanilla sugar cookie served chilled and topped with a perfect swirl of sweet almond frosting.",
    imageUrl: chilledSugar,
    isAvailable: true
  },
  {
    id: 5,
    name: "Milkshake Dream",
    price: 1420,
    description: "A chilled cookie featuring layers of malted milkshake mousse, whipped cream, and a cherry on top.",
    imageUrl: milkshakeDream,
    isAvailable: false
  },
  {
    id: 6,
    name: "Lotus Biscoff Lava",
    price: 1490,
    description: "A cookie packed with Biscoff cookie pieces, stuffed with melted Biscoff spread, and drizzled with white chocolate.",
    imageUrl: lotusLava,
    isAvailable: true
  },
  {
    id: 7,
    name: "Double Chocolate Fudge",
    price: 1290,
    description: "A rich, dark chocolate cookie loaded with semi-sweet chunks and drizzled with a hot fudge glaze.",
    imageUrl: darkDoubleChocolate,
    isAvailable: true
  },
  {
    id: 8,
    name: "Peanut Butter Cup",
    price: 1350,
    description: "A classic peanut butter cookie topped with a pool of melted milk chocolate and crushed peanut butter cups.",
    imageUrl: peanutButter,
    isAvailable: false
  },
  {
    id: 9,
    name: "Dulce de Leche",
    price: 1390,
    description: "A spiced cinnamon cookie layered with thick dulce de leche caramel and a smooth cream cheese swirl.",
    imageUrl: dulceDeLeche,
    isAvailable: true
  },
  {
    id: 10,
    name: "Lemon Meringue Pie",
    price: 1450,
    description: "A graham cracker crust cookie filled with tart lemon curd and topped with a toasted fluffy meringue swirl.",
    imageUrl: lemonMeringue,
    isAvailable: true
  }
];