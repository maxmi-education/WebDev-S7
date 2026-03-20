from flask import Flask, render_template, redirect, jsonify, request, session
import pymysql
import flask_login
import bcrypt

from database import conn
from comments import comments_bp
from scores import scores_bp
from login import login_bp, User

app = Flask(__name__)
app.secret_key = 'k573U@ge#%RyQ@DoTe5'


app.register_blueprint(comments_bp)
app.register_blueprint(scores_bp)
app.register_blueprint(login_bp)


login_manager = flask_login.LoginManager()
login_manager.init_app(app)

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