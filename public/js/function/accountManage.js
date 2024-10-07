$(document).ready(function() {
  let currentPage = 1;
  let searchQuery = '';

  // Hàm lấy token từ localStorage
  function getToken() {
      console.log(localStorage.getItem('token'));
      return localStorage.getItem('token');
  }

  // Hàm load dữ liệu
  function loadAccounts(page = 1, query = '') {
    const apiUrl = query ? `https://quanly.hocsinhq.workers.dev/admin/account/list?page=${page}&search=${query}` : `https://quanly.hocsinhq.workers.dev/admin/account/list?page=${page}`;

    $.ajax({
      url: apiUrl,
      type: 'GET',
      beforeSend: function(xhr) {
        const token = getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      },
      success: function(response) {
        const accounts = response.accounts;
        const totalPages = response.totalPages;
        const totalAccounts = response.total;
        const currentPage = response.currentPage;
        let tbodyHtml = '';

        accounts.forEach((account, index) => {
          let status = '';
          let actionButtons = '';

          // Trạng thái tài khoản
          switch (account.is_verified) {
            case 0:
              status = 'Chưa xác thực';
              actionButtons += `<button class="btn btn-success btn-sm" onclick="verifyAccount(${account.id})">Chấp nhận</button> `;
              break;
            case 1:
              status = 'Đang hoạt động';
              actionButtons += `<button class="btn btn-warning btn-sm" onclick="lockAccount(${account.id})">Khóa</button> `;
              break;
            case 2:
              status = 'Đã khóa';
              actionButtons += `<button class="btn btn-secondary btn-sm" onclick="unlockAccount(${account.id})">Mở khóa</button> `;
              break;
          }

          // Thêm nút Sửa, Xóa
          actionButtons += `<button class="btn btn-primary btn-sm" onclick="editAccount(${account.id})">Sửa</button> `;
          actionButtons += `<button class="btn btn-danger btn-sm" onclick="deleteAccount(${account.id})">Xóa</button>`;

          tbodyHtml += `
            <tr>
              <td>${index + 1 + (currentPage - 1) * 10}</td>
              <td>${account.username}</td>
              <td>${account.name}</td>
              <td>${account.email}</td>
              <td>${status}</td>
              <td>${actionButtons}</td>
            </tr>
          `;
        });

        $('#list_account').html(tbodyHtml);
        renderPagination(totalPages, currentPage);
      },
      error: function() {
          localStorage.setItem("status", "401");
      }
    });
  }

  // Hàm phân trang
  function renderPagination(totalPages, currentPage) {
    let paginationHtml = '<ul class="pagination justify-content-center">';

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      }
    } else {
      paginationHtml += `
        <li class="page-item ${1 === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="1">1</a>
        </li>
      `;

      if (currentPage > 4) {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }

      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        paginationHtml += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      }

      if (currentPage < totalPages - 3) {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }

      paginationHtml += `
        <li class="page-item ${totalPages === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
        </li>
      `;
    }

    paginationHtml += '</ul>';
    $('#pagination').html(paginationHtml);
  }

  

  // Bắt sự kiện click vào trang
  $(document).on('click', '.page-link', function(e) {
    e.preventDefault();
    currentPage = $(this).data('page');
    loadAccounts(currentPage, searchQuery);
  });

  // Gọi hàm load dữ liệu lần đầu tiên
  loadAccounts();

  window.searchAccount = function(){
      
          searchQuery = $("#search").val();
          loadAccounts(1, searchQuery); // Load lại trang đầu tiên với kết quả tìm kiếm
  };

  // Hàm tổng quát để xử lý các thay đổi trạng thái tài khoản
  window.updateAccountStatus = function(accountId, status) {
      $.ajax({
      url: `https://quanly.hocsinhq.workers.dev/admin/account/verify`,
      type: 'PUT',
      beforeSend: function(xhr) {
          const token = getToken();
          if (token) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
      },
      data: JSON.stringify({
          "accountId": accountId,
          "status": status
      }),
      contentType: 'application/json',
      success: function() {
          loadAccounts(currentPage, searchQuery);
      }
      });
  };
  
  // Hàm gọi cập nhật trạng thái
  window.verifyAccount = function(accountId) {
      updateAccountStatus(accountId, 1); // Xác thực tài khoản
  };
  
  window.lockAccount = function(accountId) {
      updateAccountStatus(accountId, 2); // Khóa tài khoản
  };
  
  window.unlockAccount = function(accountId) {
      updateAccountStatus(accountId, 1); // Mở khóa tài khoản
  };

  window.editAccount = function(accountId) {
    window.location.href = `/accountEdit/${accountId}`
  };

  window.deleteAccount = function(accountId) {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
      $.ajax({
        url: `https://quanly.hocsinhq.workers.dev/admin/account/delete`,
        type: 'DELETE',
        beforeSend: function(xhr) {
          const token = getToken();
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        },
        data: JSON.stringify({
          "accountId" : accountId
        }),
        success: function() {
          alert("Tài khoản đã được xóa khỏi hệ thống!")
          loadAccounts(currentPage, searchQuery);
        },
        error: function() {
          alert("Xóa tài khoản thất bại")
          localStorage.setItem("status", "401");
        }
      });
    }
  };
});
