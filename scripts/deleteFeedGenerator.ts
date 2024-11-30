import dotenv from 'dotenv'
import { AtpAgent, BlobRef } from '@atproto/api'

const run = async () => {
  dotenv.config()

  const feedGenDid = process.env.FEEDGEN_SERVICE_DID as string;
  const handle = process.env.BLUESKY_HANDLE as string
  const password = process.env.BLUESKY_APP_PASSWORD as string
  let recordName = process.env.RECORD_NAME as string

  console.log(handle);
  

  recordName = recordName.toLowerCase()

  if (recordName.length > 15) {
    recordName = recordName.substring(0, 15);
  }

  // only update this if in a test environment
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  const did = agent.session?.did ?? ''
  console.log(did);

  const checkRecord = {
    feed:'at://' + did + '/app.bsky.feed.generator/' + recordName
  }

  try {
    await agent.api.app.bsky.feed.getFeedGenerator(checkRecord)
  } catch (err) {
    throw new Error(
      'The specified feed is not registered.',
    )
  }

  let record = {
    repo: feedGenDid,
    collection: 'app.bsky.feed.generator',
    rkey: recordName,
  }
  let recordJSON = JSON.stringify(record, null, 2);
  console.log(`Deleting record ${recordJSON}`)
  let response = await agent.api.com.atproto.repo.deleteRecord(record);
  let responseJSON = JSON.stringify(response, null, 2);
  console.log(`Response: ${responseJSON}`)
}

run()