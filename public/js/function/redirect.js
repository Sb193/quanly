function redirect(url){
    role = localStorage.getItem("status")
    if (role === null){
        window.location.href("/login");
    } else if (role == 404){
        window.location.href("/404")
    } else if (role == 403){
        window.location.href("/403")
    } else {
        window.location.href(url)
    }
}