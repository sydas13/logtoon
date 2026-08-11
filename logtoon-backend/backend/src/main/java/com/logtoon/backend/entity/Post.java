package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_seq")
    @SequenceGenerator(
            name = "post_seq",
            sequenceName = "post_sequence",
            allocationSize = 1
    )
    private Long id;
    @Column(nullable = false)
    private Integer rating;
    @Column(nullable = false)
    private BigDecimal moneySpent;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String review;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private String locationDetails;
    private List<String> imageFiles= new ArrayList<>();
    @ManyToOne
    @JoinColumn(name="profile_id")
    private UserProfile profile;
    @ManyToMany
    @JoinTable(name = "post_category",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories= new HashSet<>();
    @ManyToMany
    @JoinTable(name="post-cuisine",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "cuisine_id")
    )
    private  Set<Cuisine> cuisines=new HashSet<>();
    @ManyToMany
    @JoinTable(name="post-tag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private  Set<Tag> tags=new HashSet<>();

}
