from flask import Blueprint, request, jsonify
from database import conn

comments_bp = Blueprint('comments', __name__)


@comments_bp.route("/api/get_comments", methods=['GET'])
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

@comments_bp.route("/api/add_comment", methods=['POST'])
def addComment():
    data = request.form
    if not data:
        return jsonify({"status": "error", "message": "Invalid payload"})

    page_name = data.get('page')
    author_name = data.get('author_name')
    message = data.get('message')

    # Validation
    if not page_name or not author_name or not message:
        return jsonify({"status": "error", "message": "Missing required fields"})

    if len(author_name) > 100:
        return jsonify({"status": "error", "message": "Name too long (max 100 characters)"})

    if len(message) > 500:
        return jsonify({"status": "error", "message": "Message too long (max 500 characters)"})

    try:
        instance = conn.cursor()
        instance.execute(
            'INSERT INTO comments (page_name, author_name, message) VALUES (%s, %s, %s)',
            (page_name, author_name, message)
        )
        conn.commit()
        return jsonify({"status": "success", "message": "Comment added!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
