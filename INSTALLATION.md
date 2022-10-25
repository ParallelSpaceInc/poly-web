# Poly

This is main repository for Poly, the model sharing platform.

## Dependancy

Poly server is dependant on AWS S3 and MySQL.

## Build server

To build you Poly Server, perform the following steps.

- Clone repository and install node packages
- Prepare S3Server for Poly server
- Create OAuth ID from Google and Github
- Update .env file
- Run Poly Server

### Cloning repository

To clone Poly repository, execute the commands below.

```bash
$ git clone --depth=1 https://github.com/parallelspaceRE/poly-web
$ cd poly-web
$ npm install
```

### Preparing S3Server

Using AWS S3 may be charged under AWS policy.

Create new S3 Bucket for Poly server.

### Creating OAuth ID

Following steps are guides for server which domain name is **poly-web.com**

If you don't have domain and want to run server for test, you can replace domain name to **http://localhost:3000**.

#### Google

Create OAuth 2.0 Client ID from [Google Cloud console](https://console.cloud.google.com/apis/credentials)

- Click _Create Credentials_ -> OAuth client ID
- Selecet _Web application_
- Fill **https://poly-web.com** for Authorized JavaScript origins
- Fill **https://poly-web.com/api/auth/callback/google** for Authorized redirect URIs
- Click _Create_ Button
- Memo your client id and Secret

#### Github

Create OAuth ID from [Github Developer settings](https://github.com/settings/developers)

- Click _New OAuth App_
- Fill App name
- Fill **https://poly-web.com** for Homepage URL
- Fill **https://poly-web.com/api/auth/callback/github** for Authorized callback URIs
- Click _Register application_
- Click _Generate a new client secret_ then memo the secret and Client ID
