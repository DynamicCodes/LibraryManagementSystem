package org.example.librarymanagementsystem.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("LIBRARIAN")
public class Librarian extends User {
    private String employeeNumber;

    @Override
    public boolean canBorrowBooks() {
        return true; // Librarians have no borrowing restrictions
    }
}
