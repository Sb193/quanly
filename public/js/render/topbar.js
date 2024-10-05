fetch('layout/topbar.html')
      .then(response => response.text())
      .then(data => document.getElementById('topbarNav').innerHTML = data);