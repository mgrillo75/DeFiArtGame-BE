FROM python:3.9-alpine AS base

RUN apk add --update build-base alpine-sdk

WORKDIR /usr/defi-be

FROM base as release
COPY . .
RUN python -m pip install -r requirements.txt
CMD python app.py