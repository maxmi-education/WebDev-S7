from flask import Flask, render_template, redirect, jsonify, request
import pymysql

app = Flask(__name__)

conn = pymysql.connect(host='localhost', user='root', password='root', database='the_base', cursorclass=pymysql.cursors.DictCursor)

@app.route("/api/insert_sample_user")
def insertSampleUser():
    instance = conn.cursor()
    instance.execute('INSERT INTO users (last_name, first_name, email) VALUES (%s, %s, %s)', 
                     ('Max', 'Michel', 'michel.max@education.lu'))
    conn.commit()
    return "OK"

@app.route("/api/insert_user", methods=['POST'])
def insertUser():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "Invalid JSON payload"})
    
    lastName = data.get('last_name')
    firstName = data.get('first_name')
    email = data.get('email')

    instance = conn.cursor()
    instance.execute('INSERT INTO users (last_name, first_name, email) VALUES (%s, %s, %s)', 
                     (lastName, firstName, email))
    conn.commit()
    newID = instance.lastrowid
    return jsonify({"status": "created", "id": newID})


@app.route("/api/get_all_users")
def getAllUsers():
    instance = conn.cursor()
    instance.execute('SELECT * FROM users')
    return jsonify(instance.fetchall())


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/basics")
def basics():
    return render_template("js_basics.html")

@app.route("/timer")
def timer():
    return render_template("timer.html")

@app.route("/rotato")
def rotato():
    return render_template("rotato.html")

@app.route('/favicon.ico')
def favicon():
    return redirect("/static/favicon.ico")

@app.route("/shooter")
def shooter():
    return render_template("games/shooter.html", title="Shooter")

@app.route("/memory")
def memory(): 
    return render_template("games/memory.html", title="Memory")

@app.route("/bandit")
def bandit():
    return render_template("games/bandit.html", title="One Armed Bandit")

@app.errorhandler(404)
def not_found(error):
    return "404"


if __name__ == "__main__":
    app.run(debug=True)