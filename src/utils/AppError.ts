class AppError extends Error {
  status: string;
  operational: boolean;
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.operational = true;
  }
}

export { AppError };
