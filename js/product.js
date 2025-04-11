const params = new URLSearchParams(window.location.search);
const productId = params.get("product");

fetch("../data/products.json")
  .then((res) => res.json())
  .then((data) => {
    let foundProduct = null;
    let currentCategory = null;

    // Search through all categories to find the matching product by ID
    Object.entries(data).forEach(([categoryName, categoryProducts]) => {
      const match = categoryProducts.find((p) => p.id === productId);
      if (match) {
        foundProduct = match;
        currentCategory = categoryName; // Capture the category of the found product
      }
    });

    if (!foundProduct) {
      document.getElementById("productInfo").innerHTML = `
        <p class="text-red-500 text-center font-semibold text-lg">Product not found.</p>
      `;
      return;
    }

    const product = foundProduct;

    // Simulated details (should ideally be in your JSON data)
    const details = {
      "Coca Cola": {
        description:
          "Coca-Cola has come under scrutiny for its operations in Israel, including facilities located in Israeli settlements. Advocacy groups have urged a boycott due to the brand's indirect contributions to the Israeli economy through these ventures.",
        support:
          "Coca-Cola has invested heavily in Israel over decades, with millions of dollars flowing into Israeli infrastructure and corporate partnerships.",
      },
      Nestlé: {
        description:
          "Nestlé owns a significant stake in Osem, an Israeli food manufacturer. It has continued operations in Israel despite international protests, raising concerns about its support for the occupation.",
        support:
          "Nestlé has invested over $150 million in Israel and continues to profit from its operations there, indirectly supporting the economy.",
      },
      // Add more products here if needed
    };

    const { name, company, img } = product;
    const info = details[name] || {
      description:
        "This product is under boycott due to its ties with Israel and related operations or affiliations.",
      support:
        "The company has generated millions from international markets which indirectly support the Israeli economy.",
    };

    document.getElementById("productInfo").innerHTML = `
      <div class="flex flex-col md:flex-row items-center gap-8">
        <img src="../public/assets/img/${img}" alt="${name}" class="w-60 h-60 object-contain" />
        <div>
          <h1 class="text-3xl font-bold text-yellow-500 mb-2">${name}</h1>
          <p class="text-gray-600 mb-2 text-md">🚫 Owned by <span class="font-semibold">${company}</span></p>
          <p class="text-sm text-gray-700 mt-4 leading-relaxed">${info.description}</p>
          <p class="text-sm text-red-600 mt-4 leading-relaxed font-medium">${info.support}</p>
          <button onclick="window.location.href = '../index.html#products'" class="mt-6 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-md transition-all">⬅ Back to Product List</button>
        </div>
      </div>
    `;

    // Dynamically generate related products based on category
    const relatedProductsContainer = document.getElementById("relatedProducts");
    const relatedProducts = getRelatedProducts(
      data,
      productId,
      currentCategory
    );

    relatedProducts.forEach((relatedProduct) => {
      const relatedProductCard = document.createElement("div");
      relatedProductCard.classList.add(
        "p-4",
        "border",
        "rounded-lg",
        "hover:shadow-md",
        "transition-all"
      );
      relatedProductCard.innerHTML = `
        <img
          src="../public/assets/img/${relatedProduct.img}"
          alt="${relatedProduct.name}"
          class="w-50 h-48 object-contain rounded-md mb-4"
        />
        <h4 class="text-xl font-semibold text-gray-800 mb-2">${relatedProduct.name}</h4>
        <p class="text-gray-600 text-sm">
          ${relatedProduct.company}
        </p>
        <a
          href="product.html?product=${relatedProduct.id}"
          class="text-yellow-500 hover:text-yellow-600 mt-2 block"
        >View Details</a>
      `;
      relatedProductsContainer.appendChild(relatedProductCard);
    });
  })
  .catch((err) => {
    console.error("Failed to fetch product data", err);
  });

// Function to get related products from the same category
function getRelatedProducts(data, currentProductId, currentCategory) {
  const relatedProducts = [];
  const categoryProducts = data[currentCategory] || [];

  categoryProducts.forEach((product) => {
    if (product.id !== currentProductId) {
      relatedProducts.push(product);
    }
  });

  return relatedProducts.slice(0, 3); // Limiting to 3 related products for now
}
