document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Form that sends the email info
  document.querySelector('#compose-form').addEventListener('submit', send_email)

}

function load_mailbox(mailbox) {

  var email_view = document.querySelector('#emails-view');


  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //Print emails
    if(emails.length == 0){
      email_view.innerHTML = '<p style = "font-size: large; font-weight: bold;">There are no Emails !</p>';
    }
    else{
      for(email in emails){

        var mail = document.createElement("div");

        var sender = document.createElement('p');
        var subject = document.createElement('p');
        var time = document.createElement('p');

        sender.style.display = "inline-block";
        subject.style.display = "inline-block";
        time.style.display = "inline-block";

        sender.style.margin = "20px";
        subject.style.margin = "20px";
        time.style.margin = "20px";

        if(emails[email]['read'] == false){
          mail.style.backgroundColor = 'white';
        }
        else{
          mail.style.backgroundColor = 'grey';


        }
        mail.style.border = "double black";




        sender.innerHTML = emails[email]["sender"];
        subject.innerHTML = emails[email]["subject"];
        time.innerHTML = emails[email]["timestamp"];




        mail.appendChild(sender);
        mail.appendChild(subject);
        mail.appendChild(time);

        document.querySelector('#emails-view').append(mail);


      }



    }
  })
}

function send_email(){

  event.preventDefault();


  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {

      load_mailbox('sent');
  })
  .catch(err => console.log(err));




}
