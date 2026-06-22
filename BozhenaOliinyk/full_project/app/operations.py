from sqlalchemy.orm import Session
from sqlalchemy import select, func
from models import User, Bird, Favorite


def create_user(db: Session, login: str, email: str, password_hash: str) -> User:
    new_user = User(login=login, email=email, password=password_hash)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def log_in_user(db: Session, identification: str) -> User | None:
    if "@" in identification :
        query = select(User).where(User.email == identification)
    else:
        query = select(User).where(User.login == identification)
    return db.scalars(query).first()



def get_all_birds(db: Session) -> list[Bird]:
    query = select(Bird)
    return list(db.scalars(query).all())

def get_bird_likes(db: Session, bird_id: int) -> list[int]:
    query = select(func.count(Favorite.id_user)).where(Favorite.id_bird == bird_id)
    return db.scalar(query) or 0

def get_birds_by_user_id(db: Session, user_id: int) -> list[Bird]:
    query = select(Bird).where(Bird.id_user == user_id)
    return list(db.scalars(query).all())


def create_bird(db: Session, species: str, location: str, user_id: int, photo: list[bytes]) -> Bird:
    new_bird = Bird(
        species=species,
        location=location,
        id_user=user_id,
        photo=photo
    )
    db.add(new_bird)
    db.commit()
    db.refresh(new_bird)
    return new_bird


def update_bird(db: Session, bird_id: int, user_id: int, new_species: str, new_location: str,
                new_photo: list[bytes]) -> Bird | None:
    bird = db.get(Bird, bird_id)

    if bird and bird.id_user == user_id:
        bird.species = new_species
        bird.location = new_location
        bird.photo = new_photo
        db.commit()
        db.refresh(bird)
        return bird
    return None



def get_user_favorite_bird_ids(db: Session, user_id: int | None) -> list[int]:
    if not user_id:
        return []

    query = select(Favorite.id_bird).where(Favorite.id_user == user_id)
    return list(db.scalars(query).all())


def toggle_favorite(db: Session, user_id: int, bird_id: int) -> bool:
    query = select(Favorite).where(Favorite.id_user == user_id, Favorite.id_bird == bird_id)
    existing_fav = db.scalars(query).first()

    if existing_fav:
        db.delete(existing_fav)
        db.commit()
        return False
    else:
        new_fav = Favorite(id_user=user_id, id_bird=bird_id)
        db.add(new_fav)
        db.commit()
        return True