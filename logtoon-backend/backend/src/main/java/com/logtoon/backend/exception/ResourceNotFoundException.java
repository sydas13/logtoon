package com.logtoon.backend.exception;

import java.io.IOException;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }

    public ResourceNotFoundException(String message, IOException e) {
        super(message,e);
    }
}
