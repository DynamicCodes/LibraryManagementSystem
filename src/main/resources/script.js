document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8080/api';

    const bookList = document.getElementById('bookList');
    const userList = document.getElementById('userList');
    const searchBar = document.getElementById('searchBar');

    const addBookForm = document.getElementById('addBookForm');
    const bookTypeSelect = document.getElementById('bookType');
    const novelFields = document.getElementById('novelFields');
    const textbookFields = document.getElementById('textbookFields');
    
    const addUserForm = document.getElementById('addUserForm');
    const userTypeSelect = document.getElementById('userType');
    const librarianFields = document.getElementById('librarianFields');

    // Fetch and display initial data
    const loadInitialData = async () => {
        await fetchAndDisplayBooks();
        await fetchAndDisplayUsers();
    };

    // --- Book Functions ---
    const fetchAndDisplayBooks = async (searchTerm = '') => {
        try {
            const url = searchTerm 
                ? `${API_BASE_URL}/books/search?criteria=${encodeURIComponent(searchTerm)}` 
                : `${API_BASE_URL}/books`;
            const response = await fetch(url);
            const books = await response.json();
            
            bookList.innerHTML = '';
            const users = await fetch(`${API_BASE_URL}/users`).then(res => res.json());

            books.forEach(book => {
                const card = document.createElement('div');
                card.className = `card ${!book.available ? 'unavailable' : ''}`;
                
                const bookType = book.hasOwnProperty('genre') ? 'Novel' : 'Textbook';
                
                let details = `<p><strong>Author:</strong> ${book.author}</p><p><strong>ISBN:</strong> ${book.isbn}</p>`;
                if (bookType === 'Novel') {
                    details += `<p><strong>Genre:</strong> ${book.genre}</p>`;
                } else {
                    details += `<p><strong>Subject:</strong> ${book.subject}</p><p><strong>Edition:</strong> ${book.edition}</p>`;
                }

                const userOptions = users.map(u => `<option value="${u.id}">${u.userName} (ID: ${u.id})</option>`).join('');

                card.innerHTML = `
                    <h3>${book.title} (${bookType})</h3>
                    ${details}
                    <p><strong>Status:</strong> ${book.available ? 'Available' : 'On Loan'}</p>
                    <div class="lend-return-buttons">
                        ${book.available 
                            ? `<button class="lend-btn" data-book-id="${book.id}">Lend</button>` 
                            : `<button class="return-btn" data-book-id="${book.id}">Return</button>`
                        }
                    </div>
                    <select class="user-select" style="display:none;">${userOptions}</select>
                `;
                bookList.appendChild(card);
            });
        } catch (error) {
            console.error('Failed to fetch books:', error);
            bookList.innerHTML = '<p>Error loading books. Is the backend running?</p>';
        }
    };
    
    // --- User Functions ---
    const fetchAndDisplayUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const users = await response.json();
            
            userList.innerHTML = '';
            users.forEach(user => {
                const card = document.createElement('div');
                card.className = 'card';
                
                const userType = user.hasOwnProperty('employeeNumber') ? 'Librarian' : 'Member';
                let details = `<p><strong>Contact:</strong> ${user.contactInfo}</p>`;
                if (userType === 'Librarian') {
                    details += `<p><strong>Employee #:</strong> ${user.employeeNumber}</p>`;
                } else {
                    details += `<p><strong>Borrowed:</strong> ${user.borrowedBooksCount}</p>`;
                }

                card.innerHTML = `
                    <h3>${user.userName} (ID: ${user.id})</h3>
                    <p><strong>Type:</strong> ${userType}</p>
                    ${details}
                `;
                userList.appendChild(card);
            });
        } catch (error) {
            console.error('Failed to fetch users:', error);
            userList.innerHTML = '<p>Error loading users.</p>';
        }
    };

    // --- Event Listeners ---
    bookTypeSelect.addEventListener('change', () => {
        novelFields.style.display = bookTypeSelect.value === 'NOVEL' ? 'block' : 'none';
        textbookFields.style.display = bookTypeSelect.value === 'TEXTBOOK' ? 'block' : 'none';
    });

    userTypeSelect.addEventListener('change', () => {
        librarianFields.style.display = userTypeSelect.value === 'LIBRARIAN' ? 'block' : 'none';
    });

    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = bookTypeSelect.value;
        const endpoint = type === 'NOVEL' ? '/books/novel' : '/books/textbook';
        
        const bookData = {
            isbn: document.getElementById('isbn').value,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
        };

        if (type === 'NOVEL') {
            bookData.genre = document.getElementById('genre').value;
        } else {
            bookData.subject = document.getElementById('subject').value;
            bookData.edition = document.getElementById('edition').value;
        }

        try {
            await fetch(API_BASE_URL + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            addBookForm.reset();
            loadInitialData();
        } catch (error) {
            console.error('Failed to add book:', error);
        }
    });
    
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = userTypeSelect.value;
        const endpoint = type === 'MEMBER' ? '/users/member' : '/users/librarian';
        
        const userData = {
            userName: document.getElementById('userName').value,
            contactInfo: document.getElementById('contactInfo').value
        };

        if (type === 'LIBRARIAN') {
            userData.employeeNumber = document.getElementById('employeeNumber').value;
        }

        try {
            await fetch(API_BASE_URL + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            addUserForm.reset();
            loadInitialData();
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    });

    searchBar.addEventListener('input', () => fetchAndDisplayBooks(searchBar.value));
    
    bookList.addEventListener('click', async (e) => {
        const bookId = e.target.dataset.bookId;
        if (!bookId) return;

        const card = e.target.closest('.card');
        const userSelect = card.querySelector('.user-select');

        if (e.target.classList.contains('lend-btn')) {
            if (userSelect.style.display === 'none') {
                userSelect.style.display = 'block';
                e.target.textContent = 'Confirm Lend';
            } else {
                const userId = userSelect.value;
                if (!userId) {
                    alert('Please select a user.');
                    return;
                }
                try {
                    await fetch(`${API_BASE_URL}/books/${bookId}/lend/${userId}`, { method: 'PUT' });
                    loadInitialData();
                } catch (error) {
                    console.error('Failed to lend book:', error);
                }
            }
        } else if (e.target.classList.contains('return-btn')) {
             if (userSelect.style.display === 'none') {
                userSelect.style.display = 'block';
                e.target.textContent = 'Confirm Return';
            } else {
                const userId = userSelect.value;
                if (!userId) {
                    alert('Please select a user who returned the book.');
                    return;
                }
                try {
                    await fetch(`${API_BASE_URL}/books/${bookId}/return/${userId}`, { method: 'PUT' });
                    loadInitialData();
                } catch (error) {
                    console.error('Failed to return book:', error);
                }
            }
        }
    });
    
    // Initial load
    loadInitialData();
});
