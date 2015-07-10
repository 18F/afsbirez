To run the application under Docker,

- Install docker (or, on Mac, boot2docker)
- If on Mac, run `boot2docker`
- `./docker-run.sh`
- Within the container, run `python manage.py runserver`, or any of the other commands (like `python manage.py getnaics`).

`./docker-run.sh` is set to automatically remove the container when you exit from it.  However, the 
`/app` folder is a data container for the folder, so any changes you make there will persist on
your host hard disk.



