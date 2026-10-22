export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api/appointments`;

export const getAppointments = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createAppointment = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
};