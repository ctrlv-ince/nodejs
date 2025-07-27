$(document).ready(function() {
    let currentProduct = null;
    let quantity = 1;

    // Load dynamic header
    $('#headerContainer').load('header.html', function() {
        // Header loaded successfully
    });

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError('Product ID not found');
        return;
    }

    // Load product details
    loadProductDetails(productId);

    // Load product details
    function loadProductDetails(productId) {
        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/products/${productId}`,
            success: function(response) {
                if (response.success) {
                    currentProduct = response.product;
                    displayProductDetails(currentProduct);
                    loadRelatedProducts(currentProduct.category, currentProduct.id);
                } else {
                    showError('Product not found');
                }
            },
            error: function(error) {
                console.error('Failed to load product:', error);
                showError('Failed to load product details');
            }
        });
    }

    // Display product details
    function displayProductDetails(product) {
        // Update page title
        document.title = `Bit & Board - ${product.name}`;
        
        // Update breadcrumb
        $('#productBreadcrumb').text(product.name);

        const stockStatus = getStockStatus(product.stock_quantity);
        const stockClass = getStockClass(product.stock_quantity);

        const productHtml = `
            <div class="row">
                <div class="col-lg-6">
                    <img src="${product.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}" 
                         class="product-image" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
                </div>
                <div class="col-lg-6">
                    <div class="product-category">${product.category}</div>
                    <h1 class="product-title">${product.name}</h1>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    
                    <div class="stock-status ${stockClass}">
                        <i class="fas fa-circle"></i> ${stockStatus}
                        ${product.stock_quantity > 0 ? `(${product.stock_quantity} available)` : ''}
                    </div>
                    
                    ${product.stock_quantity > 0 ? `
                        <div class="quantity-selector">
                            <label class="font-weight-bold mr-3">Quantity:</label>
                            <button class="btn quantity-btn" onclick="changeQuantity(-1)">-</button>
                            <input type="number" class="form-control quantity-input" id="quantityInput" value="1" min="1" max="${product.stock_quantity}">
                            <button class="btn quantity-btn" onclick="changeQuantity(1)">+</button>
                        </div>
                        
                        <button class="btn btn-primary btn-add-cart" onclick="addToCart()">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        
                        <button class="btn btn-buy-now" onclick="buyNow()">
                            <i class="fas fa-shopping-bag"></i> Buy Now
                        </button>
                    ` : `
                        <button class="btn btn-secondary btn-add-cart" disabled>
                            <i class="fas fa-times"></i> Out of Stock
                        </button>
                    `}
                </div>
            </div>
            
            <div class="product-description">
                <h3>Description</h3>
                <p>${product.description || 'No description available for this product.'}</p>
            </div>
            
            <div class="product-specs">
                <h3>Product Specifications</h3>
                <div class="spec-item">
                    <span class="spec-label">Product ID:</span>
                    <span class="spec-value">#${product.id}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Category:</span>
                    <span class="spec-value">${product.category}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Price:</span>
                    <span class="spec-value">$${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Stock:</span>
                    <span class="spec-value">${product.stock_quantity} units</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Status:</span>
                    <span class="spec-value">${product.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Added:</span>
                    <span class="spec-value">${new Date(product.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;

        $('#productContainer').html(productHtml);
    }

    // Load related products
    function loadRelatedProducts(category, excludeId) {
        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/products?category=${category}&limit=4`,
            success: function(response) {
                if (response.success && response.products.length > 0) {
                    displayRelatedProducts(response.products.filter(p => p.id != excludeId));
                }
            },
            error: function(error) {
                console.error('Failed to load related products:', error);
            }
        });
    }

    // Display related products
    function displayRelatedProducts(products) {
        if (products.length === 0) return;

        $('#relatedProducts').show();
        let relatedHtml = '';

        products.forEach(product => {
            relatedHtml += `
                <div class="col-lg-3 col-md-6">
                    <div class="card related-product-card">
                        <img src="${product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                             class="related-product-image" 
                             alt="${product.name}"
                             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        <div class="card-body">
                            <h6 class="card-title">${product.name}</h6>
                            <p class="card-text text-primary font-weight-bold">$${parseFloat(product.price).toFixed(2)}</p>
                            <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        $('#relatedProductsContainer').html(relatedHtml);
    }

    // Get stock status text
    function getStockStatus(stockQuantity) {
        if (stockQuantity === 0) return 'Out of Stock';
        if (stockQuantity <= 5) return 'Low Stock';
        return 'In Stock';
    }

    // Get stock status class
    function getStockClass(stockQuantity) {
        if (stockQuantity === 0) return 'out-of-stock';
        if (stockQuantity <= 5) return 'low-stock';
        return 'in-stock';
    }

    // Show error message
    function showError(message) {
        $('#productContainer').html(`
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <a href="catalog.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Back to Catalog
                </a>
            </div>
        `);
    }

    // Change quantity
    window.changeQuantity = function(change) {
        if (!currentProduct) return;

        const newQuantity = quantity + change;
        const maxQuantity = currentProduct.stock_quantity;

        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            quantity = newQuantity;
            $('#quantityInput').val(quantity);
        }
    };

    // Quantity input change
    $(document).on('input', '#quantityInput', function() {
        const newQuantity = parseInt($(this).val());
        const maxQuantity = currentProduct ? currentProduct.stock_quantity : 1;

        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            quantity = newQuantity;
        } else {
            $(this).val(quantity);
        }
    });

    // Add to cart
    window.addToCart = function() {
        if (!currentProduct) return;

        // Check if user is logged in
        const token = sessionStorage.getItem('jwtToken');
        
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please log in to add items to your cart.',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
            return;
        }

        // Add to cart
        $.ajax({
            method: 'POST',
            url: `${config.API_URL}/api/v1/cart/add`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                product_id: currentProduct.id,
                quantity: quantity
            }),
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Added to Cart!',
                        text: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`,
                        showConfirmButton: false,
                        timer: 1500,
                        position: 'top-end',
                        toast: true
                    });
                    
                    // Update cart count in header
                    updateCartCount();
                }
            },
            error: function(error) {
                console.error('Failed to add to cart:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.responseJSON?.message || 'Failed to add item to cart.'
                });
            }
        });
    };

    // Buy now
    window.buyNow = function() {
        if (!currentProduct) return;

        // Check if user is logged in
        const token = sessionStorage.getItem('jwtToken');
        
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please log in to purchase items.',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
            return;
        }

        // Add to cart first, then redirect to checkout
        $.ajax({
            method: 'POST',
            url: `${config.API_URL}/api/v1/cart/add`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                product_id: currentProduct.id,
                quantity: quantity
            }),
            success: function(response) {
                if (response.success) {
                    // Redirect to cart/checkout
                    window.location.href = 'cart.html';
                }
            },
            error: function(error) {
                console.error('Failed to add to cart:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.responseJSON?.message || 'Failed to add item to cart.'
                });
            }
        });
    };

    // Update cart count in header
    function updateCartCount() {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
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
    }
}); 