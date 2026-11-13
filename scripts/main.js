/*
 * CODEX - Main JavaScript
 * Handles navigation, user accounts, content sliders, search, and interactive elements
 *
 */

// Get current page for navigation highlighting
const currentPage = decodeURIComponent(window.location.pathname.split("/").pop().toLowerCase());

// Navigation highlighting for different menu types
function highlightActiveLinks() {
  // Main navigation menu
  const menuLinks = document.querySelectorAll(".menu li a");
  if (menuLinks.length > 0) {
    menuLinks.forEach(link => {
      const href = link.getAttribute("href").toLowerCase();
      if (href === currentPage || currentPage === href.replace('.html', '')) {
        link.classList.add("active");
      }
    });
  }

  // Tutorial sidebar navigation
  const tutorialLinks = document.querySelectorAll(".div li a");
  if (tutorialLinks.length > 0) {
    tutorialLinks.forEach(link => {
      if (link.getAttribute("href").toLowerCase() === currentPage) {
        link.classList.add("active");
      }
    });
  }

  // Quiz sidebar navigation
  const quizSidebarLinks = document.querySelectorAll(".sidebar li a");
  if (quizSidebarLinks.length > 0) {
    quizSidebarLinks.forEach(link => {
      if (link.getAttribute("href").toLowerCase() === currentPage) {
        link.classList.add("active");
      }
    });
  }
}

// Initialize navigation highlighting
highlightActiveLinks();

/**
 * User Account System
 * Handles login, logout and account display
 */
function initUserAccount() {
  const username = localStorage.getItem("username");
  const loginArea = document.getElementById("loginArea");

  // Handle login form if present
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("username").value.trim();
      if (name) {
        localStorage.setItem("username", name);
        redirectToHome();
      } else {
        alert("Please enter a username!");
      }
    });
  }

  // Display user account if logged in
  if (loginArea && username && username.trim() !== "") {
    loginArea.innerHTML = `
      <div class="account">
        <button id="accountBtn"><b>My Account</b></button>
        <div class="dropdown" id="dropdownMenu">
          <p id="greeting">Hello, ${username} :)</p>
          <button id="signOut">Sign Out</button>
        </div>
      </div>
    `;

    const accountBtn = document.getElementById("accountBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (accountBtn && dropdownMenu) {
      // Toggle dropdown on button click
      accountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
      });

      // Close dropdown when clicking outside
      window.addEventListener("click", (e) => {
        if (!loginArea.contains(e.target)) {
          dropdownMenu.classList.remove("show");
        }
      });

      // Handle sign out
      const signOutBtn = document.getElementById("signOut");
      if (signOutBtn) {
        signOutBtn.addEventListener("click", () => {
          localStorage.removeItem("username");
          redirectToHome();
        });
      }
    }
  }
}

// Helper function to redirect to home page
function redirectToHome() {
  const currentPath = window.location.pathname;

  if (
    currentPath.includes("/navhtml/") ||
    currentPath.includes("/tutorialCSS/") ||
    currentPath.includes("/tutorialHtml/") ||
    currentPath.includes("/quizzesHC/") ||
    currentPath.includes("/Editor/")
  ) {
    window.location.href = "../index.html";
  } else {
    window.location.href = "index.html";
  }
}


// Initialize user account system
initUserAccount();

/**
 * Content Slider System
 * Handles slide transitions and animations for featured content
 */
function initContentSlider() {
  const containers = document.querySelectorAll('.container');
  const dots = document.querySelectorAll('.dot');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');

  if (containers.length > 0 && next && prev) {
    let currentIndex = 0;
    let direction = "right";

    // Update slide with direction animation
    function showSlide(index) {
      containers.forEach((container, i) => {
        container.classList.remove("active", "prev", "next", "slide-left", "slide-right");
        
        if (i === index) {
          container.classList.add("active", direction === "right" ? "slide-right" : "slide-left");
        } else if (i === (index - 1 + containers.length) % containers.length) {
          container.classList.add("prev");
        } else if (i === (index + 1) % containers.length) {
          container.classList.add("next");
        }
      });

      // Update pagination dots
      if (dots.length > 0) {
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });
      }
    }

    // Next slide button
    next.addEventListener('click', () => {
      direction = "right";
      currentIndex = (currentIndex + 1) % containers.length;
      showSlide(currentIndex);
    });

    // Previous slide button
    prev.addEventListener('click', () => {
      direction = "left";
      currentIndex = (currentIndex - 1 + containers.length) % containers.length;
      showSlide(currentIndex);
    });

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        direction = i > currentIndex ? "right" : "left";
        currentIndex = i;
        showSlide(currentIndex);
      });
    });

    // Initialize first slide
    showSlide(currentIndex);
  }
}

// Initialize content slider
initContentSlider();

/**
 * Mascot Interaction (Nana)
 * Handles interactive mascot animations on the home page
 */
