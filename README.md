#Deploy

A quick and simple deployment server.

## Installation

`npm install`

## Usage

1. Come up with a secret key (one for all your webhooks), store it as an
   environment variable named `WEBHOOK_SECRET_KEY`
2. Add webhook `http://hostname/post-hook` to your required projects.
   Set to only send commit events. Don't forget to use the secret key!
3. Add the repo name to `whitelist.json`, otherwise the server will not accept
   the webhook request.

## Optional Steps

* You can add bespoke versions of npm modules as tarballs in `precompiled-npm`.
  Any matched modules in `optionalDependencies` or `dependencies` will use
  this tarball instead of fetching from npm.

* Go project support has been added. Please ensure `go` and `godeps` have been
  installed to `/opt/go/bin`.
