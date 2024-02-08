let clientsData = [];
let clientsRequests = [];
let clientsChart;

function addClient() {
    if (!validateInputs()) {
        alert('Please fill in all required fields.');
        return;
    }

    const client = {
        clientName: document.getElementById('clientName').value,
        websiteUrl: document.getElementById('websiteUrl').value,
        contactPerson: document.getElementById('contactPerson').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactNumber: document.getElementById('contactNumber').value,
        requestType: document.getElementById('requestType').value
    };

    clientsData.push(client);

    updateTable();
    updateChart();
    clearInputs();
}

function addClientWithMissingData() {
    const client = {
        clientName: document.getElementById('clientName').value || 'N/A',
        websiteUrl: document.getElementById('websiteUrl').value || 'N/A',
        contactPerson: document.getElementById('contactPerson').value || 'N/A',
        contactEmail: document.getElementById('contactEmail').value || 'N/A',
        contactNumber: document.getElementById('contactNumber').value || 'N/A',
        requestType: document.getElementById('requestType').value || 'N/A'
    };

    clientsData.push(client);

    updateTable();
    updateChart();
    clearInputs();
}

function removeClient(row) {
    const index = row.parentNode.parentNode.rowIndex - 1;
    clientsData.splice(index, 1);
    updateTable();
    updateChart();
}

function editClient(cell) {
    // Make the cell editable
    const oldValue = cell.textContent;
    cell.innerHTML = `<input type="text" class="edit-input" value="${oldValue}">`;
    const input = cell.querySelector('.edit-input');
    input.focus();
    input.addEventListener('blur', () => {
        const newValue = input.value;
        cell.textContent = newValue;
        updateClientData(cell.parentNode);
    });
}

function updateClientData(row) {
    const index = row.rowIndex - 1;
    const cells = row.cells;
    clientsData[index].clientName = cells[0].textContent;
    clientsData[index].websiteUrl = cells[1].textContent;
    clientsData[index].contactPerson = cells[2].textContent;
    clientsData[index].contactEmail = cells[3].textContent;
    clientsData[index].contactNumber = cells[4].textContent;
    clientsData[index].requestType = cells[5].textContent;
    updateChart();
}

function updateTable() {
    const tableBody = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows
    clientsData.forEach((client, index) => {
        let row = tableBody.insertRow();
        Object.keys(client).forEach((key, i) => {
            let cell = row.insertCell(i);
            cell.textContent = client[key];
            cell.addEventListener('click', () => editClient(cell)); // Make cell editable on click
        });
        let cell = row.insertCell();
        cell.innerHTML = `<button onclick="removeClient(this)">REMOVE</button>`;
    });
}

function exportToCSV() {
    const csv = Papa.unparse({ data: clientsData, fields: Object.keys(clientsData[0]) });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    if (link.download !== undefined) { 
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "clients.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function clearInputs() {
    document.getElementById('clientName').value = '';
    document.getElementById('websiteUrl').value = '';
    document.getElementById('contactPerson').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactNumber').value = '';
}

function validateInputs() {
    const requiredFields = ['clientName', 'websiteUrl', 'contactPerson', 'contactEmail', 'contactNumber'];
    return requiredFields.every(field => document.getElementById(field).value.trim() !== '');
}

function updateChart() {
    if (!clientsChart) {
        let ctx = document.getElementById('clientsChart').getContext('2d');
        clientsChart = new Chart(ctx, {
            type: 'bar', // Changed to bar chart
            data: {
                labels: clientsData.map(client => client.clientName),
                datasets: [{
                    label: 'Client Requests',
                    data: clientsData.map(client => 1),
                    backgroundColor: [
                        '#007bff', // Light Blue
                        '#ffc107', // Yellow
                        '#28a745', // Green
                        '#dc3545'  // Red
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        clientsChart.data.labels = clientsData.map(client => client.clientName);
        clientsChart.data.datasets[0].data = clientsData.map(client => 1);
        clientsChart.update();
    }
}

function addClientRequests() {
    const clientNameRequests = document.getElementById('clientNameRequests').value;
    const websiteUrlRequests = document.getElementById('websiteUrlRequests').value;
    const clientRequests = document.getElementById('clientRequests').value;

    if (!clientNameRequests || !websiteUrlRequests || !clientRequests) {
        alert('Please fill in all fields in the CLIENT NEEDS & REQUESTS section.');
        return;
    }

    const clientRequest = {
        clientNameRequests,
        websiteUrlRequests,
        clientRequests
    };

    clientsRequests.push(clientRequest);

    updateRequestsTable();
    clearRequestInputs();
}

function updateRequestsTable() {
    const tableBody = document.getElementById('requestsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows
    clientsRequests.forEach((request, index) => {
        let row = tableBody.insertRow();
        Object.keys(request).forEach((key, i) => {
            let cell = row.insertCell(i);
            cell.textContent = request[key];
        });
    });
}

function clearRequestInputs() {
    document.getElementById('clientNameRequests').value = '';
    document.getElementById('websiteUrlRequests').value = '';
    document.getElementById('clientRequests').value = '';
}