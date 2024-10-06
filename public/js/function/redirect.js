
const role = localStorage.getItem("status");  // Nên khai báo biến với const hoặc let
console.log(role);

if (role === null) {
    window.location.href = "/login";  // Gán giá trị cho href
} else if (role === "404") {
    window.location.href = "/404";  // Chú ý: role cần được so sánh với chuỗi "404"
} else if (role === "403") {
    window.location.href = "/403";  // Chú ý: role cần được so sánh với chuỗi "403"
}

else if (role === "401") {
    window.location.href = "/login";  // Chú ý: role cần được so sánh với chuỗi "403"
}

