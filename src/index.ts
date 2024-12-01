import dotenv from 'dotenv'
import FeedGenerator from './server'

const run = async () => {
  dotenv.config()
  // const hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'example.com'
  const hostname += (process.env.FEEDGEN_HOSTNAME as string) + ".yamara.workers.dev"

  const serviceDid = "did:plc:6hj3b43unydeqry6lqobe4b5"
     // maybeStr(process.env.FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`
  
  const server = FeedGenerator.create({
    port: 443,
      // maybeInt(process.env.FEEDGEN_PORT) ?? 3000,
    listenhost: '0.0.0.0',
      // maybeStr(process.env.FEEDGEN_LISTENHOST) ?? 'localhost',
    sqliteLocation: ':memory:',
      // maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? ':memory:',
    subscriptionEndpoint: 'wss://bsky.network',
      // maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ?? 'wss://bsky.network',
    publisherDid:"did:plc:6hj3b43unydeqry6lqobe4b5",
      // maybeStr(process.env.FEEDGEN_PUBLISHER_DID) ?? 'did:example:alice',
    subscriptionReconnectDelay: 86400,
      // maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
    hostname,
    serviceDid,
  })
  await server.start()
  console.log(
    `🤖 running feed generator at http://${server.cfg.listenhost}:${server.cfg.port}`,
  )
}

const maybeStr = (val?: string) => {
  if (!val) return undefined
  return val
}

const maybeInt = (val?: string) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

run()
