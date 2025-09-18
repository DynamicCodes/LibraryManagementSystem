package org.example.librarymanagementsystem.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("NOVEL")
public class NovelBook extends Book {
    private String genre;
}
