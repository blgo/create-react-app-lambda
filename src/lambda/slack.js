const { SLACK_WEBHOOK_URL } = process.env;
import fetch from "node-fetch"
export function handler(event, context, callback) {
  if (event.httpMethod !== "POST") {
    return callback(null, { statusCode: 410, body: "Unsupported Request Method" });
  }
  console.log(context)
  const claims = context.clientContext && context.clientContext.user;
  if (!claims) {
    return callback(null, { statusCode: 401, body: "You must be signed in to call this function" });
  }


  try {
    const payload = JSON.parse(event.body);
    fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({ 
          text: payload.text,
          attachments: [
            { "text": `From ${claims.email}` }
      ] 
    })
    }).then(() => {
      callback(null, { statusCode: 204 });
    }).catch((e) => {
      callback(null, { statusCode: 500, body: "Internal Server Error: " + e });
    })
  } catch (e) {
    callback(null, { statusCode: 500, body: "Internal Server Error: " + e });
  }
}
