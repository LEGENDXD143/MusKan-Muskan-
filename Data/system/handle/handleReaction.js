const logs = require('../../utility/logs');

async function handleReaction({ api, event, config }) {
  const { messageID, userID, reaction } = event;

  if (!global.client.handleReaction) return;

  const reactionData = global.client.handleReaction.find(
    item => item.messageID === messageID
  );

  if (!reactionData) return;

  try {
    const command = global.client.commands.get(reactionData.name);

    if (!command || !command.handleReaction) return;

    const Users = require('../../system/controllers/users');
    const Threads = require('../../system/controllers/threads');

    await command.handleReaction({
      api,
      event,
      config,
      handleReaction: reactionData,
      Users,
      Threads
    });
  } catch (error) {
    console.error('Reaction Handler Error:', error);
  }
}

module.exports = handleReaction;