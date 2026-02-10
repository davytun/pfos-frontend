const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("menu-mobile");
const closeMenu = document.getElementById("close-menu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    menuToggle.setAttribute(
      "aria-expanded",
      mobileMenu.classList.contains("hidden") ? "false" : "true",
    );
  });
}

if (closeMenu) {
  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  });
}

/**
 * Init typed.js
 */
const slides = document.querySelectorAll(".text-slide");
let index = 0;

function showNextSlide() {
  if (slides.length > 0) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateY(-${index * 100}%)`;
    });

    index = (index + 1) % slides.length; // Loop back to first slide
  }
}

if (slides.length > 0) {
  setInterval(showNextSlide, 2000); // Change every 2 seconds
}

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

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// --- Consolidated Cart Management ---
window.getCart = function () {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    console.error("Error parsing cart:", e);
    return [];
  }
};

window.saveCart = function (cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.updateCartCount(); // Auto-update UI on save
    return true;
  } catch (e) {
    console.error("Error saving cart:", e);
    return false;
  }
};

window.updateCartCount = function () {
  const cart = window.getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Update all possible cart count indicators
  const indicators = ["cart-count", "mobile-cart-count", "floating-cart-count"];
  indicators.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = totalItems;
  });

  // Update Cart Preview in the floating dropdown if it exists
  const preview = document.getElementById("cart-preview");
  const totalEl = document.getElementById("cart-total");
  if (preview && totalEl) {
    let totalPrice = 0;
    if (cart.length === 0) {
      preview.innerHTML =
        "<p class='text-gray-400 text-sm'>Your cart is empty</p>";
    } else {
      preview.innerHTML = cart
        .map((item) => {
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          totalPrice += itemTotal;
          return `
          <div class="flex items-center gap-2 border-b border-gray-700 pb-1 mb-1 last:border-b-0">
            <img src="${item.image || "/assets/images/logo.png"}" class="w-8 h-8 object-contain rounded bg-white p-px" />
            <div class="flex-1 overflow-hidden">
              <p class="text-white text-sm truncate">${item.name}</p>
              <p class="text-gray-400 text-xs">Qty: ${item.quantity}</p>
            </div>
            <p class="text-[#FBB610] text-sm whitespace-nowrap">₦${itemTotal.toLocaleString()}</p>
          </div>`;
        })
        .join("");
    }
    totalEl.textContent = `₦${totalPrice.toLocaleString()}`;
  }
};

window.addToCart = function (productId, name, price, image, description) {
  // If we are on the specialized sales page, it uses its own detailed redirect logic
  // but for the homepage/others, we use this standard logic
  if (window.location.pathname.includes("solar-product-sales.html")) {
    const product = {
      id: productId,
      name,
      price: parseFloat(price),
      image,
      description,
      quantity: 1,
    };
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "/product-details.html";
    return;
  }

  // Standard background addition (Home page logic)
  let cart = window.getCart();
  const existingIndex = cart.findIndex((item) => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: productId,
      name,
      price: parseFloat(price),
      image,
      description,
      quantity: 1,
    });
  }

  window.saveCart(cart);

  // Final feedback: Pulse the cart icon
  const cartIcon = document.getElementById("cart-count");
  if (cartIcon) {
    cartIcon.classList.add("scale-125", "bg-green-500");
    setTimeout(
      () => cartIcon.classList.remove("scale-125", "bg-green-500"),
      300,
    );
  }
};

// --- Product Fetching (Site-wide) ---
async function fetchProducts() {
  const container = document.getElementById("product-container");
  if (!container) return;

  try {
    const response = await fetch("https://pfossolar.com/api/products");
    const responseData = await response.json();

    // Handle both simple array and paginated object response
    const products = Array.isArray(responseData)
      ? responseData
      : responseData.products || [];

    if (products.length === 0) {
      container.innerHTML =
        "<p class='text-white text-center col-span-full'>No products found</p>";
      return;
    }

    container.innerHTML = products
      .map(
        (product) => `
      <div class="flex flex-col items-start max-w-[340px] group">
        <div class="w-[290px] md:w-[330px] h-[290px] md:h-[330px] rounded-[20px] bg-white flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img src="${product.image || product.images?.[0] || "/assets/images/logo.png"}" alt="${product.name}" class="w-[250px] md:w-[290px] object-contain" />
        </div>
        <h4 class="font-bold text-[20px] md:text-[24px] mt-4 text-white truncrate w-full" title="${product.name}">${product.name}</h4>
        <p class="text-orange text-[20px] md:text-[25px] mb-3">₦${parseFloat(product.price).toLocaleString()}</p>
        <button onclick="addToCart('${product._id || product.id}', '${product.name.replace(/'/g, "\\'")}', '${product.price}', '${product.image || product.images?.[0]}', '${(product.description || "").replace(/'/g, "\\'")}')" 
          class="bg-orange text-[14px] md:text-[16px] font-bold text-blue w-full h-10 md:h-12 rounded-md hover:bg-white transition-colors">
          Buy Now
        </button>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Error fetching products:", error);
    container.innerHTML = "<p class='text-white'>Failed to load products.</p>";
  }
}

