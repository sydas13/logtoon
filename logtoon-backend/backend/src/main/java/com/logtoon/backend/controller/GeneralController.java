package com.logtoon.backend.controller;

import com.logtoon.backend.service.ImageService;
import com.logtoon.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/logtoon/general")
@RequiredArgsConstructor
public class GeneralController {

    private final ImageService imageService;

    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        return imageService.getProfileImage(filename);
    }
}
