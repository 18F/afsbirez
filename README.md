SBIR-EZ
========
[![Build Status](https://travis-ci.org/18F/afsbirez.svg?branch=master)](https://travis-ci.org/18F/afsbirez)

The SBIR-EZ (_sih-bur-easy_)project, provides a web service and user interface abstraction over the Small Business Innovation Research Program suite of tools used by SBIR.gov, DoDSBIR.com and various agency tools. The intent is that users may have a uniform interface to:

* Research existing and past SBIR solicitations
* Save opportunities for later processing
* Apply to opportunities independently of the owning agency
* Track the status of applications
* Receive and send communications
* View benchmarks

Please file issues at the [central repository for all Air Force Small Business repo](https://github.com/18f/afsmallbiz/issues?labels=Product%3A+SBIR&page=1&state=open)

### Installation
* Install PostGRESql
* Install Node.js 0.10+
* Update NPM to the latest version 
```
$ npm install npm -g
```
* Install bower and grunt command line clients
```
$ npm install -g bower grunt-cli
```

* Install Sass and Compass gems
```
$ gem install sass
$ gem install compass
```

* Install node depedencies
```
$ npm install
```

* Run the bower install
```
$ bower install
```

### Configure the Database
At this time, the development instance of sbir-ez connects to the local postgres installation using a user name matching your system user name and no password. 

Configure the pg_hba.conf file on your system (location varies) to allow local connections without passwords. Your hba.conf should have
lines like the below:
```
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
```

Create a database and role with your system user name
```
$ psql -c 'CREATE ROLE <youruser> LOGIN;' -U postgres
$ psql -c 'CREATE DATABASE afsbirez_dev WITH OWNER <youruser>;' -U postgres
```

### Running the Server

Use grunt to run the server. This will also open up a browser window to your application.
```
$ grunt serve
```

The first time you run the 

### Running Tests

First create a postgres database and test user

```
$ psql -c `create database afsbirez_test WITH OWNER <youruser>;` -U postgres
```

### License: Public Domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
