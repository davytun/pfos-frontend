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

async function fetchProducts() {
  const container = document.getElementById("product-container");
  if (!container) return; // Exit if container doesn't exist

  try {
    const response = await fetch("https://pfossolar.com/api/products");
    const products = await response.json();

    if (!Array.isArray(products) || products.length === 0) {
      container.innerHTML = "<p>No products found</p>";
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

    container.innerHTML = productHTML;
  } catch (error) {
    console.error("Error fetching products:", error);
    container.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Call function when the page loads
fetchProducts();

function setupContactForm(formId, isFooter = false) {
  const form = document.getElementById(formId);

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const nameId = isFooter ? "name-footer" : "name";
      const emailId = isFooter ? "email-footer" : "email";
      const messageId = isFooter ? "message-footer" : "message";

      const nameInput =
        document.getElementById(nameId) ||
        form.querySelector('input[name="name_footer"]') ||
        form.querySelector('input[name="name"]');
      const emailInput =
        document.getElementById(emailId) ||
        form.querySelector('input[name="email_footer"]') ||
        form.querySelector('input[name="email"]');
      const messageInput =
        document.getElementById(messageId) ||
        form.querySelector('textarea[name="message_footer"]') ||
        form.querySelector('textarea[name="message"]');

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      const showNotification = (msg, isSuccess = true) => {
        // Try to find a notification element near the form or global
        let notification =
          document.getElementById("form-notification") ||
          form.querySelector(".form-notification");

        if (!notification) {
          // Fallback if no specific notification element
          alert(msg);
          return;
        }

        notification.textContent = msg;
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-[10000] ${
          isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`;
        notification.classList.remove("hidden");
        setTimeout(() => {
          notification.classList.add("hidden");
        }, 3000);
      };

      if (!name || !email || !message) {
        showNotification("All fields are required!", false);
        return;
      }

      try {
        const url = "https://pfossolar.com/api/messages";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            subject: "Inquiry from Website",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to send message");
        }

        showNotification("Message sent successfully!");
        form.reset();
      } catch (error) {
        showNotification("Failed to send message. Please try again.", false);
        console.error("Error:", error);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupContactForm("quickMessageForm", false);
  setupContactForm("quickMessageFormFooter", true);

  // Check for order success
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("order") === "success") {
    // Create a temporary notification element if it doesn't exist just for this
    let notification = document.getElementById("form-notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "form-notification";
      document.body.appendChild(notification);
    }

    notification.textContent =
      "Order placed successfully! We will contact you soon.";
    notification.className =
      "fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 bg-green-500 text-white z-[10000]";
    notification.classList.remove("hidden");

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);

    setTimeout(() => {
      notification.classList.add("hidden");
    }, 5000);
  }
});
