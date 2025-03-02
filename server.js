const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const dbFile = './db.json';

// Read users from db.json
function readUsers() {
    const data = fs.readFileSync(dbFile);
    return JSON.parse(data);
}

// Save users to db.json
function saveUsers(users) {
    fs.writeFileSync(dbFile, JSON.stringify(users, null, 2));
}

// Signup
app.post('/signup', (req, res) => {
    const users = readUsers();
    const newUser = req.body;

    if (users.some(user => user.username === newUser.username)) {
        res.status(400).json({ message: 'Username already exists' });
    } else {
        users.push(newUser);
        saveUsers(users);
        res.status(201).json({ message: 'User registered successfully' });
    }
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Update profile
app.put('/update', (req, res) => {
    const updatedUser = req.body;
    let users = readUsers();

    users = users.map(user => (user.username === updatedUser.username ? updatedUser : user));
    saveUsers(users);

    res.json({ message: 'Profile updated successfully' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
