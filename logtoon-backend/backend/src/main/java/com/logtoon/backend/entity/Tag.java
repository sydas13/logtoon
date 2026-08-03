package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tag_seq")
    @SequenceGenerator(
            name = "tag_seq",
            sequenceName = "tag-sequence",
            allocationSize = 1
    )
    private Long id;
    @Column(nullable = false,unique = true)
    private String name;
    @ManyToMany(mappedBy = "tags")
    private Set<Post> posts=new HashSet<>();
}
