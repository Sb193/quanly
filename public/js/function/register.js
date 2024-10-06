$(document).ready(function () {
    $('#registerForm').on('submit', function (e) {
      e.preventDefault(); // Ngăn chặn hành động mặc định của form (nạp lại trang)

      // Lấy giá trị từ form
      const formData = {
        username: $('#email').val(),
        password: $('#password').val(),
        name: $('#firstName').val()+" " +$('#lastName').val(),
        
        email: $('#email').val(),
        phone_number: $('#phoneNumber').val(),
        address: $('#address').val(),
        birthday: $('#birthday').val(),
        gender: $('#gender').val()
      };

      // Kiểm tra password và repeat password
      const repeatPassword = $('#repeatPassword').val();
      if (formData.password !== repeatPassword) {
        $('#message').html('<div class="alert alert-danger">Passwords do not match.</div>');
        return;
      }

      // Gửi AJAX request đến API
      $.ajax({
        url: 'https://quanly.hocsinhq.workers.dev/auth/register', // URL của API
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
          $('#message').html('<div class="alert alert-success">User registered successfully!</div>');
        },
        error: function (xhr) {
          let errorMessage = 'An error occurred. Please try again.';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
          }
          $('#message').html('<div class="alert alert-danger">' + errorMessage + '</div>');
        }
      });
    });
  });