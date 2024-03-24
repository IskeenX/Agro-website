let products = [];
let cart = [];
let availableProducts = [];
fetch('products.json')
    .then(response => response.json())
    .then(products => { availableProducts = products; })
    .catch(error => console.error('Error fetching products:', error));
//* Selectors
const selectors = {
    // Search
    searchIcon: document.querySelector('.search-big'),
    searchbar: document.querySelector('.searchbar'),
    resultsBox: document.querySelector('.result-box'),
    inputBox: document.querySelector('#input-box'),
    // Cart
    products: document.querySelector('.products'),
    cartBtn: document.querySelector(".cart-btn"),
    cartQty: document.querySelector(".cart-qty"),
    cartClose: document.querySelector(".cart-close"),
    cart: document.querySelector(".cart"),
    cartOverlay: document.querySelector(".cart-overlay"),
    cartClear: document.querySelector(".cart-clear"),
    cartBody: document.querySelector(".cart-body"),
    cartTotal: document.querySelector(".cart-total"),
    // Single product
    quantityInput: document.querySelector('#quantityInput'),
    mainImage: document.querySelector('#MainImg'),
    colorSelect: document.querySelector('#colorSelect'),
    smallImages: document.querySelectorAll('.small-img')
};
//* Event listeners
const setupListeners = () => {
    document.addEventListener("DOMContentLoaded", initStore)
    // Search
    selectors.searchIcon.addEventListener('click', showSearch);
    // Cart
    selectors.cartBtn.addEventListener("click", showCart);
    selectors.cartOverlay.addEventListener("click", hideCart);
    selectors.cartClose.addEventListener("click", hideCart);
    selectors.cartBody.addEventListener("click", updateCart);
    selectors.cartClear.addEventListener("click", clearCart);
    // Product
    selectors.products.addEventListener("click", addToCart);
};
//* Event handlers
const initStore = () => {
    loadCart();
    loadProducts("https://fakestoreapi.com/products").then(renderProducts).finally(renderCart);
};
const showCart = () => {
    selectors.cart.classList.add('show');
    selectors.cartOverlay.classList.add('show');
};
const hideCart = () => {
    selectors.cart.classList.remove('show');
    selectors.cartOverlay.classList.remove('show');
};
const clearCart = () => {
    cart = [];
    saveCart();
    renderCart();
    renderProducts();
    setTimeout(hideCart, 500);
};
const addToCart = (e) => {
    if (e.target.hasAttribute('data-id')) {
        const id = parseInt(e.target.dataset.id);
        const inCart = cart.find((x) => x.id === id);
        if (inCart) {
            alert('Item is already in cart.');
            return;
        }
        cart.push({ id, qty: 1 });
        saveCart();
        renderProducts();
        renderCart();
    }
};
const removeFromCart = (id) => {
    cart = cart.filter((x) => x.id !== id);
    // If the last item has been removed, cart will close
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
    if (e.target.hasAttribute('data-btn')) {
        const cartItem = e.target.closest('.cart-item');
        const id = parseInt(cartItem.dataset.id);
        const btn = e.target.dataset.btn;

        btn === 'incr' && increaseQty(id);
        btn === 'decr' && decreaseQty(id);
        saveCart();
        renderCart();
    }
};
const saveCart = () => {
    localStorage.setItem('online-store', JSON.stringify(cart));
};
const loadCart = () => {
    cart = JSON.parse(localStorage.getItem('online-store')) || [];
};
const showSearch = () => {
    selectors.searchbar.classList.toggle('show-input');
    const input = selectors.searchbar.querySelector('input');
    if (selectors.searchbar.classList.contains('show-input')) {
        input.focus();
    } else {
        input.blur();
    }
};
//* Render functions
const renderCart = () => {
    // Show cart qty
    const cartQty = cart.reduce((sum, item) => { return sum + item.qty; }, 0);
    selectors.cartQty.textContent = cartQty;
    selectors.cartQty.classList.toggle('visible', cartQty);
    // Show cart total
    selectors.cartTotal.textContent = calculateTotal().format();
    // Show empty cart
    if (cart.length === 0) {
        selectors.cartBody.innerHTML = '<div class="cart-empty">Корзина пуста.</div>';
        return;
    }
    // Show cart items
    selectors.cartBody.innerHTML = cart.map(({ id, qty }) => {
        // Get product info of each cart item
        const product = products.find((x) => x.id === id);
        const { title, image, price } = product;
        const amount = price * qty;
        return `
            <div class="cart-item" data-id=${id}>
                <img src="${image}" alt="${title}">
                <div class="cart-item-detail">
                    <h3>${title}</h3>
                    <h6>${price.format()}</h6>
                    <div class="cart-item-amount">
                        <i class="far fa-minus" data-btn="decr"></i>
                        <span class="qty">${qty}</span>
                        <i class="far fa-plus" data-btn="incr"></i>
                        <span class="cart-item-price">${amount.format()}</span>
                    </div>
                </div>
            </div>`;
    }).join("");
};
const renderProducts = () => {
    selectors.products.innerHTML = products.map(product => {
        const { id, title, image, price } = product;
        // Check if product is already in cart
        const inCart = cart.find((x) => x.id === id);
        // Make the add to cart button disabled if already in cart
        const disabled = inCart ? 'disabled' : '';
        // Change the text if already in cart
        const text = inCart ? 'Добавлено' : 'В корзину';
        return `
        <div class="product">
            <img src="${image}" alt="${title}">
            <div class="des">
                <h5>${title}</h5>
                <h4 class="price">${price.format()}</h4>
            </div>
            <button class="normal addCart" ${disabled} data-id=${id}>${text}</button>
        </div>
        `;
    })
        .join("");
};
//* API functions
const loadProducts = async (apiURL) => {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        products = await response.json();
        console.log(products);
    } catch (error) {
        console.error("Fetch error:", error);
    }
};
//* Helper functions
const calculateTotal = () => {
    return cart.map(({ id, qty }) => {
        const { price } = products.find((x) => x.id === id);
        return qty * price;
    }).reduce((sum, number) => { return sum + number; }, 0);
};
Number.prototype.format = function () {
    return this.toLocaleString('en-US', {
        style: 'currency',
        currency: 'KGS',
    });
};
// Search
selectors.inputBox.onkeyup = function () {
    let result = [];
    let input = selectors.inputBox.value.trim().toLowerCase();
    if (input.length) {
        result = availableProducts.filter((product) => {
            return (
                product.name.toLowerCase().startsWith(input) ||
                product.company.toLowerCase().startsWith(input) ||
                product.id.toString().startsWith(input)
            );
        });
    }
    display(result);
    if (!result.length) {
        selectors.resultsBox.innerHTML = '';
    }
    function display(result) {
        const content = result.map((product) => {
            return "<li onclick='selectInput(\"" + product.name + "\")'>" + product.name + "</li>";
        });
        selectors.resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
    }
};
function selectInput(name) {
    selectors.inputBox.value = name;
    selectors.resultsBox.innerHTML = '';
}
//* Initialize
setupListeners();

// // Single Product Page
// if (selectors.smallImages.length > 0) {
//     selectors.smallImages.forEach(function (smallImg) {
//         smallImg.addEventListener('click', function () {
//             const newImageSrc = this.getAttribute('src');
//             selectors.mainImage.setAttribute('src', newImageSrc);
//         });
//     });
//     selectors.colorSelect.addEventListener('change', function () {
//         const selectedColor = this.value;
//         const matchingImage = document.querySelector(`.small-img[data-color="${selectedColor}"]`);
//         const newImageSrc = matchingImage.getAttribute('src');
//         selectors.mainImage.setAttribute('src', newImageSrc);
//     });
// }
