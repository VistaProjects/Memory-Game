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


const WebSocket = require('ws')
const port = 1000
const Server = new WebSocket.Server({port: port})


// game.addWin("picocode")

// game.getWins("testacc").then(result => {
// 	console.log("getWins", result)
// })
// game.getRank("Lulzsec").then(result => {
// 	console.log("getRank", result)
// })







var onlineUsers = new Set()

Server.on('connection', (ws, req) => {
	// console.log('Received connection')

	ws.on('close', function() {
		// console.log('User closed connection')
	});

	ws.on('message', function incoming(received_data) {
		var data = String(received_data)

		// var user = req.url.split("=")[1]
		// console.log(user)
		try {
			var json = JSON.parse(data)
	
			if (json.heartbeat == true) {
				onlineUsers.add(json.username)
			}
			else
			{
				console.log(json)
				// Check if we have a challenge request
				if (json.sender != null) {
					Server.clients.forEach(function each(client) {
						client.send(JSON.stringify(json));
					});
				}

				// Check if the receiver accpected the challenge
				if (json.newGame) {
					// Server.clients.forEach(function each(client) {
					// 	client.send(JSON.stringify({onlineUsers: array}));
					// });
					// console.log(json)
				}
			}
	
		} catch (e) {}
	})
})

// Heartbeat 
setInterval(() => {
	let array = Array.from(onlineUsers).sort()
	Server.clients.forEach(function each(client) {
		client.send(JSON.stringify({onlineUsers: array}));
	});
	onlineUsers.clear()
}, 1000)

// Format for mysql

// create table vraag
// (
//     id              int auto_increment,
//     naam            varchar(255) not null,
//     antwoord_a      varchar(255) null,
//     antwoord_b      varchar(255) not null,
//     antwoord_c      varchar(255) null,
//     antwoord_d      varchar(255) null,
//     juiste_antwoord varchar(255) not null,
//     constraint vraag_pk
//         primary key (id)
// );
// INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'vraag naam', 'antwoord a', 'antwoord b', 'antwoord c', 'antwoord d', 'antwoord hier');


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

app.get('/game/:id', (req, res) => {
	res.render('game.html')
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

fs.readdirSync('./routes').forEach(file => {
    app.use(`/${file}/`, require(`./routes/${file}/${file}.controller`));
});

console.log(`WebSocket Starting server on port ${port}`)
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('Server is connected to the database.'));