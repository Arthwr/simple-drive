export class AppError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  constructor() {
    super('Resource not found', 404);
  }
}

