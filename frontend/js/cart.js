$(document).ready(function() {
    // Check if user is logged in
    const token = sessionStorage.getItem('jwtToken');
    
    if (!token) {
        // Redirect to login if not authenticated
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to view your cart.',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'index.html';
            }
        });
        return;
    }

    // Load dynamic header
    $('#headerContainer').load('header.html', function() {
        // Header loaded successfully
    });

    // Load cart items
    loadCart();

    // Load cart items
    function loadCart() {
        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/cart`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success) {
                    if (response.cart.length === 0) {
                        showEmptyCart();
                    } else {
                        displayCart(response.cart, response.total);
                    }
                } else {
                    showError('Failed to load cart');
                }
            },
            error: function(error) {
                console.error('Failed to load cart:', error);
                if (error.status === 401) {
                    // Token expired or invalid
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                } else {
                    showError('Failed to load cart');
                }
            }
        });
    }

    // Display cart items
    function displayCart(cartItems, total) {
        let cartHtml = `
            <div class="row">
                <div class="col-lg-8">
                    <h2 class="mb-4">Shopping Cart (${cartItems.length} items)</h2>
                    <div id="cartItems">
        `;

        cartItems.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            cartHtml += `
                <div class="cart-item" data-product-id="${item.product_id}">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image_url || 'https://via.placeholder.com/100x100?text=No+Image'}" 
                                 class="cart-item-image" 
                                 alt="${item.name}"
                                 onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                        </div>
                        <div class="col-md-4">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} each</div>
                        </div>
                        <div class="col-md-3">
                            <div class="quantity-controls">
                                <button class="btn quantity-btn" onclick="updateQuantity(${item.product_id}, -1)">-</button>
                                <input type="number" class="form-control quantity-input" 
                                       value="${item.quantity}" min="1" max="${item.stock_quantity}"
                                       onchange="updateQuantityInput(${item.product_id}, this.value)">
                                <button class="btn quantity-btn" onclick="updateQuantity(${item.product_id}, 1)">+</button>
                            </div>
                            <small class="text-muted">Max: ${item.stock_quantity}</small>
                        </div>
                        <div class="col-md-2">
                            <div class="cart-item-total">$${itemTotal}</div>
                        </div>
                        <div class="col-md-1">
                            <button class="btn remove-btn" onclick="removeItem(${item.product_id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartHtml += `
                    </div>
                    <div class="mt-4">
                        <button class="btn btn-outline-secondary continue-shopping" onclick="window.location.href='catalog.html'">
                            <i class="fas fa-arrow-left"></i> Continue Shopping
                        </button>
                        <button class="btn btn-outline-danger" onclick="clearCart()">
                            <i class="fas fa-trash"></i> Clear Cart
                        </button>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="cart-summary">
                        <h3 class="mb-4">Order Summary</h3>
                        <div class="summary-item">
                            <span>Subtotal:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div class="summary-item">
                            <span>Tax:</span>
                            <span>$${(total * 0.08).toFixed(2)}</span>
                        </div>
                        <div class="summary-total">
                            <span>Total:</span>
                            <span>$${(total * 1.08).toFixed(2)}</span>
                        </div>
                        <button class="btn btn-checkout mt-4" onclick="proceedToCheckout()">
                            <i class="fas fa-credit-card"></i> Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;

        $('#cartContent').html(cartHtml);
    }

    // Show empty cart
    function showEmptyCart() {
        const emptyCartHtml = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button class="btn btn-primary" onclick="window.location.href='catalog.html'">
                    <i class="fas fa-shopping-bag"></i> Start Shopping
                </button>
            </div>
        `;
        $('#cartContent').html(emptyCartHtml);
    }

    // Show error message
    function showError(message) {
        const errorHtml = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="loadCart()">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
        $('#cartContent').html(errorHtml);
    }

    // Update quantity
    window.updateQuantity = function(productId, change) {
        const quantityInput = $(`.cart-item[data-product-id="${productId}"] .quantity-input`);
        const currentQuantity = parseInt(quantityInput.val());
        const newQuantity = currentQuantity + change;
        const maxQuantity = parseInt(quantityInput.attr('max'));

        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            updateCartItem(productId, newQuantity);
        }
    };

    // Update quantity via input
    window.updateQuantityInput = function(productId, newQuantity) {
        const quantityInput = $(`.cart-item[data-product-id="${productId}"] .quantity-input`);
        const maxQuantity = parseInt(quantityInput.attr('max'));
        
        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            updateCartItem(productId, parseInt(newQuantity));
        } else {
            // Reset to current value if invalid
            quantityInput.val(quantityInput.attr('value'));
        }
    };

    // Update cart item quantity
    function updateCartItem(productId, quantity) {
        $.ajax({
            method: 'PUT',
            url: `${config.API_URL}/api/v1/cart/update/${productId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ quantity: quantity }),
            success: function(response) {
                if (response.success) {
                    // Reload cart to update totals
                    loadCart();
                    updateCartCount();
                }
            },
            error: function(error) {
                console.error('Failed to update quantity:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.responseJSON?.message || 'Failed to update quantity.'
                });
            }
        });
    }

    // Remove item from cart
    window.removeItem = function(productId) {
        Swal.fire({
            icon: 'question',
            title: 'Remove Item',
            text: 'Are you sure you want to remove this item from your cart?',
            showCancelButton: true,
            confirmButtonText: 'Remove',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: 'DELETE',
                    url: `${config.API_URL}/api/v1/cart/remove/${productId}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Item Removed',
                                text: 'Item has been removed from your cart.',
                                showConfirmButton: false,
                                timer: 1500,
                                position: 'top-end',
                                toast: true
                            });
                            loadCart();
                            updateCartCount();
                        }
                    },
                    error: function(error) {
                        console.error('Failed to remove item:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to remove item from cart.'
                        });
                    }
                });
            }
        });
    }

    // Clear cart
    window.clearCart = function() {
        Swal.fire({
            icon: 'warning',
            title: 'Clear Cart',
            text: 'Are you sure you want to remove all items from your cart?',
            showCancelButton: true,
            confirmButtonText: 'Clear Cart',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: 'DELETE',
                    url: `${config.API_URL}/api/v1/cart/clear`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Cart Cleared',
                                text: 'All items have been removed from your cart.',
                                showConfirmButton: false,
                                timer: 1500,
                                position: 'top-end',
                                toast: true
                            });
                            loadCart();
                            updateCartCount();
                        }
                    },
                    error: function(error) {
                        console.error('Failed to clear cart:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to clear cart.'
                        });
                    }
                });
            }
        });
    }

    // Proceed to checkout
    window.proceedToCheckout = function() {
        window.location.href = 'checkout.html';
    };

    // Update cart count in header
    function updateCartCount() {
        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/cart/count`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success) {
                    // Update cart count in header if it exists
                    const cartBadge = $('.cart-count');
                    if (cartBadge.length > 0) {
                        cartBadge.text(response.count);
                    }
                }
            }
        });
    }
}); 