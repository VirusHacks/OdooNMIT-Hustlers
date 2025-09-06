<!-- PROJECT LOGO -->
<p align="center">
  <img src="https://img.shields.io/badge/EcoFinds-🌱-green?style=for-the-badge" alt="EcoFinds logo"/>
</p>

<h1 align="center">EcoFinds Marketplace</h1>
<p align="center">
  <b>Sustainable Luxury Marketplace | Built for the OdooNMIT Hackathon</b><br/>
  <i>Where luxury meets sustainability</i>
  <br/>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-97.2%25-blue?style=flat-square&logo=typescript" alt="TypeScript"></a>
  <a href="https://prisma.io/"><img src="https://img.shields.io/badge/Prisma-%232D3748.svg?style=flat-square&logo=prisma" alt="Prisma"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="https://postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql" alt="PostgreSQL"></a>
  <img src="https://img.shields.io/badge/contributors-3-orange?style=flat-square" alt="Contributors">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"/>
</p>

---

## <img src="https://img.icons8.com/color/48/000000/about.png" width="28"/> About

<b>EcoFinds</b> is a <b>sustainable marketplace platform</b> enabling users to buy and sell pre-owned luxury items, promoting environmental consciousness and reducing waste via the circular economy model. Built as a hackathon project, its goal is to merge luxury commerce with real-world sustainability.

---

## <img src="https://img.icons8.com/color/48/000000/sparkling.png" width="28"/> Features
<ul>
  <li><b>Secure Authentication</b>: JWT-based login (bcrypt hashed passwords)</li>
  <li><b>Product Management</b>: List, edit, and manage luxury resale products with multi-image support</li>
  <li><b>Shopping Cart</b>: Full cart system with quantity controls</li>
  <li><b>Order Tracking</b>: End-to-end order lifecycle (confirmation, shipping, delivery)</li>
  <li><b>Smart Categories</b>: Fashion, Electronics, Home & Garden, Books, Sports, and Beauty</li>
  <li><b>Beautiful UI</b>: Modern, responsive design (Tailwind, Framer Motion & GSAP)</li>
  <li><b>Genuine Sustainability Focus</b>: Extends product lifecycles</li>
</ul>

---

## <img src="https://img.icons8.com/doodle/48/000000/rocket--v2.png" width="28"/> Getting Started

### <b>Prerequisites</b>
<ul>
  <li>Node.js 18+</li>
  <li>npm or pnpm</li>
  <li>Neon PostgreSQL account</li>
</ul>

### <b>Installation</b>
<details>
  <summary><b>Expand for setup instructions</b></summary>

```bash
git clone https://github.com/VirusHacks/OdooNMIT-Hustlers.git
cd OdooNMIT-Hustlers
npm install  # or pnpm install
```

1. Add a <code>.env</code> file:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-here"
```

2. <b>Set up the database:</b>

Recommended:
```bash
npm run setup
```
Manual:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

3. <b>Start development server:</b>
```bash
npm run dev
```
Visit <a href="http://localhost:3000">http://localhost:3000</a>
</details>

### <b>Test Accounts (after seeding):</b>
<ul>
  <li>alice@example.com / password123</li>
  <li>bob@example.com / password123</li>
</ul>

---

## <img src="https://img.icons8.com/color/48/000000/settings.png" width="28"/> Tech Stack
<table><tr><td>
<b>Frontend:</b><br/>
  Next.js 14, React 18<br/>
  Tailwind CSS, Radix UI, Lucide Icons<br/>
  Framer Motion, GSAP, Geist Fonts
</td><td>
<b>Backend:</b><br/>
  PostgreSQL (Neon)<br/>
  Prisma ORM, JWT Auth<br/>
  Next.js API Routes<br/>
</td><td>
<b>Dev Tools:</b><br/>
  TypeScript (97.2%)<br/>
  ESLint, Prettier, Git
</td></tr></table>

---

## <img src="https://img.icons8.com/color/48/000000/flow-chart.png" width="28"/> Project Structure

<pre>
OdooNMIT-Hustlers/
├── app/            # Next.js app directory (APIs, dashboard, auth, listings)
├── components/     # UI components and providers
├── lib/            # Prisma client, auth helpers, utilities
├── prisma/         # Schema and data seeding
├── public/         # Static files
└── ...
</pre>

---

## <img src="https://img.icons8.com/color/48/000000/database.png" width="28"/> Database Entities
<ul>
<li><b>Users</b> – Authentication & profiles</li>
<li><b>Categories</b> – Product categorization</li>
<li><b>Listings</b> – All product listings</li>
<li><b>Cart Items</b> – User carts</li>
<li><b>Orders</b> – Order management</li>
<li><b>Order Items</b> – Line items in orders</li>
</ul>

### <b>Categories:</b> 👗 <b>Fashion</b> ‧ 📱 <b>Electronics</b> ‧ 🏠 <b>Home & Garden</b> ‧ 📚 <b>Books</b> ‧ ⚽ <b>Sports</b> ‧ 💄 <b>Beauty</b>

---

## <img src="https://img.icons8.com/fluency/48/000000/idea-sharing.png" width="28"/> Contributing

<details>
<summary><b>How to contribute</b></summary>
<ul>
  <li>Fork this repo and create your branch (<code>feature/AmazingFeature</code>).</li>
  <li>Commit your changes (<code>git commit -m 'Add AmazingFeature'</code>).</li>
  <li>Push and open a pull request.</li>
  <li>Follow TypeScript and code guidelines.</li>
</ul>
</details>

---

## <img src="https://img.icons8.com/color/48/000000/chess-leaderboard.png" width="28"/> Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Dash10107">
        <img src="https://github.com/Dash10107.png" width="100px;" alt="Daksh Jain"/>
        <br />
        <sub><b>Daksh Jain</b></sub>
      </a>
      <br /> 💻 Full-stack Development
    </td>
    <td align="center">
      <a href="https://github.com/vinisha1014">
        <img src="https://github.com/vinisha1014.png" width="100px;" alt="Vinisha K Bhagwani"/>
        <br />
        <sub><b>Vinisha K Bhagwani</b></sub>
      </a>
      <br /> 🎨 Frontend & UI/UX
    </td>
    <td align="center">
      <a href="https://github.com/wizardsweb">
        <img src="https://github.com/wizardsweb.png" width="100px;" alt="Vinay Vora"/>
        <br />
        <sub><b>Vinay Vora</b></sub>
      </a>
      <br /> 📦 Backend & Infra
    </td>
  </tr>
</table>

---

## <img src="https://img.icons8.com/color/48/000000/license.png" width="28"/> License

This project is MIT licensed.

---

<p align="center">
  <b>Made with ❤️ for a sustainable future</b><br/>
  <i>EcoFinds – Where luxury meets sustainability 🌱</i>
</p>

<!-- END OF README -->