function initMascotInteraction() {
  const imgBox = document.getElementById("imgBox");
  if (!imgBox) return;

  const frames = {
    idle: "images/pixil-frame-0.png",
    click: "images/pixil-frame-11.png",
    right: ["images/pixil-frame-10.png", "images/pixil-frame-11.png", "images/pixil-frame-12.png"],
    left: ["images/pixil-frame-13.png", "images/pixil-frame-14.png", "images/pixil-frame-15.png"]
  };
  
  // Preload all mascot frames
  [frames.idle, frames.click, ...frames.right, ...frames.left].forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Set default mascot appearance
  imgBox.style.backgroundImage = `url(${frames.idle})`;
  imgBox.style.backgroundSize = "contain";
  imgBox.style.backgroundRepeat = "no-repeat";
  imgBox.style.backgroundPosition = "center";
  
  // Interaction variables
  let isPointerDown = false;
  let startX = 0;
  const dragThreshold = 40;

  // Handle pointer events for mascot interaction
  imgBox.addEventListener('pointerdown', e => {
    isPointerDown = true;
    startX = e.clientX;
    imgBox.setPointerCapture(e.pointerId);
    imgBox.style.backgroundImage = `url(${frames.click})`;
  });

  imgBox.addEventListener('pointermove', e => {
    if (!isPointerDown) return;
    
    const diff = e.clientX - startX;
    if (diff > dragThreshold) {
      // Dragging right
      const randomFrame = frames.right[Math.floor(Math.random() * frames.right.length)];
      imgBox.style.backgroundImage = `url(${randomFrame})`;
      startX = e.clientX;
    } else if (diff < -dragThreshold) {
      // Dragging left
      const randomFrame = frames.left[Math.floor(Math.random() * frames.left.length)];
      imgBox.style.backgroundImage = `url(${randomFrame})`;
      startX = e.clientX;
    }
  });

  imgBox.addEventListener('pointerup', () => {
    isPointerDown = false;
    imgBox.style.backgroundImage = `url(${frames.idle})`;
  });
}

// Initialize mascot interaction
initMascotInteraction();

/**
 * Footer Year
 * Updates copyright year in footer
 */
function updateFooterYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Update footer year
updateFooterYear();

/**
 * Global Search System
 * Provides site-wide search functionality with autocomplete
 */
function initGlobalSearch() {
  const searchInput = document.getElementById("search");
  const searchResults = document.getElementById("searchResults");
  const searchBtn = document.getElementById("searchIcon");
  
  if (!searchInput || !searchResults || !searchBtn) return;

  // Determine base path for links based on current location
  const isInSubfolder = window.location.pathname.includes("/navhtml/") ||
    window.location.pathname.includes("/quizzesHC/") ||
    window.location.pathname.includes("/tutorialCSS/") ||
    window.location.pathname.includes("/tutorialHtml/");
  
  const basePath = isInSubfolder ? "../" : "";

  // Searchable content database
  const searchItems = [
    { title: "HTML Introduction", link: `${basePath}tutorialHtml/Html Introduction.html` },
    { title: "HTML Editors", link: `${basePath}tutorialHtml/Html Editors.html` },
    { title: "Basic Structure", link: `${basePath}tutorialHtml/Basic Structure.html` },
    { title: "HTML Elements", link: `${basePath}tutorialHtml/Elements.html` },
    { title: "HTML Attributes", link: `${basePath}tutorialHtml/Attributes.html` },
    { title: "HTML Headings", link: `${basePath}tutorialHtml/Headings.html` },
    { title: "HTML Paragraphs", link: `${basePath}tutorialHtml/Paragraphs.html` },
    { title: "HTML Text Formatting", link: `${basePath}tutorialHtml/Text Formatting.html` },
    { title: "HTML Quotations", link: `${basePath}tutorialHtml/Quotations.html` },
    { title: "HTML Comment", link: `${basePath}tutorialHtml/Comment.html` },
    { title: "HTML Links and Images", link: `${basePath}tutorialHtml/Links and Images.html` },
    { title: "HTML Lists", link: `${basePath}tutorialHtml/HTML Lists.html` },
    { title: "HTML Tables", link: `${basePath}tutorialHtml/HTML Tables.html` },
    { title: "Tutorials", link: `${basePath}navhtml/tutorials.html` },
    { title: "Quiz", link: `${basePath}navhtml/quiz.html` },
    { title: "Contact Us", link: `${basePath}navhtml/contact.html` },
    { title: "Home", link: `${basePath}index.html` },
    { title: "CSS Introduction", link: `${basePath}tutorialCSS/CSS Introduction.html` },
    { title: "CSS Syntax", link: `${basePath}tutorialCSS/CSS Syntax.html` },
    { title: "CSS Selectors", link: `${basePath}tutorialCSS/CSS Selectors.html` },
    { title: "CSS Colors", link: `${basePath}tutorialCSS/CSS Colors.html` },
    { title: "CSS Backgrounds", link: `${basePath}tutorialCSS/CSS Backgrounds.html` },
    { title: "CSS Borders", link: `${basePath}tutorialCSS/CSS Borders.html` },
    { title: "CSS Margins", link: `${basePath}tutorialCSS/CSS Margins.html` },
    { title: "CSS Padding", link: `${basePath}tutorialCSS/CSS Padding.html` },
    { title: "CSS Text", link: `${basePath}tutorialCSS/CSS Text.html` },
    { title: "CSS Fonts", link: `${basePath}tutorialCSS/CSS Fonts.html` },
    { title: "CSS Links", link: `${basePath}tutorialCSS/CSS Links.html` },
    { title: "CSS Lists", link: `${basePath}tutorialCSS/CSS Lists.html` },
    { title: "CSS Tables", link: `${basePath}tutorialCSS/CSS Tables.html` },
    { title: "CSS Display", link: `${basePath}tutorialCSS/CSS Display.html` },
    { title: "CSS Position", link: `${basePath}tutorialCSS/CSS Position.html` },
    { title: "CSS Flexbox", link: `${basePath}tutorialCSS/CSS Flexbox.html` },
    { title: "CSS Grid", link: `${basePath}tutorialCSS/CSS Grid.html` },
    { title: "CSS Animations", link: `${basePath}tutorialCSS/CSS Animations.html` },
    { title: "CSS Transitions", link: `${basePath}tutorialCSS/CSS Transitions.html` },
    { title: "CSS Responsive Design", link: `${basePath}tutorialCSS/CSS Responsive.html` }
  ];

  // Show search suggestions as user types
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!query) {
      searchResults.style.display = "none";
      return;
    }

    const filtered = searchItems.filter(item =>
      item.title.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
      searchResults.style.display = "block";
      filtered.forEach(item => {
        const linkEl = document.createElement("a");
        linkEl.href = item.link;
        linkEl.textContent = item.title;
        linkEl.classList.add("result-item");
        searchResults.appendChild(linkEl);
      });
    } else {
      searchResults.style.display = "block";
      searchResults.innerHTML = `<p class="no-results">No results found</p>`;
    }
  });

  // Execute search function
  const performSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const match = searchItems.find(item =>
      item.title.toLowerCase().includes(query)
    );

    if (match) {
      window.location.href = match.link;
    } else {
      alert("No matching page found.");
    }
  };

  // Search button click handler
  searchBtn.addEventListener("click", performSearch);
  
  // Enter key handler
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  // Close search results when clicking outside
  window.addEventListener("click", e => {
    const searchbar = document.querySelector(".searchbar");
    if (searchbar && !searchbar.contains(e.target)) {
      searchResults.style.display = "none";
    }
  });
}

