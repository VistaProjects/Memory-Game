require('dotenv').config();

const fs = require("fs");
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('./routes/user/user.model');
const gameLibrary = require('./functions/game.function.js');
const game = new gameLibrary();

const { randomUUID } = require('crypto');


// Backup vragen database to database.sql
// require('./mongo_mysql')

const WebSocket = require('ws');
const { stringify } = require('querystring');
const port = 1337
const Server = new WebSocket.Server({port: port})


// game.addWin("picocode")

// game.getWins("testacc").then(result => {
// 	console.log("getWins", result)
// })
// game.getRank("Lulzsec").then(result => {
// 	console.log("getRank", result)
// })


const sendAll = message => {
	Server.clients.forEach(function each(client) {
		client.send(message);
	});
}




var onlineUsers = new Set()

Server.on('connection', (ws, req) => {
	// console.log('Received connection')

	ws.on('close', function() {
		// console.log('User closed connection')
	});

	ws.on('message', function incoming(received_data) {
		var data = String(received_data)

		try {
			var json = JSON.parse(data)
	
			if (json.heartbeat == true) {
				onlineUsers.add(json.username)
			}
			else
			{
				// Check if we have a challenge request
				if (json.sender != null) {
					sendAll(JSON.stringify(json))
				}
				
				if (json.game == 'win') {
					// console.log('json.game -> ', json)
					game.addWin(json.winner)
					game.addLoss(json.loser)

					sendAll(JSON.stringify({
						game: 'gg',
						winner: json.winner,
						loser: json.loser,
						gameId: json.gameId,
					}))
				}
				

				// Check if a button is pressed
				if (json.game != null) {
					// console.log('json.game -> ', json)
					sendAll(JSON.stringify(json))
				}
				
				//if (json.correct != null) {
				//	console.log(gameObject)
				//	
				//	
				//	gameObject.game.find(game => {
				//		if (game.id == json.gameid) {
				//			gameObject.game.correct.push(json.currentCells[0], json.currentCells[1])
				//		}
				//	})
				//	console.log(gameObject)
				//	// sendAll(JSON.stringify(json))
				//}

				

				// Check if the receiver accepted the challenge
				if (json.newGame != undefined) {
					var gameId = randomUUID()
					console.log('newGame', gameId)

					game.startMemoryGame(json.newGame[0], json.newGame[1], gameId)

					sendAll(JSON.stringify({gameId: gameId, players: json.newGame}))
				}
			}
	
		} catch (e) {}
	})
})

// Heartbeat 
setInterval(() => {
	let array = Array.from(onlineUsers).sort()

	sendAll(JSON.stringify({onlineUsers: array}))

	onlineUsers.clear()
}, 1000)

app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(require('./middleware/sanitize.middleware'))
app.use(cookieParser());

app.get('/', (req, res) => {
	try {
		const token = req.cookies[process.env.JWT_NAME];
		const username = jwt.verify(token, process.env.JWT_SECRET).username

		User.findOne({username}).then(json=>{
			res.redirect('/dashboard')
		})
		
	// If we dont have a JWT token/logged in sesssion
	} catch (e) { res.render('index.html') }
});

app.get('/register', (req, res) => {
    res.render('register.html');
});

app.get('/logout', (req, res) => {
	res.clearCookie(process.env.JWT_NAME)
    res.redirect('/')
});

app.get('/game/:id', require('./middleware/jwt.middleware'), (req, res) => {
	// console.log(gameObject)
	// check if the id matches to gameObject.gameId to our game

	const username = req.userData.username

	var found = false
	gameObject.game.find(game => {
		if (game.id == req.params.id) {
			res.render('game.html', {
				game: game,
				admin: false,
				username: username
			})
			found = true
		}
	})
	// If the game is not found, redirect to the dashboard
	if (!found) res.redirect('/dashboard')

});


app.get('/leaderboard', require('./middleware/jwt.middleware'), (req, res) => {
	const username = req.userData.username
	game.getLeaderboard().then(leaderboard=>{
		User.findOne({username}).then(json=>{

			if (json.group == 3) {
				res.render('banned.html',  { username: username });
				return
			}

			res.render('leaderboard.html',  {
				username: username,
				admin: json.group == 2,
				leaderboard: leaderboard
			});
		})
	})
});

app.get('/online', require('./middleware/jwt.middleware'), (req, res) => {
	const username = req.userData.username

	User.findOne({username}).then(json=>{

		if (json.group == 3) {
			res.render('banned.html',  { username: username });
			return
		}

		res.render('online.html',  {
			username: username,
			admin: json.group == 2
		});
	})
});


app.get('/dashboard', require('./middleware/jwt.middleware'), (req, res) => {
	const username = req.userData.username
	User.findOne({username}).then(json=>{

		if (json.group == 3) {
			res.render('banned.html',  { username: username });
			return
		}

		res.render('dashboard.html',  {
			username: username,
			admin: json.group == 2,
			invite_system: process.env.INVITE_ONLY
		});
	})
});

var userSchema = new mongoose.Schema({
    naam: {type: String},
}, {collection: 'vragen'});
  
  
var vragen = mongoose.model('vragen',userSchema);

app.get('/getquestion', (req, res) => {
	vragen.find({}).then(vraag => {
		let random = Math.floor(Math.random() * vraag.length)
		res.send(vraag[random])
	})
})

fs.readdirSync('./routes').forEach(file => {
    app.use(`/${file}/`, require(`./routes/${file}/${file}.controller`));
});

console.log(`WebSocket Starting server on port ${port}`)
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('Server is connected to the database.'));