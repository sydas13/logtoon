package com.logtoon.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Long commentCount;
    @Column(nullable = false)
    private Long readCount;
    @Column(nullable = false)
    private Long watchlistCount;
    @Column(nullable = false)
    private Long heartCount;
    private String bio;
    private String avatarFileName;
    private String avatarHash;
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

        if (commentCount==null)
            commentCount=0L;

        if (readCount==null)
            readCount=0L;

        if (watchlistCount==null)
            watchlistCount=0L;

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
