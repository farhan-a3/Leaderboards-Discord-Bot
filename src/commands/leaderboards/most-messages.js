const { SlashCommandBuilder } = require('discord.js');

async function getMessages() {

}

async function getUserMessageCount(interaction) {
    
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('most-active')
		.setDescription('Displays a leaderboard of the members with the most messages.'),
	async execute(interaction) {
        // maps userid to number of messages
		let messageData = {};

        // display embed with ranking
	},
};