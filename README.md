# TrainWebBack

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install dependecies.

```bash
npm install
```

Create a .env file in the root directory and add the following variables:

```bash
DB_USER=
DB_PASSWORD=
PORT=
PUBLIC_KEY='config/JwtKeys/public.pem'
SECRET_KEY='config/JwtKeys/private.pem'

-> ATTENTION: bien mettre les variables d'environnement à saisir entre "
```

Generate a key pair for JWT authentication:

```bash
openssl genrsa -out config/JwtKeys/private.pem 2048 
&& 
openssl rsa -in config/JwtKeys/private.pem -pubout -out config/JwtKeys/public.pem
```

## Usage
To start the server run:
```bash
npm start
```
### [User Routes](routes/README.md#user-routes)
