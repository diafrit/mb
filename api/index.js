import express from 'express'
import path from 'node:path'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

const __dirname = process.cwd()

app.get('/registration', (req, res) => {
	app.use(express.static(path.join(__dirname, 'dist')))
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

app.post('/registration', (req, res) => {
	const user = req.body

	if (user.name && user.email && user.document && user.password && user.phone && user.password) res.send({ message: 'Usuário cadastrado com sucesso!' })
	else res.json({ message: 'Erro ao cadastrar usuário' })
})

const port = 3000
app.listen(port)
console.log(`Server started at http://localhost:${port}/registration`)
