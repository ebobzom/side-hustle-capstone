const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const allRoutes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 4000;

app.use(fileupload({ useTempFiles: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

allRoutes(app);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})