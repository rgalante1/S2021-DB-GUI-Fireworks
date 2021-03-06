require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

var connection = mysql.createPool({
	connectionLimit: 10,
	host: process.env.MYSQL_CLOUD_HOST,
	password: process.env.MYSQL_CLOUD_PASS,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_CLOUD_USER,
	database: process.env.MYSQL_DB
});

// set up some configs for express.
const config = {
	name: 'sample-express-app',
	port: 8000,
	host: '0.0.0.0',
};

// create the express.js object
const app = express();

// create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

// specify middleware to use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors({
	origin: 'http://ec2-3-128-160-107.us-east-2.compute.amazonaws.com:3000',
	credentials: true
}));
app.use(ExpressAPILogMiddleware(logger, { request: true }));

connection.getConnection(function (err) {
	if (err){
		logger.info("Cannot connect to DB");
	}
	else{
		logger.info("Connected");
	}
});

// middleware to use for all requests
app.use(function (req, res, next) {
	// do logging
	logger.info('Something is happening.');
	next();
});



// GET /

app.get('/', (req, res) => {
	res.status(200).send('Go to 0.0.0.0:3000.');
});


//get a post by postID
app.get('/post/:postID', function (req, res) {
	var postid = req.param('postID');

	connection.query("SELECT * FROM post where post.companyID = ?", postid, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//get a specific user's type of access
app.get('/user/:username/userType', function (req, res) {
	var UserName = req.param('username');

	connection.query("SELECT userType FROM user where username = ?", UserName, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});


//get a post buy company ID
app.get('/post/:companyID', function (req, res) {
	var CompanyID = req.param('companyID');

	connection.query("SELECT * FROM post WHERE companyID = ?", CompanyID, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//get a profile by username
app.get('/profile/:username', function (req, res) {
	var UserName = req.param('username');

	connection.query("SELECT * FROM user WHERE username = ?", UserName, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});

});

//see a user friend requests
app.get('/profile/:username/friendrequests', function (req, res) {
	var UserName = req.param('username');

	var query = "SELECT fi.*, u2.* FROM user u1 INNER JOIN friendInvites fi on u1.userID = fi.addresseeIDINNER JOIN user u2 on fi.senderID = u2.userID WHERE u1.username = '" + UserName;

	connection.query("SELECT fi.*, u2.* FROM user u1 INNER JOIN friendInvites fi on u1.userID = fi.addresseeID INNER JOIN user u2 on fi.senderID = u2.userID WHERE u1.username = ? AND fi.accepted = 0", UserName, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//see a user friend requests that are accepted
app.get('/profile/:username/acceptedrequestsAddressee', function (req, res) {
	var UserName = req.param('username');

	var query = "SELECT fi.*, u2.* FROM user u1 INNER JOIN friendInvites fi on u1.userID = fi.addresseeIDINNER JOIN user u2 on fi.senderID = u2.userID WHERE u1.username = '" + UserName;

	connection.query("SELECT fi.*, u2.* FROM user u1 INNER JOIN friendInvites fi on u1.userID = fi.addresseeID INNER JOIN user u2 on fi.senderID = u2.userID WHERE u1.username = ? AND fi.accepted = 1", UserName, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//see a user friend requests that are accepted where they were the sender
app.get('/profile/:username/acceptedrequestsSender', function (req, res) {
	var UserName = req.param('username');

	var query = "SELECT fi.*, u2.* FROM user u1 INNER JOIN friendInvites fi on u1.userID = fi.addresseeIDINNER JOIN user u2 on fi.senderID = u2.userID WHERE u1.username = '" + UserName;

	connection.query("SELECT fi.*, u2.* FROM user u1 INNER JOIN friendInvites fi on u1.userID = fi.senderID INNER JOIN user u2 on fi.addresseeID = u2.userID WHERE u1.username = ? AND fi.accepted = 1", UserName, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//see if a user has a friend request
app.get('/profile/requestcheck/:useraddressee/:usersender', function (req, res) {
	var useraddressee = req.param('useraddressee');
	var usersender = req.param('usersender');

	connection.query("SELECT * FROM user u1 INNER JOIN friendInvites fi on (u1.userID  = fi.addresseeID) OR (u1.userID = fi.senderID) INNER JOIN  user u2 on (u2.userID = fi.senderID) OR (u2.userID = fi.addresseeID)where u1.username = ? AND u2.username = ? ", [useraddressee, usersender], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});

});

// get meetings 
app.get('/meetings', function (req, res) {
	connection.query("SELECT * FROM meeting", function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

app.get('/meetingsById/:meetingId', function (req, res) {
    var meetingId = req.param('meetingId');
    connection.query("SELECT * FROM meeting INNER JOIN company ON meeting.hostCompanyID = company.companyID WHERE meeting.meetingID = ?",
    meetingId, function(err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
});

// get meeting by company name 
app.get('/meetings/:companyName', function (req, res) {
	var companyName = req.param('companyName');
	connection.query("SELECT meeting.* FROM meeting INNER JOIN company ON meeting.hostCompanyID = company.companyID WHERE company.companyName = ?", 
	companyName, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

// get posts by company name 
app.get('/posts/:companyName', function (req, res) {
	var companyName = req.param('companyName');
	connection.query("SELECT post.* FROM post INNER JOIN company ON post.companyID = company.companyID WHERE company.companyName = ?", 
	companyName, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get users

app.get('/users/get', function (req, res) {
	connection.query("SELECT * FROM user", function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});


//Get users by ID
app.get('/users/:id', function (req, res) {
	var query = "SELECT * FROM user where userID =\"" + req.params.id + "\"";

	connection.query(query, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get all posts
app.get('/post', function (req, res) {
	connection.query("SELECT * FROM post", function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});



//Get company
app.get('/company', function (req, res) {
	connection.query("SELECT * FROM company", function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get company by ID
app.get('/company/:id', function (req, res) {
	var query = "SELECT * FROM company where companyID =\"" + req.params.id + "\"";

	connection.query(query, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get company by name
app.get('/company/byName/:companyName', function (req, res) {
	var query = "SELECT companyID FROM company where companyName =\"" + req.params.companyName + "\"";

	connection.query(query, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get rating
app.get('/rating', function (req, res) {
	connection.query("SELECT * FROM rating", function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get rating by ID
app.get('/rating/:id', function (req, res) {
	var query = "SELECT * FROM rating where ratingID =\"" + req.params.id + "\"";

	connection.query(query, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

app.get('/ratingsByMeeting/:meetingId', function (req, res) {
    connection.query("SELECT * FROM rating WHERE meeting = ?", req.param('meetingId'), function(err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
});

//Get meetingInvites by ID
app.get('/meetingInvites/:id', function (req, res) {
	var query = "SELECT * FROM meetingInvites where inviteID =\"" + req.params.id + "\"";

	connection.query(query, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get friendInvites
app.get('/friendInvites', function (req, res) {
	connection.query("SELECT * FROM friendInvites", function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Get friendInvites by ID
app.get('/friendInvites/:id', function (req, res) {
	var query = "SELECT * FROM friendInvites where inviteID =\"" + req.params.id + "\"";

	connection.query(query, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//get back all posts
app.get('/allposts', function (req, res) {
	var companyName = req.param('request');
	//console.log("First log");
	//console.log(companyName);

	var query = "SELECT p.title as postTitle, p.description as postDescript, m2.* FROM post p INNER JOIN company c on p.companyID = c.companyID INNER JOIN meeting m2 on c.companyID = m2.hostCompanyID WHERE c.companyName = '" + companyName;

	//console.log("Second log");
	//console.log(query);

	connection.query("SELECT p.title as postTitle, p.description as postDescript, m2.* FROM post p INNER JOIN company c on p.companyID = c.companyID INNER JOIN meeting m2 on c.companyID = m2.hostCompanyID WHERE c.companyName = ?", companyName, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

app.get('/meeting/:meetingID/rsvp', function (req, res) {
	var meetingID = req.params.meetingID;
	connection.query("SELECT * FROM meetingRSVP WHERE meetingId = ?", meetingID, function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.get('/meeting/:meetingID/rsvp/:userID', function (req, res) {
	var meetingID = req.params.meetingID;
	var userID = req.params.userID;
	connection.query("SELECT COUNT(*) AS rsvpExists FROM meetingRSVP WHERE meetingId = ? AND userId = ?", [meetingID, userID], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.put('/meeting/:meetingID/rsvp/:userID', function (req, res) {
	var meetingID = req.params.meetingID;
	var userID = req.params.userID;
	connection.query("INSERT INTO meetingRSVP (meetingId, userId) VALUES (?, ?)", [meetingID, userID], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.delete('/meeting/:meetingID/rsvp/:userID', function (req, res) {
	var meetingID = req.params.meetingID;
	var userID = req.params.userID;
	connection.query("DELETE FROM meetingRSVP WHERE meetingId = ? AND userId = ?", [meetingID, userID], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

//Get attendees
app.get('/meeting/:meetingID/attendees', function (req, res) {
	var id = req.params.meetingID;
	connection.query("select concat(firstname, ' ', lastname) as attendees from user u inner join meetingInvites mi on u.userID = mi.addresseeID inner join meeting m on mi.meetingID = m.meetingID where m.meetingID = ? and mi.accepted = 1;", id,
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result)); // Result in JSON format
		});
});

//Filter by location, Date and meetingType
app.get('/dashboard/filter', function (req, res) {
	var FilterOpt = req.param('filteropt');
	var SearchOpt = req.param('searchopt');
	
	//console.log('First log');
	//console.log(FilterOpt);
	//console.log('Second log');
	//console.log(SearchOpt);
	
	if(FilterOpt == 1)
	{
		
		if(SearchOpt)
		{
			connection.query("SELECT * FROM meeting where location IS NOT NULL order by location", function (err, result, fields) {
					if (err) throw err;
					res.end(JSON.stringify(result)); // Result in JSON format
			});
		}
		else
		{
			connection.query("SELECT * FROM meeting where location IS NOT NULL order by location", function (err, result, fields) {;
					if (err) throw err;
					res.end(JSON.stringify(result)); // Result in JSON format
			});
		}
	}
	else if(FilterOpt == 2)
	{
		if(SearchOpt)
		{
			
			connection.query("Select * From meeting where eventDate = ? AND eventDate IS NOT NULL order by eventDate", SearchOpt, function (err, result, fields) {
				if (err) throw err;
				res.end(JSON.stringify(result)); // Result in JSON format
			});
		}
		else
		{
			connection.query("Select * From meeting where eventDate IS NOT NULL order by eventDate", function (err, result, fields) {
				if (err) throw err;
				res.end(JSON.stringify(result)); // Result in JSON format
			});
			
		}
	}
	else if(FilterOpt == 3)
	{
		//The code is specifically designed this way b/c meetingType is an int value the app will crash is switching from !SearchOpy to SearchOpt
		if(!SearchOpt)
		{
			return res.status(401).json({ Errors: "Can Not filter" });
		}
		{
			connection.query("SELECT * FROM meeting where meetingType = ? AND meetingType IS NOT NULL order by meetingType", SearchOpt, function (err, result, fields) {
				if (err) throw err;
				res.end(JSON.stringify(result)); // Result in JSON format
			});
		}
	}
	else
	{
		return res.status(401).json({ Errors: "Can Not filter" });
	}
	
});

//search for a specific user by username, first name or lastname
app.get('/profile/search/:query', function (req, res) {
	//var name = req.param('name');
	var Name = ("%" + req.params.query + "%")
	var query = "SELECT * FROM user where username =" + Name + " OR firstName = " + Name + " OR lastName = " + Name;

	connection.query("SELECT * FROM user where username LIKE ? OR firstName LIKE ? OR lastName LIKE ?", [Name, Name, Name] , function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});


// PUT 

//update a friend request for a user
app.put('/profile/:inviteID/togglerequest', function (req, res) {
    var InviteID = req.params.inviteID;

    connection.query("UPDATE friendInvites SET accepted = 1 WHERE inviteID = ?", InviteID, function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
});


//eddit info for a specific user
app.put('/profile/:username/changeinfo', function(req, res) {
	
	var UserName = req.body.username;
	var FirstName = req.body.firstName;
	var LastName = req.body.lastName;
	var bio = req.body.bio;
	var title = req.body.title;
	var Location = req.body.location;
	var PhoneNumber = req.body.phoneNumber;
	var EmailAddress = req.body.emailAddress;
	var ProfilePhotoURL = req.body.profilePhotoURL;
	var companyname = req.body.companyName;

	let array = [FirstName, LastName, bio, title, Location, PhoneNumber, EmailAddress, ProfilePhotoURL, companyname, UserName];
	connection.query("UPDATE user SET firstName = ?, lastName = ?, bio = ?, title = ?, location = ?, phone = ?, mail = ?, picture = ?, companyName = ? WHERE username = ?", array, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//update a friend request for a user
app.put('/meeting/update', function (req, res) {
	var meetingID = req.body.meetingID;
    var description = req.body.description;
	var startTime = req.body.startTime;
	var meetingLink = req.body.meetingLink;
	var location = req.body.location;
	var meetingType = req.body.meetingType;
	var eventDate = req.body.eventDate;
	var title = req.body.title;

    connection.query("UPDATE meeting SET description = ?, startTime = ?, meetingLink = ?, location = ?, meetingType = ?, eventDate = ?, title = ? WHERE meetingID = ?",
	 [description, startTime, meetingLink, location, meetingType, eventDate, title, meetingID], function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
});

// POST /
//edit info for a specific post
app.put('/post/update', function(req, res) {
	
	var postID = req.body.postID;
	var Title = req.body.title;
	var Description = req.body.description;

	let array = [Title, Description, postID];
	connection.query("UPDATE post SET title = ?, description = ? WHERE postID = ?", array, function (err, result, fields) {

		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//inset a new meeting
app.post('/meeting/:meetingID/rating', function (req, res) {
	var Rating = req.body.rating;
	var RatingDescription = req.body.ratingDescription;
	var meetingID = req.body.meetingID;
	var Name = req.body.Name;

	let array = [meetingID, Name, RatingDescription, Rating];

	connection.query("INSERT INTO rating (`meeting`, `name`, `description`, `rating`) VALUES(?,?,?, ?) ", array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//Create account 
app.post('/createaccount', function (req, res) {
	var FirstName = req.body.FirstName;
	var LastName = req.body.LastName;
	var UserName = req.body.UserName;
	var PassWord = req.body.PassWord;
	var CompanyData = req.body.CompanyData;
	var CompanyName = CompanyData ? CompanyData.Name : undefined;
	var CompanyDescription = CompanyData ? CompanyData.Description : undefined;

	//console.log(FirstName);
	//console.log(LastName);
	//console.log(UserName);
	//console.log(PassWord);
	//console.log(CompanyName);
	//console.log(CompanyData);
	
	if (CompanyData) {
		connection.query("INSERT INTO company (companyName, description, password) VALUES (?, ?, ?)", [CompanyName, CompanyDescription, PassWord], function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result)); // Result in JSON format
		});
	}
	else {
		connection.query("INSERT INTO user (firstName,lastName,username,password) VALUES (?,?,?,?)", [FirstName, LastName, UserName, PassWord], function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result)); // Result in JSON format
		});
	}
});

app.post('/login', (req, res) => {

	if (!(req.body.username && req.body.password)) {

		res.status(400).send("Missing email or password");
		return;
	}

	var query = "select * from user where username=\"" + req.body.username + "\" and p" +
		"assword=\"" + req.body.password + "\";";

	if (req.body.company) {
		query = "select * from company where companyName=\"" + req.body.username + "\" and password=\"" + req.body.password + "\";";
	}

	connection.query(query, function (err, result, fields) {
		if (err) {
			res.status(500).send("Failed SQL Query");
			return;
		}

		switch (result.length) {
			case 0:
				res.status(200).send(false);
				break;
			case 1:
				res.status(200).send(true);
				break;
			default:
				res.status(402).send("Too Many Users Found");
				return;
		}

	})
})

// create a company 
app.post('/createCompany', async (req, res) => {
	var id = req.body.companyID;
	var companyName = req.body.companyName;
	var field = req.body.field;
	var description = req.body.description;

	let array = [id, companyName, field, description];
	var sql = "INSERT into `fireworks`.`company` (`companyID`,`companyName`,field,`description`) values (?,?,?,?)";
	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

// create a company post
app.post('/createpost', async (req, res) => {
	var id = req.body.companyID;
	var title = req.body.title;
	var description = req.body.description;
  	var date = req.body.date;

	let array = [id, title, description,date];
	var sql = "INSERT into `fireworks`.`post` (`companyID`,`title`,`description`,`date`) values (?,?,?,?)";
	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

// create a rating
app.post('/createRating', async (req, res) => {
	var id = req.body.ratingID;
	var meeting = req.body.meeting;
	var name = req.body.name;
	var description = req.body.description;
	var rating = req.body.rating;

	let array = [id, meeting, name, description, rating];
	var sql = "INSERT into `fireworks`.`rating` (`ratingID`,`meeting`,name,`description`,rating) values (?,?,?,?,?)";
	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

//create new user
app.post('/createUser', async (req, res) => {

  var userID = req.body.userID;
  var username  = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstname;
  var lastName = req.body.lastName;
  var phone = req.body.phone;
  var userType = req.body.userType;
  var mail = req.body.mail;
  var employerID = req.body.employerID;
  var location = req.body.location;


	let array = [userID,username,password,firstName,lastName,phone,userType,mail,employerID,location];
	var sql = "INSERT into `fireworks`.`user` (`userID`,`username`,`password`,`firstName`,`lastName`,`phone`,`userType`,`mail`,`employerID`,location) values (?,?,?,?,?,?,?,?,?,?)";

	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});



// create a meeting/event
app.post('/createmeeting', async (req, res) => {
	var description = req.body.description || "";
	var start = req.body.startTime;
	var end = req.body.endTime;
	var link = req.body.meetingLink || "";
	var company = req.body.hostCompanyID;
	var loc = req.body.location || "";
	var meetingType = req.body.meetingType;
	var eventDate = req.body.eventDate;
  	var title = req.body.title;

	let array = [description, start, end, link, company, loc, meetingType, eventDate, title];
	var sql = "INSERT into `fireworks`.`meeting` (`meetingID`,`description`,`startTime`,`endTime`,`meetingLink`,`hostCompanyID`,`location`,`meetingType`,`eventDate`,title) values (DEFAULT,?,?,?,?,?,?,?,?,?)";
	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

// create a meetingInvites
app.post('/createMeetingInvites', async (req, res) => {
	var id = req.body.inviteID;
	var addresseeID = req.body.addresseeID;
	var meetingID = req.body.meetingID;
	var dateSent = req.body.dateSent;
	var accepted = req.body.accepted;

	let array = [id, addresseeID, meetingID, dateSent, accepted];
	var sql = "INSERT into `fireworks`.`meetingInvites` (inviteID,addresseeID,meetingID,dateSent,accepted) values (?,?,?,?,?)";
	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

// create a friendInvites
app.post('/createFriendInvites', async (req, res) => {
	var id = req.body.addresseeID;
	var senderID = req.body.senderID;
	var dateSent = req.body.dateSent;
	var accepted = 0;

	let array = [id, senderID, dateSent, accepted];
	var sql = "INSERT into `fireworks`.`friendInvites` (addresseeID,senderID,dateSent,accepted) values (?,?,?,?)";
	connection.query(sql, array, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});



// DELETE /
//delete a meeting and any stored rating with it have to use stored procedure
app.delete('/meeting/:meetingID/delete', async (req, res) => {
	
	var id = req.params.meetingID;
	
	//var id = req.param('meetingID');
	//console.log('First log');
	//console.log(id);
	
	if(id)
	{
		connection.query("call Delete_metting(?)", id , function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		});
	}
	else
	{
		return res.status(401).json({ Errors: "Invalid Input" });
	}
});

//delete a friend request
app.delete('/profile/:inviteID/deleteFR', async (req, res) => {
	var id = req.params.inviteID;
	
	connection.query("DELETE FROM friendInvites WHERE inviteID = ?", id, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

//delete a user
app.delete('/user/delete/:UserID', async (req, res) => {
	var id = req.params.UserID;
	
	//var id = req.param('UserID');
	//console.log('First log');
	//console.log(id);
	
	if(id)
	{
		connection.query("call Delete_User(?)", id , function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		});
	}
	else
	{
		return res.status(401).json({ Errors: "Invalid Input" });
	}
	
});

//delete a post
app.delete('/post/:postID/delete', async (req, res) => {
	var id = req.params.postID;
	
	//var id = req.param('postID');
	//console.log('First log');
	//console.log(id);
	
	connection.query("DELETE FROM post WHERE postID = ?", id, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});


// connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
	if (e) {
		throw new Error('Internal Server Error');
	}
	logger.info(`${config.name} running on ${config.host}:${config.port}`);
});