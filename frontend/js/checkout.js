$(document).ready(function() {
    let cartItems = [];
    let cartTotal = 0;
    let selectedPaymentMethod = 'credit_card';

    // Check if user is logged in
    const token = sessionStorage.getItem('jwtToken');
    
    if (!token) {
        // Redirect to login if not authenticated
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to complete your purchase.',
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

    // Load cart and initialize checkout
    loadCartAndInitialize();

    // Load cart items and initialize checkout
    function loadCartAndInitialize() {
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
                        cartItems = response.cart;
                        cartTotal = response.total;
                        displayCheckout();
                    }
                } else {
                    showError('Failed to load cart');
                }
            },
            error: function(error) {
                console.error('Failed to load cart:', error);
                if (error.status === 401) {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                } else {
                    showError('Failed to load cart');
                }
            }
        });
    }

    // Display checkout form
    function displayCheckout() {
        const tax = cartTotal * 0.08;
        const total = cartTotal + tax;

        const checkoutHtml = `
            <div class="row">
                <div class="col-lg-8">
                    <!-- Shipping Information -->
                    <div class="checkout-section">
                        <h3 class="section-title">
                            <i class="fas fa-shipping-fast"></i> Shipping Information
                        </h3>
                        <form id="shippingForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="firstName">First Name *</label>
                                        <input type="text" class="form-control" id="firstName" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="lastName">Last Name *</label>
                                        <input type="text" class="form-control" id="lastName" required>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address *</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number *</label>
                                <input type="tel" class="form-control" id="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="address">Street Address *</label>
                                <input type="text" class="form-control" id="address" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="city">City *</label>
                                        <input type="text" class="form-control" id="city" required>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="state">State *</label>
                                        <input type="text" class="form-control" id="state" required>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="zipCode">ZIP Code *</label>
                                        <input type="text" class="form-control" id="zipCode" required>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Payment Information -->
                    <div class="checkout-section">
                        <h3 class="section-title">
                            <i class="fas fa-credit-card"></i> Payment Method
                        </h3>
                        <div class="payment-method selected" data-method="credit_card">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-credit-card fa-2x text-primary mr-3"></i>
                                <div>
                                    <h6 class="mb-1">Credit/Debit Card</h6>
                                    <small class="text-muted">Pay securely with your card</small>
                                </div>
                            </div>
                        </div>
                        <div class="payment-method" data-method="paypal">
                            <div class="d-flex align-items-center">
                                <i class="fab fa-paypal fa-2x text-primary mr-3"></i>
                                <div>
                                    <h6 class="mb-1">PayPal</h6>
                                    <small class="text-muted">Pay with your PayPal account</small>
                                </div>
                            </div>
                        </div>
                        <div class="payment-method" data-method="bank_transfer">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-university fa-2x text-primary mr-3"></i>
                                <div>
                                    <h6 class="mb-1">Bank Transfer</h6>
                                    <small class="text-muted">Direct bank transfer</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="order-summary">
                        <h3 class="section-title">Order Summary</h3>
                        <div id="orderItems">
                            ${cartItems.map(item => `
                                <div class="order-item">
                                    <img src="${item.image_url || 'https://via.placeholder.com/60x60?text=No+Image'}" 
                                         class="item-image" 
                                         alt="${item.name}"
                                         onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                                    <div class="item-details">
                                        <div class="item-name">${item.name}</div>
                                        <small class="text-muted">Qty: ${item.quantity}</small>
                                    </div>
                                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="summary-total">
                            <div class="d-flex justify-content-between">
                                <span>Subtotal:</span>
                                <span>$${cartTotal.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Tax:</span>
                                <span>$${tax.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Total:</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-place-order mt-4" onclick="placeOrder()">
                            <i class="fas fa-lock"></i> Place Order - $${total.toFixed(2)}
                        </button>
                        
                        <button class="btn btn-outline-secondary back-to-cart mt-3" onclick="window.location.href='cart.html'">
                            <i class="fas fa-arrow-left"></i> Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        $('#checkoutContent').html(checkoutHtml);

        // Load user profile data
        loadUserProfile();

        // Add payment method selection
        $('.payment-method').on('click', function() {
            $('.payment-method').removeClass('selected');
            $(this).addClass('selected');
            selectedPaymentMethod = $(this).data('method');
        });
    }

    // Load user profile data
    function loadUserProfile() {
        $.ajax({
            method: 'GET',
            url: `${config.API_URL}/api/v1/auth/profile`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success) {
                    const user = response.user;
                    $('#firstName').val(user.first_name);
                    $('#lastName').val(user.last_name);
                    $('#email').val(user.email);
                    $('#phone').val(user.phone_number);
                }
            },
            error: function(error) {
                console.error('Failed to load user profile:', error);
            }
        });
    }

    // Show empty cart
    function showEmptyCart() {
        const emptyCartHtml = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
                <h3>Your cart is empty</h3>
                <p>You need to add items to your cart before checkout.</p>
                <button class="btn btn-primary" onclick="window.location.href='catalog.html'">
                    <i class="fas fa-shopping-bag"></i> Start Shopping
                </button>
            </div>
        `;
        $('#checkoutContent').html(emptyCartHtml);
    }

    // Show error message
    function showError(message) {
        const errorHtml = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="loadCartAndInitialize()">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
        $('#checkoutContent').html(errorHtml);
    }

    // Place order
    window.placeOrder = function() {
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const shippingData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            zipCode: $('#zipCode').val()
        };

        const orderData = {
            shipping_address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`,
            payment_method: selectedPaymentMethod
        };

        // Show loading state
        const orderBtn = $('.btn-place-order');
        const originalText = orderBtn.html();
        orderBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...');
        orderBtn.prop('disabled', true);

        // Place order
        $.ajax({
            method: 'POST',
            url: `${config.API_URL}/api/v1/orders/create`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(orderData),
            success: function(response) {
                if (response.success) {
                    // Order successful
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Placed Successfully!',
                        text: `Your order #${response.order_id} has been placed. You will receive a confirmation email shortly.`,
                        confirmButtonText: 'View Orders',
                        showCancelButton: true,
                        cancelButtonText: 'Continue Shopping'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'orders.html';
                        } else {
                            window.location.href = 'index.html';
                        }
                    });
                } else {
                    showOrderError('Failed to place order');
                }
            },
            error: function(error) {
                console.error('Failed to place order:', error);
                showOrderError(error.responseJSON?.message || 'Failed to place order');
            },
            complete: function() {
                // Reset button state
                orderBtn.html(originalText);
                orderBtn.prop('disabled', false);
            }
        });
    };

    // Validate form
    function validateForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'state', 'zipCode'
        ];

        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(fieldId => {
            const field = $(`#${fieldId}`);
            const value = field.val().trim();
            
            if (!value) {
                field.addClass('is-invalid');
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            } else {
                field.removeClass('is-invalid');
            }
        });

        // Email validation
        const email = $('#email').val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            $('#email').addClass('is-invalid');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = $('#email');
            }
        }

        // Phone validation
        const phone = $('#phone').val();
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
            $('#phone').addClass('is-invalid');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = $('#phone');
            }
        }

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields correctly.'
            });
            
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }

        return isValid;
    }

    // Show order error
    function showOrderError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Order Failed',
            text: message
        });
    }

    // Remove invalid class on input
    $(document).on('input', '.form-control', function() {
        $(this).removeClass('is-invalid');
    });
}); 