# Routes usage
## User Routes
### Register
To register a student:
```bash
POST /users/student/create
```
```json
{
    "user":{
        "username": "John Doe",
        "email": "johndoe@mail.com",
        "password": "password"
    }
}
```
All the keys must be filled or the server will return a 400 HTTP code with the following message:
```json
{
    "message": "Missing parameters"
}
```
\
If the mail or the username are already used by another user, the server will return 400 HTTP error code with the following message:
```json
{
    "message": "Username is already used"
}
```
```json
{
    "message": "Email is already used"
}
```

If the POST request is correct you will receive the following response :
```json
{
    "createdUser": {
        "id": 2,
        "email": "johndoe@mail.com",
        "username": "John Doe",
        "password": "hashedPassword",
        "emailVerified": false,
        "role": "STUDENT",
        "updatedAt": "2023-01-16T10:53:14.332Z",
        "createdAt": "2023-01-16T10:53:14.332Z"
    },
    "message": "User created"
}
````
To register a teacher:
```bash
POST /users/teacher/create
```
To register a teacher you need to do it with an admin or a teacher account. 
```json
{
    "user":{
        "username": "John Doe",
        "email": "johndoe@mail.com",
        "password": "password"
    },
    "token": "token"
}
```
All the keys must be filled or the server will return a 400 HTTP code with the following message:
```json
{
    "message": "Missing parameters"
}
```
\
If the mail or the username are already used by another user, the server will return 400 HTTP error code with the following message:
```json
{
    "message": "Username is already used"
}
```
```json
{
    "message": "Email is already used"
}
```

If the POST request is correct you will receive the following response :
```json
{
    "createdUser": {
        "id": 2,
        "email": "johndoe@mail.com",
        "username": "John Doe",
        "password": "hashedPassword",
        "emailVerified": false,
        "role": "Teacher",
        "updatedAt": "2023-01-16T10:53:14.332Z",
        "createdAt": "2023-01-16T10:53:14.332Z"
    },
    "message": "User created"
}
````
### Login
To login a user:
```bash
POST /users/login
```
```json
{
    "user":{
        "email": "johndoe@mail.com",
        "password": "password"
    }
}
```

If the login is correct you will receive the following response:
```json
{
    "createdToken": {
        "id": 6,
        "token": "token",
        "expirationDate": "2023-01-16T12:05:08.199Z",
        "idUser": 2,
        "updatedAt": "2023-01-16T11:05:08.200Z",
        "createdAt": "2023-01-16T11:05:08.200Z"
    }
}
```
Keep the token in a secure place, you will need it to access the other routes.\
Possibles errors:
```json
{
    "message": "Missing parameters"
}
```
```json
{
    "message": "User not found"
}
```
```json
{
    "message": "Invalid password"
}
```

### Update user
To update a user: \
In the header of the request place your token in the "authorization" field.
```bash
PUT /users/update
```
```json
{
    "user": {
        "username": "John Doe",
        "email": "johndoe2@mail.com",
        "password": "Newpassword",
        "role": "TEACHER"
    }
}
```
All the keys are required, you can't update only one of them.

If the update is correct you will receive the following response:
```json
{
    "user": {
        "id": 2,
        "email": "johndoe2@mail.com",
        "password": "hashedPassword",
        "username": "John Doe",
        "emailVerified": false,
        "createdAt": "2023-01-16T10:53:14.000Z",
        "updatedAt": "2023-01-16T11:49:37.154Z"
    },
    "message": "User updated"
}
```

### Logout User
In the header of the request place your token in the "authorization" field.
```bash
POST /users/logout
```
If the logout process was successfull you will receive a HTTP Status Code 200 with this following response:
```json
{
    "message":"User logged out"
}
```
## Token routes
### Update token
In the header of the request place your token in the "authorization" field.
```bash
PUT /tokens/update
```
If the update operation was successfull you will receive a HTTP Status Code 200 with this following response
```json
{
    "token": {
        "id": 20,
        "token": "token",
        "expirationDate": "2023-01-18T16:28:53.148Z",
        "idUser": 3,
        "isDeleted": false,
        "updatedAt": "2023-01-18T16:27:53.148Z",
        "createdAt": "2023-01-18T16:27:53.148Z"
    },
    "message": "Token updated"
} 
````
