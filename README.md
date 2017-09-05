birthday-email-sender
==================
version 0.0.1

Muzammil Shahbaz

muzammil.shahbaz@gmail.com

## Summary
This small program reads preset birthday events from your Google calendar everyday and sends 'Happy Birthday' emails from your side. 

## Prerequisites
 - Node.js installed. 
 - The npm package management tool (comes with
   Node.js). 
 - Google account.

## Usage
The program uses OAuth 2.0 authorization framework to access your Google Calendar events and Gmail settings. You have to activate Gmail API and Calendar API from [Google Developers Console](https://console.developers.google.com). The step by step process is explained by Google as follows: 

### Get a client ID and client secret

 1. Open the [Google Developers Console](https://console.developers.google.com) page.     
 2. From the project drop-down, choose 'Create a new project', enter a name for the project, e.g., 'Birthday Email Sender'. 
 3. On the Credentials page, select Create credentials, then select OAuth client ID. 
 4. Under Application type, choose Web application. 
 5. Under Authorized redirect URIs, add https://developers.google.com/oauthplayground
 6. Click Create. 
 7. On the page that appears, take note of the **Client ID**
    and **Client Secret**. Save them into `config/client_secret.json` for keys
    *client_id* and *client_secret* respectively.
  
### Generate tokens
1. Go to the [OAuth2 Playground](https://developers.google.com/oauthplayground).
2. Click the gear icon in the upper right corner and check the box labeled 'Use your own OAuth credentials' (if it isn't already checked). Make sure that:
    1. OAuth flow is set to Server-side.
    2. Access type is set to Offline (this ensures you get a refresh token and an access token, instead of just an access token).
3. Enter the OAuth2 client ID and OAuth2 client secret you obtained above.
4. In the section labeled 'Step 1 - Select & authorize APIs', select 
    1. https://www.googleapis.com/auth/calendar.readonly under Calendar API v3
    2. https://mail.google.com/ under Gmail API v1
5. Click Authorize APIs
6. If prompted, log in to the account to which you want to grant access and authorization. Otherwise, allow the app to access Gmail and Calendar.
7. In the tab labeled 'Step 2 - Exchange authorization code for tokens', you should now see an Authorization code. Click 'Exchange authorization code' for tokens.
8. If all goes well, you should see the Refresh token and Access token filled in for you (you may have to re-expand 'Step 2 - Exchange authorization code' for tokens to see these values)
9. Copy the **Refresh token** and save into `config/client_secret.json` for the key *refresh_token*. 

### Setup Email message
1. Open `config/email_message_settings.json` and customize message to suit your taste.
2. Open `config/client_secret.json` and edit the user key to your Google user account.

### Setup birthday notification
You can setup as many birthday events using the following steps:

1. Open Google Calendar in your account
2. Create event as follows 
    1. Add title with prefix **.bd** followed by your friend's name, like this:

> bd. John

The prefix is important. This is how the app identifies the event as a birthday event.

    2. Add description with the name of your friend how you want to address the person, e.g., Jonny and enter the email address in the next line, like this: 

> Jonny 

> john@email.com

### Run the program
Run the app with the command `npm start`.  

This app will read the events for today, and send email if any birthday event is found. Then it will check for events every day at 10am local time.

