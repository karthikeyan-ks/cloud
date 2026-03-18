require('dotenv').config()

const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
const host = process.env.DB_HOST || "127.0.0.1"
const port = Number(process.env.DB_PORT || 5432)
const dialect = "postgres"

module.exports = {
  "development": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "port": port,
    "dialect": dialect
  },
  "test": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "port": port,
    "dialect": dialect
  },
  "production": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "port": port,
    "dialect": dialect
  }
}
