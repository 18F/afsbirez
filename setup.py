from setuptools import setup
from pip.req import parse_requirements

# parse_requirements() returns generator of pip.req.InstallRequirement objects
install_reqs = parse_requirements('requirements.txt')

# reqs is a list of requirement
# e.g. ['django==1.5.1', 'mezzanine==1.4.6']
reqs = [str(ir.req) for ir in install_reqs]

setup(name='sbirez',
      version='0.0.0',
      description='Small Business Innovation Research (SBIR) - EZ ',
      author='18f',
      author_email='18f@gsa.gov',
      url='http://sbirez.gsa.gov',
      install_requires=reqs
     )
