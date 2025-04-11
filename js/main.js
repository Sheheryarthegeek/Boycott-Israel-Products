fetch("../data/products.json")
  .then((res) => res.json())
  .then((data) => {
    const grid = document.getElementById("productGrid");
    const searchBar = document.getElementById("searchBar");
    const notFoundMessage = document.getElementById("notFoundMessage");

    const categories = [
      { name: "Food & Beverages", products: data["Food & Beverages"] },
      {
        name: "Confectionery & Snacks",
        products: data["Confectionery & Snacks"],
      },
      {
        name: "Household & Personal Care",
        products: data["Household & Personal Care"],
      },
    ];

    function renderProducts(list) {
      grid.innerHTML = "";
      let hasProducts = false;

      list.forEach((category) => {
        const categoryProducts = category.products
          .map(
            (p) => `
          <div class="product-card bg-white shadow-lg rounded-2xl p-4 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer" onclick="window.location.href='../public/product.html?product=${p.id}'">
            <img src="../public/assets/img/${p.img}" alt="${p.name}" class="w-full h-40 object-contain mb-4" />
            <h3 class="text-lg font-semibold">${p.name}</h3>
            <p class="text-sm text-gray-500">${p.company}</p>
            <button class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">View Details</button>
          </div>
        `
          )
          .join("");

        if (categoryProducts.length > 0) {
          grid.innerHTML += categoryProducts;
          hasProducts = true;
        }
      });

      if (!hasProducts) {
        notFoundMessage.classList.remove("hidden");
        notFoundMessage.classList.add("fade-in");
      } else {
        notFoundMessage.classList.add("hidden");
        notFoundMessage.classList.remove("fade-in");
      }
    }

    function handleSearch(query) {
      const filteredCategories = categories.map((category) => {
        const filteredProducts = category.products.filter((product) =>
          product.name.toLowerCase().includes(query)
        );
        return { ...category, products: filteredProducts };
      });
      renderProducts(filteredCategories);
    }

    renderProducts(categories);

    // Input typing
    searchBar.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      handleSearch(query);
    });

    // Enter key
    searchBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = e.target.value.toLowerCase();
        handleSearch(query);
      }
    });

    // Voice Search
    const micBtn = document.querySelector(".text-gray-400");
    if (micBtn && "webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";

      micBtn.addEventListener("click", () => {
        recognition.start();
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchBar.value = transcript;
        handleSearch(transcript.toLowerCase());
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    }
  })
  .catch((error) => {
    console.error("Error loading product data:", error);
  });

window.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("mainNavbar");
  setTimeout(() => {
    navbar.classList.remove("opacity-0");
  }, 100);
});
