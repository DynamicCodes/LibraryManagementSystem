package org.example.librarymanagementsystem.controller;

import org.example.librarymanagementsystem.model.*;
import org.example.librarymanagementsystem.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    // --- Book Endpoints ---
    @PostMapping("/books/novel")
    public ResponseEntity<Book> addNovelBook(@RequestBody NovelBook novelBook) {
        return ResponseEntity.ok(libraryService.addBook(novelBook));
    }

    @PostMapping("/books/textbook")
    public ResponseEntity<Book> addTextBook(@RequestBody TextBook textBook) {
        return ResponseEntity.ok(libraryService.addBook(textBook));
    }

    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(libraryService.getAllBooks());
    }

    @GetMapping("/books/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String criteria) {
        return ResponseEntity.ok(libraryService.searchBooks(criteria));
    }

    // --- User Endpoints ---
    @PostMapping("/users/member")
    public ResponseEntity<User> registerMember(@RequestBody Member member) {
        return ResponseEntity.ok(libraryService.registerUser(member));
    }

    @PostMapping("/users/librarian")
    public ResponseEntity<User> registerLibrarian(@RequestBody Librarian librarian) {
        return ResponseEntity.ok(libraryService.registerUser(librarian));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(libraryService.getAllUsers());
    }

    // --- Lending Endpoints ---
    @PutMapping("/books/{bookId}/lend/{userId}")
    public ResponseEntity<String> lendBook(@PathVariable Long bookId, @PathVariable Long userId) {
        boolean success = libraryService.lendBook(bookId, userId);
        if (success) {
            return ResponseEntity.ok("Book lent successfully.");
        }
        return ResponseEntity.badRequest().body("Could not lend book. Either it's unavailable or user has reached their limit.");
    }

    @PutMapping("/books/{bookId}/return/{userId}")
    public ResponseEntity<String> returnBook(@PathVariable Long bookId, @PathVariable Long userId) {
        libraryService.returnBook(bookId, userId);
        return ResponseEntity.ok("Book returned successfully.");
    }
}
