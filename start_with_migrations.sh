#!/bin/sh

set -ex
npx mikro-orm migration:up
npm run start
