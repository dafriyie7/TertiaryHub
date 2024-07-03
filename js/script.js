/* NAV BAR */
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });
});


/* CAROUSEL */
document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlides() {
        slides.forEach((slide, index) => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        slides[slideIndex - 1].style.display = 'block';
        slides[slideIndex - 1].classList.add('active');
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }

    function changeSlide(n) {
        slides.forEach((slide, index) => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        slideIndex += n;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        if (slideIndex < 1) {
            slideIndex = slides.length;
        }

        slides[slideIndex - 1].style.display = 'block';
        slides[slideIndex - 1].classList.add('active');
    }

    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));

    showSlides();
});


/* LOGIN */
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



/* Contact */
const inputs = document.querySelectorAll(".contactInput");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});



/* ABOUT US */
const websitesDesigned = document.querySelector(".websites-designed");
const appsdeveloped = document.querySelector(".apps-developed");

setTimeout(() => {
  websitesDesigned.innerHTML = "40";
  appsdeveloped.innerHTML = "50";
}, 400);