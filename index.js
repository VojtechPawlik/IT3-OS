const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index.ejs');
})

/* Routa pro zobrazení výsledků ankety */
app.get("/results", (req, res) => {
    // Zde bude načtení dat ze souboru responses.json a jejich předání do šablony
    fs.readFile('responses.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Nastala chyba při čtení dat.');
      }
      const responses = JSON.parse(data);
      res.render('results', { responses }); // Předání dat-odpovědí šabloně results.ejs
    });
  });

/* Routa pro zpracování dat z formuláře */
app.post("/submit", (req, res) => {
  // Zde budeme ukládat data z formuláře do souboru responses.json
  let newResponse = {
    
    name: req.body.name,
    surname: req.body.surname,
    city: req.body.city,
    street: req.body.street,
    tel: req.body.tel,
    timestamp: new Date().toISOString(),
  };

  // Čtení stávajících dat z souboru
  fs.readFile("responses.json", (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    json.push(newResponse);

    // Zápis aktualizovaných dat zpět do souboru
    fs.writeFile("responses.json", JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log("Data byla úspěšně uložena.");
      res.redirect("/results"); // Přesměrování na stránku s výsledky
    });
  });
});

app.listen(3001);