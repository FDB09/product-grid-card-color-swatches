// COLOR SWATCH FEATURE

document.addEventListener("DOMContentLoaded", function () {
  // Updates the product image in the card when a variant is selected.
  function updateProductImage(card, variantData, variantId) {
    var productImageElement = card.querySelector(".card__media img");
    if (productImageElement) {
      var dynamicSrcset = [
        `${variantData.imageUrl}?width=165 165w`,
        `${variantData.imageUrl}?width=360 360w`,
        `${variantData.imageUrl}?width=533 533w`,
        `${variantData.imageUrl}?width=720 720w`,
        `${variantData.imageUrl}?width=940 940w`,
        `${variantData.imageUrl}?width=1066 1066w`,
      ].join(", ");
      productImageElement.srcset = dynamicSrcset;
      productImageElement.src = variantData.imageUrl;
    }
  }

  // Updates the product links in the card with the selected variant URL.
  function updateProductLinks(card, variantData) {
    var productLinks = card.querySelectorAll(
      'a[id^="CardLink-"], a[id^="StandardCardNoMediaLink-"], a.card__content',
    );
    productLinks.forEach(function (link) {
      link.href = variantData.productUrl;
    });
  }

  // Stores the selected variant (image & links) in sessionStorage to maintain state across reloads.
  function storeSelectedVariant(sectionId, productId, variantId) {
    sessionStorage.setItem(
      "selectedVariant-" + sectionId + "-" + productId,
      variantId,
    );
  }

  // Stores the selected swatch option in sessionStorage.
  function storeSelectedSwatch(sectionId, productId, variantId) {
    sessionStorage.setItem(
      "selectedSwatch-" + sectionId + "-" + productId,
      variantId,
    );
  }

  // // Restores the product image and links with the previously selected variant.
  function restoreSelectedVariant(
    productGrid,
    sectionId,
    productId,
    variantDataMap,
  ) {
    var selectedVariantId = sessionStorage.getItem(
      "selectedVariant-" + sectionId + "-" + productId,
    );
    if (selectedVariantId && variantDataMap[selectedVariantId]) {
      var card = productGrid.querySelector(
        `.card-product-custom-div[data-section-id="${sectionId}"][data-product-id="${productId}"]`,
      );
      var variantData = variantDataMap[selectedVariantId];
      updateProductImage(card, variantData, selectedVariantId);
      updateProductLinks(card, variantData);
    }
  }

  // Restores the previously selected swatch in the product.
  function restoreSelectedSwatch(productGrid, sectionId, productId) {
    var selectedVariantId = sessionStorage.getItem(
      "selectedSwatch-" + sectionId + "-" + productId,
    );
    if (selectedVariantId) {
      var swatchInput = productGrid.querySelector(
        `input[type="radio"][data-variant-id="${selectedVariantId}"][data-section-id="${sectionId}"][data-product-id="${productId}"]`,
      );
      if (swatchInput) {
        swatchInput.checked = true;
      }
    }
  }

  // Initializes the product grid by restoring previously selected variants and swatches.
  function initializeProductGrid(productGrid) {
    var sectionId = productGrid.getAttribute("data-id");
    productGrid
      .querySelectorAll(".card-product-custom-div")
      .forEach(function (card) {
        var productId = card.getAttribute("data-product-id");
        var variantDataMap =
          window[
            "variantDataMap" + sectionId.replace(/-/g, "_") + "_" + productId
          ];
        restoreSelectedVariant(
          productGrid,
          sectionId,
          productId,
          variantDataMap,
        );
        restoreSelectedSwatch(productGrid, sectionId, productId);
        card.addEventListener("change", function (e) {
          if (
            e.target.matches(
              'input[type="radio"][data-section-id="' +
                sectionId +
                '"][data-product-id="' +
                productId +
                '"]',
            )
          ) {
            var variantId = e.target.getAttribute("data-variant-id");
            var variantData = variantDataMap[variantId];
            if (!variantData) {
              return;
            }
            storeSelectedVariant(sectionId, productId, variantId);
            storeSelectedSwatch(sectionId, productId, variantId);
            updateProductImage(card, variantData, variantId);
            updateProductLinks(card, variantData);
          }
        });
        card.classList.add("loaded");
      });
  }

  // Initializes all product grids on the page.
  function initializeAllProductGrids() {
    var productGrids = document.querySelectorAll(".grid.product-grid");
    productGrids.forEach(initializeProductGrid);
  }

  // Executes initialization on page load.
  initializeAllProductGrids();

  // Observes DOM changes to detect new product grids and reinitialize them.
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        initializeAllProductGrids();
      }
    });
  });

  var config = { childList: true, subtree: true };
  observer.observe(document.body, config);
});
