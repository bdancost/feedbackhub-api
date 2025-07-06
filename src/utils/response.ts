export const successResponse = (res: any, data: any, message = "Sucesso") => {
  return res.status(200).json({ success: true, message, data });
};

export const errorResponse = (
  res: any,
  status: number,
  message: string,
  details?: any
) => {
  return res.status(status).json({ success: false, message, details });
};
