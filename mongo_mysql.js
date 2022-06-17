require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs')
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => main())


var userSchema = new mongoose.Schema({
	naam: {type: String},
}, {collection: 'vragen'});
  
  
var User = mongoose.model('vragen',userSchema);

var SQL = `create table vraag
(
    id              int auto_increment,
    naam            varchar(255) not null,
    antwoord_a      varchar(255) null,
    antwoord_b      varchar(255) not null,
    antwoord_c      varchar(255) null,
    antwoord_d      varchar(255) null,
    juiste_antwoord varchar(255) not null,
    constraint vraag_pk
        primary key (id)
);\n`

function main() {
	User.find({}).then(vraag => {
		vraag.forEach(v => {
			var json = v.toJSON()
			SQL += `INSERT INTO \`vraag\` (\`id\`, \`naam\`, \`antwoord_a\`, \`antwoord_b\`, \`antwoord_c\`, \`antwoord_d\`, \`juiste_antwoord\`) VALUES ('', '${json.naam}', '${json.antwoord_a}', '${json.antwoord_b}', '${json.antwoord_c}', '${json.antwoord_d}', '${json.juiste_antwoord}');\n`
		})
		fs.writeFileSync('./database.sql', SQL)
		console.log('Saved vragen to database.sql')
	})
}