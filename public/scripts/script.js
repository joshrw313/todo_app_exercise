console.log('local script added');
const deleteMethod = {
 method: 'DELETE', // Method itself
}
const patchMethod = {
 method: 'PATCH',
}
const deleteButtons = Array.from(document.getElementsByClassName('removeButton'));
const incompletes = Array.from(document.getElementsByClassName('incomplete'));

deleteButtons.forEach(button => 
button.addEventListener('click', (evt) => {
evt.preventDefault();
fetch(`/tasks/${button.id}`, deleteMethod) 
.then(response => response) // This is needed to ensure that promise on the backend is allowed to finish before refreshing the page
.then(response => location.assign('/tasks')) // Manipulate the data retrieved back, if we want to do something with it
.catch(err => console.log(err)) // Do something with the error
}))

incompletes.forEach(tag => {
	tag.addEventListener('click', (evt) => {
		evt.preventDefault();
		fetch(`/tasks/${tag.id-99}/is_completed`, patchMethod)
		.then(response => response)
		.then(response => location.assign('/tasks'))
	})
})