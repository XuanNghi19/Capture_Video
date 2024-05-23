package com.example.be;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;
import java.util.Date;

@Entity
@Table(name = "video")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "video")
    private byte[] data;

    @Column(name = "create_at")
    private Date createAt;

    @PrePersist
    protected void onCreate(){
        createAt = new Date();
    }
    public String getDataUrl() {
        return "data:video/mp4;base64," + Base64.getEncoder().encodeToString(data);
    }
}
