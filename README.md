# Backend Server Side Program

### Setup - Server ready

- core nodejs
- Express (Framework)

### Package Manager used in Project - pnpm

- To install `pnpm` in project following steps should be followed:
  - npm i pnpm -g (global dependency)
  - pnpm init

### Data receiving methods:

- To receive data from client we need to use parser (3rd party middleware)
- There are two methods to receive data from body i.e
  - using form-data or,
  - using x-www-form-urlencoded

- form-data => use when file uploading -> need to use multer
- urlencoded => use when data need to be encoded
- raw => use when file need to be compressed when sending

### E-Commerce Features:

- Authentication
  - Register
  - Login
  - Activate User
  - Forgot Password
  - Reset Password
  - Logout User

### PostgreSQL packages installation in Node

- pnpm install sequelize pg pg-hstore
  These packages have different purposes:

`pg`
PostgreSQL driver for Node.js.
It allows Node to communicate with PostgreSQL

`sequelize`
ORM.

It lets you work with PostgreSQL using JavaScript models instead of writing SQL for every operation.

`pg-hstore`
Used by Sequelize for PostgreSQL-related serialization needs.
