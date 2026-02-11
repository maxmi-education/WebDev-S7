from flask import Flask, render_template, redirect, jsonify, request, session
import pymysql
import flask_login
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.secret_key = 'k573U@ge#%RyQ@DoTe5'

bcrypt = Bcrypt(app)

conn = pymysql.connect(
    host='localhost',
    port=3307, 
    user='root',
    password='root', 
    database='the_base', 
    cursorclass=pymysql.cursors.DictCursor
)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

class User(flask_login.UserMixin):
    id = None

    def get_id(self):
        return str(self.id) if self.id else None

@login_manager.user_loader
def user_loader(id):
    user = User()
    instance = conn.cursor()
    instance.execute('SELECT id FROM users WHERE id = %s', (id,))
    result = instance.fetchone()
    if result:
        user.id = result['id']
        return user
    return None  # User not found

def authenticate(email, password):
    instance = conn.cursor()
    instance.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
    conn.commit()
    if (instance.rowcount == 0):
        return None
    result = instance.fetchone()
    if bcrypt.check_password_hash(result['password_hash'], password):
        return result['id']
    else:
        return None


@app.route("/api/register_user", methods=['POST']) # modification of insert_user
def insertUserPOST():
    data = request.form
    if not data:
        return jsonify({"status" : "error", "message": "invalid payload"})
    
    lastName = data.get('last_name')
    firstName = data.get('first_name')
    email = data.get('email')
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        instance = conn.cursor()
        instance.execute('INSERT INTO users (last_name, first_name, email, password_hash) VALUES (%s, %s, %s, %s)', 
                        (lastName, firstName, email, hashed_password))
        conn.commit()
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    return jsonify({"status": "success", "message": "Account created!"})

@app.route("/api/login_user", methods=['POST'])
def loginUser():
    data = request.form
    if not data:
        return jsonify({"status" : "error", "message": "invalid payload"})
    
    email = data.get('email')
    password = data.get('password')
    auth = authenticate(email, password)
    if auth == None:
        return jsonify({"status": "error", "message": "Invalid password or email address"})
    else:
        user = User()
        user.id = auth
        flask_login.login_user(user)
        return jsonify({"status": "success", "message": "Logged in successfully!"}) 

@app.route("/api/logout_user", methods=['POST', 'GET'])
def logoutUser():
    flask_login.logout_user()
    return jsonify({"status":"success", "message": "Log out successful"})

@app.route("/api/get_comments", methods=['GET'])
def getComments():
    data = request.args
    page_name = data.get('page', 'home')  # default to 'home' if not specified
    
    instance = conn.cursor()
    instance.execute(
        'SELECT author_name, message, created_at FROM comments WHERE page_name = %s ORDER BY created_at DESC',
        (page_name,)
    )
    comments = instance.fetchall()
    
    return jsonify({
        'status': 'success',
        'comments': comments
    })

@app.route("/api/insert_sample_user")
def insertSampleUser():
    instance = conn.cursor()
    instance.execute('INSERT INTO users (last_name, first_name, email) VALUES (%s, %s, %s)', 
                     ('Max', 'Michel', 'michel.max@education.lu'))
    conn.commit()
    return "OK"

@app.route("/api/insert_user", methods=['GET'])
def insertUserGET():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})
    
    if not 'email' in data:
        return jsonify({"status": "error", "message": "Missing email"}) 
    
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

@app.route("/api/get_all_scores")
def getAllScores():
    instance = conn.cursor()
    instance.execute('SELECT users.first_name, users.last_name, scores.score FROM users JOIN scores ON users.id = scores.user_id')
    return jsonify(instance.fetchall())

@app.route("/api/get_high_scores", methods=['GET'])
def getHighScores():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})
    
    if not 'number' in data or not data.get('number').isnumeric():
        return jsonify({"status": "error", "message": "Missing or wrong number"}) 

    instance = conn.cursor()
    instance.execute('SELECT users.first_name, users.last_name, scores.score FROM users JOIN scores ON users.id = user_id ORDER BY scores.score desc limit %s', [int(data.get('number'))])
    return jsonify(instance.fetchall())

@app.route("/api/add_score", methods=['GET'])
def addScoreGET():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})
    
    if not 'user_id' in data:
        return jsonify({"status": "error", "message": "Missing user id"}) 

    instance = conn.cursor()
    instance.execute('INSERT INTO scores (score, user_id) VALUES (%s, %s)', 
                     (int(data.get('score')), int(data.get('user_id'))))
    conn.commit()
    newID = instance.lastrowid
    return jsonify({"status": "created", "id": newID})

@app.route("/api/get_user_scores", methods=['GET'])
def getUserScores():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})
    
    if not 'user_id' in data or not data.get('user_id').isnumeric():
        return jsonify({"status": "error", "message": "Missing or wrong user id"}) 

    instance = conn.cursor()
    instance.execute('SELECT users.first_name, users.last_name, scores.score FROM users JOIN scores ON users.id = user_id WHERE users.id=%s ORDER BY scores.score desc', [int(data.get('user_id'))])
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

@app.route("/database")
def database():
    return render_template("database.html", title="DataBase")

@app.route("/create_account")
def create_account():
    return render_template("create_account.html", title="Create an Account")

@app.route("/login")
def login_page():
    return render_template("login.html", title="Log In")

@app.route("/protected")
@flask_login.login_required
def protected_page():
    return render_template("protected_page.html", title="Protected")

@app.route("/changing")
def changing_page():
    return render_template("changing_page.html", title="Changing")


@app.errorhandler(404)
def not_found(error):
    return "404"

@app.errorhandler(401)
def not_authorized(error):
    return render_template("login.html", title="Log In")



if __name__ == "__main__":
    app.run(debug=True)