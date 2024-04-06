const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

mongoose.connect('mongodb://localhost/labook', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./public/model/users.js');
const Room = require('./public/model/rooms.js');
const Reservation = require('./public/model/reservations.js');
const roomsData = require('./public/model/premadeRooms.js');
const usersData = require('./public/model/premadeUsers.js')

Room.insertMany(roomsData)
    .then(() => console.log('Rooms data imported...'))
    .catch(err => console.log(err));
User.insertMany(usersData)
    .then(() => console.log('Users data imported...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'thisissecret',
  resave: false,
  saveUninitialized: true 
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/view/index.html'));
});

app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
      const user = await User.findOne({ userId });

      if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
              req.session.user = user;
              res.send('Login successful!');
          } else {
              res.status(401).send('Invalid userId or password.');
          }
      } else {
          res.status(401).send('Invalid userId or password.');
      }
  } catch (error) {
      res.status(500).send('An error occurred');
  }
});

/*
NO BCRYPT LOGIN ROUTE, remove notes to use
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
      const user = await User.findOne({ userId });

      if (user) {
          if (password === user.password) {
              req.session.user = user;
              res.send('Login successful!');
          } else {
              res.status(401).send('Invalid userId or password.');
          }
      } else {
          res.status(401).send('Invalid userId or password.');
      }
  } catch (error) {
      res.status(500).send('An error occurred');
  }
});

*/


app.get('/userprofile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('You must be logged in to view this page.');
  }

  try {
    const user = await User.findById(req.session.user._id);
    const reservations = await Reservation.find({ user: user._id }).populate('room');
    res.render('userprofile.html', { user, reservations });
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

app.get('/room1', (req, res) => {
  res.render('./public/view/room1.html'); 
});

app.get('/room2', (req, res) => {
  res.render('./public/view/room2.html');
});

app.get('/room3', (req, res) => {
  res.render('./public/view/room3.html');
});

app.get('/room4', (req, res) => {
  res.render('./public/view/room4.html');
});

app.get('/room5', (req, res) => {
  res.render('./public/view/room5.html');
});

app.post('/signup', async (req, res) => {
  const { username, email, password, type, description } = req.body;

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Count the number of existing users
      const userCount = await User.countDocuments({});

      // Assign the userId
      const userId = userCount + 1;

      const user = new User({ userId, username, email, password: hashedPassword, type, description });
      await user.save();
      req.session.user = user;
      res.send('Signup successful!');
  } catch (error) {
      if (error.code === 11000){
          res.status(400).send('Username or email already exists.');
      } else {
          res.status(500).send('An error occurred during signup.');
      }
  }
});


/*
NO BCRYPT SIGNUP ROUTE
app.post('/signup', async (req, res) => {
    const { userId, username, email, password, type, description } = req.body;

    try {
        const user = new User({ userId, username, email, password, type, description });
        await user.save();
        req.session.user = user;
        res.send('Signup successful!');
    } catch (error) {
        if (error.code === 11000){
            res.status(400).send('Username or email already exists.');
        } else {
            res.status(500).send('An error occurred during signup.');
        }
    }
});


*/

app.get('/users', async (req, res) => {
  try{
    const users = await User.find({});
    res.json(users);
  } catch(error){
    res.status(500).send('An error occurred.');
  }
});

app.get('/rooms', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('./public/view/login.html');
  }
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).send('An error occurred.');
  };
});

app.get('/get-user-data', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const currentUser = await User.findById(req.session.user._id);
    if (currentUser) {
      res.json(currentUser);
    } else {
      res.status(500).send("Error: User data not found");
    }
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

app.get('/get-all-students', async (req, res) => {
  try {
    const students = await User.find({ type: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

app.post('/update-user-data', async (req, res) => {
  const { username, email, description } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      user.email = email;
      user.description = description;
      await user.save();
      res.send('User data updated successfully!');
    } else {
      res.status(400).send('User not found.');
    }
  } catch (error) {
    res.status(500).send('An error occurred during update.');
  }
});

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/');
});

app.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send('Old password is incorrect.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();

    res.send('Password changed successfully.');
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});


app.get('/login-status', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/get-room-data/:roomName', async (req, res) => {
  const roomName = req.params.roomName;

  try {
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.json({ room: null, availableTimeslots: [], availableSeats: [] });
    }

    const reservations = await Reservation.find({ room: room._id });

    const availableTimeslots = getAvailableTimeslots(room, reservations);
    const availableSeats = getAvailableSeats(room, reservations);

    res.json({
      room,
      availableTimeslots,
      availableSeats 
    });
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

function getAvailableTimeslots(room, reservations) {
  let availableTimeslots = [...room.timeslots];

  reservations.forEach(reservation => {
    availableTimeslots = availableTimeslots.filter(timeslot => timeslot.startTime !== reservation.timeslot.startTime || timeslot.endTime !== reservation.timeslot.endTime);
  });

  return availableTimeslots;
}

function getAvailableSeats(room, reservations) {
  let availableSeats = Array.from({ length: room.roomCapacity }, (_, i) => `Seat ${i + 1}`);

  reservations.forEach(reservation => {
    availableSeats = availableSeats.filter(seat => seat !== reservation.seat);
  });

  return availableSeats;
}


app.post('/book', async (req, res) => {
  const { username, roomName, date, timeslot, seat } = req.body;

  try {
      const newReservation = new Reservation({
          user: username,
          room: roomName,
          date,
          timeslot,
          seat
      });

      await newReservation.save();
      res.json({ message: 'Booking successful!', reservation: newReservation });
      res.json({ message: 'Booking successful!', redirect: 'index.html' });
  } catch (error) {
      console.error('Error saving reservation:', error);
      res.status(500).send('An error occurred while saving the reservation.');
  }
});

app.get('/get-user-reservations', async (req, res) => {
  const username = req.query.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const reservations = await Reservation.find({ user: user._id }).populate('room');
    res.json(reservations);
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
