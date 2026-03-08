require('dotenv').config()

const username = process.env.POSTGRES_USER
const password = process.env.POSTGRES_PASSWORD
const database = process.env.POSTGRES_DB
const host = "127.0.0.1"
const dialect = "postgres"

module.exports = {
  "development": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "dialect": dialect
  },
  "test": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "dialect": dialect
  },
  "production": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "dialect": dialect
  }
}
