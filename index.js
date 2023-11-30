import express from 'express'

const PORT = 8080

const app = express()

app.set('view engine', 'pug')
// app.set('views', 'views') -> default: views

app.get('/', (req, res) => res.render('index'))

app.listen(PORT, () => {
    console.log('ghffltlt', PORT)
})