"use strict";

(function () {
  if (!customElements.get("book-slideshow")) {
    class BookSlideshow extends HTMLElement {
      constructor() {
        super();
        this.initSlideshow = this.initSlideshow.bind(this);
      }

      connectedCallback() {
        this.initSlideshow();

        if (window.innerWidth <= 480) {
          // Select the flipbook that has already been initialized
          const flipbook = this.querySelector(".flipbook"); // Use this.querySelector for Vanilla JS

          if (flipbook) {
            // Create a container for both buttons
            const buttonContainer = document.createElement("div"); // Use document.createElement instead of document.createElement
            buttonContainer.classList.add("button-container"); // Add CSS class for styling

            // Create 'Next' button
            const nextButton = document.createElement("button");
            nextButton.classList.add("slider-button", "slider-button--next");
            nextButton.innerHTML = ">";
            nextButton.addEventListener("click", function () {
              // Use Vanilla JS to trigger the next method for Turn.js
              $(flipbook).turn("next");
            });

            // Create 'Previous' button
            const prevButton = document.createElement("button");
            prevButton.classList.add("slider-button", "slider-button--prev");
            prevButton.innerHTML = "<";
            prevButton.addEventListener("click", function () {
              // Use Vanilla JS to trigger the previous method for Turn.js
              $(flipbook).turn("previous");
            });

            // Append both buttons to the container
            buttonContainer.appendChild(prevButton);
            buttonContainer.appendChild(nextButton);

            // Insert the button container after the flipbook
            flipbook.parentNode.insertBefore(
              buttonContainer,
              flipbook.nextSibling
            );
          }
        }
      }

      initSlideshow() {
        const pages_count = this.querySelectorAll(".page").length;

        if (pages_count % 2 !== 0) {
          const lastPage = this.querySelector(".page:last-child");
          const newPage = lastPage.cloneNode(true);
          newPage.classList.add("hard");
          newPage.style.background =
            "#c0392b url('https://cdn.shopify.com/s/files/1/0669/3670/1123/files/3.webp?v=1729489868') no-repeat center/cover";
          newPage.style.color = "#fff";
          newPage.style.fontWeight = "bold";
          newPage.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage);
        } else {
          // in other case add 2 more pages
          const lastPage = this.querySelector(".page:last-child");
          const newPage = lastPage.cloneNode(true);
          newPage.classList.add("hard");
          newPage.style.background =
            "#c0392b url('https://cdn.shopify.com/s/files/1/0669/3670/1123/files/3.webp?v=1729489868') no-repeat center/cover";
          newPage.style.color = "#fff";
          newPage.style.fontWeight = "bold";
          newPage.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage);
          const newPage2 = lastPage.cloneNode(true);
          newPage2.classList.add("hard");
          newPage2.style.background =
            "#c0392b url('https://cdn.shopify.com/s/files/1/0669/3670/1123/files/3.webp?v=1729489868') no-repeat center/cover";
          newPage2.style.color = "#fff";
          newPage2.style.fontWeight = "bold";
          newPage2.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage2);
        }

        // Initialize the flipbook
        $(".flipbook").turn({
          cornerSize: this.getCornerSize(),
        });

        // Video controls
        const videos = this.querySelectorAll(".BookVideo");
        videos.forEach((video) => {
          video.controls = false;
          video.addEventListener("ended", () => video.play()); // Ensure loop
        });

        // Page flip event
        $(".flipbook").on("turning", function () {
          const visiblePages = $(this).turn("view");
          console.log("Visible Pages:", visiblePages);

          const allVideos = document.querySelectorAll(".BookVideo");
          allVideos.forEach((video) => video.play());
        });

        // Random dot positioning logic
        this.randomizeDots();
      }

      getCornerSize() {
        let screenWidth = window.innerWidth;
        if (screenWidth < 768) return 2000; // Mobile
        if (screenWidth <= 1024) return 400; // Tablet
        return 60; // PC
      }

      randomizeDots() {
        const dots = this.querySelectorAll(".dot-link");
        dots.forEach((dot) => {
          const image = dot.previousElementSibling;
          let randomX, randomY;

          if (window.innerWidth < 480) {
            randomX = Math.random() * (image.offsetWidth - 50) + 75;
            randomY = Math.random() * (image.offsetHeight - 50) + 75;
          } else if (window.innerWidth < 768) {
            randomX = Math.random() * (image.offsetWidth - 50) + 125;
            randomY = Math.random() * (image.offsetHeight - 50) + 125;
          } else {
            randomX = Math.random() * (image.offsetWidth - 10) + 250;
            randomY = Math.random() * (image.offsetHeight - 10) + 250;
          }

          dot.style.left = `${randomX}px`;
          dot.style.top = `${randomY}px`;
        });
      }
    }

    customElements.define("book-slideshow", BookSlideshow);
  }
})();
