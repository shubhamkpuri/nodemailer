const socket = io();
socket.on('user', (user) => {
    M.toast({
        html: `User ${user.name} created <i class="material-icons right">done</i>`,
        classes: 'green rounded'
    });
});
socket.on('sent', (data) => {
    M.toast({
        html: 'Mail sent Successfully <i class="material-icons right">done</i>',
        classes: 'green rounded'
    });
    document.getElementById('createContact').disabled=false;

});
socket.on('error', (data) => {
    M.toast({
        html: 'Entered Email not correct <i class="material-icons right">cancel</i>',
        classes: 'red rounded'
    });
    document.getElementById('createContact').disabled=false;

});

function send() {
    var email = document.getElementById('email').value;
    var name = document.getElementById('name').value;
    if(email=='' || name==''){
        alert('Fill both fields');
        return false;
    }
    document.getElementById('createContact').disabled=true;
    fetch("/", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        })
        .then((res) => {
            document.getElementById('name').value='';
            document.getElementById('email').value='';
            console.log(res);
        })
        .catch((err) => {
            M.toast({
                html: 'Something Worng <i class="material-icons right">cancel</i>',
                classes: 'red rounded'
            });
        });


}
