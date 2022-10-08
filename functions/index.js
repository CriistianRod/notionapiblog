const functions = require("firebase-functions");
const { Client } = require("@notionhq/client");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.helloBlog = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello blog logs!", {structuredData: true});
  response.send("Hello from my blog!");
});

const database_id = process.env.NOTION_DATABASE_ID;

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

exports.getVideos = functions.https.onRequest(async (request, response) => {
    functions.logger.info("Videos from API!", {structuredData: true});

        const payload = {
        path: `databases/${database_id}/query`,
        method: 'POST',
    };
  
    const { results } = await notion.request(payload);
  
    const videos = results.map((page) => {
      return {
        id: page.id,
        title: page.properties.Name.title[0].plain_text,
        date: page.properties.Date.date.start,
        tags: page.properties.Tags.rich_text[0]?.plain_text,
        description: page.properties.Description.rich_text[0].plain_text,
        created_time: page.created_time,
      };
    });

    response.send(videos);
});
