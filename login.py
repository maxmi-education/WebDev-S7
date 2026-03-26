from flask import Flask, render_template, redirect, jsonify, request, session, Blueprint
from database import conn

import flask_login
import bcrypt

login_bp = Blueprint('login', __name__)


class User(flask_login.UserMixin):
    id = None
    name = 'Anonymous'

    def get_id(self):
        return str(self.id) if self.id else None


def authenticate(email, password):
    instance = conn.cursor()
    instance.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
    conn.commit()
    if (instance.rowcount == 0):
        return None
    result = instance.fetchone()
    if bcrypt.checkpw(password.encode('utf-8'), result['password_hash'].encode('utf-8')):
        return result['id']
    else:
        return None


@login_bp.route("/api/register_user", methods=['POST']) # modification of insert_user
def insertUserPOST():
    data = request.form
    if not data:
        return jsonify({"status" : "error", "message": "invalid payload"})

    lastName = data.get('last_name')
    firstName = data.get('first_name')
    email = data.get('email')
    password = data.get('password')
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        instance = conn.cursor()
        instance.execute('INSERT INTO users (last_name, first_name, email, password_hash) VALUES (%s, %s, %s, %s)',
                        (lastName, firstName, email, hashed_password))
        conn.commit()
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    return jsonify({"status": "success", "message": "Account created!"})

@login_bp.route("/api/login_user", methods=['POST'])
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
        user.name = email
        flask_login.login_user(user)
        return jsonify({"status": "success", "message": "Logged in successfully!"})

@login_bp.route("/api/logout_user", methods=['POST', 'GET'])
def logoutUser():
    flask_login.logout_user()
    return jsonify({"status":"success", "message": "Log out successful"})
