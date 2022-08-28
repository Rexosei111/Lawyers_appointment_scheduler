from datetime import datetime, timedelta
from lib2to3.pgen2 import token
import os
from time import timezone
import jwt
from rest_framework.response import Response
import boto3


secret = os.getenv("JWT_SECRET")


def get_tokens_for_user(user):
    expire = datetime.utcnow() + timedelta(
        minutes=int(os.environ.get("JWT_EXPIRE"))
    )
    data_to_encode = {"exp": expire, "id": user.id, "email": user.email}
    token = jwt.encode(data_to_encode, secret)
    return token


def decode_token(token):
    try:
        data = jwt.decode(token, secret, algorithms=[
                          os.getenv("JWT_ALGORITHM")])
        return data
    except jwt.ExpiredSignatureError:
        return None


def authenticate(request):
    auth_header = request.headers["Authorization"]
    if (auth_header is None):
        return Response(status=401, data={"message": "`Authorization` header not provided"})
    if (len(auth_header.split(" ")) != 2):
        return Response(status=401, data={"message": "Invalid Authorization token"})
    token = auth_header.split(" ")[1]
    data = decode_token(token=token)
    return data


def get_date(date_string: str):
    if (date_string is None):
        return None
    try:
        date = datetime.strptime(date_string, "%m/%d/%Y").date()
        return date
    except Exception as msg:
        print(msg)
        return None


ses_client = boto3.client("ses", "us-east-1")


def is_email_verified(email):
    identities = ses_client.list_identities()["Identities"]
    if email in identities:
        return True
    return False
