package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_likes",
        uniqueConstraints = {
                @UniqueConstraint(name = "users_posts_comment_key",columnNames = {"user_id","post_id"})
        })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentLike {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_like_seq")
    @SequenceGenerator(name = "comment_like_seq",sequenceName = "comment_like_sequence",allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Comment comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
