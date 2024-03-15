const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const quantityInput = document.getElementById('quantityInput');
var loginForm = document.getElementById("loginForm");
var regForm = document.getElementById("regForm");
var indicator = document.getElementById("indicator");

/* Account Page */
document.addEventListener('DOMContentLoaded', function () {
    // Set initial state
    Login();
    document.getElementById('accountButton').addEventListener('click', function() {
        indicator.style.transform = `translateX(20.5px)`;
    });
});
function Register() {
    regForm.style.transform = "translateX(0px)"
    loginForm.style.transform = "translateX(0px)"
    indicator.style.transform = "translateX(153.5px)"
}
function Login() {
    regForm.style.transform = "translateX(300px)"
    loginForm.style.transform = "translateX(300px)"
    indicator.style.transform = "translateX(20.5px)"
}

/* Media Pages */
if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

/* Single Product Page */
quantityInput.addEventListener('change', function(event) {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    event.target.value = value;
});
document.addEventListener('DOMContentLoaded', function () {
    const smallImages = document.querySelectorAll('.small-img');
    const mainImage = document.getElementById('MainImg');
    const colorSelect = document.getElementById('colorSelect');
    // Change main image when clicking on small images
    smallImages.forEach(function (smallImg) {
        smallImg.addEventListener('click', function () {
            const newImageSrc = this.getAttribute('src');
            mainImage.setAttribute('src', newImageSrc);
        });
    });
    // Change main image when selecting a color from the dropdown
    colorSelect.addEventListener('change', function () {
        const selectedColor = this.value;
        const matchingImage = document.querySelector(`.small-img[data-color="${selectedColor}"]`);
        const newImageSrc = matchingImage.getAttribute('src');
        mainImage.setAttribute('src', newImageSrc);
    });
});

