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

            flipbook.parentNode.insertBefore(buttonContainer, flipbook.nextSibling);
          }
        }
      }

      initSlideshow() {
        const pages_count = this.querySelectorAll(".page").length;
        if(pages_count < 2) {
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
        

        if (pages_count % 2 !== 0) {
          const lastPage = this.querySelector(".page:last-child");
          const newPage = lastPage.cloneNode(true);
          newPage.classList.add("hard");
          newPage.style.background =
            `#c0392b url(${this.frontPageImg}) no-repeat center/cover`;
          newPage.style.color = "#fff";
          newPage.style.fontWeight = "bold";
          newPage.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage);
        } else {
          const lastPage = this.querySelector(".page:last-child");
          const newPage = lastPage.cloneNode(true);
          newPage.classList.add("hard");
          newPage.style.background =
            `#c0392b url(${this.frontPageImg}) no-repeat center/cover`;
          newPage.style.color = "#fff";
          newPage.style.fontWeight = "bold";
          newPage.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage);
          const newPage2 = lastPage.cloneNode(true);
          newPage2.classList.add("hard");
          newPage2.style.background =
            `#c0392b url(${this.frontPageImg}) no-repeat center/cover`;
          newPage2.style.color = "#fff";
          newPage2.style.fontWeight = "bold";
          newPage2.innerHTML =
            "Thank You for visiting <small>~ NataKuku</small>";
          this.querySelector(".flipbook").appendChild(newPage2);
        }

        $(this).find(".flipbook").turn({
          cornerSize: this.getCornerSize(),
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
        $(this).find(".flipbook").turn("disable", pages_count - 1);

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
          const maxX = image.width * 0.7;
          const maxY = image.height * 0.7;
          const minX = image.width * 0.3;
          const minY = image.height * 0.3;

          let randomX = Math.random() * (maxX - minX) + minX;
          let randomY = Math.random() * (maxY - minY) + minY;

          dot.style.left = `${randomX}px`;
          dot.style.top = `${randomY}px`;
        });
      }
    }

    customElements.define("book-slideshow", BookSlideshow);
  }
})();
