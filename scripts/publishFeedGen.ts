import dotenv from 'dotenv';
import inquirer from 'inquirer';
import { AtpAgent, BlobRef } from '@atproto/api';
import fs from 'fs/promises';
import path from 'path';

const run = async () => {
  dotenv.config();

  if (!process.env.FEEDGEN_SERVICE_DID) {
    throw new Error('Please provide a hostname in the .env file');
  }

  const feedGenDid = process.env.FEEDGEN_SERVICE_DID as string;

  const isDevelop = process.env.TARGET === "develop";
  const recordName = isDevelop ? "test2" : "who-liked-me";
  const displayName = isDevelop ? "テスト" : "Who Liked Me";
  const description = isDevelop ? "説明文" : "自身の投稿にいいねした人の投稿を表示します";
  const avatar = isDevelop ? "test.png" : "test.png";

  const handle = process.env.BLUESKY_HANDLE as string;
  const password = process.env.BLUESKY_APP_PASSWORD as string;
  
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  let avatarRef: BlobRef | undefined;
  if (avatar) {
    let encoding: string
    if (avatar.endsWith('png')) {
      encoding = 'image/png'
    } else if (avatar.endsWith('jpg') || avatar.endsWith('jpeg')) {
      encoding = 'image/jpeg'
    } else {
      throw new Error('expected png or jpeg')
    }
    const img = await fs.readFile(avatar) // path.join('..', avatar)
    const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
      encoding,
    })
    avatarRef = blobRes.data.blob
  }

  console.log(agent.session?.did as string);

  await agent.api.com.atproto.repo.putRecord({
    repo: agent.session?.did ?? '',
    collection: 'app.bsky.feed.generator',
    rkey: recordName,
    record: {
      did: feedGenDid,
      displayName: displayName,
      description: description,
      avatar: avatarRef,
      createdAt: new Date().toISOString(),
    },
  });

  console.log('All done 🎉');
};

run();
