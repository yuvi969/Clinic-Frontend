import api from "./axios";

export const getQueue = async () => {

  const response = await api.get(
    "/appointments/queue/doctor"
  );

  return response.data;
};

export const callNextPatient = async () => {

  const response = await api.post(
    "/appointments/next"
  );

  return response.data;
};

export const completeAppointment = async (
  appointmentId
) => {

  const response = await api.put(
    `/appointments/${appointmentId}/status`,
    {
      status: "completed",
    }
  );

  return response.data;
};

export const getPrescriptionByAppointment = async (
  appointmentId
) => {
  const response = await api.get(
    `/prescriptions/appointment/${appointmentId}`
  );

  return response.data;
};

export const createPrescription = async (
  prescriptionData
) => {
  const response = await api.post(
    "/prescriptions",
    prescriptionData
  );

  return response.data;
};

export const updatePrescription = async (
  appointmentId,
  prescriptionData
) => {
  const response = await api.put(
    `/prescriptions/appointment/${appointmentId}`,
    prescriptionData
  );

  return response.data;
};

export const generateSlots = async (
  slotData
) => {
  const response = await api.post(
    "/slots/generate",
    slotData
  );

  return response.data;
};

export const getDoctorStats =
  async () => {

    const response =
      await api.get(
        "/dashboard/doctor"
      );

    return response.data;
};

