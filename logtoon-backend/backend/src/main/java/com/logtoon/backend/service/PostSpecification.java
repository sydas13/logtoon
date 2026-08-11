package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.AdjectivesFilterRequest;
import com.logtoon.backend.entity.Post;
import jakarta.persistence.criteria.*;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PostSpecification {
    public static Specification<Post> columnFilter(List<AdjectivesFilterRequest> adjectivesFilterRequests, int minimumRating){
        return new Specification<Post>() {
            @Override
            public @Nullable Predicate toPredicate(@NonNull Root<Post> root,@NonNull CriteriaQuery<?> query,@NonNull CriteriaBuilder criteriaBuilder) {
                query.distinct(true);
                List<Predicate> predicates=new ArrayList<>();

                for(AdjectivesFilterRequest adjectivesFilterRequest:adjectivesFilterRequests){
                    List<Predicate> values=new ArrayList<>();
                    Join<Post, ?> join =
                            root.join(adjectivesFilterRequest.columnName());
                    for(String columnValue:adjectivesFilterRequest.columnValues()){
                        Predicate value=criteriaBuilder.equal(join.get("name"),columnValue);
                        values.add(value);
                    }
                    if(!values.isEmpty()) {
                        predicates.add(criteriaBuilder.or(values.toArray(new Predicate[0])));
                    }
                }

                Predicate ratingPredicate=criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), minimumRating);
                predicates.add(ratingPredicate);

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}
