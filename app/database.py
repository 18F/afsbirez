from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app.config import DevelopmentConfig

#Call init_db to initialize these
engine = None
db_session = None
Base = declarative_base()

def init_db(config_object=DevelopmentConfig):
    engine = create_engine(config_object.SQLALCHEMY_DATABASE_URI, convert_unicode=True)
    db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine)) 
    Base.query = db_session.query_property()

    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import app.model
    Base.metadata.create_all(bind=engine)
