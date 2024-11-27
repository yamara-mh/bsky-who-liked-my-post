import dotenv from 'dotenv';
import inquirer from 'inquirer';
import { AtpAgent, BlobRef } from '@atproto/api';
import fs from 'fs/promises';
import path from 'path';
import { ids } from '../src/lexicon/lexicons';

const run = async () => {
  dotenv.config();

  if (!process.env.FEEDGEN_SERVICE_DID && !process.env.FEEDGEN_HOSTNAME) {
    throw new Error('Please provide a hostname in the .env file');
  }

  const args: string[] = process.argv.slice(2);
  const isDevelop = args[0] === "develop";

  const handle = process.env.FEEDGEN_SERVICE_DID;
  const password = process.env.BLUESKY_APP_PASSWORD;
  const service = 'https://bsky.social';

  console.log("recordName");
  const recordName = isDevelop ? "t" : "who-liked-me";
  console.log("displayName");
  const displayName = isDevelop ? "テスト" : "Who Liked Me";
  console.log("description");
  const description = isDevelop ? "説明文" : "自身の投稿にいいねした人の投稿を表示します";
  console.log("avatar");
  const avatar = isDevelop ? "test.png" : "test.png";
  console.log("----");

  const feedGenDid =
    process.env.FEEDGEN_SERVICE_DID ?? `did:web:${process.env.FEEDGEN_HOSTNAME}`;

  const agent = new AtpAgent({ service: service ? service : 'https://bsky.social' });
  await agent.login({ identifier: handle, password });

  let avatarRef: BlobRef | undefined;
  if (avatar) {
    const img = await fs.readFile(path.join('..', avatar));
    const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, { contentType: 'image/png' });
    avatarRef = blobRes.data.blob;
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
