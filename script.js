

let flag = true;

const toggle = function () {
  const img = document.getElementById("img");
  document.documentElement.classList.toggle("light-theme");
  if (flag) {
    let str = `img\\logo-stencil.svg`;
    if (img) img.setAttribute("src", str);
  } else {
    let str = "img\\logo-stencil-svgrepo-com.svg";
    if (img) img.setAttribute("src", str);
  }
  flag = !flag;
};

const themeBtn = document.getElementById("theme");
if (themeBtn) {
  themeBtn.addEventListener("click", () => toggle());
}

// --------------------------------------------------------------------------
// Mobile Hamburger Navigation: Auto-close on link click
// --------------------------------------------------------------------------
const mobileNavLinks = document.querySelectorAll(".kp2 a");
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const navCheck = document.getElementById("nav-check");
    if (navCheck && navCheck.checked) {
      navCheck.checked = false;
    }
  });
});

// --------------------------------------------------------------------------
// Contact Form: Frontend Validation & Direct Email Dispatch Backend Service
// --------------------------------------------------------------------------
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const messageInput = document.getElementById("user-message");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");

// Email regex pattern for RFC 5322 compliance checking
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

// Validation helpers
function validateName() {
  const val = nameInput.value.trim();
  if (!val) {
    showFieldError(nameInput, nameError, "Name is required.");
    return false;
  }
  if (val.length < 2) {
    showFieldError(nameInput, nameError, "Name must be at least 2 characters.");
    return false;
  }
  clearFieldError(nameInput, nameError);
  return true;
}

function validateEmail() {
  const val = emailInput.value.trim();
  if (!val) {
    showFieldError(emailInput, emailError, "Email address is required.");
    return false;
  }
  if (!emailRegex.test(val)) {
    showFieldError(emailInput, emailError, "Please enter a valid email address.");
    return false;
  }
  clearFieldError(emailInput, emailError);
  return true;
}

function validateMessage() {
  const val = messageInput.value.trim();
  if (!val) {
    showFieldError(messageInput, messageError, "Message cannot be empty.");
    return false;
  }
  if (val.length < 10) {
    showFieldError(messageInput, messageError, "Please enter at least 10 characters.");
    return false;
  }
  clearFieldError(messageInput, messageError);
  return true;
}

function showFieldError(input, errorElement, msg) {
  input.classList.add("invalid-input");
  errorElement.textContent = msg;
}

function clearFieldError(input, errorElement) {
  input.classList.remove("invalid-input");
  errorElement.textContent = "";
}

// Real-time input listeners to clear error once corrected
if (nameInput) nameInput.addEventListener("input", () => validateName());
if (emailInput) emailInput.addEventListener("input", () => validateEmail());
if (messageInput) messageInput.addEventListener("input", () => validateMessage());

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check honeypot field for bot/spam prevention
    const honeypot = contactForm.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      console.warn("Spam submission detected.");
      return;
    }

    // Run full validation suite
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    // Set UI to loading state
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector(".btn-text");
    const originalText = btnText ? btnText.textContent : "Send Message";
    if (btnText) btnText.textContent = "Sending...";
    formStatus.className = "form-status";
    formStatus.style.display = "none";

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      _subject: `New Portfolio Message from ${nameInput.value.trim()}`,
    };

    try {
      // Backend Mail Endpoint with FormSubmit random-like token to obfuscate email address
      const response = await fetch("https://formsubmit.co/ajax/9128bbbe83788a016eb34f107e58c337", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && (result.success === "true" || result.success === true || result.message)) {
        formStatus.className = "form-status success";
        formStatus.textContent = "✓ Thank you! Your message has been sent directly to Kavya.";
        formStatus.style.display = "block";
        contactForm.reset();
      } else {
        throw new Error(result.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Form transmission error:", err);
      formStatus.className = "form-status error";
      formStatus.textContent = "✕ Oops! Couldn't send your message. Please reach out directly to kavya2310.kp@gmail.com";
      formStatus.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = originalText;
    }
  });
}

// --------------------------------------------------------------------------
// Resume Preview Modal (Responsive & Interactive with Keyboard / Backdrop Support)
// --------------------------------------------------------------------------
const resumeModal = document.getElementById("resume-modal");
const resumeTriggers = document.querySelectorAll(".resume-trigger");
const resumeCloseBtn = document.getElementById("resume-modal-close");
const navCheck = document.getElementById("nav-check");

function openResumeModal(e) {
  if (e) e.preventDefault();
  if (!resumeModal) return;

  // If mobile hamburger menu is open, collapse it
  if (navCheck && navCheck.checked) {
    navCheck.checked = false;
  }

  resumeModal.classList.add("active");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent background body scroll
}

function closeResumeModal() {
  if (!resumeModal) return;
  resumeModal.classList.remove("active");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (resumeTriggers && resumeTriggers.length > 0) {
  resumeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openResumeModal);
  });
}

if (resumeCloseBtn) {
  resumeCloseBtn.addEventListener("click", closeResumeModal);
}

if (resumeModal) {
  // Close when clicking outside the modal dialog card
  resumeModal.addEventListener("click", (e) => {
    if (e.target === resumeModal) {
      closeResumeModal();
    }
  });

  // Close when pressing the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeModal.classList.contains("active")) {
      closeResumeModal();
    }
  });
}
