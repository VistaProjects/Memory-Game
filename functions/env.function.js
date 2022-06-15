const fs = require('fs')
const os = require('os')

var env = class env{
		update(key, value) {
		// Update the key in memory too
		process.env[key] = value

		const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

		const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
			return line.match(new RegExp(key));
		}));
		ENV_VARS.splice(target, 1, `${key}=${value}`);

		// Update the .env file with new variable
		// console.log(ENV_VARS.join(os.EOL)) 
		fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
	}
};
module.exports = env