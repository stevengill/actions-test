const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

// action submit-form was selected in quick switcher
app.action({callback_id: 'submit-form'}, async ({ ack, payload, context }) => {
    console.log('action');
    console.log(payload);
    ack();
    try {
      const result = app.client.views.open({
        token: context.botToken,
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: payload.trigger_id,
        // View payload
        view: {
          type: 'modal',
          // View identifier
          callback_id: 'view_1',
          title: {
            type: 'plain_text',
            text: 'Modal title'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Welcome to a modal with _blocks_'
              },
            },
            {
              type: 'input',
              block_id: 'input_c',
              label: {
                type: 'plain_text',
                text: 'What are your hopes and dreams?'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'dreamy_input',
                multiline: true
              }
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      });
    }
    catch (error) {
      console.error(error);
    }
});


// respond to view submission
app.view('view_1', async ({ ack, body, view, context }) => {
  ack();
  const user = body['user']['id'];
  console.log(view['state']);
  console.log(view['state']['values']['input_c']['dreamy_input']);

  // Message to send user
  let msg = `your submission was successful! You sent ${view['state']['values']['input_c']['dreamy_input']['value']}`;

  // Message the user
  try {
    app.client.chat.postMessage({
      token: context.botToken,
      channel: user,
      text: msg
    });
  }
  catch (error) {
    console.error(error);
  }
})

// sanity test
app.message('hello', ({ message, say }) => {
    say(`_Who's there?_`);
    console.log('msg');
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();