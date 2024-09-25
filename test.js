// making the api call
document.addEventListener("DOMContentLoaded", function(){
fetchPatientData();
})
// credentials encoding
function getBasicAuthHeader() {
    const username = 'coalition';
    const password = 'skills-test';
    const encodedCredentials = btoa(`${username}:${password}`); 
    return `Basic ${encodedCredentials}`;
}
// function to fecth pt data
function fetchPatientData() {
    fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
        method: 'GET',
        headers: {
            'Authorization': getBasicAuthHeader()  
        }
    })
    .then(response => response.json())
    .then(data => {
        const patient = data.find(p => p.name === 'Jessica Taylor');
        if (patient) {
            updatePatientDetails(patient);     
            updateDiagnosisList(patient.diagnostic_list);
            updateLabResults(patient.lab_results);
            updateBloodPressureChart(patient.diagnosis_history);
        }
    })
    .catch(error => {
        console.error('Error fetching patient data:', error);
    });
}

// update patient section
function updatePatientDetails(patient) {
    const patientsSection = document.querySelector('.profile-section');

    patientsSection.innerHTML = `
        <h2>${patient.name}</h2>
        <img src="${patient.profile_picture}" alt="${patient.name}" class="patient-profile-pic">
        <p>Gender: ${patient.gender}</p>
        <p>Age: ${patient.age}</p>
        <p>Date of Birth: ${patient.date_of_birth}</p>
        <p>Phone: ${patient.phone_number}</p>
        <p>Emergency Contact: ${patient.emergency_contact}</p>
        <p>Insurance: ${patient.insurance_type}</p>
    `;
}

// fetch bp data and update chart
function fetchAndUpdateChart() {
    fetch('https://patient-data-api-url.com/blood-pressure')
        .then(response => response.json())
        .then(data => {
            updateDiagnosisChart(data);
        })
        .catch(error => {
            console.error('Error fetching blood pressure data:', error);
        });
}
// diagnosis function and update diagnosis section
function updateDiagnosisList(diagnosisList) {
    const diagnosisSection = document.querySelector('.diagnosis-section');

    let diagnosisHTML = "<h2>Diagnosis History</h2><ul>";
    diagnosisList.forEach(diagnosis => {
        diagnosisHTML += `<li>${diagnosis.name}: ${diagnosis.description} (${diagnosis.status})</li>`;
    });
    diagnosisHTML += "</ul>";

    diagnosisSection.innerHTML += diagnosisHTML;
}
// profile section update
function updateLabResults(labResults) {
    const profileSection = document.querySelector('.patients-section');

    let labResultsHTML = "<h2>Lab Results</h2><ul>";
    labResults.forEach(result => {
        labResultsHTML += `<li>${result}</li>`;
    });
    labResultsHTML += "</ul>";

    profileSection.innerHTML += labResultsHTML;
}
// updating diagnosis section with chart
function updateBloodPressureChart(diagnosisHistory) {
    const ctx = document.getElementById('bpChart').getContext('2d');

    const labels = diagnosisHistory.map(diagnosis => `${diagnosis.month} ${diagnosis.year}`);
    const systolicValues = diagnosisHistory.map(diagnosis => diagnosis.blood_pressure.systolic.value);
    const diastolicValues = diagnosisHistory.map(diagnosis => diagnosis.blood_pressure.diastolic.value);

    const bpChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Systolic',
                    data: systolicValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Diastolic',
                    data: diastolicValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
