const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid')

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
  

app.use(express.static('public'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  
  // Get the notes from the data store
  app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reading notes' });
      } else {
        const notes = JSON.parse(data);
        res.json(notes);
      }
    });
  });
  
  // Save a new note to the data store
  app.post('/api/notes', (req, res) => {
    const newNote = {
      id: uuid.v4(),
      title: req.body.title,
      text: req.body.text
    };
  
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reading notes' });
      } else {
        const notes = JSON.parse(data);
        notes.push(newNote);
  
        fs.writeFile(
          path.join(__dirname, './db/db.json'),
          JSON.stringify(notes),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: 'Error writing notes' });
            } else {
              res.json(newNote);
            }
          }
        );
      }
    });
  });
  
  // Delete a note from the data store
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reading notes' });
      } else {
        const notes = JSON.parse(data);
        const newNotes = notes.filter((note) => note.id !== noteId);
  
        fs.writeFile(
          path.join(__dirname, './db/db.json'),
          JSON.stringify(newNotes),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: 'Error writing notes' });
            } else {
              res.json({ message: 'Note deleted' });
            }
          }
        );
      }
    });
  });
  
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });