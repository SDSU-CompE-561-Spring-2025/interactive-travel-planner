from sqlalchemy import Column, Integer, String, ForeignKey, Table, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.itineraries import Itinerary
from app.models.association import itinerary_trip_association, trip_collaborators

# Friends association table
user_friends = Table(
    'user_friends',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('friend_id', Integer, ForeignKey('users.id'), primary_key=True)
)

# Friend requests table
friend_requests = Table(
    'friend_requests',
    Base.metadata,
    Column('sender_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('receiver_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    social = Column(Text, nullable=True)  # Store as JSON string

    collaborating_trips = relationship(
        "Trip",
        secondary=trip_collaborators,
        back_populates="collaborators"
    )

    # Friends relationships
    friends = relationship(
        "User",
        secondary=user_friends,
        primaryjoin=id==user_friends.c.user_id,
        secondaryjoin=id==user_friends.c.friend_id,
        backref="friend_of"
    )

    # Friend requests sent
    sent_friend_requests = relationship(
        "User",
        secondary=friend_requests,
        primaryjoin=id==friend_requests.c.sender_id,
        secondaryjoin=id==friend_requests.c.receiver_id,
        backref="received_friend_requests"
    )

Itinerary.trips = relationship('Trip', secondary=itinerary_trip_association, back_populates='itineraries')
