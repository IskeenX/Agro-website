const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const quantityInput = document.getElementById('quantityInput');
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



