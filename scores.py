from flask import Blueprint, request, jsonify
from database import conn

scores_bp = Blueprint('scores', __name__)

@scores_bp.route("/api/insert_sample_user")
def insertSampleUser():
    instance = conn.cursor()
    instance.execute('INSERT INTO users (last_name, first_name, email) VALUES (%s, %s, %s)',
                     ('Max', 'Michel', 'michel.max@education.lu'))
    conn.commit()
    return "OK"

@scores_bp.route("/api/insert_user", methods=['GET'])
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


@scores_bp.route("/api/get_all_users")
def getAllUsers():
    instance = conn.cursor()
    instance.execute('SELECT * FROM users')
    return jsonify(instance.fetchall())

@scores_bp.route("/api/get_all_scores")
def getAllScores():
    instance = conn.cursor()
    instance.execute('SELECT users.first_name, users.last_name, scores.score FROM users JOIN scores ON users.id = scores.user_id')
    return jsonify(instance.fetchall())

@scores_bp.route("/api/get_high_scores", methods=['GET'])
def getHighScores():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})

    if not 'number' in data or not data.get('number').isnumeric():
        return jsonify({"status": "error", "message": "Missing or wrong number"})

    instance = conn.cursor()
    instance.execute('SELECT users.first_name, users.last_name, scores.score FROM users JOIN scores ON users.id = user_id ORDER BY scores.score desc limit %s', [int(data.get('number'))])
    return jsonify(instance.fetchall())

@scores_bp.route("/api/add_score", methods=['GET'])
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

@scores_bp.route("/api/get_user_scores", methods=['GET'])
def getUserScores():
    data = request.args
    if not data:
        return jsonify({"status": "error", "message": "Invalid arguments"})

    if not 'user_id' in data or not data.get('user_id').isnumeric():
        return jsonify({"status": "error", "message": "Missing or wrong user id"})

    instance = conn.cursor()
    instance.execute('SELECT users.first_name, users.last_name, scores.score FROM users JOIN scores ON users.id = user_id WHERE users.id=%s ORDER BY scores.score desc', [int(data.get('user_id'))])
    return jsonify(instance.fetchall())