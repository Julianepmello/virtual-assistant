FROM python:3.7-slim

RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential gcc

# layer caching for faster builds
COPY requirements.txt /
RUN pip install -r /requirements.txt

RUN python -m spacy download pt_core_news_sm \
    && python -m spacy link pt_core_news_sm pt

COPY test.py /usr/local/lib/python3.7/site-packages/rasa/core/

ADD . /api_gateway
WORKDIR /api_gateway

ENTRYPOINT ["python"]

CMD ["-u","app.py"]