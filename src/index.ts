import dotenv from 'dotenv'
import FeedGenerator from './server'

const run = async () => {
  dotenv.config()
  let hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'example.com'
  hostname += ".yamara.workers.dev"

  const serviceDid =
    maybeStr(process.env.FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`
  
  console.log(serviceDid)
  console.log(process.env.FEEDGEN_PORT as string)
  console.log(process.env.FEEDGEN_LISTENHOST as string)
  console.log(process.env.FEEDGEN_SQLITE_LOCATION as string)
  console.log(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT as string)
  console.log(process.env.FEEDGEN_PUBLISHER_DID as string)
  
  const server = FeedGenerator.create({
    port: maybeInt(process.env.FEEDGEN_PORT) ?? 443,
    listenhost: maybeStr(process.env.FEEDGEN_LISTENHOST) ?? '0.0.0.0', // 'localhost',
    sqliteLocation: maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? ':memory:',
    subscriptionEndpoint:
      maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ??
      "did:plc:6hj3b43unydeqry6lqobe4b5",// 'wss://bsky.network',
    publisherDid:
      maybeStr(process.env.FEEDGEN_PUBLISHER_DID) ?? "did:plc:6hj3b43unydeqry6lqobe4b5",// 'did:example:alice',
    subscriptionReconnectDelay:
      maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
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
