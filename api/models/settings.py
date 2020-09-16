import pymysql
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker


class Config(object):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@db:3306/cookle_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


engine = create_engine(
    Config.SQLALCHEMY_DATABASE_URI,
    encoding="utf-8",
    echo=True
)
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

Base = declarative_base()
Base.query = db_session.query_property()


def retrun_base():
    return Base
