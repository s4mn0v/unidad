const API_BASE_URL = 'http://localhost:3000/api'; // Reemplaza esto con la URL base de tu API

export async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const createStudent = (studentData) => apiCall('estudiantes', 'POST', studentData);
export const getStudents = () => apiCall('estudiantes');
export const updateStudent = (id, studentData) => apiCall(`estudiantes/${id}`, 'PUT', studentData);
export const deleteStudent = (id) => apiCall(`estudiantes/${id}`, 'DELETE');

export const getPrograms = () => apiCall('programas');

export const createAgent = (agentData) => apiCall('agentes', 'POST', agentData);
export const getAgents = () => apiCall('agentes');
export const updateAgent = (id, agentData) => apiCall(`agentes/${id}`, 'PUT', agentData);
export const deleteAgent = (id) => apiCall(`agentes/${id}`, 'DELETE');

export const createInscription = (inscriptionData) => apiCall('inscripciones', 'POST', inscriptionData);
export const getInscriptions = () => apiCall('inscripciones');
export const updateInscription = (id, inscriptionData) => apiCall(`inscripciones/${id}`, 'PUT', inscriptionData);
export const deleteInscription = (id) => apiCall(`inscripciones/${id}`, 'DELETE');

export const createEstudiantesActivos = (estudiantesActivosData) => apiCall(`estudiantes-activos/${id}`, 'POST', estudiantesActivosData);
export const getEstudiantesActivos = () => apiCall('estudiantes-activos');
export const updateEstudiantesActivos = (id, updateEstudiantesActivos) => apiCall(`estudiantes-activos/${id}`, 'PUT', updateEstudiantesActivos);
export const deleteEstudiantesActivos = (id) => apiCall(`estudiantes-activos/${id}`, 'DELETE');

// Add this to your existing api.js file
export const createEstudiantesMoodle = (estudiantesMoodleData) => apiCall(`estudiantes-moodle/${id}`, 'POST', estudiantesMoodleData);
export const getEstudiantesMoodle = () => apiCall('estudiantes-moodle');
export const updateEstudiantesMoodle = (id, updateEstudiantesMoodle) => apiCall(`estudiantes-moodle/${id}`, 'PUT', updateEstudiantesMoodle);
export const deleteEstudiantesMoodle = (id) => apiCall(`estudiantes-moodle/${id}`, 'DELETE');