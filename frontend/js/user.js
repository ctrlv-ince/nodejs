$(document).ready(function () {
    const url = config.API_URL + '/'

    const getToken = () => {
        const token = sessionStorage.getItem('jwtToken');

        if (!token) {
            Swal.fire({
                icon: 'warning',
                text: 'You must be logged in to access this page.',
                showConfirmButton: true
            }).then(() => {
                window.location.href = 'login.html';
            });
            return;
        }
        return token;
    }

    $("#register").on('click', function (e) {
        e.preventDefault();
        
        // Get all form data
        let first_name = $("#first_name").val()
        let last_name = $("#last_name").val()
        let email = $("#email").val()
        let phone_number = $("#phone_number").val()
        let age = $("#age").val()
        let sex = $("#sex").val()
        let username = $("#username").val()
        let password = $("#password").val()
        let confirmPassword = $("#confirmPassword").val()
        
        // Basic validation
        if (!first_name || !last_name || !email || !phone_number || !age || !sex || !username || !password || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields'
            });
            return;
        }
        
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match'
            });
            return;
        }
        
        if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password must be at least 6 characters long'
            });
            return;
        }
        
        // Create user object matching database structure
        let user = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            age: parseInt(age),
            sex: sex,
            username: username,
            password: password
        }
        
        $.ajax({
            method: "POST",
            url: `${url}api/v1/register`,
            data: JSON.stringify(user),
            processData: false,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (data) {
                console.log(data);
                Swal.fire({
                    icon: "success",
                    text: "Registration successful! Welcome to Bit & Board",
                    position: 'bottom-right'
                }).then(() => {
                    // Clear any existing session data
                    sessionStorage.removeItem('jwtToken');
                    sessionStorage.removeItem('userData');
                    window.location.href = 'login.html';
                });
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    text: error.responseJSON?.message || "Registration failed. Please try again.",
                    position: 'bottom-right'
                });
            }
        });
    });

    $("#login").on('click', function (e) {
        e.preventDefault();

        let username = $("#username").val()
        let password = $("#password").val()
        
        // Basic validation
        if (!username || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields'
            });
            return;
        }
        
        let user = {
            username: username,
            password: password
        }
        
        $.ajax({
            method: "POST",
            url: `${url}api/v1/login`,
            data: JSON.stringify(user),
            processData: false,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (data) {
                console.log(data);
                Swal.fire({
                    text: data.success || "Login successful!",
                    showConfirmButton: false,
                    position: 'bottom-right',
                    timer: 1000,
                    timerProgressBar: true
                });
                
                // Store JWT token and user data
                if (data.token) {
                    sessionStorage.setItem('jwtToken', data.token);
                }
                sessionStorage.setItem('userData', JSON.stringify(data.user));
                
                // Trigger header update
                $(window).trigger('userLoginStatusChanged');
                
                window.location.href = 'profile.html'
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    text: error.responseJSON?.message || "Login failed. Please check your credentials.",
                    showConfirmButton: false,
                    position: 'bottom-right',
                    timer: 1000,
                    timerProgressBar: true
                });
            }
        });
    });

    $('#avatar').on('change', function () {
        const file = this.files[0];
        console.log(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log(e.target.result)
                $('#avatarPreview').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $("#updateBtn").on('click', function (event) {
        event.preventDefault();
        const token = getToken();
        if (!token) return;

        var data = $('#profileForm')[0];
        console.log(data);
        let formData = new FormData(data);

        $.ajax({
            method: "POST",
            url: `${url}api/v1/update-profile`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (data) {
                console.log(data);
                Swal.fire({
                    text: data.message,
                    showConfirmButton: false,
                    position: 'bottom-right',
                    timer: 1000,
                    timerProgressBar: true
                });
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    text: "Failed to update profile. Please try again.",
                    position: 'bottom-right'
                });
            }
        });
    });

    $('#loginBody').load("header.html");

    $("#profile").load("header.html", function () {
        // After header is loaded, check sessionStorage for userId
        if (sessionStorage.getItem('userId')) {
            // Change Login link to Logout
            const $loginLink = $('a.nav-link[href="login.html"]');
            $loginLink.text('Logout').attr({ 'href': '#', 'id': 'logout-link' }).on('click', function (e) {
                e.preventDefault();
                sessionStorage.clear();
                window.location.href = 'login.html';
            });
        }
    });

    $("#deactivateBtn").on('click', function (e) {
        e.preventDefault();
        const token = getToken();
        if (!token) return;
        
        Swal.fire({
            title: 'Deactivate Account',
            text: 'Are you sure you want to deactivate your account? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, deactivate',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: "DELETE",
                    url: `${url}api/v1/deactivate`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        Swal.fire({
                            text: data.message,
                            showConfirmButton: false,
                            position: 'bottom-right',
                            timer: 2000,
                            timerProgressBar: true
                        });
                        sessionStorage.clear();
                        window.location.href = 'index.html';
                    },
                    error: function (error) {
                        console.log(error);
                        Swal.fire({
                            icon: "error",
                            text: "Failed to deactivate account. Please try again.",
                            position: 'bottom-right'
                        });
                    }
                });
            }
        });
    });
}) 