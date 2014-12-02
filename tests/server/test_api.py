import unittest
import logging

from app.models.model import db
from tests.server import hal_loads
from app import create_application
from tests.support import test_data_queries
from tests.settings import TestingConfig


logger = logging.getLogger(__name__)

class ApiTest(unittest.TestCase):
    def setUp(self):
        """Construct temporary database and test client for testing routing and responses"""
        # self.db_fd, self.db_path = tempfile.mkstemp()

        self.afsbirez = create_application(TestingConfig())
        self.test_client = self.afsbirez.test_client()

        #Push a context so that database knows what application to attach to
        self.ctx = self.afsbirez.test_request_context()
        self.ctx.push()
        db.create_all()
        for qry in test_data_queries:
            db.session.execute(qry)
        db.session.commit()

    def tearDown(self):
        """Removes temporary database at end of each test"""
        db.session.remove()
        db.drop_all()

        #Remove the context so that we can create a new app and reassign the db
        self.ctx.pop()


class EndpointsTests(ApiTest):
    """Tests the root endpoint"""

    def test_endpoints(self):
        resp = self.test_client.get('/api/')
        doc = hal_loads(resp.data)

        resp.status_code.should.equal(200)
        resources = ['topics', 'awards', 'users', 'organizations', 'applications', 'forms', 'documents', 'processes']
        for resource in resources:
            doc.links['r:{0}'.format(resource)].url().should.equal('/api/{0}'.format(resource))


class TopicsListTest(ApiTest):
    """Tests of api 'TopicsList' resource"""
    pass

class TopicTest(ApiTest):
    """Tests of api 'Topic' resource"""
    pass

class AwardsListTest(ApiTest):
    """Tests of api 'AwardsList' resource"""
    pass