package org.example.librarymanagementsystem;

import org.example.librarymanagementsystem.model.Librarian;
import org.example.librarymanagementsystem.model.Member;
import org.example.librarymanagementsystem.model.NovelBook;
import org.example.librarymanagementsystem.model.TextBook;
import org.example.librarymanagementsystem.service.LibraryService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LibraryManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagementSystemApplication.class, args);
    }

    @Bean
    public CommandLineRunner initialData(LibraryService libraryService) {
        return args -> {
            // Create and save TextBooks
            TextBook textbook1 = new TextBook();
            textbook1.setIsbn("ISBN123");
            textbook1.setTitle("Mathematics 101");
            textbook1.setAuthor("John Doe");
            textbook1.setSubject("Mathematics");
            textbook1.setEdition(3);
            libraryService.addBook(textbook1);

            // Create and save NovelBooks
            NovelBook novel1 = new NovelBook();
            novel1.setIsbn("ISBN321");
            novel1.setTitle("The Great Adventure");
            novel1.setAuthor("Emily White");
            novel1.setGenre("Adventure");
            libraryService.addBook(novel1);

            // Create and save Users
            Member member1 = new Member();
            member1.setUserName("John Doe");
            member1.setContactInfo("John@gmail");
            libraryService.registerUser(member1);

            Librarian librarian1 = new Librarian();
            librarian1.setUserName("Bob");
            librarian1.setContactInfo("bob@gmail");
            librarian1.setEmployeeNumber("EMP002");
            libraryService.registerUser(librarian1);

            System.out.println("--- Database Initialized with Sample Data ---");
        };
    }

}
