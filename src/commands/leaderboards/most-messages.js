const { SlashCommandBuilder } = require('discord.js');

async function getMessages(channel) {
    const messages = [];

    // first message pointer
    let message = await channel.messages
        .fetch({ limit: 1 })
        .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null))
        .catch(error => {
            console.error('Error fetching first message in channel ${channel.id}:', error);
        });

    if (message) messages.push(message);

    while (message) {
        await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                // add each message in page to array
                messagePage.forEach(msg => messages.push(msg));

                // update first message pointer to be the last added message
                message = messagePage.size > 0 ? messagePage.at(messagePage.size - 1) : null;
            })
            .catch(error => {
                console.error(`Error fetching messages in channel ${channel.id}:`, error);
                message = null;
            });
    }

    return messages;
}

async function getUserActivity(interaction) {
    const guild = interaction.guild;

    // initialize activity map (user, number of messages), each user starts at 0 messages
    const userActivity = new Map();
    const members = await guild.members.fetch().catch(error => console.error('Error fetching members:', error));
    if (!members) return userActivity;

    members.forEach(member => {
        userActivity.set(member.id, 0);
    });

    const channels = guild.channels.cache.filter(channel => channel.isTextBased());
    for (const channel of channels.values()) {
        let messages = null;
        try {
            messages = await getMessages(channel);
        } catch (error) {
            console.error(`Error getting messages in channel ${channel.id}:`, error);
            continue;
        }

        for (const message of messages) {
            userActivity.set(message.author.id, userActivity.get(message.author.id)+1);
        }
    }

    return userActivity;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('most-active')
		.setDescription('Displays a leaderboard of the members with the most messages.'),
	async execute(interaction) {
        await interaction.deferReply();  // defer reply to avoid timeout

        // maps userid to number of messages
        let userActivity;
        try {
            userActivity = await getUserActivity(interaction);
        } catch (error) {
            console.error('Error fetching user activity:', error);
            await interaction.editReply('Error occurred while fetching user activity.');
            return;
        }

        console.log(userActivity);
        await interaction.editReply('DONE.');
	},
};