// Initialize global search
initGlobalSearch();

/**
 * Code Editor Popup
 * Provides a draggable popup editor for code examples
 * Only visible in tutorial folders (tutorialCSS and tutorialHtml)
 */
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is in tutorial folders
  const currentPath = window.location.pathname.toLowerCase();
  const isInTutorialFolder = 
    currentPath.includes("/tutorialcss/") || 
    currentPath.includes("/tutorialhtml/");
  
  // Only create and show popup in tutorial folders
  if (isInTutorialFolder) {
    // Create popup if it doesn't exist
    if (!document.getElementById("editorPopup")) {
      const popupHTML = `
        <div id="editorPopup" style="display:none;">
          <div id="editorHeader">
            <button id="closeEditorBtn">✖</button>
          </div>
          <iframe id="editorIframe" src="../Editor/PopUp.html"></iframe>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", popupHTML);
    }

    const editorPopup = document.getElementById("editorPopup");
    const openBtn = document.getElementById("openEditorBtn");
    const closeBtn = document.getElementById("closeEditorBtn");

    // Restore popup state from previous session only if still in tutorial folder
    if (localStorage.getItem("popupOpen") === "true") {
      editorPopup.style.display = "flex";
    }

    // Open popup button
    openBtn?.addEventListener("click", () => {
      editorPopup.style.display = "flex";
      localStorage.setItem("popupOpen", "true");
    });

    // Close popup button
    closeBtn?.addEventListener("click", () => {
      editorPopup.style.display = "none";
      localStorage.setItem("popupOpen", "false");
    });

    // Restore popup position
    const savedPosition = JSON.parse(localStorage.getItem("popupPosition"));
    if (savedPosition) {
      editorPopup.style.left = savedPosition.left + "px";
      editorPopup.style.top = savedPosition.top + "px";
    }

    // Make popup draggable
    initDraggablePopup(editorPopup);
  } else {
    // If not in tutorial folder, ensure popup is closed
    localStorage.setItem("popupOpen", "false");
    
    // Remove popup if it exists when navigating away from tutorial pages
    const existingPopup = document.getElementById("editorPopup");
    if (existingPopup) {
      existingPopup.style.display = "none";
    }
  }
});

// Helper function to make popup draggable
function initDraggablePopup(popup) {
  let isDragging = false, offsetX, offsetY;
  const header = document.getElementById("editorHeader");

  header?.addEventListener("mousedown", e => {
    isDragging = true;
    const rect = popup.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = "";
      localStorage.setItem("popupPosition", JSON.stringify({
        left: parseFloat(popup.style.left || 0),
        top: parseFloat(popup.style.top || 0)
      }));
    }
  });
}

// Listen for messages from the popup iframe
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SAVE_POPUP_CODE") {
    localStorage.setItem("popupEditorContent", event.data.code);
  }
});