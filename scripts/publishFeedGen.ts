import dotenv from 'dotenv';
import inquirer from 'inquirer';
import { AtpAgent, BlobRef } from '@atproto/api';
import fs from 'fs/promises';
import path from 'path';
import { ids } from '../src/lexicon/lexicons';

const run = async () => {
  dotenv.config();

  console.log(process.env.FEEDGEN_SERVICE_DID as string);
  
  if (!process.env.FEEDGEN_SERVICE_DID) {
    throw new Error('Please provide a hostname in the .env file');
  }

  const args: string[] = process.argv.slice(2);
  const isDevelop = args[0] === "develop";

  const feedGenDid = process.env.FEEDGEN_SERVICE_DID as string;
  const service = 'https://bsky.social';

  const recordName = isDevelop ? "t" : "who-liked-me";
  const displayName = isDevelop ? "テスト" : "Who Liked Me";
  const description = isDevelop ? "説明文" : "自身の投稿にいいねした人の投稿を表示します";
  const avatar = isDevelop ? "test.png" : "test.png";

  const handle = process.env.FEEDGEN_SERVICE_DID as string;
  const password = process.env.BLUESKY_APP_PASSWORD as string;
  const agent = new AtpAgent({ service: service ? service : 'https://bsky.social' });
  await agent.login({ identifier: handle, password });

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
    const img = await fs.readFile(path.join('..', avatar))
    const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
      encoding,
    })
    avatarRef = blobRes.data.blob
  }

  await agent.api.com.atproto.repo.putRecord({
    repo: agent.session?.did ?? '',
    collection: ids.AppBskyFeedGenerator,
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
