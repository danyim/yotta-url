# yotta-url

> _Yotta_ is the largest decimal unit prefix in the metric system, denoting a factor of 10 or 1000000000000000000000000

URL shortening is _so yesterday_. What if we instead lengthened a URL to a wall of hashed text? yotta-url will take your URL and expand it to the maximum allowable length (2083 characters for IE)

## Installation
1. Run `npm install` on the root directory
2. Start the server via `npm run start:server`
3. Send a GET request to http://localhost:1104/expand?[your URL here]
    - It will return with a URL
4. Send a GET request to http://localhost:1104/[URL code] (replace with your URL code returned from the previous step)
