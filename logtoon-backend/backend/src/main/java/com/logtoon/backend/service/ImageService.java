package com.logtoon.backend.service;

import com.logtoon.backend.exception.ImageStorageException;
import com.logtoon.backend.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;

@Repository
@Slf4j
public class ImageService {

    @Value("${default.image.file}")
    private String DEFAULT_IMAGE_FILE;
    @Value("${image.upload.dir}")
    private String uploadDir;
    public String saveImage(MultipartFile image) {

        String contentType=image.getContentType();

        if(contentType==null || !contentType.equals("image/jpeg") && !contentType.equals("image/png"))
            throw new ImageStorageException("Only JPEG or PNG images are allowed");

        String extension= contentType.equals("image/png")?".png":".jpg";

        try {
            String fileName = UUID.randomUUID() + extension;
            Path path = Paths.get(uploadDir, fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, image.getBytes());

            return fileName;
        }catch (IOException e){
            throw new ImageStorageException("Image couldn't be saved",e);
        }

    }

    public ResponseEntity<Resource> getProfileImage(String filename)  {
            Path path = Paths.get(uploadDir, filename);
            Resource resource = new FileSystemResource(path);
            if (!resource.exists() || !resource.isReadable()) {
                System.out.println(path);
                throw new ResourceNotFoundException("image not found: " + filename);
            }

            try{
                String contentType = Files.probeContentType(path);

                MediaType mediaType = (contentType != null)
                        ? MediaType.parseMediaType(contentType)
                        : MediaType.APPLICATION_OCTET_STREAM;

                return ResponseEntity.ok().contentType(mediaType).body(resource);
        }catch (IOException e){
            throw new ResourceNotFoundException("Failed to retrieve image: "+filename,e);
        }
    }

    public void deleteImage(String filename)  {
        if(filename.isBlank() || filename.equals(DEFAULT_IMAGE_FILE))
            return;

        try {
            Path path = Paths.get(uploadDir, filename);
            Files.deleteIfExists(path);
        }catch (IOException e){
            log.warn("Failed to delete: {}", filename, e);
        }
    }

    public String generateImageHash(MultipartFile image) {
        try {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(image.getBytes());
        return HexFormat.of().formatHex(hash);
        }catch (NoSuchAlgorithmException | IOException e){
            throw new ImageStorageException("Image couldn't be hashed",e);
        }
    }


}
