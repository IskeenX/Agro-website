const selectors = {
    bar: document.getElementById('bar'),
    close: document.getElementById('close'),
    nav: document.getElementById('navbar'),
    quantityInput: document.getElementById('quantityInput'),
    loginForm: document.getElementById("loginForm"),
    regForm: document.getElementById("regForm"),
    indicator: document.getElementById("indicator"),
    mainImage: document.getElementById('MainImg'),
    colorSelect: document.getElementById('colorSelect'),
    accountButton: document.getElementById('accountButton'),
    cartBtn: document.getElementById('icon-cart'),//
    cartClose: document.querySelector('.cart-close'),//
    products: document.querySelector('.items-list'),//
    cart: document.querySelector('.cart-show'),//
    cartOverlay: document.querySelector(".cart-overlay"),//
    cartBody: document.querySelector(".cart-body"),//
    cartClear: document.querySelector(".cart-clear"),//
    cartQty: document.querySelector('#icon-cart span'),//
    cartTotal: document.querySelector(".cart-total"),//
    smallImages: document.querySelectorAll('.small-img')
};
let products = [];
let cart = [];

//* event listeners
const setupListeners = () => {
    document.addEventListener("DOMContentLoaded", initStore);
    // other events
    selectors.bar.addEventListener('click', toggleNav);
    selectors.close.addEventListener('click', toggleNav);
    selectors.accountButton.addEventListener('click', moveIndicator);
    // product event
    selectors.products.addEventListener("click", addToCart);
    // cart events
    selectors.cartBtn.addEventListener("click", showCart);
    selectors.cartOverlay.addEventListener("click", hideCart);
    selectors.cartClose.addEventListener("click", hideCart);
    selectors.cartBody.addEventListener("click", updateCart);
    selectors.cartClear.addEventListener("click", clearCart);
};

//* event handlers
const initStore = () => {
    loadCart();
    loadProducts("products.json")
        .then(renderProducts)
        .finally(renderCart);
};
const showCart = () => {
    selectors.cart.classList.add("show");
    selectors.cartOverlay.classList.add("show");
};
const hideCart = () => {
    selectors.cart.classList.remove("show");
    selectors.cartOverlay.classList.remove("show");
};
const clearCart = () => {
    cart = [];
    saveCart();
    renderCart();
    renderProducts();
    setTimeout(hideCart, 500);
};
const addToCart = (e) => {
    if (e.target.hasAttribute("data-id")) {
        const id = parseInt(e.target.dataset.id);
        const inCart = cart.find((x) => x.id === id);

        if (inCart) {
            alert("Item is already in cart.");
            return;
        }

        cart.push({ id, qty: 1 });
        saveCart();
        renderProducts();
        renderCart();
        showCart();
    }
};
const removeFromCart = (id) => {
    cart = cart.filter((x) => x.id !== id);

    // if the last item is remove, close the cart
    cart.length === 0 && setTimeout(hideCart, 500);

    renderProducts();
};
const increaseQty = (id) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty++;
};
const decreaseQty = (id) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty--;

    if (item.qty === 0) removeFromCart(id);
};
const updateCart = (e) => {
    if (e.target.hasAttribute("data-btn")) {
        const cartItem = e.target.closest(".cart-item");
        const id = parseInt(cartItem.dataset.id);
        const btn = e.target.dataset.btn;

        btn === "incr" && increaseQty(id);
        btn === "decr" && decreaseQty(id);

        saveCart();
        renderCart();
    }
};
const saveCart = () => {
    localStorage.setItem("online-store", JSON.stringify(cart));
};
const loadCart = () => {
    cart = JSON.parse(localStorage.getItem("online-store")) || [];
};

//* render functions
const renderCart = () => {
    // show cart qty in navbar
    const cartQty = cart.reduce((sum, item) => {
        return sum + item.qty;
    }, 0);

    selectors.cartQty.textContent = cartQty;
    selectors.cartQty.classList.toggle("visible", cartQty);

    // show cart total
    selectors.cartTotal.textContent = calculateTotal().format();
    // show empty cart
    if (cart.length === 0) {
        selectors.cartBody.innerHTML =
            '<div class="cart-empty">Your cart is empty.</div>';
        return;
    }
    // show cart items
    selectors.cartBody.innerHTML = cart
        .map(({ id, qty }) => {
            // get product info of each cart item
            const product = products.find((x) => x.id === id);

            const { title, image, price } = product;

            const amount = price * qty;

            return `
          <div class="cart-item" data-id="${id}">
            <img src="${image}" alt="${title}" />
            <div class="cart-item-detail">
              <h3>${title}</h3>
              <h5>${price.format()}</h5>
              <div class="cart-item-amount">
                <i class="bi bi-dash-lg" data-btn="decr"></i>
                <span class="qty">${qty}</span>
                <i class="bi bi-plus-lg" data-btn="incr"></i>
  
                <span class="cart-item-price">
                  ${amount.format()}
                </span>
              </div>
            </div>
          </div>`;
        })
        .join("");
};
const renderProducts = () => {
    selectors.products.innerHTML = products
        .map((product) => {
            const { id, title, image, price } = product;

            // check if product is already in cart
            const inCart = cart.find((x) => x.id === id);

            // make the add to cart button disabled if already in cart
            const disabled = inCart ? "disabled" : "";

            // change the text if already in cart
            const text = inCart ? "Added in Cart" : "Add to Cart";

            return `
      <div class="product">
        <img src="${image}" alt="${title}" />
        <h3>${title}</h3>
        <h5>${price.format()}</h5>
        <button ${disabled} data-id=${id}>${text}</button>
      </div>
      `;
        })
        .join("");
};

//* api functions
const loadProducts = async (jsonURL) => {
    try {
        const response = await fetch(jsonURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

//* helper functions
const calculateTotal = () => {
    return cart
        .map(({ id, qty }) => {
            const { price } = products.find((x) => x.id === id);

            return qty * price;
        })
        .reduce((sum, number) => {
            return sum + number;
        }, 0);
};

Number.prototype.format = function () {
    return this.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

//* initialize
setupListeners();

// Functions
function moveIndicator() {
    selectors.indicator.style.transform = `translateX(20.5px)`;
}
function Register() {
    selectors.regForm.style.transform = "translateX(0px)"
    selectors.loginForm.style.transform = "translateX(0px)"
    selectors.indicator.style.transform = "translateX(153.5px)"
}
function Login() {
    selectors.regForm.style.transform = "translateX(300px)"
    selectors.loginForm.style.transform = "translateX(300px)"
    selectors.indicator.style.transform = "translateX(20.5px)"
}
function toggleNav() {
    selectors.nav.classList.toggle('active');
}


// Single Product Page
if (selectors.smallImages.length > 0) {
    selectors.smallImages.forEach(function (smallImg) {
        smallImg.addEventListener('click', function () {
            const newImageSrc = this.getAttribute('src');
            selectors.mainImage.setAttribute('src', newImageSrc);
        });
    });
    selectors.colorSelect.addEventListener('change', function () {
        const selectedColor = this.value;
        const matchingImage = document.querySelector(`.small-img[data-color="${selectedColor}"]`);
        const newImageSrc = matchingImage.getAttribute('src');
        selectors.mainImage.setAttribute('src', newImageSrc);
    });
}
