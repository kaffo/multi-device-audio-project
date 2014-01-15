multi-device-audio-project
==========================

!WARNING!
DEVELOPMENT BRANCH

Third year University of Glasgow Computer Science project     
Project Supervisor:Dr John H. Williamson - JohnH.Williamson@glasgow.ac.uk

Project will allow for multiple users on Android devices to capture audio and then upload recordings to a server. On a web client, users will be able to interact with different users recordings as they sync up in time in the same location. Imagined case uses could be demonstrations, concerts or disaster areas.

Contributors:

Keir 'Kaffo' Smith,
Ally Weir,
Peter Yordanov,
Georgi Dimitrov,
and Gordon Adam

=========================

_Installation_

1. Clone this repo
2. cd to repo location
3. sudo apt-get install mysql mysql-server mysql-python
4. pip install south
5. mysql -u root -p
6. CREATE DATABASE mdrsDatabase;
7. CREATE USER 'mdrs'@'localhost' IDENTIFIED BY 't34mt34mt';
8. GRANT ALL PRIVILIGES ON mdrsDatabase.* TO 'mdrs'@'localhost';
9. quit
10. python manage syncdb
11. python manage migrate
12. python runserver 0.0.0.0:8080
