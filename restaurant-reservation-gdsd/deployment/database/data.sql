DROP database if exists reserveat;

CREATE database reserveat;
use reserveat;

drop table if exists users;
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    lastName varchar(255),
    firstName varchar(255),
    email varchar(255),
    UNIQUE (email),
    roleId int,
    password varchar(255),
    phoneNumber varchar(255)
);

drop table if exists roles;
CREATE TABLE roles (
	id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    name varchar(255)
);

drop table if exists restaurants;
CREATE TABLE restaurants (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    name varchar(255),
    postalCode int,
    address varchar(255),
    city varchar(255),
    cuisine enum ('Italian', 'Chinese', 'French', 'Thai', 'German', 'Arabic', 'Indian', 'Vegetarian', 'USA', 'Vegan'), 
    maxCapacity int,
    maxTables int,
    restaurantNote varchar(255),
    gracePeriod int,
    timeInterval int,
    status enum ('pending', 'approved', 'rejected'),
    userId int
);

drop table if exists reservations;
CREATE TABLE reservations (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    userId int,
    restaurantId int,
    numberOfSeats int,
    status enum('Reserved', 'Modified', 'Cancelled'),
    extraServiceId int,
    lastUpdate date,
	times INT,
    specialRequest varchar(255),
    date date
);   

drop table if exists extraServices;
CREATE TABLE extraServices (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    name varchar(255),
    description varchar(255)
);

drop table if exists chats;
CREATE TABLE chats (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    user int,
    restaurantOwner int
);

drop table if exists messages;
CREATE TABLE messages (
    id int NOT NULL AUTO_INCREMENT,
    chatId int,
    senderId int,
    message varchar(255),
    timeOfSending int,
    PRIMARY KEY (id)
);

alter table messages add column isSeen tinyint after timeofsending;


drop table if exists flags;
CREATE TABLE flags (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    userID int,
    reservationID int,
    descriptionOf varchar(255)
);

drop table if exists rewards;
CREATE TABLE rewards (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    userID int,
    typeOf enum("ForReservation", "ForUserReview"),
    points int
);

drop table if exists reviews;
CREATE TABLE reviews (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    userID int,
    restaurantID int,
    rating int,
    descriptionReview varchar(255)
);

drop table if exists images;
CREATE TABLE images (
    id INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    restaurantID int,
    status enum("Uploaded", "Approved", "Rejected"),
    path varchar(255),
    isMenuImage boolean
);

drop table if exists restaurantTime;
CREATE TABLE restaurantTime (
    id INT(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	times INT,
    availability boolean,
    restaurantID INT(11),
    seatsBooked int,
	date date
);

INSERT INTO roles VALUES(1, 'user');	
INSERT INTO roles VALUES(2, 'admin');	
INSERT INTO roles VALUES(3, 'restaurantOwner');	
INSERT INTO roles VALUES(4, 'waiter');

INSERT INTO users (lastName,firstName,email,roleId,password,phoneNumber) VALUES
	 ('Skywwalker','Luke','root@hs-fulda.de',1,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','00425781567328'),
	 ('Taraka','Owner','taraka@hs-fulda.de',3,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','004254563267328'),
	 ('Master','Yoda','yoda.eat@hs-fulda.de',1,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','00124781567328'),
	 ('Fett','Boba','boooba@hs-fulda.de',3,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','078913781567328'),
	 ('Fett','Jango','jangooo@hs-fulda.de',3,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','004256857567328'),
	 ('Funk','Boba','bobaarrrr@hs-fulda.de',1,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','09345781567328'),
	 ('Jinn','Qui-Gon','quququququ@hs-fulda.de',1,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','07351281567328'),
	 ('Kenobi','Ben','ben.kenobi@hs-fulda.de',1,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','00425781567328'),
	 ('Vader','Darth','red.lightsaber@hs-fulda.de',1,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','666'),
	 ('Admin','Admin','admin@hs-fulda.de',2,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','07351281567328'),
     ('owner','rest','ro@hs-fulda.de',3,'$2a$08$LlUi/vmMosiRhs9ABa3D3.SO..2Nh/.v88PqOyxND/EWVvOxMUQ2e','07351281567328');

INSERT INTO restaurants (name,postalCode,address,city,cuisine,maxCapacity,maxTables,restaurantNote,gracePeriod,timeInterval,status,userId) VALUES
	 ('Taraka',36037,'Leipziger Str 12','Fulda','Chinese',50,12,'Name',2,1200,'approved',2),
	 ('Thaitiqi',36037,'Magdeburger Str 45','Fulda','French',20,5,'Name',2,1200,'approved',2),
	 ('Steak House',36037,'Amand-Ney-Strasse 17','Fulda','Thai',65,17,'Name',2,1200,'approved',6),
	 ('China Town',36037,'Heinrich Str 28','Fulda','German',35,25,'Name',2,1200,'pending',12),
	 ('Toast Laden',36037,'Buttlar Str 79','Fulda','Arabic',5,5,'Name',2,1200,'approved',5),
	 ('Ideal',36037,'Stadtschloss Str 2','Fulda','Indian',40,8,'Name',2,1200,'approved',5),
	 ('Cafe Thiele',36037,'Mittel Str 178','Fulda','Vegetarian',80,6,'Name',2,1200,'rejected',6),
	 ('Hopfenglueck',36037,'Heinrich Str 28','Fulda','USA',35,20,'Name',2,1200,'pending',6),
	 ('Eck',36037,'Bahnhoff Str 76','Fulda','Vegan',15,15,'Name',2,1200,'approved',12),
	 ('Goeppel',36037,'Leipziger Str 158','Fulda','Italian',46,40,'Name',2,1200,'pending',12);


INSERT INTO extraServices VALUES('001', 'Birthday', 'We Make Cake!');
INSERT INTO extraServices VALUES('002', 'Wedding', 'We Make 2 Cakes!');
INSERT INTO extraServices VALUES('003', 'Funeral', 'You bring your own Cake!!!');
