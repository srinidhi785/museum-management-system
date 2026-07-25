import pandas as pd
from database import SessionLocal
from models import Artist, Artwork

db = SessionLocal()

# ==========================
# Load Artists CSV
# ==========================
artists = pd.read_csv("dataset/artists.csv")

for index, row in artists.iterrows():
    try:
        artist = Artist(
            id=int(row["Artist ID"]),
            name=str(row["Name"]) if pd.notna(row["Name"]) else None,
            nationality=str(row["Nationality"]) if pd.notna(row["Nationality"]) else None,
            gender=str(row["Gender"]) if pd.notna(row["Gender"]) else None,
            birth_year=int(row["Birth Year"]) if pd.notna(row["Birth Year"]) else None,
            death_year=int(row["Death Year"]) if pd.notna(row["Death Year"]) else None,
        )

        db.add(artist)

    except Exception as e:
        print(f"Error in Artists row {index}")
        print(row)
        print(e)
        break

try:
    db.commit()
    print("Artists inserted successfully")
except Exception as e:
    db.rollback()
    print("Error while inserting artists:")
    print(e)

# ==========================
# Load Artworks CSV
# ==========================
artworks = pd.read_csv("dataset/artworks.csv")

for index, row in artworks.iterrows():
    try:
        artwork = Artwork(
            id=int(row["Artwork ID"]),
            title=str(row["Title"]) if pd.notna(row["Title"]) else None,
            artist_id=int(str(row["Artist ID"]).split(",")[0].strip()) if pd.notna(row["Artist ID"]) else None,
            department=str(row["Department"]) if pd.notna(row["Department"]) else None,
            classification=str(row["Classification"]) if pd.notna(row["Classification"]) else None,
            object_date=str(row["Date"]) if pd.notna(row["Date"]) else None,
        )

        db.add(artwork)

    except Exception as e:
        print(f"Error in Artworks row {index}")
        print(row)
        print(e)
        break

try:
    db.commit()
    print("Artworks inserted successfully")
except Exception as e:
    db.rollback()
    print("Error while inserting artworks:")
    print(e)

db.close()