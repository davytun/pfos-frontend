const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("menu-mobile");
const closeMenu = document.getElementById("close-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  menuToggle.setAttribute(
    "aria-expanded",
    mobileMenu.classList.contains("hidden") ? "false" : "true"
  );
});

closeMenu.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
  menuToggle.setAttribute("aria-expanded", "false");
});

/**
 * Init typed.js
 */
const slides = document.querySelectorAll(".text-slide");
let index = 0;

function showNextSlide() {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateY(-${index * 100}%)`;
  });

  index = (index + 1) % slides.length; // Loop back to first slide
}

setInterval(showNextSlide, 2000); // Change every 2 seconds

(function () {
  emailjs.init("QxzxYdkHlSqmgwk6H"); // Initialize Email.js with your public key
})();

document
  .getElementById("quickMessageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Retrieve input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation: Ensure fields are not empty
    if (!name || !email || !message) {
      alert("All fields are required!");
      return;
    }

    // Prepare email.js template parameters
    const templateParams = {
      name: name,
      email: email,
      message: message,
    };

    // Send email via Email.js
    emailjs.send("service_vtw0yyb", "template_pv80lnk", templateParams).then(
      function (response) {
        alert("Message sent successfully!");
        console.log("Success:", response.status, response.text);
        // Clear form fields after submission (optional)
        document.getElementById("quickMessageForm").reset();
      },
      function (error) {
        alert("Failed to send message. Please try again.");
        console.log("Error:", error);
      }
    );
  });

// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();

//     const targetId = this.getAttribute("href").substring(1);
//     const targetElement = document.getElementById(targetId);

//     window.scrollTo({
//       top: targetElement.offsetTop,
//       behavior: "smooth",
//     });
//   });
// });

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://pfos-backend.onrender.com/api/products"
    );
    const products = await response.json();

    if (!Array.isArray(products) || products.length === 0) {
      document.getElementById("product-container").innerHTML =
        "<p>No products found</p>";
      return;
    }

    let productHTML = "";

    products.forEach((product) => {
      productHTML += `
        <div class="flex flex-col items-start max-w-[340px]">
          <div class="w-[290px] md:w-[330px] h-[290px] md:h-[330px] rounded-[20px] bg-white flex items-center justify-center">
            <img src="${product.image}" alt="${product.name}" class="w-[250px] md:w-[290px]" />
          </div>
          <h4 class="font-bold text-[20px] md:text-[24px]">${product.name}</h4>
          <p class="text-orange text-[20px] md:text-[25px]">₦${product.price}</p>
          <button onclick="addToCart('${product._id}')" class="bg-orange text-[14px] md:text-[16px] font-bold text-blue w-24 h-10 md:w-32 md:h-12 rounded-md">
            Buy Now
          </button>
        </div>
      `;
    });

    document.getElementById("product-container").innerHTML = productHTML;
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("product-container").innerHTML =
      "<p>Failed to load products.</p>";
  }
}

// Call function when the page loads
fetchProducts();
