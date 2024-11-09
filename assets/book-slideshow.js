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
        const allPages = this.querySelectorAll(".page");
        if (window.innerWidth <= 480) {
          allPages.forEach((page) => {
            const clonedPage = page.cloneNode(true); // Deep clone the page
            clonedPage.classList.add("cloned"); // Add a class to identify cloned elements

            const shadow = page.querySelector(".flipbook__book-shadow-left");
            const shadow_on_cloned_page = clonedPage.querySelector(
              ".flipbook__book-shadow-left"
            );
            page.innerHTML = "";
            clonedPage.removeChild(shadow_on_cloned_page);
            if (shadow) {
              page.appendChild(shadow);
            }

            page.parentNode.insertBefore(clonedPage, page.nextSibling);
          });
        }

        allPages.forEach((page, index) => {
          const shadow = page.querySelector(".flipbook__book-shadow-left");
          if (index % 2 === 1 && shadow) {
            //remove flipbook__book-shadow-left class
            shadow.classList.remove("flipbook__book-shadow-left");
            //add flipbook__book-shadow-right class
            shadow.classList.add("flipbook__book-shadow-right");
          }
        });

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
          display: "double",
          acceleration: true,
        });

        const videos = this.querySelectorAll(".BookVideo");
        videos.forEach((video) => {
          video.controls = false;
          video.addEventListener("ended", () => video.play());
        });

        $(this)
          .find(".flipbook")
          .on("turning", function (event, page, view) {
            // Play all videos on the page
            const allVideos = document.querySelectorAll(".BookVideo");
            allVideos.forEach((video) => video.play());
          });

        // disabling turning on the last page
        $(this)
          .find(".flipbook")
          .turn("disable", pages_count - 1);

        this.randomizeDots();
        $(this).find(".flipbook").on("turning", this.randomizeDots);
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
          const randomTop = Math.random(50, 100) * 50;
          const randomLeft = Math.random(50, 100) * 45;

          // Apply the randomized position and styles to each dot
          dot.style.position = "absolute";
          dot.style.width = "30px";
          dot.style.height = "30px";
          dot.style.backgroundColor = "white";
          dot.style.borderRadius = "50%";
          dot.style.textDecoration = "none";
          dot.style.pointerEvents = "auto";
          dot.style.transition = "opacity 0.5s ease";
          dot.style.zIndex = "800";

          if (!dot.style.top) {
            dot.style.top = `${randomTop}%`;
          }
          if (!dot.style.left) {
            dot.style.left = `${randomLeft}%`;
          }
        });
      }
    }

    customElements.define("book-slideshow", BookSlideshow);
  }
})();
