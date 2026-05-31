import api from "./axios";

export const getPatientPrescription =
  async (appointmentId) => {

    const response = await api.get(
      `/prescriptions/patient/appointment/${appointmentId}`
    );

    return response.data;

  };

  export const getPatientStats =
  async () => {

    const response =
      await api.get(
        "/dashboard/patient"
      );

    return response.data;

  };