package org.example.librarymanagementsystem.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("MEMBER")
public class Member extends User {
    private int borrowedBooksCount = 0;
    private static final int MAX_BORROW_LIMIT = 5;

    @Override
    public boolean canBorrowBooks() {
        return borrowedBooksCount < MAX_BORROW_LIMIT;
    }
}