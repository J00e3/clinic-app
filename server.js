const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'appointments.json');

app.use(express.json());

// Explicitly serve static files
app.use(express.static(__dirname));

// Explicit page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/book.html', (req, res) => res.sendFile(path.join(__dirname, 'book.html')));
app.get('/list.html', (req, res) => res.sendFile(path.join(__dirname, 'list.html')));
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));

// Read appointments
function getAppointments() {
  if (!fs.existsSync(FILE_PATH)) {
    const defaultData = [
      {
        id: 1,
        patientName: "Sarah Ahmed",
        phone: "07123456789",
        department: "General Medicine",
        date: "2026-11-20",
        hasPrescription: true,
        prescriptionDetails: "Paracetamol 500mg, twice daily",
        notes: "Routine checkup"
      },
      {
        id: 2,
        patientName: "Omar Khaled",
        phone: "07987654321",
        department: "Dental",
        date: "2026-11-22",
        hasPrescription: false,
        prescriptionDetails: "",
        notes: "Dental cleaning"
      }
    ];
    try { fs.writeFileSync(FILE_PATH, JSON.stringify(defaultData, null, 2)); } catch(e){}
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  } catch(e) {
    return [];
  }
}

function saveAppointments(data) {
  try { fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2)); } catch(e){}
}

// API Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/appointments', (req, res) => {
  res.json(getAppointments());
});

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

app.delete('/api/appointments/:id', (req, res) => {
  let list = getAppointments();
  list = list.filter(item => item.id !== parseInt(req.params.id));
  saveAppointments(list);
  res.json({ success: true });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = app;
