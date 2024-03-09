function dispsearchAndFill() {
  const dispName = document.getElementById('dispName').value;
  
  fetch('/form/disp/autofill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dispName: dispName })
  })
  .then(response => response.json())
  .then(data => {
    document.querySelector('input[name="dispTel"]').value = data.dispTel;
    document.querySelector('input[name="dispEmail"]').value = data.dispEmail;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}