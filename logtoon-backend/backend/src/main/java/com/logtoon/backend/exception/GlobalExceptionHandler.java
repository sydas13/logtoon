package com.logtoon.backend.exception;

import com.logtoon.backend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleAlreadyExists(AlreadyExistsException ex, WebRequest request){

        ErrorResponse err= new ErrorResponse(LocalDateTime.now(), HttpStatus.CONFLICT.value(),ex.getMessage(), request.getDescription(false));

        return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
    }


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, WebRequest req){

        ErrorResponse err= new ErrorResponse(LocalDateTime.now(),HttpStatus.UNAUTHORIZED.value(),"Invalid username or password", req.getDescription(false));

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> maxUploadSizeExceeded(BadCredentialsException ex, WebRequest req){

        ErrorResponse err= ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.CONTENT_TOO_LARGE.value()).message("File upload failed: File exceeds the maximum permitted limit.").description(req.getDescription(false)).build();
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE).body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex){
        StringBuilder message = new StringBuilder();
        ex.getBindingResult().getAllErrors().forEach((objectError -> {
            String fieldName= ((FieldError) objectError).getField();
            String errorMessage= objectError.getDefaultMessage();
            message.append(fieldName).append(" : ").append(errorMessage).append("\n");
        }));
        ErrorResponse err= new ErrorResponse(LocalDateTime.now(),HttpStatus.BAD_REQUEST.value(), message.toString(),"");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request){

        ErrorResponse err=ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.NOT_FOUND.value()).message(ex.getMessage()).description(request.getDescription(false)).build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @ExceptionHandler(ImageStorageException.class)
    public ResponseEntity<ErrorResponse> handleImageStorage(ImageStorageException ex, WebRequest request){

        ErrorResponse err=ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.INTERNAL_SERVER_ERROR.value()).message(ex.getMessage()+" : "+ex.getCause()).description(request.getDescription(false)).build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }



    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, WebRequest req){

        ErrorResponse err=ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.INTERNAL_SERVER_ERROR.value()).message(ex.getMessage()).description(req.getDescription(false)).build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }

}


