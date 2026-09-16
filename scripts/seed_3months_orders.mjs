import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env
const envContent = fs.readFileSync(".env", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

// Fetch existing products to use real IDs, names, and prices
async function seedOrders() {
  console.log("Fetching products from Supabase...");
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("id, name, price")
    .order("id");

  if (pErr || !products || products.length === 0) {
    console.error("Failed to fetch products:", pErr);
    process.exit(1);
  }

  console.log(`Found ${products.length} products.`);

  // Create lookup dictionary
  const prodMap = new Map();
  for (const p of products) {
    prodMap.set(p.name, p);
  }

  // Helper to get product or fallback
  const getProd = (preferredName) => {
    if (prodMap.has(preferredName)) return prodMap.get(preferredName);
    return products[Math.floor(Math.random() * products.length)];
  };

  const customers = [
    { name: "Ayesha Malik", email: "ayesha.malik@gmail.com", phone: "03014829102", address: "House 14, Street 9, F-7/2, Islamabad" },
    { name: "Bilal Ahmed", email: "bilal.ahmed92@gmail.com", phone: "03215582910", address: "Apartment 4B, Silver Oaks, F-10/4, Islamabad" },
    { name: "Dr. Fatima Noor", email: "dr.fatima.noor@outlook.com", phone: "03335198234", address: "Villa 22, Sector B, DHA Phase 2, Islamabad" },
    { name: "Hamza Tariq", email: "hamza.tariq@gmail.com", phone: "03458920192", address: "House 88, Street 14, I-8/3, Islamabad" },
    { name: "Zainab Ali", email: "zainab.ali@yahoo.com", phone: "03124890213", address: "House 102, Street 5, G-11/2, Islamabad" },
    { name: "Omar Farooq", email: "omar.farooq@gmail.com", phone: "03009821034", address: "House 45, Street 12, F-6/1, Islamabad" },
    { name: "Maryam Saeed", email: "maryam.saeed@gmail.com", phone: "03348192019", address: "Street 7, Sector F, Bahria Town Phase 7, Rawalpindi" },
    { name: "Usman Khalid", email: "usman.khalid@gmail.com", phone: "03135928102", address: "House 301, Sector C, Askari 11, Rawalpindi" },
    { name: "Saad Rafiq", email: "saad.rafiq@gmail.com", phone: "03028192018", address: "Flat 12, Beverly Centre, Blue Area, Islamabad" },
    { name: "Hira Siddiqui", email: "hira.siddiqui@gmail.com", phone: "03229810293", address: "House 15-A, Street 20, F-8/2, Islamabad" },
    { name: "Mahnoor Khan", email: "mahnoor.khan@gmail.com", phone: "03445920191", address: "House 72, Street 3, E-11/3, Islamabad" },
    { name: "Ahmed Raza", email: "ahmed.raza@gmail.com", phone: "03158291029", address: "House 19, Street 8, Chaklala Scheme 3, Rawalpindi" },
    { name: "Sana Javed", email: "sana.javed@gmail.com", phone: "03319820192", address: "House 54, Sector J, DHA Phase 1, Islamabad" },
    { name: "Daniyal Shah", email: "daniyal.shah@gmail.com", phone: "03005829103", address: "House 12B, Street 34, G-9/1, Islamabad" },
    { name: "Zarak Khan", email: "zarak.dev@gmail.com", phone: "03149066874", address: "House 7A, Street 22, F7/2, Islamabad" },
  ];

  // Popular cookie picks
  const popularCookieNames = [
    "Lotus Biscoff Lava",
    "Chocolate Fudge",
    "Midnight Cookies & Cream",
    "Pink Velvet",
    "Chilled Sugar",
    "Matcha White Choco",
    "Chocolate Chip",
    "Nutella River Core",
    "White Chocolate Raspberry Lava",
    "Warm Cinnamon Churro Delight",
    "Roasted Pistachio Cardamom Dream",
    "Red Velvet White Choco Dream",
  ];

  let orderSequence = 71000;

  // Function to create an order specification
  function generateOrder(dateStr, status = "Delivered") {
    orderSequence++;
    const orderId = `EXY-${orderSequence}`;
    const cust = customers[Math.floor(Math.random() * customers.length)];
    
    // Choose box size: 4-pack (35%), 6-pack (50%), 12-pack (15%)
    const roll = Math.random();
    let boxSize = "6-Pack Custom Box";
    let targetCount = 6;
    if (roll < 0.35) {
      boxSize = "4-Pack Custom Box";
      targetCount = 4;
    } else if (roll > 0.85) {
      boxSize = "12-Pack Custom Box";
      targetCount = 12;
    }

    // Pick 2 to 4 cookie varieties to fill targetCount
    const numVarieties = targetCount === 12 ? Math.floor(Math.random() * 3) + 3 : (targetCount === 6 ? Math.floor(Math.random() * 2) + 2 : 2);
    const chosenCookies = [];
    let remaining = targetCount;

    for (let v = 0; v < numVarieties; v++) {
      const isLast = v === numVarieties - 1;
      const cName = popularCookieNames[Math.floor(Math.random() * popularCookieNames.length)];
      const prod = getProd(cName);
      let qty = isLast ? remaining : Math.max(1, Math.floor(remaining / (numVarieties - v)));
      if (qty > remaining) qty = remaining;
      remaining -= qty;

      chosenCookies.push({
        product: prod,
        quantity: qty,
      });

      if (remaining <= 0) break;
    }

    if (remaining > 0) {
      chosenCookies[0].quantity += remaining;
    }

    // Compute contents string, subtotal, total
    const contentsStr = chosenCookies.map((c) => `${c.quantity}x ${c.product.name}`).join(", ");
    let subtotal = 0;
    const orderItems = [];

    for (const c of chosenCookies) {
      const lineSubtotal = Number(c.product.price) * c.quantity;
      subtotal += lineSubtotal;
      orderItems.push({
        order_id: orderId,
        product_id: c.product.id,
        product_name_snapshot: c.product.name,
        unit_price: Number(c.product.price),
        quantity: c.quantity,
        subtotal: lineSubtotal,
        created_at: dateStr,
      });
    }

    const deliveryFee = 150;
    const discount = subtotal > 15000 ? 1000 : (subtotal > 8000 && Math.random() > 0.5 ? 500 : 0);
    const totalPrice = subtotal + deliveryFee - discount;

    const orderRow = {
      id: orderId,
      customer_name: cust.name,
      customer_email: cust.email,
      customer_phone: cust.phone,
      delivery_address: cust.address,
      box_size: boxSize,
      contents: contentsStr,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      discount: discount,
      total_price: totalPrice,
      payment_method: Math.random() > 0.3 ? "cod" : "card",
      payment_status: status === "Delivered" ? "paid" : "pending",
      status: status,
      created_at: dateStr,
      timestamp: dateStr,
      updated_at: dateStr,
    };

    return { orderRow, orderItems };
  }

  // 1. Generate July 2026 Orders (~18 orders, ~Rs. 135,000)
  // July 2026 days: 01 to 31
  const allOrders = [];
  const allItems = [];

  const julyDays = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 25, 27, 28, 29, 30, 31];
  for (const day of julyDays) {
    const dStr = `2026-07-${String(day).padStart(2, "0")}T${String(10 + (day % 10)).padStart(2, "0")}:${String((day * 3) % 60).padStart(2, "0")}:00.000Z`;
    const { orderRow, orderItems } = generateOrder(dStr, "Delivered");
    allOrders.push(orderRow);
    allItems.push(...orderItems);
  }

  // 2. Generate August 2026 Orders (~28 orders, ~Rs. 225,000)
  // August 2026 days: 01 to 31
  const augustDays = [
    1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 30, 31, 31
  ];
  for (let i = 0; i < augustDays.length; i++) {
    const day = augustDays[i];
    const hour = 11 + (i % 9);
    const minute = (i * 7) % 60;
    const dStr = `2026-08-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`;
    const { orderRow, orderItems } = generateOrder(dStr, "Delivered");
    allOrders.push(orderRow);
    allItems.push(...orderItems);
  }

  // 3. Generate September 2026 Orders (~34 orders, ~Rs. 280,000 - 320,000)
  // Up to current date: Sep 1 to Sep 16
  const sepDays = [
    1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8, 9, 9, 10, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 16, 16, 16
  ];
  const activeStatuses = ["Delivered", "Delivered", "Delivered", "Delivered", "Baking", "Preparing", "Confirmed", "Pending"];
  for (let i = 0; i < sepDays.length; i++) {
    const day = sepDays[i];
    const hour = 9 + (i % 12);
    const minute = (i * 11) % 60;
    const dStr = `2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`;
    const status = day < 14 ? "Delivered" : activeStatuses[i % activeStatuses.length];
    const { orderRow, orderItems } = generateOrder(dStr, status);
    allOrders.push(orderRow);
    allItems.push(...orderItems);
  }

  // Calculate monthly totals
  let julRev = 0, augRev = 0, sepRev = 0;
  for (const o of allOrders) {
    if (o.status !== "Cancelled") {
      const m = new Date(o.created_at).getMonth();
      if (m === 6) julRev += o.total_price;
      if (m === 7) augRev += o.total_price;
      if (m === 8) sepRev += o.total_price;
    }
  }

  console.log(`Generated ${allOrders.length} orders across 3 months:`);
  console.log(`- July 2026: Rs. ${julRev.toLocaleString()}`);
  console.log(`- August 2026: Rs. ${augRev.toLocaleString()} (+${(((augRev - julRev) / julRev) * 100).toFixed(1)}%)`);
  console.log(`- September 2026: Rs. ${sepRev.toLocaleString()} (+${(((sepRev - augRev) / augRev) * 100).toFixed(1)}%)`);

  // Insert orders in chunks of 25
  console.log("Inserting orders into Supabase...");
  for (let i = 0; i < allOrders.length; i += 25) {
    const chunk = allOrders.slice(i, i + 25);
    const { error } = await supabase.from("orders").insert(chunk);
    if (error) {
      console.error("Error inserting order chunk:", error);
      process.exit(1);
    }
  }
  console.log("All orders inserted successfully!");

  // Insert order_items in chunks of 50
  console.log("Inserting order items into Supabase...");
  for (let i = 0; i < allItems.length; i += 50) {
    const chunk = allItems.slice(i, i + 50);
    const { error } = await supabase.from("order_items").insert(chunk);
    if (error) {
      console.error("Error inserting order items chunk:", error);
      process.exit(1);
    }
  }
  console.log("All order items inserted successfully!");

  console.log("Database successfully seeded for July, August, and September 2026!");
}

seedOrders();
