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
	console.log('Received connection')

	ws.on('close', function() {
		console.log('User closed connection')
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
				console.log(`Received data: ${data}`)
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