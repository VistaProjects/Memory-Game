const User = require('../routes/user/user.model');

const user = user => { return { username: user }}

// Delete cached global variable 
gameObject = {}

// Create global variable
gameObject = {
	game: [
		// {
		// 	id: abcdefghijklmnopqrstuvwxyz,
		// 	player1: 'name1',
		// 	player1: 'name2',
		// },
	]
}

class game {
	
	startMemoryGame(user1, user2, gameId) {
		// check if gameId already exists in the gameObject
		if (gameObject.game.find(game => game.id == gameId)) {
			return
		}

		gameObject.game.push({id: gameId, player1: user1, player2: user2})
		// console.log(`Starting memory game between ${user1} and ${user2}, gameid: ${gameId}`)
		console.log('GAME HAS BEEN STARTED:', gameObject)
	}

	addWin(username) {
		User.updateOne(user(username), { $inc: { wins: 1 } }).then()
		console.log(`Added win to ${username}`)
	}
	addLoss(username) {
		User.updateOne(user(username), { $inc: { loss: 1 } }).then()
		console.log(`Added loss to ${username}`)
	}
	getWins(username) {
		return User.findOne(user(username)).then(json => {
			return json.wins
		})
	}
	getLosses(username) {
		return User.findOne(user(username)).then(json => {
			return json.loss
		})
	}
	getWL(username) {
		return User.findOne(user(username)).then(json => {
			return json.wins - json.loss
		})
	}
	getRank(username) {
		return User.find({}).sort({wins: -1}).collation({ locale: "nl", numericOrdering: true }).limit().then(leaderboard=>{
			for (var i = 0; i < leaderboard.length; i++) {
				if (leaderboard[i].username == username) return i+1
			}
			return leaderboard.length
		})
	}
	getLeaderboard(amount) {
		return User.find({}).sort({wins: -1}).collation({ locale: "nl", numericOrdering: true }).limit(amount).then(leaderboard=>{
			return leaderboard
		})
	}

};
module.exports = game