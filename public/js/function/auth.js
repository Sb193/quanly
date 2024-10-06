$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault(); // Ngăn không cho form tự động submit

        // Lấy dữ liệu từ form
        var email = $('#email').val();
        var password = $('#password').val();
        var rememberMe = $('#rememberMe').is(':checked') ? 1 : 0;

        // Kiểm tra dữ liệu có hợp lệ không (optional)
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        // Gửi dữ liệu lên server bằng AJAX
        $.ajax({
            url: 'https://quanlyhocsinh.hocsinhq.workers.dev/auth/login',  // URL xử lý đăng nhập trên server
            type: 'POST',
            data: JSON.stringify({
                username: email,
                password: password,
                rememberMe: rememberMe
            }),
            success: function(response) {
                // Xử lý phản hồi từ server
                if (response.status) {
                    alert('Đăng nhập thành công!');
                    // Đặt token và status vào localStorage
                    localStorage.setItem("token", response.token);  // Đúng cú pháp setItem
                    localStorage.setItem("username", response.username);  // Đúng cú pháp setItem
                    localStorage.setItem("status", "200");
                    window.location.href = "/index"
                } else {
                    alert('Đăng nhập thất bại: ' + response.message);
                    localStorage.setItem("status", "401");
                }
            },
            error: function() {
                alert('Không thể đăng nhập');
                localStorage.setItem("status", "401");
            }
        });
    });
});