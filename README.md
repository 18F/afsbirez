SBIR-EZ
========
[![Build Status](https://travis-ci.org/18F/afsbirez.svg?branch=master)](https://travis-ci.org/18F/afsbirez) [![Coverage Status](https://coveralls.io/repos/18F/afsbirez/badge.png)](https://coveralls.io/r/18F/afsbirez)

The SBIR-EZ (_sih-bur-easy_)project, provides a web service and user interface abstraction over the Small Business Innovation Research Program process. Goals of the system are that users may:

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

* Run the bower install
```
$ bower install
```

* Setup the postgresql database
```
$ psql -c 'create database afsbirez_test;' -U postgres
```

### License: Public Domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
