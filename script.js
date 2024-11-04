document.getElementById('strainForm').addEventListener('submit', async function(event) { 
    event.preventDefault();

    const strainNumber = document.getElementById('strainNumber').value;
    const storageLocation = document.getElementById('storageLocation').value;
    const preserver = document.getElementById('preserver').value;
    const date = document.getElementById('date').value;
    const massResult = document.getElementById('massResult').value;

    const response = await fetch('https://re0-3.onrender.com/strains', { // 使用完整的后端 URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ strainNumber, storageLocation, preserver, date, massResult })
    });

    if (response.ok) {
        alert('菌株信息已提交！');
        document.getElementById('strainForm').reset();
    } else {
        alert('提交失败，请重试。');
    }
});

document.getElementById('searchButton').addEventListener('click', async function() {
    const searchTerm = document.getElementById('searchTerm').value;

    const response = await fetch(`https://re0-3.onrender.com/strains?search=${searchTerm}`); // 使用完整的后端 URL
    const results = await response.json();
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    results.forEach(strain => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${strain.strain_number}</td>
            <td>${strain.storage_location}</td>
            <td>${strain.preserver}</td>
            <td>${strain.date}</td>
            <td>${strain.mass_spectrometry_result}</td>
        `;
        resultsBody.appendChild(row);
    });
});

