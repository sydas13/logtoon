package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="post_saves", uniqueConstraints = {
        @UniqueConstraint(name = "users_posts_save_key", columnNames = {"user_id","post_id"})
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostSave {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_save_seq")
    @SequenceGenerator(name = "post_save_seq", sequenceName = "post_save_sequence",allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
