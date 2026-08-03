package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="profiles")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profile_seq")
    @SequenceGenerator(
            name = "profile_seq",
            sequenceName = "profile_sequence",
            allocationSize = 1
    )
    private Long id;
    private String name;
    @Column(nullable = false)
    private Long followerCount;
    @Column(nullable = false)
    private Long followingCount;
    @Column(nullable = false)
    private Long placesVisited;
    @Column(nullable = false)
    private Long heartCount;
    @Column(nullable = false)
    private Badge badge;
    private String bio;
    private String avatarFileName;
    private String avatarHash;
    @OneToMany(mappedBy = "profile")
    private List<Post> posts= new ArrayList<>();
    @OneToOne(mappedBy = "profile")
    private AppUser appUser;

    @PrePersist
    public void prePersist(){
        if(name==null)
            name="";

        if (followerCount==null)
            followerCount=0L;

        if (followingCount==null)
            followingCount=0L;

        if (placesVisited ==null)
            placesVisited =0L;

        if (heartCount==null)
            heartCount=0L;

        if(bio==null)
            bio="";

        if(avatarFileName ==null)
            avatarFileName ="";

        if(avatarHash ==null)
            avatarHash ="";
    }

}
