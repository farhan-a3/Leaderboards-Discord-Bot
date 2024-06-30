const { SlashCommandBuilder } = require('discord.js');

async function getMessages(channel) {
    let messages = [];

    // first message pointer
    let message = await channel.messages
        .fetch({ limit: 1 })
        .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
    messages.push(message);

    while (message) {
        await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                // add each message in page to array
                messagePage.forEach(msg => messages.push(msg));

                // update first message pointer to be the last added message
                message = messagePage.size > 0 ? messagePage.at(messagePage.size - 1) : null;
            });
    }

    messages.forEach(msg => {
        console.log(msg.content);
    });
}

async function getUserActivity(interaction) {
    const guild = interaction.guild;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('most-active')
		.setDescription('Displays a leaderboard of the members with the most messages.'),
	async execute(interaction) {
        // maps userid to number of messages
		let userActivity = {};

        // display embed with ranking
        const channel = await interaction.client.channels.fetch("1210344778986954792");
        getMessages(channel);
        await interaction.reply("GG");
	},
};