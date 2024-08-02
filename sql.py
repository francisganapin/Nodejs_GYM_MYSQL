import mysql.connector
from datetime import datetime, timedelta

# Connect to MySQL server
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root"
)

# Create a cursor object
cursor = conn.cursor()

# Create a database
cursor.execute("CREATE DATABASE IF NOT EXISTS memberdb")

# Select the database
cursor.execute("USE memberdb")

# Create the table
cursor.execute('''
CREATE TABLE gym_members (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  ID_CARD VARCHAR(255),
  Expiry DATE,
  Membership VARCHAR(255),
  First_Name VARCHAR(255),
  Last_Name VARCHAR(255),
  Phone_Number VARCHAR(255),
  Address TEXT
);
''')

# Generate 10 records with IDs from 133461 to 133470
base_date = datetime.now()
members_data = []
for i in range(10):
   
    id_card = f'IDCARD{33391 + i}'
    expiry_date = (base_date + timedelta(days=365)).strftime('%Y-%m-%d')
    membership = 'Gold' if i % 2 == 0 else 'Silver'
    first_name = f'First{i+1}'
    last_name = f'Last{i+1}'
    phone_number = f'0917{i:07d}'
    address = f'Address{i+1}'
    members_data.append(( id_card, expiry_date, membership, first_name, last_name, phone_number, address))

# Insert the data
cursor.executemany('''
INSERT INTO gym_members ( ID_CARD, Expiry, Membership, First_Name, Last_Name, Phone_Number, Address)
VALUES ( %s, %s, %s, %s, %s, %s, %s)
''', members_data)

# Commit the transaction
conn.commit()

# Close the connection
conn.close()

print("Database and table created, and records inserted.")
