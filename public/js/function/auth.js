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
            url: 'https://quanlyhocsinh.hocsinhq.workers.dev/login',  // URL xử lý đăng nhập trên server
            type: 'POST',
            data: {
                username: email,
                password: password,
                rememberMe: rememberMe
            },
            success: function(response) {
                // Xử lý phản hồi từ server
                if (response.success) {
                    alert('Đăng nhập thành công!');
                    localStorage.setItem("status") = "200";
                    redirect("/index");
                } else {
                    alert('Đăng nhập thất bại: ' + response.message);
                }
            },
            error: function() {
                alert('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
        });
    });
});