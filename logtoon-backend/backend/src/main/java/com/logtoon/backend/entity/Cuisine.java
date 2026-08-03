package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="cuisines")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cuisine {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cuisine_seq")
    @SequenceGenerator(
            name = "cuisine_seq",
            sequenceName = "cuisine_sequence",
            allocationSize = 1
    )
    private Long id;
    @Column(nullable = false,unique = true)
    private String name;
    @ManyToMany(mappedBy = "cuisines")
    private Set<Post> posts=new HashSet<>();
}
