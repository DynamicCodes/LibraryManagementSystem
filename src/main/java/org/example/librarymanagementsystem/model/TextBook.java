package org.example.librarymanagementsystem.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("TEXTBOOK")
public class TextBook extends Book {
    private String subject;
    private int edition;
}
