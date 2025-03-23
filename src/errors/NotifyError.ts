import { FlashMessages } from '../config/constants';

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
    super(FlashMessages.REGISTRATION_FAILED_EMAIL_TAKEN, 302);
  }
}

export class UnexpectedError extends NotifyError {
  constructor() {
    super(FlashMessages.UNEXPECTED_ERROR, 500);
  }
}
