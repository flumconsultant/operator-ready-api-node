const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/search', (req, res) => {
    const origin = req.query.origin || "Unknown";
    const destination = req.query.destination || "Unknown";
    const date = req.query.date || "Unknown";

    res.json({
        status: "success",
        data: {
            origin: origin,
            destination: destination,
            date: date,
            price: "$450"
        }
    });
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
