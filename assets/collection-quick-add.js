/**
 * Collection Quick Add functionality
 * Handles add-to-cart functionality for product cards on collection pages
 */
class CollectionQuickAdd {
  constructor() {
    this.init();
  }

  init() {
    // Use event delegation to handle clicks on add-to-cart buttons
    document.addEventListener('click', (event) => {
      const addToCartButton = event.target.closest('.add-to-cart');
      if (addToCartButton) {
        event.preventDefault();
        this.handleAddToCart(addToCartButton);
      }
    });
  }

  handleAddToCart(button) {
    const productId = button.getAttribute('data-product-id');
    const productUrl = button.getAttribute('data-product-url');
    const variantId = button.getAttribute('data-variant-id');

    if (!productId || !variantId) {
      console.error('Missing required data attributes for add to cart');
      return;
    }

    // Show loading state
    this.setButtonLoading(button, true);

    this.addToCart(productId, variantId, productUrl)
      .then(() => {
        // Success - cart updated event will be dispatched
        this.setButtonLoading(button, false);
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
        this.setButtonLoading(button, false);
        this.showError(button);
      });
  }

  async addToCart(productId, variantId, productUrl) {
    const data = {
      items: [{
        id: variantId,
        quantity: 1,
      }],
      sections: "cart-notification-product,cart-notification-button,cart-icon-bubble",
      sections_url: productUrl
    };

    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cart = await response.json();
    
    // Dispatch cart updated event
    const event = new CustomEvent('cart:updated', {
      detail: cart 
    });
    window.dispatchEvent(event);

    return cart;
  }

  setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.style.opacity = '0.6';
      button.style.cursor = 'not-allowed';
    } else {
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }

  showError(button) {
    // You can implement a more sophisticated error display here
    // For now, we'll just log the error
    console.error('Failed to add item to cart');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CollectionQuickAdd();
  });
} else {
  new CollectionQuickAdd();
} 