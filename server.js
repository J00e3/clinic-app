const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'appointments.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Read appointments from file
function getAppointments() {
  if (!fs.existsSync(FILE_PATH)) {
    const defaultData = [
      {
        id: 1,
        patientName: "John Smith",
        phone: "07123456789",
        department: "General Medicine",
        date: "2026-11-20",
        hasPrescription: true,
        prescriptionDetails: "Paracetamol 500mg, twice daily",
        notes: "Routine health checkup."
      },
      {
        id: 2,
        patientName: "Emma Watson",
        phone: "07987654321",
        department: "Dental",
        date: "2026-11-22",
        hasPrescription: false,
        prescriptionDetails: "",
        notes: "Dental cleaning."
      }
    ];
    fs.writeFileSync(FILE_PATH, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

// Save appointments to file
function saveAppointments(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

// 1. Simulated Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    return res.json({ success: true, message: 'Login successful' });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// 2. Get all appointments
app.get('/api/appointments', (req, res) => {
  const list = getAppointments();
  res.json(list);
});

// 3. Add appointment
app.post('/api/appointments', (req, res) => {
  const list = getAppointments();
  const newItem = {
    id: Date.now(),
    patientName: req.body.patientName,
    phone: req.body.phone,
    department: req.body.department,
    date: req.body.date,
    hasPrescription: req.body.hasPrescription || false,
    prescriptionDetails: req.body.prescriptionDetails || '',
    notes: req.body.notes || ''
  };
  list.push(newItem);
  saveAppointments(list);
  res.status(201).json(newItem);
});

// 4. Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  let list = getAppointments();
  const idToDelete = parseInt(req.params.id);
  list = list.filter(item => item.id !== idToDelete);
  saveAppointments(list);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Clinic server running on http://localhost:${PORT}`);
});
