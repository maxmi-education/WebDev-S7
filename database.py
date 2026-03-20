import pymysql

conn = pymysql.connect(
    host='localhost',
    port=3307,
    user='root',
    password='root',
    database='the_base',
    cursorclass=pymysql.cursors.DictCursor
)