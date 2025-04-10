// api/admin.js - Admin API funkce
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Získání seznamu čekajících organizací
export const fetchPendingOrganizations = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/pending-organizations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending organizations:', error);
    throw error;
  }
};

// Schválení organizace
export const approveOrganization = async (organizationId) => {
  try {
    const response = await axios.put(`${API_URL}/admin/organizations/${organizationId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving organization:', error);
    throw error;
  }
};

// Zamítnutí organizace
export const rejectOrganization = async (organizationId) => {
  try {
    const response = await axios.put(`${API_URL}/admin/organizations/${organizationId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting organization:', error);
    throw error;
  }
};

// Získání seznamu čekajících akcí
export const fetchPendingEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/pending-events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending events:', error);
    throw error;
  }
};

// Schválení akce
export const approveEvent = async (eventId) => {
  try {
    const response = await axios.put(`${API_URL}/admin/events/${eventId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving event:', error);
    throw error;
  }
};

// Zamítnutí akce
export const rejectEvent = async (eventId) => {
  try {
    const response = await axios.put(`${API_URL}/admin/events/${eventId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting event:', error);
    throw error;
  }
};

// Získání seznamu uživatelů
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Aktualizace role uživatele
export const updateUserRole = async (userId, role) => {
  try {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};
