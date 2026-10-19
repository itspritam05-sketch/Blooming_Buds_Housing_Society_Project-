import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send('App is running!!')
});

app.get('/students',(req,res) => {
    const students = [
        {
            id : 1,
            name : 'Shivam Kumar',
            branch : 'AIML'
        },
        {
            id : 2,
            name : 'Surenjit Kumar',
            branch : 'AIML'
        },
        {
            id : 3,
            name : 'Anand Ashish',
            branch : 'AIML'
        },
        {
            id : 4,
            name : 'Pritam Bhanase',
            branch : 'AIDS'
        },
        {
            id : 5,
            name : 'Shivraj Singh',
            branch : 'AIML'
        }
    ];
    res.send(students);
})

app.listen(PORT, () => {
    console.log(`Serve at http://localhost:${PORT}`)
});