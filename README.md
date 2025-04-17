# JustRight
This is an application where crime can be reported and solved.

## The required dependencies are:
i. express: For building the backend
ii. sequelize: ORM for MySQL
iii. mysql2: MYSQL driver for Node.js
iv. jsonwebtoken: For authentication
v. bcryptjs: For password hashing
vi. dotenv: For environment variables
vii. cors: For enabling Cross-Origin Resources Sharing
viii. body-parser: For parsing request bodies
ix. multer: For handling file uploads(e.g documents, images)

## DATABASE SETUP
1. Initialize the database using the command:
    'npx sequelize-cli init'
This will create the following files:
i. config: Contains database configuration

ii. models: Contains database models

iii. migrations: Contains migration files

iv. seeders: Contains seed files

2. Create the database using the command:
    'npx sequelize-cli db:create'

3. Create Database Models
Create models for PublicUsers, Moderators, Admins, Reports, Messages, and PoliceStations.

    i. PublicUser Model
    'npx sequelize-cli model:generate --name PublicUser --attributes username:string,email:string,password:string'

    ii. Moderator Model
    'npx sequelize-cli model:generate --name Moderator --attributes username:string,email:string,password:string,licenseNumber:string'

    iii. Admin Model
    'npx sequelize-cli model:generate --name Admin --attributes username:string,email:string,password:string'

    iv. Report Model
    'npx sequelize-cli model:generate --name Report --attributes incidentType:string,status:string,description:text,location:string,exactLocation:string,filePath:string,publicUserId:integer'
    
    v. Message Model
    'npx sequelize-cli model:generate --name Message --attributes fullName:string,email:string,phoneNumber:string,message:text'

    vi. PoliceStation Model
    'npx sequelize-cli model:generate --name PoliceStation --attributes stationName:string,contact:string,location:string'

4. Run Migrations
Run the migrations to create tables in the database:
    'npx sequelize-cli db:migrate'