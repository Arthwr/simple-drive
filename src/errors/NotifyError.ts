export class NotifyError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class UserExistsError extends NotifyError {
  constructor() {
    super('Email is unavaible or invalid', 409);
  }
}
