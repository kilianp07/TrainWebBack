# TrainWebBack

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install dependecies.

```bash
npm install
```

Create a .env file in the root directory and add the following variables:

```bash
DB_USER=''
DB_PASSWORD=''
DB_NAME='database_development'
PORT='80'
SECRET_KEY='config/JwtKeys/private.pem'
TOKEN_DURABILITY='60000'
```
> WARNING: Write environment Variables between: "


Generate a key pair for JWT authentication:

```bash
openssl rand 128 > config/JwtKeys/private.pem
```
> WARNING: Create the config directory config/JwtKeys

Create your database with:
```bash
npx sequelize-cli db:create
```
Create your scheme with:
```bash
npx sequelize-cli db:migrate
```

## Usage
To start the server run:
```bash
npm start
```
### [User Routes](routes/README.md#user-routes)
