const httpErrorMap: Record<string, number> = {
  successful: 200,
  created: 201,
  noContent: 204,
  notFound: 404,
  conflict: 409,
  invalidValue: 422,
  unauthorized: 401, // Corrigido de 'unauthorizad' para 'unauthorized'
  badRequest: 400,
};
type HttpStatusKey = keyof typeof httpErrorMap;

const mapStatusHTTP = (status: HttpStatusKey): number => httpErrorMap[status] || 500;

export default mapStatusHTTP;
