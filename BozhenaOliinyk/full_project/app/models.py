from sqlalchemy import (
    Integer, Text, Boolean, ForeignKey, Column, LargeBinary
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, declarative_base
from sqlalchemy.dialects.postgresql import ARRAY


Base = declarative_base()


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    login: Mapped[str | None] = mapped_column(Text, nullable=True)
    email: Mapped[str | None] = mapped_column(Text, nullable=True)
    password: Mapped[str | None] = mapped_column(Text, nullable=True)

    bird: Mapped[list["Bird"]] = relationship("Bird", back_populates="user")
    favorite: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="user")



class Bird(Base):
    __tablename__ = "bird"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    photo: Mapped[list[bytes] | None] = mapped_column(ARRAY(LargeBinary), nullable=True)
    species: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(Text, nullable=True)

    id_user: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("user.id"),
        nullable=True
    )
    user: Mapped["User"] = relationship("User", back_populates="bird")
    favorite: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="bird")



class Favorite(Base):
    __tablename__ = "favorite"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    id_bird: Mapped[int | None] = mapped_column(Integer, ForeignKey("bird.id"), nullable=True)
    id_user: Mapped[int | None] = mapped_column(Integer, ForeignKey("user.id"), nullable=True)

    bird: Mapped["Bird"] = relationship("Bird", back_populates="favorite")
    user: Mapped["User"] = relationship("User", back_populates="favorite")
