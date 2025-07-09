// utils/errors.ts
export class NotFoundError extends Error {
  constructor(message = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Ação não autorizada") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
