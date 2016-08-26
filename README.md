# yotta-url

> _Yotta_ is the largest decimal unit prefix in the metric system, denoting a factor of 10 or 1000000000000000000000000

URL shortening is _so_ yesterday. What if we instead lengthened a URL into a giant _wall of hashed text_? yotta-url does just that. It will take your URL and expand it to the maximum allowable length (a limit imposed by the stepchild of browsers: 2083 characters for IE).

The engine features a complete, [cryptographically](https://en.wikipedia.org/wiki/RC4#Key-scheduling_algorithm_.28KSA.29)-[sound](https://en.wikipedia.org/wiki/RC4#Pseudo-random_generation_algorithm_.28PRGA.29) [hashing function](https://en.wikipedia.org/wiki/Merkle%E2%80%93Damg%C3%A5rd_construction) that will turn your run-of-the-mill `http://google.com` query into...

    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

The hashing function creates an [avalanche effect](https://en.wikipedia.org/wiki/Avalanche_effect), such that appending something minor like a trailing slash (`http://google.com/`) will result in a vastly different key than the previous:

    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

## Requires
  - Node >= v6.x, a MongoDB instance with read/write, and a dash of boredom

## Installation
1. Run `npm install` on the root directory to grab dependencies
2. Copy `./.env.sample` to `./.env` and edit the file with your credentials
3. Start the server via `npm run start:server`
4. Send a GET request to http://localhost:8080/expand?[your URL here]
    - It will return a URL you can share
5. Send a GET request to http://localhost:8080/\[URL code\] (replace with your URL code returned from the previous step)
    - You will be redirected to the correct URL

## Deployment
- If you want to deploy this to Heroku, upload it as-is and define the following environment variables:

    `heroku config:set MONGO_HOSTNAME=hostname.mongodb.com/1234 MONGO_USER=user MONGO_PASSWORD=pass`

## License
  MIT
