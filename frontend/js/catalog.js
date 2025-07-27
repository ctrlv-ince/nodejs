$(document).ready(function() {
    let currentPage = 1;
    let currentFilters = {
        search: '',
        category: '',
        sortBy: 'newest',
        limit: 12
    };

    // Load dynamic header
    $('#headerContainer').load('header.html', function() {
        // Header loaded successfully
    });

    // Initialize catalog
    loadCategories();
    loadProducts();

    // Event listeners for filters
    $('#searchInput').on('input', debounce(function() {
        currentFilters.search = $(this).val();
        currentPage = 1;
        loadProducts();
    }, 500));

    $('#categoryFilter').on('change', function() {
        currentFilters.category = $(this).val();
        currentPage = 1;
        loadProducts();
    });

    $('#sortBy').on('change', function() {
        currentFilters.sortBy = $(this).val();
        currentPage = 1;
        loadProducts();
    });

    $('#itemsPerPage').on('change', function() {
        currentFilters.limit = parseInt($(this).val());
        currentPage = 1;
        loadProducts();
    });

    // Load product categories
    function loadCategories() {
        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/products/categories/list`,
            success: function(response) {
                if (response.success) {
                    const categorySelect = $('#categoryFilter');
                    response.categories.forEach(category => {
                        categorySelect.append(`<option value="${category}">${category}</option>`);
                    });
                }
            },
            error: function(error) {
                console.error('Failed to load categories:', error);
            }
        });
    }

    // Load products with filters
    function loadProducts() {
        const params = new URLSearchParams({
            page: currentPage,
            limit: currentFilters.limit
        });

        if (currentFilters.search) {
            params.append('search', currentFilters.search);
        }

        if (currentFilters.category) {
            params.append('category', currentFilters.category);
        }

        // Show loading spinner
        $('#productsContainer').html(`
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin fa-3x text-primary"></i>
                <p class="mt-3">Loading products...</p>
            </div>
        `);

        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/products?${params.toString()}`,
            success: function(response) {
                if (response.success) {
                    displayProducts(response.products);
                    displayPagination(response.pagination);
                } else {
                    showNoProducts();
                }
            },
            error: function(error) {
                console.error('Failed to load products:', error);
                showNoProducts();
            }
        });
    }

    // Display products in grid
    function displayProducts(products) {
        if (products.length === 0) {
            showNoProducts();
            return;
        }

        let productsHtml = '<div class="row">';
        
        products.forEach(product => {
            const stockStatus = getStockStatus(product.stock_quantity);
            const stockClass = getStockClass(product.stock_quantity);
            
            productsHtml += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card product-card">
                        <img src="${product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                             class="card-img-top product-image" 
                             alt="${product.name}"
                             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        <div class="card-body">
                            <div class="product-category">${product.category}</div>
                            <h5 class="card-title product-title">${product.name}</h5>
                            <p class="card-text text-muted">${product.description ? product.description.substring(0, 80) + '...' : 'No description available'}</p>
                            <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                            <div class="stock-status ${stockClass}">
                                <i class="fas fa-circle"></i> ${stockStatus}
                            </div>
                            <div class="d-flex gap-2">
                                <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm flex-fill">
                                    <i class="fas fa-eye"></i> View Details
                                </a>
                                ${product.stock_quantity > 0 ? 
                                    `<button class="btn btn-primary btn-sm flex-fill btn-add-cart" onclick="addToCart(${product.id})">
                                        <i class="fas fa-cart-plus"></i> Add to Cart
                                    </button>` : 
                                    `<button class="btn btn-secondary btn-sm flex-fill" disabled>
                                        <i class="fas fa-times"></i> Out of Stock
                                    </button>`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsHtml += '</div>';
        $('#productsContainer').html(productsHtml);
    }

    // Display pagination
    function displayPagination(pagination) {
        if (pagination.total_pages <= 1) {
            $('#paginationContainer').hide();
            return;
        }

        $('#paginationContainer').show();
        let paginationHtml = '';

        // Previous button
        paginationHtml += `
            <li class="page-item ${pagination.current_page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${pagination.current_page - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, pagination.current_page - 2);
        const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === pagination.current_page ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${pagination.current_page + 1})">Next</a>
            </li>
        `;

        $('#pagination').html(paginationHtml);
    }

    // Show no products message
    function showNoProducts() {
        $('#productsContainer').html(`
            <div class="no-products">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No products found</h4>
                <p>Try adjusting your search criteria or browse all categories.</p>
                <button class="btn btn-primary" onclick="clearFilters()">
                    <i class="fas fa-refresh"></i> Clear Filters
                </button>
            </div>
        `);
        $('#paginationContainer').hide();
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

    // Clear all filters
    window.clearFilters = function() {
        $('#searchInput').val('');
        $('#categoryFilter').val('');
        $('#sortBy').val('newest');
        $('#itemsPerPage').val('12');
        
        currentFilters = {
            search: '',
            category: '',
            sortBy: 'newest',
            limit: 12
        };
        currentPage = 1;
        loadProducts();
    };

    // Go to specific page
    window.goToPage = function(page) {
        currentPage = page;
        loadProducts();
        // Scroll to top
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    };

    // Add to cart function
    window.addToCart = function(productId) {
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
                product_id: productId,
                quantity: 1
            }),
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Added to Cart!',
                        text: 'Item has been added to your cart.',
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

    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}); 