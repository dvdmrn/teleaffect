const express = require('express')
const path = require('path')
const { get } = require('request')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = require('http').createServer(app);
const io = require('socket.io')(server);
var ss = require('socket.io-stream');
const viewNamespace = io.of('/view');




server.listen(3000);

var allClients = [];

console.log("hello");

const viewsDir = path.join(__dirname, 'static')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))

app.get('/', (req, res) => res.redirect('/'))
app.get('/client', (req, res) => res.sendFile(path.join(viewsDir, 'client.html')))
app.get('/view', (req, res) => res.sendFile(path.join(viewsDir, 'view.html')))


// io.on('connection', () => { console.log('connection event uwu') });
io.on('connection', function(socket) {
  console.log(`client connected! ${socket.id}`)
  allClients.push(socket);
  // socket.emit('addClient', socket.id);
  viewNamespace.emit('addClient',socket.id);

  // user disconnect event
  socket.on('disconnect', data=>{
    console.log(`client disconnected! ${socket.id}`)
    viewNamespace.emit('removeClient',socket.id);
    let i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  })

  socket.on('positionalData', data => {
    data.id = socket.id;
    io.emit('pos', data);
    viewNamespace.emit('pos',data);

  });
});

viewNamespace.on('connection',(socket)=>{
  console.log(`viewer connected! ${socket.id}`);
})