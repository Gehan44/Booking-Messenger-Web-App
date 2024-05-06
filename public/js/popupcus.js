let popup1 = document.getElementById('popup1')
let popup2 = document.getElementById('popup2')

function openPopup1(){
  popup1.classList.add('open-popup')
}

function openPopup2(){
  popup2.classList.add('open-popup2')
}

function closePopup1(){
  popup1.classList.remove('open-popup')
}

function closePopup2(){
  popup2.classList.remove('open-popup2')
}