"use strict";

(function () {
  if (!customElements.get("book-slideshow")) {
    class BookSlideshow extends HTMLElement {
      constructor() {
        super();
        this.initSlideshow = this.initSlideshow.bind(this);
        this.randomizeDots = this.randomizeDots.bind(this);
        this.resizeLookBook = this.resizeLookBook.bind(this);
        this.frontPageImg = this.dataset.frontPageImg;
        this.allPages = this.querySelectorAll(".page");
      }

      connectedCallback() {
        this.initSlideshow();
        $(window).on("resize", this.resizeLookBook);

        if (this.isMobile()) {
          const flipbook = this.querySelector(".flipbook");
          if (flipbook) {
            const navigationButtons = this.createNavigationButtons(flipbook);
            flipbook.parentNode.insertBefore(
              navigationButtons,
              flipbook.nextSibling
            );
          }
        }
      }

      isMobile() {
        return window.innerWidth <= 480;
      }

      createNavigationButtons(flipbook) {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const nextButton = document.createElement("button");
        nextButton.classList.add("slider-button", "slider-button--next");
        nextButton.innerHTML = ">";
        nextButton.addEventListener("click", () => $(flipbook).turn("next"));

        const prevButton = document.createElement("button");
        prevButton.classList.add("slider-button", "slider-button--prev");
        prevButton.innerHTML = "<";
        prevButton.addEventListener("click", () =>
          $(flipbook).turn("previous")
        );

        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(nextButton);

        return buttonContainer;
      }

      initSlideshow() {
        const pages = this.querySelectorAll(".page");
        console.log("1");
        const pagesCount = pages.length;
        console.log("2");

        if (this.isMobile()) {
          pages.forEach((page) => {
            const clonedPage = page.cloneNode(true);
            clonedPage.classList.add("cloned");
            this.handlePageShadows(page, clonedPage);
            page.parentNode.insertBefore(clonedPage, page.nextSibling);
          });
        }
        console.log("3");

        pages.forEach((page, index) => {
          const shadow = page.querySelector(".flipbook__book-shadow-left");
          if (index % 2 === 1 && shadow) {
            shadow.classList.remove("flipbook__book-shadow-left");
            shadow.classList.add("flipbook__book-shadow-right");
          }
        });
        console.log("4");

        const flipbook = $(this).find(".flipbook");
        this.initializeTurnJS(flipbook, this.getCornerSize());

        const videos = this.querySelectorAll(".BookVideo");
        videos.forEach((video) => {
          video.controls = false;
          video.addEventListener("ended", () => video.play());
        });
        console.log("5");

        flipbook.on("turning", () => {
          this.playAllVideos();
          this.randomizeDots();
        });
        console.log("6");

        flipbook.turn("disable", pagesCount - 1);
        // this.randomizeDots();
        console.log("7");
      }

      handlePageShadows(page, clonedPage) {
        const shadow = page.querySelector(".flipbook__book-shadow-left");
        const shadowOnClonedPage = clonedPage.querySelector(
          ".flipbook__book-shadow-left"
        );

        if (shadowOnClonedPage) clonedPage.removeChild(shadowOnClonedPage);

        if (shadow) {
          page.innerHTML = "";
          page.appendChild(shadow);
          shadow.classList.remove("flipbook__book-shadow-left");
          shadow.classList.add("flipbook__book-shadow-left-mobile");
        }
      }

      initializeTurnJS(flipbook, cornerSize) {
        flipbook.turn({
          cornerSize,
          gradients: true,
          display: "double",
          acceleration: true,
        });
      }

      getCornerSize() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) return 2000; // Mobile
        if (screenWidth <= 1024) return 400; // Tablet
        return 60; // PC
      }

      randomizeDots() {
        const dots = this.querySelectorAll(".dot-link");
        dots.forEach((dot) => {
          const randomTop = Math.random() * 100; // Randomize between 0% and 100%
          const randomLeft = Math.random() * 100;

          dot.style.position = "absolute";
          dot.style.width = "30px";
          dot.style.height = "30px";
          dot.style.backgroundColor = "white";
          dot.style.borderRadius = "50%";
          dot.style.transition = "opacity 0.5s ease";
          dot.style.zIndex = "800";

          dot.style.top = `${randomTop}%`;
          dot.style.left = `${randomLeft}%`;
        });
      }

      playAllVideos() {
        const allVideos = this.querySelectorAll(".BookVideo");
        allVideos.forEach((video) => video.play());
      }

      removeNavigationButtons() {
        const buttonContainer = this.querySelector(".button-container");
        if (buttonContainer) {
          buttonContainer.parentNode.removeChild(buttonContainer);
        }
      }

      resizeLookBook() {
        console.log("resize");
        const flipbook = $(this).find(".flipbook");
        const parent = flipbook.parent().parent();
        const parentWidth = parent.width();
        const parentHeight = parent.height();

        const { width, height } = this.calculateDimensions(
          parentWidth,
          parentHeight
        );

        flipbook.css({ width, height });
        flipbook.turn("size", width, height);

        if (this.isMobile()) {
          if (!this.querySelector(".button-container")) {
            const navigationButtons = this.createNavigationButtons(flipbook[0]);
            flipbook[0].parentNode.insertBefore(
              navigationButtons,
              flipbook[0].nextSibling
            );
          }
        } else {
          this.removeNavigationButtons();
        }
      }

      calculateDimensions(parentWidth, parentHeight) {
        const breakpointsWidth = {
          344: { width: 620 },
          390: { width: 620 },
          430: { width: 620 },
          480: { width: 640 }, // Mobile Portrait
          540: { width: 500 },
          768: { width: 600 }, // Mobile Landscape / Small Tablet
          912: { width: 700 },
          1024: { width: 800 }, // Tablet
          1200: { width: 900 },
          1280: { width: 1200 }, // Desktop Small
          1920: { width: 1400 }, // Desktop Large
        };

        const breakpointsHeight = {
          344: { height: 144 },
          390: { height: 190 },
          480: { height: 220 }, // Mobile Portrait
          768: { height: 380 }, // Mobile Landscape / Small Tablet
          882: { height: 600 },
          940: { height: 600 },
          1024: { height: 668 }, // Tablet
          1280: { height: 924 }, // Desktop Small
          1368: { height: 1000 },
          1920: { height: 1080 }, // Desktop Large
        };

        const widthBreakpoint = Object.keys(breakpointsWidth).find(
          (key) => parentWidth <= parseInt(key)
        ) || Math.max(...Object.keys(breakpointsWidth));
    
        const heightBreakpoint = Object.keys(breakpointsHeight).find(
          (key) => parentHeight <= parseInt(key)
        ) || Math.max(...Object.keys(breakpointsHeight));
    
        const widthDimensions = breakpointsWidth[widthBreakpoint];
        const heightDimensions = breakpointsHeight[heightBreakpoint];
    
        return {
          width: widthDimensions.width,
          height: heightDimensions.height,
        };
      }
    }

    customElements.define("book-slideshow", BookSlideshow);
  }
})();
