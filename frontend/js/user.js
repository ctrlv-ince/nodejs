$(document).ready(function () {
    const url = 'http://172.34.98.64:4000/'

    const getToken = () => {
        const userId = sessionStorage.getItem('userId');

        if (!userId) {
            Swal.fire({
                icon: 'warning',
                text: 'You must be logged in to access this page.',
                showConfirmButton: true
            }).then(() => {
                window.location.href = 'login.html';
            });
            return;
        }
        return true
    }

    $("#register").on('click', function (e) {
        e.preventDefault();
        let name = $("#name").val()
        let email = $("#email").val()
        let password = $("#password").val()
        let user = {
            name,
            email,
            password
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
                    text: "register success",
                    position: 'bottom-right'

                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $("#login").on('click', function (e) {
        e.preventDefault();

        let email = $("#email").val()
        let password = $("#password").val()
        let user = {
            email,
            password
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
                    text: data.success,
                    showConfirmButton: false,
                    position: 'bottom-right',
                    timer: 1000,
                    timerProgressBar: true

                });
                sessionStorage.setItem('userId', JSON.stringify(data.user.id))
                window.location.href = 'profile.html'
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    text: error.responseJSON.message,
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
        userId = sessionStorage.getItem('userId') ?? sessionStorage.getItem('userId')

        var data = $('#profileForm')[0];
        console.log(data);
        let formData = new FormData(data);
        formData.append('userId', userId)

        $.ajax({
            method: "POST",
            url: `${url}api/v1/update-profile`,
            data: formData,
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
        let email = $("#email").val()
        let user = {
            email,
        }
        $.ajax({
            method: "DELETE",
            url: `${url}api/v1/deactivate`,
            data: JSON.stringify(user),
            processData: false,
            contentType: 'application/json; charset=utf-8',
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
                sessionStorage.removeItem('userId')
                // window.location.href = 'home.html'
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    


}) 