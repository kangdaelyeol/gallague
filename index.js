import express from 'express'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 8080

const app = express()

app.set('view engine', 'pug')
app.set('views', 'src/views')
app.use('/js', express.static(join(__dirname, 'src', 'js')))
app.use('/img', express.static(join(__dirname, 'src', 'img')))
app.get('/', (req, res) => res.render('index'))

app.listen(PORT, () => {
    console.log('ghffltlt', PORT)
})
