const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// In-memory shared appointments storage (shared live across all devices)
let sharedAppointments = [
  {
    id: 1700000001,
    patientName: "Sarah Ahmed",
    phone: "01012345678",
    department: "General Medicine",
    date: "2026-11-20",
    time: "10:30",
    hasChronic: true,
    chronicCondition: "Diabetes (السكري)",
    hasPrescription: true,
    prescriptionDetails: "Metformin 500mg, twice daily",
    prescriptionImage: "",
    notes: "Follow-up consultation."
  }
];

// Explicit page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/book.html', (req, res) => res.sendFile(path.join(__dirname, 'book.html')));
app.get('/list.html', (req, res) => res.sendFile(path.join(__dirname, 'list.html')));
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/report.html', (req, res) => res.sendFile(path.join(__dirname, 'report.html')));

// API: Get all appointments (Accessible from PC, Phone, etc.)
app.get('/api/appointments', (req, res) => {
  res.json(sharedAppointments);
});

// API: Add appointment
app.post('/api/appointments', (req, res) => {
  const newItem = {
    id: req.body.id || Date.now(),
    patientName: req.body.patientName,
    phone: req.body.phone,
    department: req.body.department,
    date: req.body.date,
    time: req.body.time || '10:00',
    hasChronic: req.body.hasChronic || false,
    chronicCondition: req.body.chronicCondition || 'None',
    hasPrescription: req.body.hasPrescription || false,
    prescriptionDetails: req.body.prescriptionDetails || '',
    prescriptionImage: req.body.prescriptionImage || '',
    notes: req.body.notes || ''
  };
  sharedAppointments.unshift(newItem);
  res.status(201).json(newItem);
});

// API: Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const targetId = parseInt(req.params.id);
  sharedAppointments = sharedAppointments.filter(item => item.id !== targetId);
  res.json({ success: true });
});

// API: Login check
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
}

module.exports = app;
