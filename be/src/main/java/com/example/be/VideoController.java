package com.example.be;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/videos")
@RequiredArgsConstructor
public class VideoController {
    private final VideoRepository videoRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@RequestParam("video")MultipartFile file) {
        try {
            Video video = new Video();
            video.setData(file.getBytes());
            videoRepository.save(video);
            return ResponseEntity.ok().body("Upload success!, id: " + videoRepository.save(video).getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
