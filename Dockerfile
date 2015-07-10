FROM node

RUN apt-get update 
RUN apt-get install -y git sudo python3-setuptools python3-dev postgresql-9.4
RUN easy_install3 pip
RUN npm install -g bower

# Set up "developer" account
RUN mkdir -p /home/developer
RUN /usr/sbin/groupadd --gid 1001 developer
RUN /usr/sbin/useradd --base-dir /home --home-dir /home/developer --uid 1001 --gid 1001 developer
RUN echo "developer ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
RUN chmod 0440 /etc/sudoers

# python setup
ADD requirements.txt /home/developer/
ADD requirements/ /home/developer/requirements/
RUN chown -R developer:developer /home/developer
RUN /usr/bin/easy_install3 pip
RUN /usr/local/bin/pip install -r /home/developer/requirements.txt

USER developer
ENV HOME /home/developer
WORKDIR /home/developer
ADD bower.json /home/developer/
RUN $(npm bin)/bower install
WORKDIR /home/developer/app
CMD /bin/bash

