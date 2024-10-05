fetch('layout/accordionSidebar.html')
      .then(response => response.text())
      .then(data => document.getElementById('accordionSidebar').innerHTML = data);