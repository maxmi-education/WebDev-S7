from flask import Flask, render_template, redirect

app = Flask(__name__)

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
    return render_template("games/shooter.html")

@app.route("/memory")
def memory(): 
    return render_template("games/memory.html")

if __name__ == "__main__":
    app.run(debug=True)