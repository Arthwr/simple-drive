export class NotifyError extends Error {
  public status: number;
  public redirectTo?: string;

  constructor(message: string, status: number, redirectTo?: string) {
    super(message);
    this.status = status;
    this.redirectTo = redirectTo;
  }
}

export class UserExistsError extends NotifyError {
  constructor() {
    super('Email is unavaible or invalid', 409);
  }
}

export class UnexpectedRegistrationError extends NotifyError {
  constructor() {
    super('Registration failed. Please try again later', 500);
  }
}
