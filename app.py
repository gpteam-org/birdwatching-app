from flask import Flask, render_template
import socket

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html",
        name="Birdwatching",
        image="https://www.greatbirdpics.com/wp-content/uploads/2021/07/CAWA-3-sig.jpg",
        description="Nice little bird.",
        location="Lviv, Ukraine",
        hostname=socket.gethostname()
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
