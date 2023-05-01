import { Response } from 'express';

// Helper code for the API consumer to understand the error and handle is accordingly
enum Status {
  ERROR = "Error",
  SUCCESS = "Succes"
}


enum StatusCode {
  SUCCESS = 200,
  CREATION_SUCCESS = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  INVALID_DATA = 400,
}


type reponseType = {
   statusCode: StatusCode,
   status: Status,
   message: string,
   data : any  
}

abstract class ApiResponse {
  constructor(
    protected status: Status,
    protected statusCode: StatusCode,
    protected message: string,
    protected data : any = null 
  ) {}



  public send(res: Response): Response {
    const reponseObject : reponseType = {statusCode : this.statusCode , status : this.status  , message : this.message , data : null };
    if (this.data != null) {
      reponseObject.data = this.data  ;
    }
    return res.status(this.statusCode).json(reponseObject);
  }

 
}

export class AuthFailureResponse extends ApiResponse {
  constructor(message = 'Authentication Failure') {
    super(Status.ERROR, StatusCode.UNAUTHORIZED, message);
  }
}


export class InvalidDataResponse extends ApiResponse {
  constructor(message = 'Invalid Data') {
    super(Status.ERROR, StatusCode.INVALID_DATA, message);
  }
}


export class NotFoundResponse extends ApiResponse {
  constructor(message = 'Not Found') {
    super(Status.ERROR, StatusCode.NOT_FOUND, message);
  }

}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = 'Forbidden') {
    super(Status.ERROR, StatusCode.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = 'Bad Parameters') {
    super(Status.ERROR, StatusCode.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = 'Internal Error') {
    super(Status.ERROR, StatusCode.INTERNAL_ERROR, message);
  }
}

export class SuccessMsgResponse extends ApiResponse {
  constructor(message = "success") {
    super(Status.SUCCESS, StatusCode.SUCCESS, message);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(Status.ERROR, StatusCode.SUCCESS, message);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message = "success",data: any) {
    super(Status.SUCCESS, StatusCode.SUCCESS, message,data);
  }
}

export class SuccessCreationResponse extends ApiResponse {
  constructor(message = "success creation",data: any) {
    super(Status.SUCCESS, StatusCode.CREATION_SUCCESS, message,data);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  private instruction = 'refresh_token';

  constructor(message = 'Access token invalid') {
    super(
      Status.ERROR,
      StatusCode.UNAUTHORIZED,
      message,
    );
  }
}

export class TokenRefreshResponse extends ApiResponse {
  constructor(
    message: string,
    private accessToken: string,
    private refreshToken: string,
  ) {
    super(Status.SUCCESS, StatusCode.SUCCESS, message);
  }

}