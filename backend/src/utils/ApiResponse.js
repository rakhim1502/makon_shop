class ApiResponse {
  constructor(statusCode, data, message = 'Muvaffaqiyatli') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static ok(data = null, message = 'Muvaffaqiyatli') {
    return new ApiResponse(200, data, message);
  }

  static created(data = null, message = 'Muvaffaqiyatli yaratildi') {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = 'Muvaffaqiyatli ochirildi') {
    return new ApiResponse(204, null, message);
  }
}

export default ApiResponse;
