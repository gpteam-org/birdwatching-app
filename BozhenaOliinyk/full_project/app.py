from flask import Flask, render_template

app = Flask(__name__)

BIRDS_DATA = [
    {"id": 1, "name": "Spix's Macaw", "location": "Rio de Janeiro, Brazil", "image": "https://i.pinimg.com/1200x/c5/f5/a7/c5f5a7f3fe44bffb438ab28d35e9f1f1.jpg"},
    {"id": 2, "name": "Toco Toucan", "location": "Amazon Rainforest", "image": "https://i.pinimg.com/736x/ce/f2/d9/cef2d93e3ed33c6c25763592481abd12.jpg"},
    {"id": 3, "name": "Scarlet Macaw", "location": "Pantanal Wetlands", "image": "https://i.pinimg.com/1200x/c3/eb/a2/c3eba206e389ac89a701bf0eb26f4d10.jpg"},
    {"id": 4, "name": "Green Honeycreeper", "location": "Cerrado Savannah", "image": "https://i.pinimg.com/736x/42/8d/1a/428d1a1dbd7baef3c8a1f9df2b8a1b96.jpg"},
    {"id": 5, "name": "Blue-crowned Motmot", "location": "Atlantic Forest", "image": "https://i.pinimg.com/736x/d0/b6/e6/d0b6e633197b1183948ef3a8d99f1e40.jpg"},
    {"id": 6, "name": "Red-legged Honeycreeper", "location": "Amazon Basin", "image": "https://i.pinimg.com/1200x/4a/09/ba/4a09ba242211fff9781777211da375df.jpg"}
]

@app.route('/')
def index():
    return render_template('index.html', birds=BIRDS_DATA)


@app.route('/profile')
def profile():
    USER_BIRDS = [
        {"id": 1, "name": "Spix's Macaw", "location": "Rio de Janeiro, Brazil", "image": "https://i.pinimg.com/1200x/c5/f5/a7/c5f5a7f3fe44bffb438ab28d35e9f1f1.jpg"},
        {"id": 2, "name": "Toco Toucan", "location": "Amazon Rainforest", "image": "https://i.pinimg.com/736x/ce/f2/d9/cef2d93e3ed33c6c25763592481abd12.jpg"},
    ]
    return render_template('profile.html', birds=USER_BIRDS)


if __name__ == '__main__':
    app.run(debug=True)
