function cussearchAndFill() {
  const cusName = document.getElementById('cusName').value;
  
  fetch('/form/cus/autofill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cusName: cusName })
  })
  .then(response => response.json())
  .then(data => {
    document.querySelector('input[name="cusPlace"]').value = data.cusPlace;
    document.querySelector('input[name="cusTel"]').value = data.cusTel;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}