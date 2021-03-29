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
  document.querySelector('#show-email').style.display = 'none';


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
  document.querySelector('#show-email').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //Print emails
    if(emails.length == 0){
      console.log('emails');
      email_view.innerHTML = '<p style = "font-size: large; font-weight: bold;">There are no Emails !</p>';
    }
    else{
      for(let email in emails){

        var mail = document.createElement("div");

        var sender = document.createElement('p');
        var subject = document.createElement('p');
        var time = document.createElement('p');


        //Button to read an email
        var read_b = document.createElement("button");
        read_b.innerHTML ="Read";

        // Event Listener to Read an EMail
        read_b.addEventListener('click',() => view_email(emails[email]["id"]));

        //Button to archive or unarchive an email
        var archive = document.createElement("button");


        sender.style.display = "inline-block";
        subject.style.display = "inline-block";
        time.style.display = "inline-block";
        read_b.style.display = "inline-block";


        sender.style.margin = "20px";
        subject.style.margin = "20px";
        time.style.margin = "20px";
        read_b.style.margin = "20px";

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

        mail.appendChild(read_b);


        if(mailbox === "inbox"){
          archive.innerHTML = "Archive";
          archive.addEventListener('click',() => change_archive(emails[email]["id"],false));
          mail.appendChild(archive);


        }
        else if(mailbox === "archive"){
          archive.innerHTML = "Unarchive";
          archive.addEventListener('click',() =>  change_archive(emails[email]["id"],true));
          mail.appendChild(archive);

        }

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

function view_email(id){


  // console.log(id);

  // Show the show_email div and hide the others
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#show-email').style.display = 'block';

  var show_email = document.querySelector('#show-email');


  // Checks if the div has a child,if a child exists then its removed
  if(show_email.firstChild){
    show_email.removeChild(show_email.firstChild);

  }

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    //Creates div that will have attached all the info from the email


    var mail = document.createElement("div");
    var sender = document.createElement('h5');
    var subject = document.createElement('h6');
    var time = document.createElement('p');
    var body = document.createElement('p');
    var reci = document.createElement('p');


    sender.innerHTML = "Sender: " + email["sender"];
    subject.innerHTML = "Subject: " + email["subject"];
    time.innerHTML = email["timestamp"];
    body.innerHTML = "Body of the Email:" + "<br /><br />" + email["body"];
    reci.innerHTML = "Recipients: " + email["recipients"];


    mail.appendChild(sender);
    mail.appendChild(subject);
    mail.appendChild(time);
    mail.appendChild(body);
    mail.appendChild(reci);

    // Check if the email has been read yet

    if(email["read"]== false){

      fetch(`/emails/${id}`,{
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })

    }
    //Adding the mail to the div show-email
    document.querySelector('#show-email').append(mail);

  })
}

function change_archive(id,flag){


  //Unarchive
  if(flag == true){
    fetch(`/emails/${id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    load_mailbox('archive');

  }
  //Archive
  else if(flag == false){
    fetch(`/emails/${id}`,{
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
    load_mailbox('inbox');



  }






}
