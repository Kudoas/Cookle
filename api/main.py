from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from controller.controller import api


app = Flask(__name__)
CORS(app)

app.config['JSON_AS_ASCII'] = False
# Flask-JWT-extendedのセットアップ
app.config['JWT_SECRET_KEY'] = 'super-secret'
# 認証トークンの期限の有無
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
JWTManager(app)


app.register_blueprint(api)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
