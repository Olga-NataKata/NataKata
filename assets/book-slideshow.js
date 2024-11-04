"use strict";

(function () {
  if (!customElements.get("book-slideshow")) {
    class BookSlideshow extends HTMLElement {
      constructor() {
        super();
        this.initSlideshow = this.initSlideshow.bind(this);
        this.randomizeDots = this.randomizeDots.bind(this);
        this.frontPageImg = this.dataset.frontPageImg;
      }

      connectedCallback() {
        this.initSlideshow();

        if (window.innerWidth <= 480) {
          const flipbook = this.querySelector(".flipbook");

          if (flipbook) {
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            const nextButton = document.createElement("button");
            nextButton.classList.add("slider-button", "slider-button--next");
            nextButton.innerHTML = ">";
            nextButton.addEventListener("click", () =>
              $(flipbook).turn("next")
            );

            const prevButton = document.createElement("button");
            prevButton.classList.add("slider-button", "slider-button--prev");
            prevButton.innerHTML = "<";
            prevButton.addEventListener("click", () =>
              $(flipbook).turn("previous")
            );

            buttonContainer.appendChild(prevButton);
            buttonContainer.appendChild(nextButton);

            flipbook.parentNode.insertBefore(
              buttonContainer,
              flipbook.nextSibling
            );
          }
        }
      }

      initSlideshow() {
        const pages_count = this.querySelectorAll(".page").length;
        if (pages_count < 2) {
          return;
        }
        if (window.innerWidth <= 480) {
          const allPages = this.querySelectorAll(".page");
          allPages.forEach((page) => {
            const clonedPage = page.cloneNode(true); // Deep clone the page
            clonedPage.classList.add("cloned"); // Add a class to identify cloned elements

            page.parentNode.insertBefore(clonedPage, page.nextSibling);
            // очистити вміст оригінального елемента
            page.innerHTML = "";
          });
        }

        if (pages_count % 2 === 0) {
          const lastPage = this.querySelector(".page:last-child");
          const newPage = lastPage.cloneNode(true);
          newPage.classList.add("hard");
          newPage.style.background = `#c0392b url(${this.frontPageImg}) no-repeat center/cover`;
          newPage.style.color = "#fff";
          newPage.style.fontWeight = "bold";
          newPage.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage);
        }
        // else if () {
        //   const lastPage = this.querySelector(".page:last-child");
        //   const newPage = lastPage.cloneNode(true);
        //   newPage.classList.add("hard");
        //   newPage.style.background =
        //     `#c0392b url(${this.frontPageImg}) no-repeat center/cover`;
        //   newPage.style.color = "#fff";
        //   newPage.style.fontWeight = "bold";
        //   newPage.innerHTML =
        //     "Thank You for visiting <small>~ NataKuku</small>";
        //   this.querySelector(".flipbook").appendChild(newPage);
        // }

        $(this).find(".flipbook").turn({
          cornerSize: this.getCornerSize(),
					gradients: true,
					display: 'double',
					acceleration: true,
        });

        const videos = this.querySelectorAll(".BookVideo");
        videos.forEach((video) => {
          video.controls = false;
          video.addEventListener("ended", () => video.play());
        });

        $(this)
          .find(".flipbook")
          .on("turning", function () {
            const visiblePages = $(this).turn("view");

            const allVideos = document.querySelectorAll(".BookVideo");
            allVideos.forEach((video) => video.play());
          });

        // disabling turning on the last page
        $(this)
          .find(".flipbook")
          .turn("disable", pages_count - 1);

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
          // Randomize the position between 0 and 100% for both top and left
          const randomTop = Math.random(2, 98) * 50;
          const randomLeft = Math.random(2, 98) * 50;

          // Apply the randomized position to each dot
          dot.style.position = "absolute";
          dot.style.top = `${randomTop}%`;
          dot.style.left = `${randomLeft}%`;
        });
      }
    }

    customElements.define("book-slideshow", BookSlideshow);
  }
})();
