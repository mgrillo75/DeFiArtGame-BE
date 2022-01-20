import os
from flask import Flask, jsonify, request, make_response
from flaskext.mysql import MySQL
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from logging import *

port = int(os.environ.get("PORT", 3001))

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": '*'}})


#app.config['CORS_HEADERS'] = 'application/json'
#app.config['CORS_RESOURCES'] = {r"/get*": {"origins": "*"}}


# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Mos0451234561477@162.240.18.56/mgrillo_defiart_db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yield.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)


class NFT(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # title = db.Column(db.String(100))
    nft_reference = db.Column(db.String(100))

    # body = db.Column(db.Integer)
    nft_yield = db.Column(db.Integer)

    date = db.Column(db.DateTime, default=datetime.datetime.now)
    deposit = db.Column(db.Integer)

    def __init__(self, nft_reference, nft_yield, deposit):
        self.nft_reference = nft_reference
        self.nft_yield = nft_yield
        self.deposit = deposit


class NFTSchema(ma.Schema):
    class Meta:
        fields = ('id', 'nft_reference', 'nft_yield', 'date', 'deposit')


NFT_schema = NFTSchema()
NFT_schema = NFTSchema(many=True)


@app.route('/', methods=["GET"])
@cross_origin()
def index():
    return("hello NFT YIELDS")


@app.route('/get', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_nfts():
    all_nfts = NFT.query.all()
    results = NFT_schema.jsonify(all_nfts)
    #results.headers.add("Access-Control-Allow-Origin", "*")
    return (results)


@app.route('/get/<id>/', methods=['GET'])
def post_details(id):
    nft = NFT.query.get(id)
    return NFT_schema.jsonify(nft)


@app.route('/add', methods=['POST'])
@cross_origin(origin='*')
def add_article():
    nft_reference = request.json['nft_reference']
    nft_yield = request.json['nft_yield']
    deposit = request.json['deposit']

    nft_result = NFT(nft_reference, nft_yield, deposit)
    db.session.add(nft_result)
    db.session.commit()
    return NFT_schema.jsonify("NFT Added")


@app.route('/update/<id>/', methods=['PUT'])
def get_article(id):
    article = NFT.query.get(id)

    title = request.json['title']
    body = request.json['body']
    deposit = request.json['deposit']

    article.title = title
    article.body = body
    article.deposit = deposit

    db.session.commit()
    return NFT_schema.jsonify("NFT Updated")


if __name__ == "__main__":
    # app.run(debug=True)
    # app.run(host='0.0.0.0',port=5000,debug=True)
    app.run(host='0.0.0.0', port=port, debug=True)
