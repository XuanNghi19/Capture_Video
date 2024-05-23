package com.example.be;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/views")
@RequiredArgsConstructor
public class VideoFrm {
    private final VideoRepository videoRepository;
    @GetMapping("")
    public String getAllVideo(Model model) {
        List<Video> videoList = videoRepository.findAllByOrderByCreateAtDesc();
        model.addAttribute("videos", videoList);
        return "index";
    }
}
