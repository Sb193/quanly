$(document).ready(function() {
    const token = 'Bearer your-token-here'; // Thay bằng token thật của bạn
    const accountId = new URLSearchParams(window.location.search).get('id'); // Lấy ID từ URL
    // Hàm lấy token từ localStorage
    function getToken() {
        console.log(localStorage.getItem('token'));
        return localStorage.getItem('token');
    }
    // Lấy dữ liệu từ API
    $.ajax({
        url: `http://127.0.0.1:8787/admin/account/${accountId}`,
        method: 'GET',
        beforeSend: function(xhr) {
            const token = getToken();
            if (token) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
          },
        success: function(response) {
            const account = response.account;
            $('#id').val(account.id);
            $('#username').val(account.username);
            $('#name').val(account.name);
            $('#email').val(account.email);
            $('#phone_number').val(account.phone_number);
            $('#address').val(account.address);
            $('#birthday').val(account.birthday);
            $('#gender').val(account.gender);
            $('#role').val(account.role);
            $('#is_verified').val(account.is_verified);
        }
    });

    // Hiển thị input password khi nhấn nút reset
    $('#resetPasswordBtn').click(function() {
        $('#password').toggleClass('d-none');
    });

    // Gửi dữ liệu chỉnh sửa qua API
    $('#editAccountForm').submit(function(e) {
        e.preventDefault();
        const accountData = {
            id: $('#id').val(),
            username: $('#username').val(),
            name: $('#name').val(),
            email: $('#email').val(),
            phone_number: $('#phone_number').val(),
            address: $('#address').val(),
            birthday: $('#birthday').val(),
            gender: $('#gender').val(),
            password: $('#password').val() ? $('#password').val() : '', // Nếu không nhập mật khẩu mới thì giữ nguyên
            role: $('#role').val()
        };

        $.ajax({
            url: 'http://127.0.0.1:8787/admin/account/edit',
            method: 'PUT',
            beforeSend: function(xhr) {
                const token = getToken();
                if (token) {
                  xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
              },
            data: JSON.stringify(accountData),
            success: function(response) {
                alert('Account updated successfully!');
            },
            error: function(error) {
                alert('Error updating account!');
            }
        });
    });
});