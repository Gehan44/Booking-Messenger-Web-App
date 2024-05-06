//Customers
async function cusSearch() {
    const nameCus = document.getElementById('nameCus').value;
    const placeCus = document.getElementById('placeCus').value;
    const telCus = document.getElementById('telCus').value;

    try {
        const response = await fetch('/sForm/cus/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nameCus: nameCus, placeCus: placeCus, telCus: telCus })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const searchResults = document.getElementById('searchCusResults');
        searchResults.innerHTML = '';
        data.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="cus-id" style="display: none;">${result.cusID}</td>
                <td>${result.cusName}</td>
                <td>${result.cusPlace}</td>
                <td>${result.cusTel}</td>
                <td>
                    <button class="btn btn-success tick-btn" onclick="cusData('${result.cusName}', '${result.cusPlace}', '${result.cusTel}')">✓</button>
                    <button class="btn btn-danger cross-btn" onclick="cusDelete('${result.cusID}')">✗</button>
                </td>
            `;
            searchResults.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cusAdd() {
    const nameCus = document.getElementById('nameCus').value;
    const placeCus = document.getElementById('placeCus').value;
    const telCus = document.getElementById('telCus').value;
    try {
        const response = await fetch('/sForm/cus/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nameCus: nameCus,placeCus: placeCus,telCus: telCus})
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await cusSearch();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cusDelete(cusID) {
    try {
        const response = await fetch('/sForm/cus/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cusID: cusID })
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        await cusSearch();
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
async function cusData(cusName, cusPlace, cusTel) {
    document.querySelector('input[name="cusName"]').value = cusName;
    document.querySelector('input[name="cusPlace"]').value = cusPlace;
    document.querySelector('input[name="cusTel"]').value = cusTel;
}



//Dispatcher
async function dispSearch() {
    const nameDisp = document.getElementById('nameDisp').value;
    const emailDisp = document.getElementById('emailDisp').value;
    const telDisp = document.getElementById('telDisp').value;


    try {
        const response = await fetch('/sForm/disp/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nameDisp: nameDisp, emailDisp: emailDisp, telDisp: telDisp })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const searchResults = document.getElementById('searchDispResults');
        searchResults.innerHTML = '';
        data.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="cus-id" style="display: none;">${result.dispID}</td>
                <td>${result.dispName}</td>
                <td>${result.dispEmail}</td>
                <td>${result.dispTel}</td>
                <td>
                    <button class="btn btn-success tick-btn" onclick="dispData('${result.dispName}', '${result.dispEmail}', '${result.dispTel}')">✓</button>
                    <button class="btn btn-danger cross-btn" onclick="dispDelete('${result.dispID}')">✗</button>
                </td>
            `;
            searchResults.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

async function dispAdd() {
    const nameDisp = document.getElementById('nameDisp').value;
    const emailDisp = document.getElementById('emailDisp').value;
    const telDisp = document.getElementById('telDisp').value;
    try {
        const response = await fetch('/sForm/disp/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nameDisp: nameDisp, emailDisp: emailDisp, telDisp: telDisp })
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await dispSearch();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function dispDelete(dispID) {
    try {
        const response = await fetch('/sForm/disp/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dispID: dispID })
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        await dispSearch();
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
async function dispData(dispName, dispEmail, dispTel) {
    document.querySelector('input[name="dispName"]').value = dispName;
    document.querySelector('input[name="dispEmail"]').value = dispEmail;
    document.querySelector('input[name="dispTel"]').value = dispTel;
}
