import sqlite3
import sys
import json
import csv

conn = sqlite3.connect('vermontmusic.db')
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS users;")
cur.execute("DROP TABLE IF EXISTS posts;")

create_table ='''CREATE TABLE users('userID' INTEGER PRIMARY KEY NOT NULL UNIQUE, 'username' TEXT NOT NULL UNIQUE, 'password' TEXT NOT NULL)'''
cur.execute(create_table)

create_table ='''CREATE TABLE posts('postID' INTEGER PRIMARY KEY NOT NULL UNIQUE, 'userID' INTEGER NOT NULL, 'review' INTEGER NOT NULL, 'text' TEXT)'''
cur.execute(create_table)

file = open('users.csv')
contents = csv.reader(file)
header = next(contents)

insert_records = "INSERT INTO users('username', 'password') VALUES(?, ?)"
cur.executemany(insert_records, contents)

file = open('posts.csv')
contents = csv.reader(file)
header = next(contents)

insert_records = "INSERT INTO posts('userID', 'review', 'text') VALUES(?, ?, ?)"
cur.executemany(insert_records, contents)

conn.commit()

conn.close()