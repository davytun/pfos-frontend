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

// (function () {
//   emailjs.init("QxzxYdkHlSqmgwk6H"); // Initialize Email.js with your public key
// })();

// document
//   .getElementById("quickMessageForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent form from submitting normally

//     // Retrieve input values
//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const message = document.getElementById("message").value.trim();

//     // Basic validation: Ensure fields are not empty
//     if (!name || !email || !message) {
//       alert("All fields are required!");
//       return;
//     }

// Prepare email.js template parameters
// const templateParams = {
//   name: name,
//   email: email,
//   message: message,
// };

// Send email via Email.js
//   emailjs.send("service_vtw0yyb", "template_pv80lnk", templateParams).then(
//     function (response) {
//       alert("Message sent successfully!");
//       console.log("Success:", response.status, response.text);
//       // Clear form fields after submission (optional)
//       document.getElementById("quickMessageForm").reset();
//     },
//     function (error) {
//       alert("Failed to send message. Please try again.");
//       console.log("Error:", error);
//     }
//   );
// });

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
  });
});

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

document
  .getElementById("quickMessageForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const showNotification = (message, isSuccess = true) => {
      const notification = document.getElementById("form-notification");
      if (!notification) {
        console.error("Notification element not found.");
        return;
      }
      notification.textContent = message;
      notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
        isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`;
      notification.classList.remove("hidden");
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
      }, 3000);
    };

    if (!name || !email || !message) {
      showNotification("All fields are required!", false);
      return;
    }

    try {
      console.log(
        "Sending request to:",
        "https://pfos-backend.vercel.app/api/messages"
      );
      console.log("Method:", "POST");
      console.log("Body:", JSON.stringify({ name, email, message }));

      const response = await fetch(
        "https://pfos-backend.vercel.app/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      showNotification("Message sent successfully!");
      document.getElementById("quickMessageForm").reset();
    } catch (error) {
      showNotification("Failed to send message. Please try again.", false);
      console.error("Error:", error);
    }
  });
