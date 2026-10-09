import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const initialProducts = [
  {
    id: "fr-001",
    slug: "vanilla-oud-fragrance",
    name: "Vanilla Oud",
    category: "fragrance",
    price: 49.99,
    stock: 25,
    shortDescription: "A warm profile with creamy sweetness and a deeper woody character.",
    description: "Vanilla Oud is presented as a rich, enveloping fragrance profile for customers who prefer warmth, depth and a soft lingering trail.",
    fragranceFamily: "Woody",
    profile: ["Warm", "Sweet", "Woody"],
    notes: { top: ["Soft spice"], heart: ["Vanilla"], base: ["Oud accord", "Woods"] },
    sizes: ["50 ml", "100 ml", "500 ml"],
    size: "100 ml",
    applications: ["Candle making", "Diffusers", "Home fragrance"],
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595425964071-2c1ec3ab808c?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    isActive: true,
  },
  {
    id: "fr-002",
    slug: "rose-musk-fragrance",
    name: "Rose Musk",
    category: "fragrance",
    price: 45.0,
    stock: 30,
    shortDescription: "A soft floral fragrance profile shaped by rose and clean musk notes.",
    description: "Rose Musk brings a gentle floral direction with a smooth, clean base that feels elegant and easy to wear in a space.",
    fragranceFamily: "Floral",
    profile: ["Floral", "Soft", "Musky"],
    notes: { top: ["Fresh petals"], heart: ["Rose"], base: ["Clean musk"] },
    sizes: ["50 ml", "100 ml", "500 ml", "1 L"],
    size: "100 ml",
    applications: ["Home fragrance", "Diffusers"],
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    isActive: true,
  },
  {
    id: "fr-003",
    slug: "citrus-amber-fragrance",
    name: "Citrus Amber",
    category: "fragrance",
    price: 42.0,
    stock: 20,
    shortDescription: "Fresh citrus brightness balanced with a mellow amber warmth.",
    description: "Citrus Amber is a bright yet grounded fragrance profile for spaces that need freshness without losing softness.",
    fragranceFamily: "Citrus",
    profile: ["Fresh", "Citrus", "Amber"],
    notes: { top: ["Citrus peel"], heart: ["Aromatic notes"], base: ["Amber"] },
    sizes: ["50 ml", "100 ml"],
    size: "100 ml",
    applications: ["Candle making", "Home fragrance"],
    imageUrl: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    isActive: true,
  },
  {
    id: "ca-001",
    slug: "amber-evening-candle",
    name: "Amber Evening Candle",
    category: "candle",
    price: 38.0,
    stock: 15,
    shortDescription: "A warm scented candle for calm evenings and quiet interiors.",
    description: "Amber Evening Candle is designed as a warm aromatic accent for moments when a room needs softness, glow and a composed scent character.",
    fragranceFamily: "Oriental",
    profile: ["Amber", "Warm", "Soft spice"],
    notes: { top: ["Soft spice"], heart: ["Amber"], base: ["Woods"] },
    sizes: ["200 g", "350 g"],
    size: "200 g",
    burnTime: "Approx 45 hours",
    waxType: "Soy wax blend with cotton wick",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    isActive: true,
  },
  {
    id: "ca-002",
    slug: "sandalwood-linen-candle",
    name: "Sandalwood Linen Candle",
    category: "candle",
    price: 36.0,
    stock: 18,
    shortDescription: "Smooth sandalwood notes paired with airy linen softness.",
    description: "Sandalwood Linen Candle creates a tranquil atmosphere with grounding wood notes lifted by clean, modern freshness.",
    fragranceFamily: "Woody",
    profile: ["Woody", "Clean", "Calm"],
    notes: { top: ["Linen note"], heart: ["Cedar"], base: ["Sandalwood"] },
    sizes: ["200 g", "350 g"],
    size: "200 g",
    burnTime: "Approx 45 hours",
    waxType: "Soy wax blend with cotton wick",
    imageUrl: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    isActive: true,
  },
  {
    id: "ca-003",
    slug: "fig-cedar-candle",
    name: "Fig & Cedar Candle",
    category: "candle",
    price: 38.0,
    stock: 12,
    shortDescription: "Earthy fig leaves and refined cedarwood for a balanced green aroma.",
    description: "Fig & Cedar Candle offers an understated balance of botanical green notes and dry, warm wood.",
    fragranceFamily: "Woody Green",
    profile: ["Green", "Fig", "Woody"],
    notes: { top: ["Fig leaf"], heart: ["Bark"], base: ["Cedarwood"] },
    sizes: ["200 g"],
    size: "200 g",
    burnTime: "Approx 45 hours",
    waxType: "Soy wax blend with cotton wick",
    imageUrl: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Admin User
  const adminEmail = "admin@fragrancesbydruaa.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("AdminPassword123!", 10);
    const admin = await prisma.user.create({
      data: {
        name: "D_Ruaa Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`✅ Seeded default admin user: ${admin.email}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${existingAdmin.email}`);
  }

  // 2. Seed Initial Products
  for (const item of initialProducts) {
    const { images, ...productData } = item;
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug },
    });

    if (!existing) {
      const created = await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images.map((url) => ({
              url,
              altText: `${item.name} image`,
            })),
          },
        },
      });
      console.log(`✅ Seeded product: ${created.name} (${created.category})`);
    } else {
      console.log(`ℹ️ Product already exists: ${existing.name}`);
    }
  }

  console.log("🌿 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
