const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  const data = req.body.data;

  const formattedDateTime = new Date()
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', '');

  const jsonData = { data, datetime: formattedDateTime }; // Include the formatted date and time

  fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error reading file');
      return;
    }

    let existingData = [];
    if (jsonString) {
      existingData = JSON.parse(jsonString);
    }

    existingData.push(jsonData);
    const updatedData = JSON.stringify(existingData, null, 2);

    fs.writeFile('data.json', updatedData, 'utf8', (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error writing file');
        return;
      }
      res.json(existingData);
    });
  });
});

app.get('/submit', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error reading file');
      return;
    }

    let data = [];
    if (jsonString) {
      data = JSON.parse(jsonString);
    }

    res.json(data);
  });
});

app.delete('/submit/:index', (req, res) => {
  const index = req.params.index;

  fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error reading file');
      return;
    }

    let data = [];
    if (jsonString) {
      data = JSON.parse(jsonString);
    }

    if (index >= 0 && index < data.length) {
      data.splice(index, 1);
      const updatedData = JSON.stringify(data, null, 2);

      fs.writeFile('data.json', updatedData, 'utf8', (err) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error writing file');
          return;
        }
        res.json(data);
      });
    } else {
      res.status(400).send('Invalid index');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
