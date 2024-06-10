# Readme.md
## Deployment
Deploy in a Linux machine
### Ditto
Eclipse Ditto is a framework used for creating and managing digital twins of real physical devices. Digital twins are virtual representations of physical objects or systems that can be used to simulate, analyze, and control the physical counterparts.

`$ git clone https://github.com/eclipse-ditto/ditto.git`

To start Ditto:
`$ cd deployment && cd docker && docker-compose up -d`

To stop Ditto:
`$ docker-compose down`

More info in deployment:
https://github.com/eclipse-ditto/ditto/tree/master/deployment/docker

MQTT example: 
https://github.com/eclipse-ditto/ditto-examples/tree/master/mqtt-quick-introduction

HTTP API:
https://eclipse.dev/ditto/http-api-doc.html


### React - Frontend
Development:
`$ git clone https://github.com/quanrzsgcm/IoTScada2.git`
`$ cd SolarMonitoringv3antd5x`

I use AntDesign as a component library for React:
https://ant.design/components/overview/
To render charts, use Apex Chart (React Version):
https://apexcharts.com/docs/react-charts/


Install packages:
`$ npm install`
`$ npm start`
This will run the react server on  <https://localhost:3000>
Build:
`$ npm build`
This will make a build folder contain static files.

### Django - Backend'
Create a virtual environment to use Django:
Check python and pip:
`python --version`
`pip --version`
pip install virtualenv

Create a virtual environment:
`virtualenv venv`

Activate the environment before using Django:
`source venv/bin/activate`

Now that you are on the virtual environment, the CLI will look like this:
`(venv) your-username@your-computer:~/your-project-directory$`


First go to `myapp` folder:
`(venv) $ cd myapp`

 To install required packages (e.g. Django), run :
`(venv) $ pip install -r requirements.txt` 
This detects the change, upgrades the package, and leaves everything else alone.

Then to run Django:
`(venv) $ cd backend`
`(venv) $ python manage.py runserver`
This will run the django server on localhost:8000
To run on a specific interface use 
`(venv) $ python manage.py runserver <IP Address>:<port number>`

Whenever you change the models.py file run:
`(venv) $ python manage.py makemigrations`
This will make SQL command files. you can check this file first then run
`(venv) $ python manage.py migrate`
to let Django apply SQL commands to your database (Postgres in this case)

Django tutorial: https://www.w3schools.com/django/

### PostgreSQL - Database
A powerful, open-source relational database management system. We use it mostly to store time-series data, but we can store anything that can be organize into a table.

Check if the Linux machine has already install Postgres:
`psql --version`

`psql` is a command-line interface (CLI) tool used to interact with PostgreSQL, more info:
https://hasura.io/blog/top-psql-commands-and-flags-you-need-to-know-postgresql

`sudo systemctl status postgresql`

Download Postgres if your machine does not have it: 
<https://www.postgresql.org/download/linux/>

By default Postgres runs on port 5432


### Authentication between React and Django
https://github.com/seankwarren/Django-React-jwt-authentication





