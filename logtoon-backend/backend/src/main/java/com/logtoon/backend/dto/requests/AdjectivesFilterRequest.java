package com.logtoon.backend.dto.requests;

import com.logtoon.backend.entity.PostAdjective;

import java.util.List;

public record AdjectivesFilterRequest(
         String columnName,
         List<String> columnValues
) {
}
