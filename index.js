const pgp = require('pg-promise')();
const db = pgp('postgres://josh@127.0.0.1:5432/todo_app');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

//app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.post('/tasks',(req,res) => {
	console.log(req);
	db.any(`insert into tasks (title)
		values ($1)`,[req.body.newTask])
		.then(value => {
	db.any(`select * from tasks`)
		.then((value) => {
			let str = '';
			let status = '';
			value.forEach(item => {
				console.log(item.is_completed);
				if (item.is_completed == true) {
					status = 'complete';
				}
				else {
					status = 'incomplete';
				}
				str+=`<li><button class="removeButton" id=${item.id}>X</button>${item.title} >> <span class=${status} id='${status}${item.id}' name=${item.id}>${status}</span></li>`
			})

			res.render('main',{
			locals: {
				tasks: str
			}
		})
	})
		.catch(err => console.log(err))})
		.catch(error => console.log(error));
	
});

app.get('/tasks',(req,res) => {
	db.any(`select * from tasks`)
		.then((value) => {
			let str = '';
			let status = 'incomplete';
			value.forEach(item => {
				if (item.is_completed == true) {
					status = 'complete';
				} else {
					status = 'incomplete';
				}
				str+=`<li><button class="removeButton" id=${item.id}>X</button>${item.title} >> <span class=${status} id='${item.id+99}' name='${item.id}'>${status}</span></li>`
			});
			res.render('main',{
			locals: {
				tasks: str
			}
		})
	})
		.catch(err => console.log(err));
		
});

app.patch('/tasks/:id/is_completed',(req,res) => {
	const {id} = req.params;
	db.none(`
		update tasks
		set is_completed = true
		where id = $1	
	`,[id])
		.catch(error => console.log(error));
	res.send(`task ${id} marked as complete`);
});

app.delete('/tasks/:id', (req,res) => {
	const {id} = req.params;
	db.any(`
		delete from tasks
		where id = $1
	`,[id])
		.then(x => res.send('success'))
		.catch(error => console.log(error));
});

/*db.any('select * from tasks')
	.then(value => console.log(value))
	.catch(error => console.log(error));
*/

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
