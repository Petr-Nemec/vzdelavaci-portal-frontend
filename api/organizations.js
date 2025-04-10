// api/organizations.js - Integrace organizací
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Získání seznamu organizací
export const fetchOrganizations = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`${API_URL}/organizations?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

// Získání detailu organizace
export const fetchOrganization = async (organizationId) => {
  try {
    const response = await axios.get(`${API_URL}/organizations/${organizationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organization details:', error);
    throw error;
  }
};

// Získání akcí organizace
export const fetchOrganizationEvents = async (organizationId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`${API_URL}/organizations/${organizationId}/events?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organization events:', error);
    throw error;
  }
};

// Vytvoření nové organizace
export const createOrganization = async (organizationData) => {
  try {
    const response = await axios.post(`${API_URL}/organizations`, organizationData);
    return response.data;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

// Aktualizace organizace
export const updateOrganization = async (organizationId, organizationData) => {
  try {
    const response = await axios.put(`${API_URL}/organizations/${organizationId}`, organizationData);
    return response.data;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};