// Auto-init only if NOT on the specialized product page
if (!window.location.pathname.includes("solar-product-sales.html")) {
  fetchProducts();
}

// Initialize cart counts on every page load
document.addEventListener("DOMContentLoaded", () => {
  window.updateCartCount();
});

// Success Modal Utility
function showSuccessModal(title, message) {
  let modal = document.getElementById("success-modal");
  if (!modal) {
    // Inject Modal Styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes modalIn {
        0% { opacity: 0; transform: scale(0.9) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes checkMark {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-modal-in {
        animation: modalIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
      .animate-check {
        animation: checkMark 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);

    // Create Modal HTML
    modal = document.createElement("div");
    modal.id = "success-modal";
    modal.className =
      "fixed inset-0 z-[10001] flex items-center justify-center hidden opacity-0 transition-opacity duration-300";
    modal.innerHTML = `
      <div class="absolute inset-0 bg-[#002347]/80 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-3xl p-10 md:p-14 shadow-2xl max-w-sm w-full mx-4 transform scale-95 transition-all duration-300 overflow-hidden">
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-green-500/10 rounded-full animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-orange/10 rounded-full"></div>
        
        <div class="flex flex-col items-center text-center">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner animate-check">
            <i class="bx bx-check text-6xl text-green-600"></i>
          </div>
          <h3 id="modal-title" class="text-3xl font-extrabold text-[#002347] mb-3">Message Sent!</h3>
          <p id="modal-message" class="text-gray-500 text-lg leading-relaxed mb-10">Thank you for reaching out. Our team will get back to you shortly.</p>
          <button id="close-modal" class="w-full bg-orange hover:bg-orange-600 text-[#002347] font-bold text-lg py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95 shadow-lg">
            Awesome!
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
      closeSuccessModal();
    });
  }

  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  if (title) modalTitle.textContent = title;
  if (message) modalMessage.textContent = message;

  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("opacity-100");
    modal
      .querySelector(".relative")
      .classList.add("scale-100", "animate-modal-in");
  }, 10);
}

function closeSuccessModal() {
  const modal = document.getElementById("success-modal");
  if (modal) {
    modal.classList.remove("opacity-100");
    modal
      .querySelector(".relative")
      .classList.remove("scale-100", "animate-modal-in");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }
}

function setupContactForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Use querySelector to find inputs within this specific form
    const nameInput =
      form.querySelector('[name="name"]') || form.querySelector("#name");
    const emailInput =
      form.querySelector('[name="email"]') || form.querySelector("#email");
    const messageInput =
      form.querySelector('[name="message"]') || form.querySelector("#message");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    const showNotification = (msg, isSuccess = true) => {
      if (isSuccess) {
        showSuccessModal("Message Sent!", msg);
      } else {
        let notification = document.getElementById("form-notification");
        if (!notification) {
          notification = document.createElement("div");
          notification.id = "form-notification";
          document.body.appendChild(notification);
        }
        notification.innerHTML = `<i class="bx bx-error-circle text-2xl"></i> <span>${msg}</span>`;
        notification.className = `fixed bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 px-8 py-4 rounded-2xl shadow-2xl transition-all duration-500 z-[10002] bg-red-600/90 text-white font-bold transform border-2 border-white/20 backdrop-blur-xl flex items-center gap-4 animate-modal-in`;
        notification.classList.remove("hidden");
        setTimeout(() => {
          notification.classList.add("opacity-0", "translate-y-10");
          setTimeout(() => {
            notification.classList.add("hidden");
            notification.classList.remove("opacity-0", "translate-y-10");
          }, 500);
        }, 5000);
      }
    };

    if (!name || !email || !message) {
      showNotification("Please fill in all fields to continue.", false);
      return;
    }

    // Show loading state
    const submitBtn =
      form.querySelector('button[type="submit"]') ||
      form.querySelector("button");
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add(
        "opacity-70",
        "cursor-not-allowed",
        "transition-all",
      );
      submitBtn.innerHTML =
        '<i class="bx bx-loader-alt animate-spin text-xl"></i> Sending...';
    }

    try {
      const url = "https://pfossolar.com/api/messages";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          subject: "Inquiry from Website",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      showSuccessModal(
        "Message Sent!",
        "Thank you for reaching out. Our team will get back to you shortly.",
      );
      form.reset();
    } catch (error) {
      showNotification(
        "Connection error. Please try again or contact us directly.",
        false,
      );
      console.error("Error:", error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Setup all forms on the page
  document.querySelectorAll("form").forEach((form) => {
    if (
      form.id.includes("quickMessageForm") ||
      form.id.includes("contactForm")
    ) {
      setupContactForm(form.id);
    }
  });

  // Check for order success
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("order") === "success") {
    showSuccessModal(
      "Order Received!",
      "Your order has been placed successfully! We will contact you soon for the next steps.",
    );
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
