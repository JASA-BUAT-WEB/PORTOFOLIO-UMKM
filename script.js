const WHATSAPP_NUMBER = "6287817513538";

const products = [
  {
    id: 1,
    name: "Kue Lapis",
    category: "Kue",
    price: 25000,
    description: "Kue lembut dengan rasa manis yang pas.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    tag: "Favorit"
  },
  {
    id: 2,
    name: "Lemper Ayam",
    category: "Tradisional",
    price: 15000,
    description: "Camilan gurih dengan isian ayam.",
    image: "https://images.unsplash.com/photo-1626777553730-bb9c7f7d6f18?auto=format&fit=crop&w=600&q=80",
    tag: "Tradisional"
  },
  {
    id: 3,
    name: "Onde-Onde",
    category: "Tradisional",
    price: 12000,
    description: "Bola wijen dengan isian lembut.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    tag: "Populer"
  },
  {
    id: 4,
    name: "Pisang Goreng",
    category: "Gorengan",
    price: 10000,
    description: "Pisang goreng untuk teman bersantai.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    tag: "Pilihan"
  },
  {
    id: 5,
    name: "Brownies",
    category: "Kue",
    price: 30000,
    description: "Brownies cokelat untuk pencinta manis.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    tag: "Cokelat"
  },
  {
    id: 6,
    name: "Kue Kering",
    category: "Kue",
    price: 35000,
    description: "Camilan renyah untuk berbagai momen.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    tag: "Renyah"
  },
  {
    id: 7,
    name: "Paket Camilan",
    category: "Tradisional",
    price: 40000,
    description: "Paket pilihan untuk keluarga.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
    tag: "Paket"
  },
  {
    id: 8,
    name: "Camilan Gurih",
    category: "Gorengan",
    price: 18000,
    description: "Pilihan gurih untuk teman berkumpul.",
    image: "https://images.unsplash.com/photo-1621939514649-280e2aa2f4b1?auto=format&fit=crop&w=600&q=80",
    tag: "Gurih"
  }
];

const cart = new Map();
let activeCategory = "Semua";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

function rupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "Semua" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x400/fbf7ef/553623?text=Produk+UMKM'">
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${rupiah(product.price)}</span>
          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Tambah ${product.name} ke keranjang"
            title="Tambah ke keranjang">+</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length !== 0;
}

function updateCartCount() {
  let total = 0;

  for (const quantity of cart.values()) {
    total += quantity;
  }

  cartCount.textContent = total;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  cart.set(id, (cart.get(id) || 0) + 1);
  updateCartCount();
  showToast(`${product.name} ditambahkan ke keranjang.`);
}

function openWhatsApp(message) {
  if (!/^\d{9,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("Atur nomor WhatsApp di file script.js terlebih dahulu.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function checkout() {
  if (cart.size === 0) {
    showToast("Keranjang masih kosong. Pilih produk dahulu.");
    document.getElementById("produk").scrollIntoView();
    return;
  }

  const lines = ["Halo Dapur Lestari, saya ingin memesan:", ""];
  let total = 0;

  for (const [id, quantity] of cart.entries()) {
    const product = products.find(item => item.id === id);
    if (!product) continue;

    const subtotal = product.price * quantity;
    total += subtotal;

    lines.push(`${product.name} x${quantity} = ${rupiah(subtotal)}`);
  }

  lines.push("", `Total sementara: ${rupiah(total)}`);
  lines.push("", "Mohon informasi ketersediaan produk dan ongkir. Terima kasih.");

  openWhatsApp(lines.join("\n"));
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

searchInput.addEventListener("input", renderProducts);

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderProducts();
});

document.getElementById("cartButton").addEventListener("click", checkout);
document.getElementById("contactButton").addEventListener("click", () => {
  openWhatsApp("Halo Dapur Lestari, saya ingin bertanya tentang produk Anda.");
});
document.getElementById("footerContact").addEventListener("click", () => {
  openWhatsApp("Halo Dapur Lestari, saya ingin bertanya tentang produk Anda.");
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("phoneDisplay").textContent ="+" + WHATSAPP_NUMBER;
renderProducts();