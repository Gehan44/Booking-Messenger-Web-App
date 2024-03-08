function searchAndFill() {
    const cusName = document.getElementById('cusName').value;
    
    const cusPlace = "New York";
    const cusTel = "911";
  
    document.querySelector('input[name="cusPlace"]').value = cusPlace;
    document.querySelector('input[name="cusTel"]').value = cusTel;
  }
  